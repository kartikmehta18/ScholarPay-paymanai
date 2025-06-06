
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface WalletData {
  balance: string;
  currency: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

const WalletOverview: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 'Loading...',
    currency: 'TSD',
    lastUpdated: new Date().toISOString(),
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadWalletData();
    loadRecentTransactions();
  }, []);

  const parseWalletData = (response: any): WalletData => {
    try {
      console.log('Parsing wallet data from response:', response);
      
      if (response.artifacts && response.artifacts.length > 0) {
        const artifact = response.artifacts[0];
        let content = '';
        
        if (artifact.content) {
          content = artifact.content;
        } else if (artifact.text) {
          content = artifact.text;
        }
        
        console.log('Wallet content:', content);
        
        // Look for balance patterns like "TSD 1,000.00" or "$1" or "1000.00"
        const balancePatterns = [
          /balance[:\s]*TSD\s*([\d,]+\.?\d*)/i,
          /TSD\s*([\d,]+\.?\d*)/i,
          /\$\s*([\d,]+\.?\d*)/i,
          /balance[:\s]*\$?\s*([\d,]+\.?\d*)/i
        ];
        
        let balance = 'N/A';
        for (const pattern of balancePatterns) {
          const match = content.match(pattern);
          if (match) {
            const amount = parseFloat(match[1].replace(/,/g, ''));
            balance = `TSD ${amount.toLocaleString()}`;
            break;
          }
        }
        
        return {
          balance,
          currency: 'TSD',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        };
      }
      
      return {
        balance: 'Service unavailable',
        currency: 'TSD',
        lastUpdated: new Date().toISOString(),
        status: 'inactive'
      };
    } catch (error) {
      console.error('Error parsing wallet data:', error);
      return {
        balance: 'Unable to parse',
        currency: 'TSD',
        lastUpdated: new Date().toISOString(),
        status: 'inactive'
      };
    }
  };

  const parseTransactionHistory = (response: any): Transaction[] => {
    try {
      if (response.artifacts && response.artifacts.length > 0) {
        const artifact = response.artifacts[0];
        let content = '';
        
        if (artifact.content) {
          content = artifact.content;
        } else if (artifact.text) {
          content = artifact.text;
        }
        
        console.log('Transaction content:', content);
        const transactions: Transaction[] = [];
        
        // Parse transaction lines with improved regex for the format:
        // "1. DEBIT: TSD 10.00 - Payment to sahaj jain"
        // "12. CREDIT: TSD 1,000.00 - Initial deposit from PAYMAN TEST BANK ****3144"
        const transactionRegex = /(\d+)\.\s*(DEBIT|CREDIT):\s*TSD\s*([\d,]+\.?\d*)\s*-\s*(.+?)(?:\s*\(Reference:\s*([^)]+)\))?$/gm;
        
        let match;
        while ((match = transactionRegex.exec(content)) !== null) {
          const [, number, type, amount, description, reference] = match;
          const parsedAmount = parseFloat(amount.replace(/,/g, ''));
          
          if (!isNaN(parsedAmount) && parsedAmount > 0) {
            transactions.push({
              id: `tx-${number}-${Date.now()}`,
              type: type === 'CREDIT' ? 'incoming' : 'outgoing',
              amount: parsedAmount,
              description: description.trim(),
              date: new Date().toISOString().split('T')[0],
              status: 'completed',
              reference: reference?.trim()
            });
          }
        }
        
        console.log('Parsed transactions:', transactions);
        return transactions.slice(0, 5); // Show only recent 5 transactions
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing transaction history:', error);
      return [];
    }
  };

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const response = await paymanService.getWalletBalance();
      console.log('Wallet balance response:', response);
      
      if (response && response.status?.toString() === 'COMPLETED') {
        const parsedData = parseWalletData(response);
        setWalletData(parsedData);
        
        toast({
          title: "Success",
          description: "Wallet data loaded successfully",
        });
      } else {
        setWalletData(prev => ({ ...prev, balance: 'Service unavailable', status: 'inactive' }));
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setWalletData(prev => ({ ...prev, balance: 'Unable to load', status: 'inactive' }));
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTransactions = async () => {
    try {
      const response = await paymanService.getTransactionHistory();
      console.log('Transaction history response:', response);
      
      if (response && response.status?.toString() === 'COMPLETED') {
        const transactions = parseTransactionHistory(response);
        setRecentTransactions(transactions);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Overview
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadWalletData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium opacity-90">Current Balance</h3>
              <p className="text-3xl font-bold">{walletData.balance}</p>
            </div>
            <Badge variant={walletData.status === 'active' ? 'default' : 'secondary'} className="bg-white/20 text-white">
              {walletData.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>Currency: {walletData.currency}</span>
            <span>Updated: {new Date(walletData.lastUpdated).toLocaleString()}</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Recent Transactions
          </h4>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent transactions</p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'incoming' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                      {transaction.reference && (
                        <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'incoming' ? '+' : '-'}TSD {transaction.amount.toLocaleString()}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;
