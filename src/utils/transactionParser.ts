
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

// interface ParsedTransactionData {
//   transactions: Transaction[];
//   balance: WalletBalance;
//   summary: TransactionSummary;
// }

// export const parseTransactionHistory = (content: string): ParsedTransactionData => {
//   const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
//   let balance = { totalBalance: 0, spendableBalance: 0, pendingBalance: 0 };
//   let summary = { totalTransactions: 0, totalDebitTransactions: 0, totalDebitAmount: 0 };
//   const transactions: Transaction[] = [];
  
//   let currentSection = '';
//   let isParsingTable = false;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];

//     // Identify sections
//     if (line.includes('Wallet Financial Summary')) {
//       currentSection = 'wallet';
//       continue;
//     } else if (line.includes('Transaction Details')) {
//       currentSection = 'summary';
//       continue;
//     } else if (line.includes('Detailed Transaction Log')) {
//       currentSection = 'transactions';
//       continue;
//     }

//     // Parse wallet balance
//     if (currentSection === 'wallet') {
//       if (line.includes('Total Wallet Balance:')) {
//         balance.totalBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
//       } else if (line.includes('Spendable Balance:')) {
//         balance.spendableBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
//       } else if (line.includes('Pending Balance:')) {
//         balance.pendingBalance = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
//       }
//     }
    
//     // Parse transaction summary
//     else if (currentSection === 'summary') {
//       if (line.includes('Total Transactions:')) {
//         summary.totalTransactions = parseInt(line.match(/\d+/)?.[0] || '0');
//       } else if (line.includes('Total Debit Amount:')) {
//         summary.totalDebitAmount = parseFloat(line.match(/[\d,.]+/)?.[0]?.replace(',', '') || '0');
//       }
//     }
    
//     // Parse individual transactions
//     else if (currentSection === 'transactions') {
//       // Skip table headers and separators
//       if (line.includes('| No.') || line.includes('|-----')) {
//         isParsingTable = true;
//         continue;
//       }
      
//       // Parse transaction rows
//       if (isParsingTable && line.startsWith('|')) {
//         const columns = line.split('|').map(col => col.trim()).filter(col => col);
        
//         if (columns.length >= 5) {
//           const [no, payee, amountStr, date, type] = columns;
//           const amount = parseFloat(amountStr.replace(/[^\d.]/g, ''));
          
//           if (!isNaN(amount) && payee && date) {
//             transactions.push({
//               id: no || `tx-${i}`,
//               type: 'DEBIT',
//               amount: amount,
//               description: `Payment to ${payee}`,
//               date: date,
//               status: 'completed',
//               recipient: payee
//             });
//           }
//         }
//       }
//     }
//   }

//   // Calculate missing summary data
//   if (!summary.totalTransactions) {
//     summary.totalTransactions = transactions.length;
//     summary.totalDebitTransactions = transactions.filter(t => t.type === 'DEBIT').length;
//     summary.totalDebitAmount = transactions.reduce((sum, t) => sum + (t.type === 'DEBIT' ? t.amount : 0), 0);
//   }

//   return { transactions, balance, summary };
// };

// export const getFallbackTransactionData = (): ParsedTransactionData => {
//   const mockTransactions: Transaction[] = [
//     { id: '1', type: 'DEBIT', amount: 1.00, description: 'Payment to john', date: '2024-01-15', status: 'completed', recipient: 'john' },
//     { id: '2', type: 'DEBIT', amount: 10.00, description: 'Payment to sahaj jain', date: '2024-01-14', status: 'completed', recipient: 'sahaj jain' },
//     { id: '3', type: 'DEBIT', amount: 11.00, description: 'Payment to kartik design', date: '2024-01-13', status: 'completed', recipient: 'kartik design' },
//     { id: '4', type: 'DEBIT', amount: 7.00, description: 'Payment to ritik jain', date: '2024-01-12', status: 'completed', recipient: 'ritik jain' },
//     { id: '5', type: 'DEBIT', amount: 2.00, description: 'Transfer to TSD Wallet 1', date: '2024-01-11', status: 'completed', recipient: 'TSD Wallet 1' },
//     { id: '6', type: 'DEBIT', amount: 23.00, description: 'Payment to km', date: '2024-01-10', status: 'completed', recipient: 'km' }
//   ];
  
