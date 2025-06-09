
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, Users, TrendingUp } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface WalletBalance {
  totalBalance: number;
  spendableBalance: number;
  pendingBalance: number;
}

interface WalletStats {
  totalPayees: number;
  totalTransactions: number;
  monthlyVolume: number;
}

const WalletDetailsCard: React.FC = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      // Load wallet balance from Payman SDK
      const balanceResponse = await paymanService.getWalletBalance();
      if (balanceResponse && balanceResponse.status === 'COMPLETED') {
        setBalance(balanceResponse.parsedBalance);
      }

      // Load payees for stats from Payman SDK
      const payeesResponse = await paymanService.getAllPayees();
      const payeeCount = payeesResponse && payeesResponse.status === 'COMPLETED' 
        ? (payeesResponse.parsedPayees?.length || 0) 
        : 0;

      // Load transaction history for stats from Payman SDK
      const transactionsResponse = await paymanService.getTransactionHistory();
      const transactions = transactionsResponse && transactionsResponse.status === 'COMPLETED'
        ? (transactionsResponse.parsedTransactions || [])
        : [];
      
      // Calculate monthly volume (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTransactions = transactions.filter((tx: any) => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      });
      
      const monthlyVolume = monthlyTransactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);

      setStats({
        totalPayees: payeeCount,
        totalTransactions: transactions.length,
        monthlyVolume
      });

      console.log('Government wallet data loaded from Payman SDK:', { 
        balance: balanceResponse.parsedBalance, 
        stats: { payeeCount, transactions: transactions.length, monthlyVolume } 
      });
      
      toast({
        title: "Success",
        description: "Wallet data loaded from Payman SDK",
      });
    } catch (error) {
      console.error('Error loading wallet data from Payman SDK:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data from Payman SDK",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Government Scholarship Wallet
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
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet data from Payman SDK...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Balance Information */}
            {balance && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total Balance</p>
                  <p className="text-2xl font-bold text-blue-900">TSD {balance.totalBalance.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Spendable</p>
                  <p className="text-2xl font-bold text-green-900">TSD {balance.spendableBalance.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-orange-900">TSD {balance.pendingBalance.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Wallet Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Payees</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalPayees}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalTransactions}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Volume</p>
                    <p className="text-xl font-bold text-gray-900">TSD {stats.monthlyVolume.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Wallet Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Wallet Type</p>
                  <p className="font-medium">Government Scholarship Fund</p>
                </div>
                <div>
                  <p className="text-gray-600">Currency</p>
                  <p className="font-medium">TSD (Test Dollar)</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletDetailsCard;
