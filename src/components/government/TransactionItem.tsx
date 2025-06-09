
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
          <p className="text-sm text-gray-600">To: {transaction.recipient}</p>
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
  );
};

export default TransactionItem;
