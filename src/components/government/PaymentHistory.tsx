
// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { History, RefreshCw } from 'lucide-react';
// import { paymanService } from '@/services/paymanService';
// import { useToast } from '@/hooks/use-toast';
// import WalletDetailsCard from './WalletDetailsCard';
// import SummaryStatsGrid from './SummaryStatsGrid';
// import TransactionFilters from './TransactionFilters';
// import TransactionList from './TransactionList';
// import { parseTransactionHistory, getFallbackTransactionData } from '@/utils/transactionParser';

// interface Transaction {
//   id: string;
//   type: 'DEBIT' | 'CREDIT';
//   amount: number;
//   description: string;
//   date: string;
//   status: 'completed' | 'pending' | 'failed';
//   recipient: string;
//   reference?: string;
// }

// interface WalletDetails {
//   walletName: string;
//   walletId: string;
//   paytag: string;
// }

// interface WalletBalance {
//   totalBalance: number;
//   spendableBalance: number;
//   pendingBalance: number;
// }

// interface TransactionSummary {
//   totalTransactions: number;
//   totalDebitTransactions: number;
//   totalDebitAmount: number;
// }

// const PaymentHistory: React.FC = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [walletDetails] = useState<WalletDetails>({ 
//     walletName: 'TSD Wallet 3', 
//     walletId: 'wlt-1f00a621-49fb-6484-9ce3-ff7ca7c48292', 
//     paytag: 'idol.recline.slack/88' 
//   });
//   const [balance, setBalance] = useState<WalletBalance>({ totalBalance: 0, spendableBalance: 0, pendingBalance: 0 });
//   const [summary, setSummary] = useState<TransactionSummary>({ totalTransactions: 0, totalDebitTransactions: 0, totalDebitAmount: 0 });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'DEBIT' | 'CREDIT'>('all');
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchTransactionHistory();

//     // Listen for payment events to refresh history
//     const handlePaymentSent = () => {
//       setTimeout(() => fetchTransactionHistory(), 1000);
//     };

//     window.addEventListener('paymentSent', handlePaymentSent);
//     return () => window.removeEventListener('paymentSent', handlePaymentSent);
//   }, []);

//   const fetchTransactionHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await paymanService.getTransactionHistory();
      
//       if (response && response.status === 'COMPLETED') {
//         const content = response.artifacts?.[0]?.content || '';
//         const parsedData = parseTransactionHistory(content);
        
//         setTransactions(parsedData.transactions);
//         setBalance(parsedData.balance);
//         setSummary(parsedData.summary);
        
//         console.log('Parsed transaction data:', parsedData);
        
//         toast({
//           title: "Success",
//           description: `Loaded ${parsedData.transactions.length} transactions`,
//         });
//       } else {
//         console.log('Invalid response format, using fallback data');
//         const fallbackData = getFallbackTransactionData();
//         setTransactions(fallbackData.transactions);
//         setBalance(fallbackData.balance);
//         setSummary(fallbackData.summary);
//       }
//     } catch (error) {
//       console.error('Error fetching transaction history:', error);
//       const fallbackData = getFallbackTransactionData();
//       setTransactions(fallbackData.transactions);
//       setBalance(fallbackData.balance);
//       setSummary(fallbackData.summary);
      
//       toast({
//         title: "Notice",
//         description: "Using demo transaction data",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || transaction.type === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="space-y-6">
//       <WalletDetailsCard />
      
//       <SummaryStatsGrid balance={balance} summary={summary} />

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <History className="h-5 w-5" />
//             Payment History
//           </CardTitle>
//           <Button
//             variant="outline"
//             onClick={fetchTransactionHistory}
//             disabled={loading}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <TransactionFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             filterType={filterType}
//             setFilterType={setFilterType}
//           />
          
//           <TransactionList transactions={filteredTransactions} loading={loading} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PaymentHistory;

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, RefreshCw } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';
import WalletDetailsCard from './WalletDetailsCard';
import SummaryStatsGrid from './SummaryStatsGrid';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';
import { parseTransactionHistory, getFallbackTransactionData } from '@/utils/transactionParser';

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

const PaymentHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletDetails] = useState<WalletDetails>({ 
    walletName: 'TSD Wallet 3', 
    walletId: 'wlt-1f00a621-49fb-6484-9ce3-ff7ca7c48292', 
    paytag: 'idol.recline.slack/88' 
  });
  const [balance, setBalance] = useState<WalletBalance>({ totalBalance: 0, spendableBalance: 0, pendingBalance: 0 });
  const [summary, setSummary] = useState<TransactionSummary>({ totalTransactions: 0, totalDebitTransactions: 0, totalDebitAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'DEBIT' | 'CREDIT'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactionHistory();

    // Listen for payment events to refresh history
    const handlePaymentSent = () => {
      setTimeout(() => fetchTransactionHistory(), 1000);
    };

    window.addEventListener('paymentSent', handlePaymentSent);
    return () => window.removeEventListener('paymentSent', handlePaymentSent);
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await paymanService.getTransactionHistory();
      
      if (response && response.status === 'COMPLETED') {
        const content = response.artifacts?.[0]?.content || '';
        const parsedData = parseTransactionHistory(content);
        
        setTransactions(parsedData.transactions);
        setBalance(parsedData.balance);
        setSummary(parsedData.summary);
        
        console.log('Parsed transaction data:', parsedData);
        
        toast({
          title: "Success",
          description: `Loaded ${parsedData.transactions.length} transactions`,
          variant: "success"
        });
      } else {
        console.log('Invalid response format, using fallback data');
        const fallbackData = getFallbackTransactionData();
        setTransactions(fallbackData.transactions);
        setBalance(fallbackData.balance);
        setSummary(fallbackData.summary);
        
        toast({
          title: "Notice",
          description: "Using demo transaction data",
          variant: "warning"
        });
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      const fallbackData = getFallbackTransactionData();
      setTransactions(fallbackData.transactions);
      setBalance(fallbackData.balance);
      setSummary(fallbackData.summary);
      
      toast({
        title: "Notice",
        description: "Using demo transaction data",
        variant: "secondary"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <WalletDetailsCard />
      
      {/* <SummaryStatsGrid balance={balance} summary={summary} /> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
          {/* <Button
            variant="outline"
            onClick={fetchTransactionHistory}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
        </CardHeader>
        <CardContent>
          <TransactionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />
          
          <TransactionList transactions={filteredTransactions} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