//   return {
//     transactions: mockTransactions,
//     balance: { totalBalance: 845.84, spendableBalance: 845.84, pendingBalance: 0 },
//     summary: { totalTransactions: 20, totalDebitTransactions: 20, totalDebitAmount: 89.15 }
//   };
// };

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
  let tableHeaders: string[] = [];
  let walletId = '';
  let paytag = '';
  let currency = 'TSD';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Identify sections (case-insensitive matching)
    if (/wallet financial summary/i.test(line)) {
      currentSection = 'wallet';
      continue;
    } else if (/transaction (overview|details)/i.test(line)) {
      currentSection = 'summary';
      continue;
    } else if (/detailed transaction log/i.test(line)) {
      currentSection = 'transactions';
      continue;
    } else if (/payee list/i.test(line)) {
      // Skip payee list section
      break;
    }

    // Parse wallet balance
    if (currentSection === 'wallet') {
      if (/wallet id:/i.test(line)) {
        const match = line.match(/wallet id:\s*([\w-]+)/i);
        if (match && match[1]) {
          walletId = match[1];
        }
      } else if (/paytag:/i.test(line)) {
        const match = line.match(/paytag:\s*([\w./]+)/i);
        if (match && match[1]) {
          paytag = match[1];
        }
      } else if (/total balance:/i.test(line)) {
        const match = line.match(/([\d,.]+)\s*(\w+)?/);
        if (match) {
          balance.totalBalance = parseFloat(match[1].replace(/,/g, ''));
          if (match[2]) currency = match[2];
        }
      } else if (/spendable balance:/i.test(line)) {
        const match = line.match(/([\d,.]+)\s*(\w+)?/);
        if (match) {
          balance.spendableBalance = parseFloat(match[1].replace(/,/g, ''));
          if (match[2]) currency = match[2];
        }
      } else if (/pending balance:/i.test(line)) {
        const match = line.match(/([\d,.]+)\s*(\w+)?/);
        if (match) {
          balance.pendingBalance = parseFloat(match[1].replace(/,/g, ''));
          if (match[2]) currency = match[2];
        }
      }
    }
    
    // Parse transaction summary
    else if (currentSection === 'summary') {
      if (/total transactions:/i.test(line)) {
        const match = line.match(/\d+/);
        if (match) {
          summary.totalTransactions = parseInt(match[0]);
        }
      } else if (/total debit amount:/i.test(line) || /total debits:/i.test(line)) {
        const match = line.match(/([\d,.]+)\s*(\w+)?/);
        if (match) {
          summary.totalDebitAmount = parseFloat(match[1].replace(/,/g, ''));
          if (match[2]) currency = match[2];
        }
      } else if (/currency:/i.test(line)) {
        const match = line.match(/currency:\s*(\w+)/i);
        if (match && match[1]) {
          currency = match[1];
        }
      }
    }
    
    // Parse individual transactions
    else if (currentSection === 'transactions') {
      // Capture table headers
      if (line.includes('|') && !line.includes('|--') && 
          (line.toLowerCase().includes('transaction') || 
           line.toLowerCase().includes('date') || 
           line.toLowerCase().includes('amount'))) {
        // Extract header names for more flexible parsing
        tableHeaders = line.split('|')
          .map(col => col.trim())
          .filter(col => col)
          .map(header => header.toLowerCase());
        isParsingTable = true;
        continue;
      } else if (line.includes('|--')) {
        isParsingTable = true;
        continue;
      }
      
      // Parse transaction rows
      if (isParsingTable && line.startsWith('|')) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col);
        
        if (columns.length >= 3) { // At minimum we need date, recipient, and amount
          // Map columns to their respective data based on headers or position
          let id = '', recipient = '', amountStr = '', date = '', type = 'DEBIT', status = 'completed', createdBy = '';
          
          if (tableHeaders.length > 0) {
            // Use headers to identify columns
            columns.forEach((value, index) => {
              const header = (tableHeaders[index] || '').toLowerCase();
              
              if (header.includes('transaction id') || header.includes('id')) {
                id = value;
              } else if (header.includes('recipient') || header.includes('description')) {
                recipient = value;
              } else if (header.includes('amount')) {
                amountStr = value;
              } else if (header.includes('date')) {
                date = value;
              } else if (header.includes('type')) {
                type = value;
              } else if (header.includes('status')) {
                status = value;
              } else if (header.includes('created by')) {
                createdBy = value;
              }
            });
          } else {
            // Fallback to positional parsing if headers aren't available
            // Assuming format: Date | Recipient | Amount | Type | Status | Created By
            if (columns.length >= 6) {
              [date, recipient, amountStr, type, status, createdBy] = columns;
            } else if (columns.length >= 5) {
              [date, recipient, amountStr, type, status] = columns;
            } else if (columns.length >= 4) {
              [date, recipient, amountStr, type] = columns;
            } else {
              [date, recipient, amountStr] = columns;
            }
          }
          
          // Clean and parse the amount
          const amountMatch = amountStr.match(/([\d,.]+)/);
          const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
          
          // Determine transaction type
          let transactionType: 'DEBIT' | 'CREDIT' = 'DEBIT';
          if (type) {
            const upperType = type.toUpperCase();
            if (upperType.includes('CREDIT') || upperType.includes('TRANSFER')) {
              transactionType = 'CREDIT';
            }
          }
          
          // Generate a unique ID if not provided
          const transactionId = id || `tx-${date}-${Math.floor(Math.random() * 10000)}`;
          
          // Create description from recipient if not provided
          const description = recipient || 'Unknown transaction';
          
          // Only add valid transactions
          if (!isNaN(amount)) {
            transactions.push({
              id: transactionId,
              type: transactionType,
              amount: amount,
              description: description,
              date: date || new Date().toISOString().split('T')[0],
              status: status.toLowerCase() as 'completed' | 'pending' | 'failed',
              recipient: recipient.replace(/payment to /i, ''),
              reference: createdBy || undefined
            });
          }
        }
      }
    }
  }

  // Calculate missing summary data
  if (!summary.totalTransactions) {
    summary.totalTransactions = transactions.length;
  }
  
  summary.totalDebitTransactions = transactions.filter(t => t.type === 'DEBIT').length;
  
  if (!summary.totalDebitAmount) {
    summary.totalDebitAmount = transactions.reduce((sum, t) => sum + (t.type === 'DEBIT' ? t.amount : 0), 0);
  }

  return { transactions, balance, summary };
};

