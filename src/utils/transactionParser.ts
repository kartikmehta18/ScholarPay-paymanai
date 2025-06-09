
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

interface ParsedTransactionData {
  transactions: Transaction[];
  balance: WalletBalance;
  summary: TransactionSummary;
}

export const parseTransactionHistory = (content: string): ParsedTransactionData => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  let balance = { totalBalance: 0, spendableBalance: 0, pendingBalance: 0 };
  let summary = { totalTransactions: 0, totalDebitTransactions: 0, totalDebitAmount: 0 };
  const transactions: Transaction[] = [];
  
  let currentSection = '';
  let isParsingTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Identify sections
    if (line.includes('Wallet Financial Summary')) {
      currentSection = 'wallet';
      continue;
    } else if (line.includes('Transaction Details')) {
      currentSection = 'summary';
      continue;
    } else if (line.includes('Detailed Transaction Log')) {
      currentSection = 'transactions';
      continue;
    }

    // Parse wallet balance
    if (currentSection === 'wallet') {
      if (line.includes('Total Wallet Balance:')) {
        balance.totalBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
      } else if (line.includes('Spendable Balance:')) {
        balance.spendableBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
      } else if (line.includes('Pending Balance:')) {
        balance.pendingBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
      }
    }
    
    // Parse transaction summary
    else if (currentSection === 'summary') {
      if (line.includes('Total Transactions:')) {
        summary.totalTransactions = parseInt(line.match(/\d+/)?.[0] || '0');
      } else if (line.includes('Total Debit Amount:')) {
        summary.totalDebitAmount = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
      }
    }
    
    // Parse individual transactions
    else if (currentSection === 'transactions') {
      // Skip table headers and separators
      if (line.includes('| No.') || line.includes('|-----')) {
        isParsingTable = true;
        continue;
      }
      
      // Parse transaction rows
      if (isParsingTable && line.startsWith('|')) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col);
        
        if (columns.length >= 5) {
          const [no, payee, amountStr, date, type] = columns;
          const amount = parseFloat(amountStr.replace(/[^\d.]/g, ''));
          
          if (!isNaN(amount) && payee && date) {
            transactions.push({
              id: no || `tx-${i}`,
              type: 'DEBIT',
              amount: amount,
              description: `Payment to ${payee}`,
              date: date,
              status: 'completed',
              recipient: payee
            });
          }
        }
      }
    }
  }

  // Calculate missing summary data
  if (!summary.totalTransactions) {
    summary.totalTransactions = transactions.length;
    summary.totalDebitTransactions = transactions.filter(t => t.type === 'DEBIT').length;
    summary.totalDebitAmount = transactions.reduce((sum, t) => sum + (t.type === 'DEBIT' ? t.amount : 0), 0);
  }

  return { transactions, balance, summary };
};

export const getFallbackTransactionData = (): ParsedTransactionData => {
  const mockTransactions: Transaction[] = [
    { id: '1', type: 'DEBIT', amount: 1.00, description: 'Payment to john', date: '2024-01-15', status: 'completed', recipient: 'john' },
    { id: '2', type: 'DEBIT', amount: 10.00, description: 'Payment to sahaj jain', date: '2024-01-14', status: 'completed', recipient: 'sahaj jain' },
    { id: '3', type: 'DEBIT', amount: 11.00, description: 'Payment to kartik design', date: '2024-01-13', status: 'completed', recipient: 'kartik design' },
    { id: '4', type: 'DEBIT', amount: 7.00, description: 'Payment to ritik jain', date: '2024-01-12', status: 'completed', recipient: 'ritik jain' },
    { id: '5', type: 'DEBIT', amount: 2.00, description: 'Transfer to TSD Wallet 1', date: '2024-01-11', status: 'completed', recipient: 'TSD Wallet 1' },
    { id: '6', type: 'DEBIT', amount: 23.00, description: 'Payment to km', date: '2024-01-10', status: 'completed', recipient: 'km' }
  ];
  
  return {
    transactions: mockTransactions,
    balance: { totalBalance: 845.84, spendableBalance: 845.84, pendingBalance: 0 },
    summary: { totalTransactions: 20, totalDebitTransactions: 20, totalDebitAmount: 89.15 }
  };
};
