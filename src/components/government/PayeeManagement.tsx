
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, RefreshCw, Mail, User, Loader2, Send, DollarSign } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface Payee {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  addedDate: string;
  type?: string;
}

const PayeeManagement: React.FC = () => {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayee, setNewPayee] = useState({ name: '', email: '' });
  const [addingPayee, setAddingPayee] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({ open: false, payee: null as Payee | null });
  const [paymentForm, setPaymentForm] = useState({ amount: '', description: '' });
  const [sendingPayment, setSendingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPayees();
  }, []);

  const parsePayeesFromResponse = (response: any): Payee[] => {
    try {
      console.log('Parsing payees from Payman SDK response:', response);
      
      if (response.artifacts && response.artifacts.length > 0) {
        const artifact = response.artifacts[0];
        let content = '';
        
        if (artifact.content) {
          content = artifact.content;
        } else if (artifact.text) {
          content = artifact.text;
        }
        
        console.log('Payee content from Payman SDK:', content);
        
        const lines = content.split('\n');
        const payees: Payee[] = [];
        
        lines.forEach((line: string, index: number) => {
          // Enhanced regex to capture different payee formats
          const match = line.match(/^\d+\.\s*(.+?)(?:\s+\((.+?)\))?(?:\s*-\s*(.+?))?$/);
          if (match) {
            const [, nameOrEmail, type, additional] = match;
            
            // Determine if the first capture is name or email
            const isEmail = nameOrEmail.includes('@');
            let name = '';
            let email = '';
            
            if (isEmail) {
              email = nameOrEmail.trim();
              name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            } else {
              name = nameOrEmail.trim();
              email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            }
            
            payees.push({
              id: `payee-${Date.now()}-${index}`,
              name,
              email,
              status: 'active',
              addedDate: new Date().toISOString().split('T')[0],
              type: type?.trim() || additional?.trim()
            });
          }
        });
        
        console.log('Parsed payees from Payman SDK:', payees);
        return payees;
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing payees from Payman SDK:', error);
      return [];
    }
  };

  const loadPayees = async () => {
    setLoading(true);
    try {
      const response = await paymanService.getAllPayees();
      console.log('Raw payees response from Payman SDK:', response);
      
      const parsedPayees = parsePayeesFromResponse(response);
      setPayees(parsedPayees);
      
      toast({
        title: "Success",
        description: `Loaded ${parsedPayees.length} payees from Payman SDK`,
      });
    } catch (error) {
      console.error('Error loading payees from Payman SDK:', error);
      toast({
        title: "Error",
        description: "Failed to load payees from Payman SDK",
        variant: "destructive"
      });
      
      // Set empty array if API fails
      setPayees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPayee.name || !newPayee.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setAddingPayee(true);
    try {
      const response = await paymanService.addPayee(newPayee.email, newPayee.name);
      console.log('Add payee response from Payman SDK:', response);
      
      const payee: Payee = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPayee.name,
        email: newPayee.email,
        status: 'active',
        addedDate: new Date().toISOString().split('T')[0]
      };
      
      setPayees(prev => [payee, ...prev]);
      setNewPayee({ name: '', email: '' });
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Payee added successfully to Payman SDK",
      });
      
      setTimeout(() => loadPayees(), 1000);
    } catch (error) {
      console.error('Error adding payee to Payman SDK:', error);
      toast({
        title: "Error",
        description: "Failed to add payee to Payman SDK",
        variant: "destructive"
      });
    } finally {
      setAddingPayee(false);
    }
  };

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentForm.amount || !paymentForm.description || !paymentDialog.payee) {
      toast({
        title: "Error",
        description: "Please fill in all payment fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setSendingPayment(true);
    try {
      // Send payment using the payee's name instead of email
      const response = await paymanService.sendPayment(
        amount,
        paymentDialog.payee.name, // Use name instead of email
        paymentForm.description
      );
      console.log('Payment response from Payman SDK:', response);
      
      toast({
        title: "Success",
        description: `Payment of TSD ${amount.toLocaleString()} sent to ${paymentDialog.payee.name} via Payman SDK`,
      });
      
      // Reset form and close dialog
      setPaymentForm({ amount: '', description: '' });
      setPaymentDialog({ open: false, payee: null });
      
      // Trigger parent component to refresh payment history
      window.dispatchEvent(new CustomEvent('paymentSent', { 
        detail: { 
          recipient: paymentDialog.payee.name,
          amount,
          description: paymentForm.description
        }
      }));
      
    } catch (error) {
      console.error('Error sending payment via Payman SDK:', error);
      toast({
        title: "Error",
        description: "Failed to send payment via Payman SDK",
        variant: "destructive"
      });
    } finally {
      setSendingPayment(false);
    }
  };

  const openPaymentDialog = (payee: Payee) => {
    setPaymentDialog({ open: true, payee });
    setPaymentForm({ amount: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Payee Management (Payman SDK)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadPayees}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Payee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Add New Payee to Payman SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPayee} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payeeName">Full Name</Label>
                      <Input
                        id="payeeName"
                        placeholder="Enter full name"
                        value={newPayee.name}
                        onChange={(e) => setNewPayee(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payeeEmail">Email Address</Label>
                      <Input
                        id="payeeEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={newPayee.email}
                        onChange={(e) => setNewPayee(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addingPayee}>
                      {addingPayee ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding to Payman SDK...
                        </>
                      ) : (
                        'Add Payee'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading payees from Payman SDK...</p>
            </div>
          ) : payees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payees found in Payman SDK. Add your first payee!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Showing {payees.length} payees from Payman SDK</strong>
                </p>
              </div>
              {payees.map((payee) => (
                <div key={payee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{payee.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{payee.email}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Added: {new Date(payee.addedDate).toLocaleDateString()}</span>
                          {payee.type && (
                            <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                              {payee.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={payee.status === 'active' ? 'default' : 'secondary'}>
                        {payee.status}
                      </Badge>
                      <Dialog 
                        open={paymentDialog.open && paymentDialog.payee?.id === payee.id}
                        onOpenChange={(open) => {
                          if (open) {
                            openPaymentDialog(payee);
                          } else {
                            setPaymentDialog({ open: false, payee: null });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Pay
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Payment to {payee.name} via Payman SDK</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSendPayment} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Amount (TSD)</Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                value={paymentForm.amount}
                                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                placeholder="Payment description"
                                value={paymentForm.description}
                                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="bg-blue-50 p-3 rounded border border-blue-200">
                              <p className="text-sm text-blue-800">
                                <strong>Recipient:</strong> {payee.name}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Payment will be sent using Payman SDK to: "{payee.name}"
                              </p>
                            </div>
                            <Button type="submit" disabled={sendingPayment} className="w-full">
                              {sendingPayment ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending Payment via Payman SDK...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Payment
                                </>
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayeeManagement;
