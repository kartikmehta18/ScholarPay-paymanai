
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Plus, Loader2 } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface PayeeSelectorProps {
  selectedPayee: string;
  onPayeeChange: (payee: string) => void;
  disabled?: boolean;
}

interface Payee {
  email: string;
  name: string;
}

const PayeeSelector: React.FC<PayeeSelectorProps> = ({ 
  selectedPayee, 
  onPayeeChange, 
  disabled 
}) => {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPayee, setNewPayee] = useState({ name: '', email: '' });
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const isPaymanConnected = paymanService.isAuthenticated() && paymanService.isTokenVerified();

  useEffect(() => {
    if (isPaymanConnected) {
      loadPayees();
    }
  }, [isPaymanConnected]);

  const loadPayees = async () => {
    setLoading(true);
    try {
      const response = await paymanService.getAllPayees();
      const parsedPayees = parsePayeesFromResponse(response);
      setPayees(parsedPayees);
    } catch (error) {
      console.error('Error loading payees:', error);
      // Use mock data for demo
      setPayees([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' },
        { name: 'Bob Johnson', email: 'bob.johnson@example.com' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const parsePayeesFromResponse = (response: any): Payee[] => {
    if (!response?.artifacts?.[0]?.content) return [];
    
    const content = response.artifacts[0].content;
    const lines = content.split('\n');
    const payees: Payee[] = [];
    
    lines.forEach((line: string) => {
      const emailMatch = line.match(/\(([^)]+@[^)]+)\)/);
      const nameMatch = line.match(/^\d+\.\s*([^(]+)/);
      
      if (emailMatch && nameMatch) {
        payees.push({
          email: emailMatch[1].trim(),
          name: nameMatch[1].trim()
        });
      }
    });
    
    return payees;
  };

  const handleAddPayee = async () => {
    if (!newPayee.name || !newPayee.email) {
      toast({
        title: "Error",
        description: "Please fill in both name and email",
        variant: "destructive"
      });
      return;
    }

    setAdding(true);
    try {
      await paymanService.addPayee(newPayee.email, newPayee.name);
      toast({
        title: "Success",
        description: "Payee added successfully"
      });
      
      // Reload payees
      await loadPayees();
      
      // Reset form and close dialog
      setNewPayee({ name: '', email: '' });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding payee:', error);
      toast({
        title: "Error",
        description: "Failed to add payee",
        variant: "destructive"
      });
    } finally {
      setAdding(false);
    }
  };

  if (!isPaymanConnected) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Preferred Payee (Optional)
        </Label>
        <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <p className="text-sm text-gray-600">
            Connect your Payman wallet to select from existing payees
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Preferred Payee (Optional)
      </Label>
      <div className="flex gap-2">
        <Select value={selectedPayee} onValueChange={onPayeeChange} disabled={disabled || loading}>
          <SelectTrigger className="flex-1 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder={loading ? "Loading payees..." : "Select a payee"} />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-60">
            {payees.map((payee) => (
              <SelectItem key={payee.email} value={payee.email}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{payee.name} ({payee.email})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" disabled={disabled || loading}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payeeName">Name</Label>
                <Input
                  id="payeeName"
                  placeholder="Enter payee name"
                  value={newPayee.name}
                  onChange={(e) => setNewPayee(prev => ({ ...prev, name: e.target.value }))}
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payeeEmail">Email</Label>
                <Input
                  id="payeeEmail"
                  type="email"
                  placeholder="Enter payee email"
                  value={newPayee.email}
                  onChange={(e) => setNewPayee(prev => ({ ...prev, email: e.target.value }))}
                  disabled={adding}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPayee} disabled={adding}>
                  {adding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Payee'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PayeeSelector;