export const getFallbackTransactionData = (): ParsedTransactionData => {
  const today = new Date();
  const formatDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  const mockTransactions: Transaction[] = [
    { id: 'tx-001', type: 'DEBIT', amount: 1.00, description: 'Payment to john', date: formatDate(1), status: 'completed', recipient: 'john', reference: 'expenzse' },
    { id: 'tx-002', type: 'DEBIT', amount: 10.00, description: 'Payment to sahaj jain', date: formatDate(2), status: 'completed', recipient: 'sahaj jain', reference: 'expenzse' },
    { id: 'tx-003', type: 'DEBIT', amount: 11.00, description: 'Payment to kartik design', date: formatDate(3), status: 'completed', recipient: 'kartik design', reference: 'expenzse' },
    { id: 'tx-004', type: 'DEBIT', amount: 7.00, description: 'Payment to ritik jain', date: formatDate(3), status: 'completed', recipient: 'ritik jain', reference: 'expenzse' },
    { id: 'tx-005', type: 'DEBIT', amount: 2.00, description: 'Transfer to TSD Wallet 1', date: formatDate(3), status: 'completed', recipient: 'TSD Wallet 1', reference: 'expenzse' },
    { id: 'tx-006', type: 'DEBIT', amount: 0.01, description: 'Fees and taxes', date: formatDate(4), status: 'completed', recipient: 'Fees and taxes', reference: 'government' },
    { id: 'tx-007', type: 'DEBIT', amount: 5.00, description: 'Payment to ram', date: formatDate(5), status: 'completed', recipient: 'ram', reference: 'government' },
    { id: 'tx-008', type: 'DEBIT', amount: 11.00, description: 'Payment to mahaveer', date: formatDate(6), status: 'completed', recipient: 'mahaveer', reference: 'government' },
    { id: 'tx-009', type: 'DEBIT', amount: 10.00, description: 'Payment to Rathore', date: formatDate(7), status: 'completed', recipient: 'Rathore', reference: 'government' },
    { id: 'tx-010', type: 'DEBIT', amount: 1.00, description: 'Payment to Jain', date: formatDate(8), status: 'completed', recipient: 'Jain', reference: 'government' }
  ];
  
  const totalDebitAmount = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    transactions: mockTransactions,
    balance: { totalBalance: 843.84, spendableBalance: 843.84, pendingBalance: 0 },
    summary: { totalTransactions: mockTransactions.length, totalDebitTransactions: mockTransactions.length, totalDebitAmount }
  };
};
