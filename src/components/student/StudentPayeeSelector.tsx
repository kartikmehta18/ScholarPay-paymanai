
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, DollarSign, Send, Loader2, User, RefreshCw } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface Payee {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  type?: string;
}

interface StudentPayment {
  id: string;
  payeeName: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface StudentPayeeSelectorProps {
  isWalletConnected: boolean;
}

const StudentPayeeSelector: React.FC<StudentPayeeSelectorProps> = ({ isWalletConnected }) => {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({ open: false, payee: null as Payee | null });
  const [paymentForm, setPaymentForm] = useState({ amount: '', description: '' });
  const [sendingPayment, setSendingPayment] = useState(false);
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isWalletConnected) {
      loadPayees();
      loadStudentPayments();
    }
  }, [isWalletConnected]);

  const parsePayeesFromResponse = (response: any): Payee[] => {
    try {
      if (response.artifacts && response.artifacts.length > 0) {
        const artifact = response.artifacts[0];
        let content = '';
        
        if (artifact.content) {
          content = artifact.content;
        } else if (artifact.text) {
          content = artifact.text;
        }
        
        const lines = content.split('\n');
        const payees: Payee[] = [];
        
        lines.forEach((line: string, index: number) => {
          const match = line.match(/^\d+\.\s*(.+?)(?:\s+\((.+?)\))?(?:\s*-\s*(.+?))?$/);
          if (match) {
            const [, nameOrEmail, type, additional] = match;
            
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
              type: type?.trim() || additional?.trim()
            });
          }
        });
        
        return payees;
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing payees:', error);
      return [];
    }
  };

  const loadPayees = async () => {
    setLoading(true);
    try {
      const response = await paymanService.getAllPayees();
      const parsedPayees = parsePayeesFromResponse(response);
      setPayees(parsedPayees);
      
      if (parsedPayees.length === 0) {
        // Fallback payees for demo
        setPayees([
          { id: '1', name: 'sahaj jain', email: 'sahaj.jain@example.com', status: 'active' },
          { id: '2', name: 'kartik design', email: 'kartik.design@example.com', status: 'active' },
          { id: '3', name: 'ritik jain', email: 'ritik.jain@example.com', status: 'active' }
        ]);
      }
    } catch (error) {
      console.error('Error loading payees:', error);
      setPayees([
        { id: '1', name: 'sahaj jain', email: 'sahaj.jain@example.com', status: 'active' },
        { id: '2', name: 'kartik design', email: 'kartik.design@example.com', status: 'active' },
        { id: '3', name: 'ritik jain', email: 'ritik.jain@example.com', status: 'active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentPayments = () => {
    // Load from localStorage or set empty array
    const saved = localStorage.getItem('student_payments');
    if (saved) {
      setStudentPayments(JSON.parse(saved));
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
      // Send payment using the improved prompt format
      const response = await paymanService.sendPayment(
        amount,
        paymentDialog.payee.name,
        paymentForm.description
      );
      
      console.log('Payment response:', response);
      
      // Add to student payment history
      const newPayment: StudentPayment = {
        id: Math.random().toString(36).substr(2, 9),
        payeeName: paymentDialog.payee.name,
        amount,
        description: paymentForm.description,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      const updatedPayments = [newPayment, ...studentPayments];
      setStudentPayments(updatedPayments);
      localStorage.setItem('student_payments', JSON.stringify(updatedPayments));
      
      toast({
        title: "Success",
        description: `Payment of TSD ${amount.toLocaleString()} sent to ${paymentDialog.payee.name}`,
      });
      
      // Reset form and close dialog
      setPaymentForm({ amount: '', description: '' });
      setPaymentDialog({ open: false, payee: null });
      
    } catch (error) {
      console.error('Error sending payment:', error);
      toast({
        title: "Error",
        description: "Failed to send payment",
        variant: "destructive"
      });
    } finally {
      setSendingPayment(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your Payman wallet to view and pay payees</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Payees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Payees
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPayees}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading payees...</p>
            </div>
          ) : payees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payees available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payees.map((payee) => (
                <div key={payee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{payee.name}</h3>
                        <p className="text-sm text-gray-600">{payee.email}</p>
                        {payee.type && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                            {payee.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <Dialog 
                      open={paymentDialog.open && paymentDialog.payee?.id === payee.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setPaymentDialog({ open: true, payee });
                          setPaymentForm({ amount: '', description: '' });
                        } else {
                          setPaymentDialog({ open: false, payee: null });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        {/* <Button size="sm" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Pay
                        </Button> */}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Payment to {payee.name}</DialogTitle>
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
                              Command: "pay {paymentForm.amount || '[amount]'} tds to {payee.name}"
                            </p>
                          </div>
                          <Button type="submit" disabled={sendingPayment} className="w-full">
                            {sendingPayment ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Payment...
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Payment History */}
      {studentPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              My Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.payeeName}</p>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-TSD {payment.amount.toLocaleString()}</p>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentPayeeSelector;
