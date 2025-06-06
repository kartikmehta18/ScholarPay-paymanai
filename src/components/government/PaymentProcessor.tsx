
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Send, History, Loader2, CheckCircle, User } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface PaymentHistory {
  id: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const PaymentProcessor: React.FC = () => {
  const [payeeForm, setPayeeForm] = useState({
    recipientEmail: '',
    recipientName: '',
    amount: '',
    description: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      recipientName: 'Alice Johnson',
      recipientEmail: 'alice@university.edu',
      amount: 5000,
      description: 'Excellence Scholarship Payment',
      status: 'completed',
      timestamp: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      recipientName: 'Bob Smith',
      recipientEmail: 'bob@university.edu',
      amount: 3000,
      description: 'Innovation Grant Payment',
      status: 'pending',
      timestamp: '2024-02-16T14:20:00Z'
    }
  ]);
  const { toast } = useToast();

  const handleCreatePayee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payeeForm.recipientEmail || !payeeForm.recipientName) {
      toast({
        title: "Error",
        description: "Please fill in name and email fields",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Create payee first
      const payeeResponse = await paymanService.addPayee(payeeForm.recipientEmail, payeeForm.recipientName);
      console.log('Payee creation response:', payeeResponse);
      
      // If amount and description are provided, also send payment
      if (payeeForm.amount && payeeForm.description) {
        const amount = parseFloat(payeeForm.amount);
        if (!isNaN(amount) && amount > 0) {
          const paymentResponse = await paymanService.sendPayment(
            amount,
            payeeForm.recipientEmail,
            payeeForm.description
          );
          console.log('Payment response:', paymentResponse);
          
          // Add to payment history
          const newPayment: PaymentHistory = {
            id: Math.random().toString(36).substr(2, 9),
            recipientName: payeeForm.recipientName,
            recipientEmail: payeeForm.recipientEmail,
            amount,
            description: payeeForm.description,
            status: 'completed',
            timestamp: new Date().toISOString()
          };
          
          setPaymentHistory(prev => [newPayment, ...prev]);
        }
      }
      
      // Reset form
      setPayeeForm({
        recipientEmail: '',
        recipientName: '',
        amount: '',
        description: ''
      });
      
      toast({
        title: "Success",
        description: `Payee ${payeeForm.recipientName} created successfully${payeeForm.amount ? ' and payment sent' : ''}`,
      });
    } catch (error) {
      console.error('Error creating payee:', error);
      toast({
        title: "Error",
        description: "Failed to create payee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Payee Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Payee & Send Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePayee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Student Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="student@university.edu"
                  value={payeeForm.recipientEmail}
                  onChange={(e) => setPayeeForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientName">Student Name *</Label>
                <Input
                  id="recipientName"
                  placeholder="Student Full Name"
                  value={payeeForm.recipientName}
                  onChange={(e) => setPayeeForm(prev => ({ ...prev, recipientName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount ($) <span className="text-gray-500">(Optional)</span></Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount (leave empty to create payee only)"
                value={payeeForm.amount}
                onChange={(e) => setPayeeForm(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Payment Description <span className="text-gray-500">(Required if amount provided)</span></Label>
              <Textarea
                id="description"
                placeholder="Scholarship payment description"
                value={payeeForm.description}
                onChange={(e) => setPayeeForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This will create a new payee in the Payman system. 
                {payeeForm.amount && payeeForm.description ? ' A payment will also be sent immediately.' : ' You can send payments later from the payee management section.'}
              </p>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Payee...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Payee {payeeForm.amount && payeeForm.description && '& Send Payment'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payments sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{payment.recipientName}</h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{payment.recipientEmail}</p>
                        <p className="text-gray-700 mt-1">{payment.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="font-semibold text-green-600">
                            ${payment.amount.toLocaleString()}
                          </span>
                          <span>
                            {new Date(payment.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
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

export default PaymentProcessor;
