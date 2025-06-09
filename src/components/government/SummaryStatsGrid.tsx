
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, History, DollarSign } from 'lucide-react';

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

interface SummaryStatsGridProps {
  balance: WalletBalance;
  summary: TransactionSummary;
}

const SummaryStatsGrid: React.FC<SummaryStatsGridProps> = ({ balance, summary }) => {
  return (
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
  );
};

export default SummaryStatsGrid;
