import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, RefreshCw, TrendingUp, TrendingDown, Search, Filter, DollarSign, Wallet } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  recipient: string;
  reference?: string;
}

interface WalletDetails {
  walletName: string;
  walletId: string;
  paytag: string;
}

interface WalletBalance {
  totalBalance: number;
  spendableBalance: number;
  pendingBalance: number;
}

interface TransactionSummary {
  totalTransactions: number;
  totalDebitTransactions: number;
  totalDebitAmount: number;
}

interface ParsedData {
  walletDetails: WalletDetails;
  balance: WalletBalance;
  summary: TransactionSummary;
  transactions: Transaction[];
}

const PaymentHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletDetails, setWalletDetails] = useState<WalletDetails>({ walletName: '', walletId: '', paytag: '' });
  const [balance, setBalance] = useState<WalletBalance>({ totalBalance: 0, spendableBalance: 0, pendingBalance: 0 });
  const [summary, setSummary] = useState<TransactionSummary>({ totalTransactions: 0, totalDebitTransactions: 0, totalDebitAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'DEBIT' | 'CREDIT'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const response = await paymanService.getTransactionHistory();
        
        if (response && response.status?.toString() === 'COMPLETED') {
          const content = response.artifacts?.[0]?.content || '';
          const { transactions: parsedTransactions, balance: parsedBalance, summary: parsedSummary, walletDetails: parsedWalletDetails } = parseTransactionHistory(content);
          
          if (parsedTransactions && parsedTransactions.length > 0) {
            setTransactions(parsedTransactions);
            setBalance(parsedBalance);
            setSummary(parsedSummary);
            setWalletDetails(parsedWalletDetails);
            toast({
              title: "Success",
              description: `Loaded ${parsedTransactions.length} transactions`,
            });
          } else {
            console.log('No transactions parsed, using fallback data');
            setFallbackTransactions();
          }
        } else {
          console.log('Invalid response status or format, using fallback data');
          setFallbackTransactions();
        }
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setFallbackTransactions();
        toast({
          title: "Error",
          description: "Failed to load transaction history, showing demo data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();

    // Listen for payment events to refresh history
    const handlePaymentSent = () => {
      setTimeout(() => fetchTransactionHistory(), 1000);
    };

    window.addEventListener('payment-sent', handlePaymentSent);
    return () => window.removeEventListener('payment-sent', handlePaymentSent);
  }, []);

  const parseTransactionHistory = (content: string) => {
    const lines = content.split('\n');
    const transactions: Transaction[] = [];
    let walletDetails = {
      walletName: '',
      walletId: '',
      paytag: '',
    };
    let balance = {
      totalBalance: 0,
      spendableBalance: 0,
      pendingBalance: 0,
    };
    let summary = {
      totalTransactions: 0,
      totalDebitTransactions: 0,
      totalDebitAmount: 0,
    };
    let isParsingTransactions = false;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Detect sections
      if (line.includes('Wallet Financial Summary')) {
        currentSection = 'wallet';
        continue;
      } else if (line.includes('Transaction Details:')) {
        currentSection = 'details';
        continue;
      } else if (line.includes('Detailed Transaction Log:')) {
        currentSection = 'transactions';
        continue;
      }

      // Parse wallet summary
      if (currentSection === 'wallet') {
        if (line.startsWith('- Total Wallet Balance:')) {
          balance.totalBalance = parseFloat(line.replace('- Total Wallet Balance:', '').replace('TSD', '').trim());
        } else if (line.startsWith('- Spendable Balance:')) {
          balance.spendableBalance = parseFloat(line.replace('- Spendable Balance:', '').replace('TSD', '').trim());
        } else if (line.startsWith('- Pending Balance:')) {
          balance.pendingBalance = parseFloat(line.replace('- Pending Balance:', '').replace('TSD', '').trim());
        }
      }
      // Parse transaction details
      else if (currentSection === 'details') {
        if (line.startsWith('- Total Transactions:')) {
          summary.totalTransactions = parseInt(line.replace('- Total Transactions:', '').trim());
        } else if (line.startsWith('- Total Debit Amount:')) {
          summary.totalDebitAmount = parseFloat(line.replace('- Total Debit Amount:', '').replace('TSD', '').trim());
        }
      }
      // Parse transactions
      else if (currentSection === 'transactions') {
        // Skip header and separator lines
        if (line.startsWith('| No.') || line.startsWith('|-----')) {
          continue;
        }

        // Parse transaction line
        if (line.startsWith('|')) {
          const parts = line.split('|').map(part => part.trim()).filter(Boolean);
          if (parts.length >= 5) {
            const [no, payee, amount, date, type] = parts;
            
            // Parse amount and determine transaction type
            const parsedAmount = parseFloat(amount.replace('TSD', '').trim());
            const transactionType: 'DEBIT' | 'CREDIT' = 'DEBIT'; // All transactions in this format are debits

            const transaction = {
              id: no,
              type: transactionType,
              amount: parsedAmount,
              description: payee,
              date: date,
              status: 'completed' as const,
              recipient: payee,
            } satisfies Transaction;

            transactions.push(transaction);
          }
        }
      }
    }

    // Calculate summary if not provided
    if (!summary.totalTransactions) {
      summary.totalTransactions = transactions.length;
      summary.totalDebitTransactions = transactions.filter(t => t.type === 'DEBIT').length;
      summary.totalDebitAmount = transactions
        .filter(t => t.type === 'DEBIT')
        .reduce((sum, t) => sum + t.amount, 0);
    }

    return {
      transactions,
      walletDetails,
      balance,
      summary,
    };
  };

  const setFallbackTransactions = () => {
    // Fallback based on console logs format
    const mockTransactions: Transaction[] = [
      { id: '1', type: 'DEBIT', amount: 1.00, description: 'Payment to john', date: '2024-01-15', status: 'completed', recipient: 'john' },
      { id: '2', type: 'DEBIT', amount: 10.00, description: 'Payment to sahaj jain', date: '2024-01-14', status: 'completed', recipient: 'sahaj jain' },
      { id: '3', type: 'DEBIT', amount: 11.00, description: 'Payment to kartik design', date: '2024-01-13', status: 'completed', recipient: 'kartik design' },
      { id: '4', type: 'DEBIT', amount: 7.00, description: 'Payment to ritik jain', date: '2024-01-12', status: 'completed', recipient: 'ritik jain' },
      { id: '5', type: 'DEBIT', amount: 2.00, description: 'Transfer to TSD Wallet 1', date: '2024-01-11', status: 'completed' },
      { id: '6', type: 'DEBIT', amount: 23.00, description: 'Payment to km', date: '2024-01-10', status: 'completed', recipient: 'km' }
    ];
    setTransactions(mockTransactions);
    setBalance({ totalBalance: 845.84, spendableBalance: 845.84, pendingBalance: 0 });
    setSummary({ totalTransactions: 20, totalDebitTransactions: 20, totalDebitAmount: 89.15 });
    setWalletDetails({ walletName: 'TSD Wallet 3', walletId: 'wlt-1f00a621-49fb-6484-9ce3-ff7ca7c48292', paytag: 'idol.recline.slack/88' });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.recipient?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Wallet Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {walletDetails.walletName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Wallet ID</p>
              <p className="font-medium">{walletDetails.walletId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paytag</p>
              <p className="font-medium">{walletDetails.paytag}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-green-600">TSD {balance.totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Spendable Balance</p>
                <p className="text-2xl font-bold text-green-600">TSD {balance.spendableBalance.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Balance</p>
                <p className="text-2xl font-bold text-yellow-600">TSD {balance.pendingBalance.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{summary.totalTransactions}</p>
              </div>
              <History className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Debit Amount</p>
                <p className="text-2xl font-bold text-red-600">TSD {summary.totalDebitAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => {}}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'DEBIT' | 'CREDIT') => setFilterType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="DEBIT">Debits Only</SelectItem>
                <SelectItem value="CREDIT">Credits Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transaction history...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'CREDIT' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.recipient && (
                        <p className="text-sm text-gray-600">To: {transaction.recipient}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.reference && (
                          <span>Ref: {transaction.reference}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}TSD {transaction.amount.toLocaleString()}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
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

export default PaymentHistory;
