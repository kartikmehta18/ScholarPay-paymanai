
import React, { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransactionItem from './TransactionItem';
import { paymanService } from '@/services/paymanService';

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

interface TransactionListProps {
  transactions?: Transaction[];
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions: propTransactions, 
  loading: propLoading 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>(propTransactions || []);
  const [loading, setLoading] = useState(propLoading || false);

  useEffect(() => {
    // If no transactions provided via props, load from Payman SDK
    if (!propTransactions) {
      loadTransactions();
    } else {
      setTransactions(propTransactions);
    }
  }, [propTransactions, propLoading]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await paymanService.getTransactionHistory();
      const parsedTransactions = response.parsedTransactions || [];
      
      // Convert to expected format
      const formattedTransactions: Transaction[] = parsedTransactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        date: tx.date,
        status: tx.status,
        recipient: tx.recipient,
        reference: `TXN-${tx.id}`
      }));
      
      setTransactions(formattedTransactions);
      console.log('Loaded transactions from Payman SDK:', formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions from Payman SDK:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading transaction history from Payman SDK...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No transactions found</p>
        <Button
          variant="outline"
          onClick={loadTransactions}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Load Transactions from Payman SDK
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!propTransactions && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTransactions}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      )}
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
