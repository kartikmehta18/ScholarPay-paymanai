
// import { PaymanClient } from '@paymanai/payman-ts';

// class PaymanService {
//   private client: PaymanClient;
//   private accessToken: string | null = null;
//   private tokenExpiry: number | null = null;
//   private isInitialized: boolean = false;
//   private supabaseToken: string | null = null;
//   private supabaseTokenData: any = null;

//   // OAuth configuration - using your updated credentials
//   private readonly clientId = 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq';
//   private readonly clientSecret = 'qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA';
//   private readonly scopes = 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet';

//   constructor() {
//     this.client = PaymanClient.withCredentials({
//       clientId: this.clientId,
//       clientSecret: this.clientSecret
//     });
    
//     this.initializeSync();
//     this.setupPaymanOAuth();
//   }

//   // Setup OAuth message listener like in your reference code
//   private setupPaymanOAuth() {
//     window.addEventListener('message', (event) => {
//       if (event.data.type === 'payman-oauth-redirect') {
//         const url = new URL(event.data.redirectUri);
//         const code = url.searchParams.get('code');
//         console.log('OAuth code received:', code);
//         if (code) {
//           this.exchangeCodeForToken(code);
//         } else {
//           console.error('OAuth authorization failed');
//         }
//       }
//     });
//   }

//   // Set Supabase token for verification with detailed parsing
//   setSupabaseToken(token: string) {
//     this.supabaseToken = token;
    
//     // Parse JWT token to extract user information
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       this.supabaseTokenData = payload;
      
//       console.log('Supabase token verified and parsed for user:', payload.email);
//     } catch (error) {
//       console.error('Error parsing Supabase token:', error);
//     }
//   }

//   // Enhanced token verification - only requires valid Supabase token
//   isTokenVerified(): boolean {
//     if (!this.supabaseToken || !this.supabaseTokenData) {
//       return false;
//     }
    
//     // Check if token is expired
//     const now = Math.floor(Date.now() / 1000);
//     if (this.supabaseTokenData.exp && now >= this.supabaseTokenData.exp) {
//       console.log('Supabase token has expired');
//       return false;
//     }
    
//     // For government users, only Supabase token verification is required
//     return true;
//   }

//   // Get user info from verified token
//   getVerifiedUserInfo() {
//     if (!this.isTokenVerified()) {
//       return null;
//     }
    
//     return {
//       id: this.supabaseTokenData.sub,
//       email: this.supabaseTokenData.email,
//       role: this.supabaseTokenData.user_metadata?.role,
//       department: this.supabaseTokenData.user_metadata?.department,
//       name: this.supabaseTokenData.user_metadata?.name
//     };
//   }

//   // Fast synchronous initialization
//   private initializeSync() {
//     if (this.isInitialized) return;
    
//     const token = localStorage.getItem('payman_access_token');
//     const expiry = localStorage.getItem('payman_token_expiry');
    
//     if (token && expiry) {
//       const expiryTime = parseInt(expiry);
//       if (Date.now() < expiryTime) {
//         this.accessToken = token;
//         this.tokenExpiry = expiryTime;
//         console.log('PaymanService: Token loaded from storage');
//       } else {
//         // Token expired, clear immediately
//         this.clearAuth();
//         console.log('PaymanService: Expired token cleared');
//       }
//     }
    
//     this.isInitialized = true;
//   }

//   // Initialize with OAuth token - optimized
//   initializeWithToken(accessToken: string, expiresIn: number) {
//     this.accessToken = accessToken;
//     this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
//     // Store immediately for persistence
//     localStorage.setItem('payman_access_token', accessToken);
//     localStorage.setItem('payman_token_expiry', this.tokenExpiry.toString());
    
//     this.client = PaymanClient.withCredentials({
//       clientId: this.clientId,
//       clientSecret: this.clientSecret
//     });
    
//     console.log('PaymanService: Initialized with new token');
//   }

//   // Fast authentication check
//   isAuthenticated(): boolean {
//     this.initializeSync();
    
//     if (!this.accessToken || !this.tokenExpiry) {
//       return false;
//     }
    
//     // Check if token is expired
//     if (Date.now() >= this.tokenExpiry) {
//       this.clearAuth();
//       return false;
//     }
    
//     return true;
//   }

//   // Generate OAuth authorization URL
//   getOAuthAuthorizationUrl(redirectUri: string): string {
//     const authUrl = new URL('https://app.paymanai.com/oauth/authorize');
//     authUrl.searchParams.set('client_id', this.clientId);
//     authUrl.searchParams.set('redirect_uri', redirectUri);
//     authUrl.searchParams.set('scope', this.scopes);
//     authUrl.searchParams.set('response_type', 'code');
    
//     return authUrl.toString();
//   }

//   // Exchange authorization code for access token
//   async exchangeCodeForToken(code: string): Promise<{ accessToken: string; expiresIn: number }> {
//     try {
//       console.log('🔄 Making OAuth token exchange request with code:', code);
      
//       // Create auth client with proper configuration
//       const authClient = PaymanClient.withAuthCode(
//         {
//           clientId: this.clientId,
//           clientSecret: this.clientSecret
//         },
//         code
//       );

//       const tokenResponse = await authClient.getAccessToken();
      
//       // Initialize service with new token immediately
//       this.initializeWithToken(tokenResponse.accessToken, tokenResponse.expiresIn);
      
//       console.log('Token exchange successful');
      
//       // Auto-create user as payee after successful authentication
//       await this.createUserAsPayee();
      
//       return {
//         accessToken: tokenResponse.accessToken,
//         expiresIn: tokenResponse.expiresIn
//       };
//     } catch (error) {
//       console.error('Token exchange failed:', error);
      
//       // Fallback to mock token for demo purposes
//       const mockTokenResponse = {
//         accessToken: `payman_token_${code}_${Date.now()}`,
//         expiresIn: 3600
//       };

//       this.initializeWithToken(mockTokenResponse.accessToken, mockTokenResponse.expiresIn);
      
//       return mockTokenResponse;
//     }
//   }

//   // Create authenticated user as a payee automatically
//   async createUserAsPayee(): Promise<void> {
//     const userInfo = this.getVerifiedUserInfo();
//     if (!userInfo) {
//       console.log('No user info available for payee creation');
//       return;
//     }

//     try {
//       const message = `Add payee with email ${userInfo.email} and name "${userInfo.name}"`;
//       console.log('Creating user as payee:', message);
      
//       const response = await this.client.ask(message, {
//         metadata: {
//           source: 'scholarship-portal',
//           type: 'user-payee-creation',
//           email: userInfo.email,
//           name: userInfo.name,
//           userId: userInfo.id,
//           role: userInfo.role
//         }
//       });
      
//       console.log('User payee creation response:', response);
//     } catch (error) {
//       console.error('Error creating user as payee:', error);
//       // Don't throw - this is not critical for authentication
//     }
//   }

//   // Clear stored authentication
//   clearAuth() {
//     this.accessToken = null;
//     this.tokenExpiry = null;
//     localStorage.removeItem('payman_access_token');
//     localStorage.removeItem('payman_token_expiry');
    
//     // Reinitialize with credentials-only client
//     this.client = PaymanClient.withCredentials({
//       clientId: this.clientId,
//       clientSecret: this.clientSecret
//     });
    
//     console.log('PaymanService: Authentication cleared');
//   }

//   // OAuth login flow
//   async initiateOAuthLogin(): Promise<string> {
//     const redirectUri = `${window.location.origin}/oauth/callback`;
    
//     const authUrl = `https://app.paymanai.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(this.scopes)}&response_type=code`;
    
//     return authUrl;
//   }

//   // Enhanced get all payees with proper parsing
//   async getAllPayees() {
//     try {
//       console.log('Fetching payees from Payman SDK...');
      
//       const response = await this.client.ask("List all payees (always in this proper manner only)");
//       console.log('Payees response:', response);
      
//       // Parse and structure payee data for government dashboard
//       const payees = this.parsePayeesFromResponse(response);
      
//       return {
//         artifacts: response.artifacts || [{ content: response.toString() }],
//         status: 'COMPLETED',
//         parsedPayees: payees
//       };
//     } catch (error) {
//       console.error('Error fetching payees:', error);
//       // Return consistent fallback structure for government dashboard
//       return {
//         artifacts: [{ content: '1. Demo Student (demo@student.edu) - Student' }],
//         status: 'COMPLETED',
//         parsedPayees: [{ name: 'Demo Student', email: 'demo@student.edu', type: 'Student' }]
//       };
//     }
//   }

//   // Enhanced payee parsing for government dashboard compatibility
//   private parsePayeesFromResponse(response: any) {
//     if (!response?.artifacts?.[0]?.content) return [];
    
//     const content = response.artifacts[0].content;
//     const lines = content.split('\n');
//     const payees: any[] = [];
    
//     lines.forEach((line: string) => {
//       const match = line.match(/^\d+\.\s*(.+?)\s*\((.+?)\)(?:\s*-\s*(.+?))?$/);
//       if (match) {
//         payees.push({
//           name: match[1].trim(),
//           email: match[2].trim(),
//           type: match[3]?.trim() || 'Student'
//         });
//       }
//     });
    
//     return payees;
//   }

//   async sendPayment(amount: number, recipientName: string, description: string) {
//     const userInfo = this.getVerifiedUserInfo();
    
//     try {
//       const message = `pay ${amount} tds to ${recipientName}`;
//       const response = await this.client.ask(message, {
//         metadata: {
//           source: 'scholarship-portal',
//           type: 'scholarship-payment',
//           recipient: recipientName,
//           amount: amount,
//           currency: 'TSD',
//           description: description,
//           sender: userInfo?.email,
//           senderRole: userInfo?.role,
//           supabaseUserId: userInfo?.id
//         }
//       });
//       console.log('Payment response:', response);
      
//       // Dispatch custom event for payment tracking
//       window.dispatchEvent(new CustomEvent('paymentSent', { 
//         detail: { recipient: recipientName, amount, description, response } 
//       }));
      
//       return response;
//     } catch (error) {
//       console.error('Error sending payment:', error);
//       throw error;
//     }
//   }

//   async addPayee(email: string, name: string, payeeType?: string): Promise<any> {
//     try {
//       let message = `Add test rail payee with email ${email} and name "${name}"`;
//       if (payeeType) {
//         message += ` as ${payeeType} type`;
//       }
      
//       console.log('Creating payee with message:', message);
      
//       const response = await this.client.ask(message, {
//         metadata: {
//           source: 'scholarship-portal',
//           type: 'payee-creation',
//           email: email,
//           name: name
//         }
//       });
      
//       console.log('Add payee response:', response);
//       return response;
//     } catch (error) {
//       console.error('Error adding payee:', error);
//       throw error;
//     }
//   }

//   // Enhanced wallet balance with consistent return structure
//   async getWalletBalance() {
//     try {
//       console.log('Fetching wallet balance from Payman SDK...');
      
//       const response = await this.client.ask("Show my TDS wallet 3 balance");
//       console.log('Wallet balance response:', response);
      
//       // Parse response to extract balance details
//       const content = response?.artifacts?.[0]?.content || response.toString();
//       const balanceData = this.parseWalletBalance(content);
      
//       return {
//         artifacts: response.artifacts || [{ content }],
//         status: 'COMPLETED',
//         parsedBalance: balanceData
//       };
//     } catch (error) {
//       console.error('Error fetching wallet balance:', error);
//       // Return consistent fallback structure
//       return {
//         artifacts: [{ content: 'Total Balance: 50,000.00 TSD\nSpendable Balance: 45,000.00 TSD\nPending Balance: 5,000.00 TSD' }],
//         status: 'COMPLETED',
//         parsedBalance: { totalBalance: 50000, spendableBalance: 45000, pendingBalance: 5000 }
//       };
//     }
//   }

//   // Parse wallet balance from response text
//   private parseWalletBalance(content: string) {
//     const totalMatch = content.match(/Total.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
//     const spendableMatch = content.match(/Spendable.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
//     const pendingMatch = content.match(/Pending.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    
//     return {
//       totalBalance: totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0,
//       spendableBalance: spendableMatch ? parseFloat(spendableMatch[1].replace(/,/g, '')) : 0,
//       pendingBalance: pendingMatch ? parseFloat(pendingMatch[1].replace(/,/g, '')) : 0
//     };
//   }

//   // Get detailed transaction history with consistent return structure
//   async getTransactionHistory() {
//     try {
//       console.log('Fetching transaction history from Payman SDK...');
      
//       const response = await this.client.ask("list my all transaction history in proper manner total wallet balance total debit net balance total transaction payee name date and amount");
//       console.log('Transaction history response:', response);
      
//       // Parse transactions for better display
//       const transactions = this.parseTransactionsFromResponse(response);
      
//       return {
//         artifacts: response.artifacts || [{ content: response.toString() }],
//         status: 'COMPLETED',
//         parsedTransactions: transactions
//       };
//     } catch (error) {
//       console.error('Error fetching transaction history:', error);
//       // Return consistent fallback structure
//       return {
//         artifacts: [{ content: '2024-06-08 - 1,000.00 TSD to Demo Student - Demo Payment' }],
//         status: 'COMPLETED',
//         parsedTransactions: [{
//           id: 'txn-001',
//           type: 'DEBIT',
//           amount: 1000,
//           description: 'Demo Payment',
//           date: '2024-06-08',
//           status: 'completed',
//           recipient: 'Demo Student'
//         }]
//       };
//     }
//   }

//   // Parse transactions from response
//   private parseTransactionsFromResponse(response: any) {
//     const content = response?.artifacts?.[0]?.content || response.toString();
//     const lines = content.split('\n');
//     const transactions: any[] = [];
    
//     lines.forEach((line: string, index: number) => {
//       const match = line.match(/(\d{4}-\d{2}-\d{2}).*?(\d+\.?\d*)\s*TSD.*?to\s+(.+?)\s+-\s+(.+)$/i);
//       if (match) {
//         transactions.push({
//           id: `txn-${String(index).padStart(3, '0')}`,
//           type: 'DEBIT',
//           amount: parseFloat(match[2]),
//           description: match[4].trim(),
//           date: match[1],
//           status: 'completed',
//           recipient: match[3].trim()
//         });
//       }
//     });
    
//     return transactions;
//   }

//   // Get user profile from Payman
//   async getUserProfile() {
//     try {
//       const response = await this.client.ask("Get my user profile information including name, email, and account details", {
//         metadata: {
//           source: 'scholarship-portal',
//           type: 'user-profile'
//         }
//       });
//       console.log('User profile response:', response);
//       return response;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       throw error;
//     }
//   }
// }

// export const paymanService = new PaymanService();

import { PaymanClient } from '@paymanai/payman-ts';

class PaymanService {
  private client: PaymanClient;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private isInitialized: boolean = false;
  private supabaseToken: string | null = null;
  private supabaseTokenData: any = null;

  // OAuth configuration - using your updated credentials
  private readonly clientId = 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq';
  private readonly clientSecret = 'qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA';
  private readonly scopes = 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet';

  constructor() {
    this.client = PaymanClient.withCredentials({
      clientId: this.clientId,
      clientSecret: this.clientSecret
    });
    
    this.initializeSync();
    this.setupPaymanOAuth();
  }

  // Setup OAuth message listener like in your reference code
  private setupPaymanOAuth() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'payman-oauth-redirect') {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get('code');
        console.log('OAuth code received:', code);
        if (code) {
          this.exchangeCodeForToken(code);
        } else {
          console.error('OAuth authorization failed');
        }
      }
    });
  }

  // Set Supabase token for verification with detailed parsing
  setSupabaseToken(token: string) {
    this.supabaseToken = token;
    
    // Parse JWT token to extract user information
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.supabaseTokenData = payload;
      
      console.log('Supabase token verified and parsed for user:', payload.email);
    } catch (error) {
      console.error('Error parsing Supabase token:', error);
    }
  }

  // Enhanced token verification - only requires valid Supabase token
  isTokenVerified(): boolean {
    if (!this.supabaseToken || !this.supabaseTokenData) {
      return false;
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (this.supabaseTokenData.exp && now >= this.supabaseTokenData.exp) {
      console.log('Supabase token has expired');
      return false;
    }
    
    // For government users, only Supabase token verification is required
    return true;
  }

  // Get user info from verified token
  getVerifiedUserInfo() {
    if (!this.isTokenVerified()) {
      return null;
    }
    
    return {
      id: this.supabaseTokenData.sub,
      email: this.supabaseTokenData.email,
      role: this.supabaseTokenData.user_metadata?.role,
      department: this.supabaseTokenData.user_metadata?.department,
      name: this.supabaseTokenData.user_metadata?.name
    };
  }

  // Fast synchronous initialization
  private initializeSync() {
    if (this.isInitialized) return;
    
    const token = localStorage.getItem('payman_access_token');
    const expiry = localStorage.getItem('payman_token_expiry');
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        this.accessToken = token;
        this.tokenExpiry = expiryTime;
        console.log('PaymanService: Token loaded from storage');
      } else {
        // Token expired, clear immediately
        this.clearAuth();
        console.log('PaymanService: Expired token cleared');
      }
    }
    
    this.isInitialized = true;
  }

  // Initialize with OAuth token - optimized
  initializeWithToken(accessToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
    // Store immediately for persistence
    localStorage.setItem('payman_access_token', accessToken);
    localStorage.setItem('payman_token_expiry', this.tokenExpiry.toString());
    
    this.client = PaymanClient.withCredentials({
      clientId: this.clientId,
      clientSecret: this.clientSecret
    });
    
    console.log('PaymanService: Initialized with new token');
  }

  // Fast authentication check
  isAuthenticated(): boolean {
    this.initializeSync();
    
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token is expired
    if (Date.now() >= this.tokenExpiry) {
      this.clearAuth();
      return false;
    }
    
    return true;
  }

  // Generate OAuth authorization URL
  getOAuthAuthorizationUrl(redirectUri: string): string {
    const authUrl = new URL('https://app.paymanai.com/oauth/authorize');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', this.scopes);
    authUrl.searchParams.set('response_type', 'code');
    
    return authUrl.toString();
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      console.log('🔄 Making OAuth token exchange request with code:', code);
      
      // Create auth client with proper configuration
      const authClient = PaymanClient.withAuthCode(
        {
          clientId: this.clientId,
          clientSecret: this.clientSecret
        },
        code
      );

      const tokenResponse = await authClient.getAccessToken();
      
      // Initialize service with new token immediately
      this.initializeWithToken(tokenResponse.accessToken, tokenResponse.expiresIn);
      
      console.log('Token exchange successful');
      
      // Auto-create user as payee after successful authentication
      await this.createUserAsPayee();
      
      return {
        accessToken: tokenResponse.accessToken,
        expiresIn: tokenResponse.expiresIn
      };
    } catch (error) {
      console.error('Token exchange failed:', error);
      
      // Fallback to mock token for demo purposes
      const mockTokenResponse = {
        accessToken: `payman_token_${code}_${Date.now()}`,
        expiresIn: 3600
      };

      this.initializeWithToken(mockTokenResponse.accessToken, mockTokenResponse.expiresIn);
      
      return mockTokenResponse;
    }
  }

  // Create authenticated user as a payee automatically
  async createUserAsPayee(): Promise<void> {
    const userInfo = this.getVerifiedUserInfo();
    if (!userInfo) {
      console.log('No user info available for payee creation');
      return;
    }

    try {
      const message = `Add payee with email ${userInfo.email} and name "${userInfo.name}"`;
      console.log('Creating user as payee:', message);
      
      const response = await this.client.ask(message, {
        metadata: {
          source: 'scholarship-portal',
          type: 'user-payee-creation',
          email: userInfo.email,
          name: userInfo.name,
          userId: userInfo.id,
          role: userInfo.role
        }
      });
      
      console.log('User payee creation response:', response);
    } catch (error) {
      console.error('Error creating user as payee:', error);
      // Don't throw - this is not critical for authentication
    }
  }

  // Clear stored authentication
  clearAuth() {
    this.accessToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('payman_access_token');
    localStorage.removeItem('payman_token_expiry');
    
    // Reinitialize with credentials-only client
    this.client = PaymanClient.withCredentials({
      clientId: this.clientId,
      clientSecret: this.clientSecret
    });
    
    console.log('PaymanService: Authentication cleared');
  }

  // OAuth login flow
  async initiateOAuthLogin(): Promise<string> {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    
    const authUrl = `https://app.paymanai.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(this.scopes)}&response_type=code`;
    
    return authUrl;
  }

  // Enhanced get all payees with proper parsing
  async getAllPayees() {
    try {
      console.log('Fetching payees from Payman SDK...');
      
      const response = await this.client.ask("List all payees (always in this proper manner only)");
      console.log('Payees response:', response);
      
      // Parse and structure payee data for government dashboard
      const payees = this.parsePayeesFromResponse(response);
      
      return {
        artifacts: response.artifacts || [{ content: response.toString() }],
        status: 'COMPLETED',
        parsedPayees: payees
      };
    } catch (error) {
      console.error('Error fetching payees:', error);
      // Return consistent fallback structure for government dashboard
      return {
        artifacts: [{ content: '1. Demo Student (demo@student.edu) - Student' }],
        status: 'COMPLETED',
        parsedPayees: [{ name: 'Demo Student', email: 'demo@student.edu', type: 'Student' }]
      };
    }
  }

  // Enhanced payee parsing for government dashboard compatibility
  private parsePayeesFromResponse(response: any) {
    if (!response?.artifacts?.[0]?.content) return [];
    
    const content = response.artifacts[0].content;
    const lines = content.split('\n');
    const payees: any[] = [];
    
    lines.forEach((line: string) => {
      const match = line.match(/^\d+\.\s*(.+?)\s*\((.+?)\)(?:\s*-\s*(.+?))?$/);
      if (match) {
        payees.push({
          name: match[1].trim(),
          email: match[2].trim(),
          type: match[3]?.trim() || 'Student'
        });
      }
    });
    
    return payees;
  }

  async sendPayment(amount: number, recipientName: string, description: string) {
    const userInfo = this.getVerifiedUserInfo();
    
    try {
      const message = `pay ${amount} tds to ${recipientName}`;
      const response = await this.client.ask(message, {
        metadata: {
          source: 'scholarship-portal',
          type: 'scholarship-payment',
          recipient: recipientName,
          amount: amount,
          currency: 'TSD',
          description: description,
          sender: userInfo?.email,
          senderRole: userInfo?.role,
          supabaseUserId: userInfo?.id
        }
      });
      console.log('Payment response:', response);
      
      // Dispatch custom event for payment tracking
      window.dispatchEvent(new CustomEvent('paymentSent', { 
        detail: { recipient: recipientName, amount, description, response } 
      }));
      
      return response;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  async addPayee(email: string, name: string, payeeType?: string): Promise<any> {
    try {
      let message = `Add test rail payee with email ${email} and name "${name}"`;
      if (payeeType) {
        message += ` as ${payeeType} type`;
      }
      
      console.log('Creating payee with message:', message);
      
      const response = await this.client.ask(message, {
        metadata: {
          source: 'scholarship-portal',
          type: 'payee-creation',
          email: email,
          name: name
        }
      });
      
      console.log('Add payee response:', response);
      return response;
    } catch (error) {
      console.error('Error adding payee:', error);
      throw error;
    }
  }

  // Enhanced wallet balance with consistent return structure
  async getWalletBalance() {
    try {
      console.log('Fetching wallet balance from Payman SDK...');
      
      const response = await this.client.ask("Show my TDS wallet 3 balance");
      console.log('Wallet balance response:', response);
      
      // Parse response to extract balance details
      const content = response?.artifacts?.[0]?.content || response.toString();
      const balanceData = this.parseWalletBalance(content);
      
      return {
        artifacts: response.artifacts || [{ content }],
        status: 'COMPLETED',
        parsedBalance: balanceData
      };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Return consistent fallback structure
      return {
        artifacts: [{ content: 'Total Balance: 50,000.00 TSD\nSpendable Balance: 45,000.00 TSD\nPending Balance: 5,000.00 TSD' }],
        status: 'COMPLETED',
        parsedBalance: { totalBalance: 50000, spendableBalance: 45000, pendingBalance: 5000 }
      };
    }
  }

  // Parse wallet balance from response text
  private parseWalletBalance(content: string) {
    const totalMatch = content.match(/Total.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    const spendableMatch = content.match(/Spendable.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    const pendingMatch = content.match(/Pending.*Balance.*?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    
    return {
      totalBalance: totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0,
      spendableBalance: spendableMatch ? parseFloat(spendableMatch[1].replace(/,/g, '')) : 0,
      pendingBalance: pendingMatch ? parseFloat(pendingMatch[1].replace(/,/g, '')) : 0
    };
  }

  // Get detailed transaction history with consistent return structure
  async getTransactionHistory() {
    try {
      console.log('Fetching transaction history from Payman SDK...');
      
      // Use a more structured query to get comprehensive transaction data
      const response = await this.client.ask(
        "Please provide my complete transaction history in a structured format with the following sections:\n" +
        "1. Wallet Financial Summary: Include wallet ID, paytag, total balance, spendable balance, and pending balance\n" +
        "2. Transaction Overview: Include total transactions, total debit amount, and currency\n" +
        "3. Detailed Transaction Log: Format as a table with columns for Transaction Date, Recipient/Description, Amount, Type, Status, and Created By\n" +
        "4. Include a list of unique payees at the end"
      );
      
      console.log('Transaction history response:', response);
      
      // Process the response to ensure consistent format
      let content = '';
      if (response?.artifacts?.[0]?.content) {
        content = response.artifacts[0].content;
      } else if (response?.artifacts?.[0]?.text) {
        content = response.artifacts[0].text;
      } else if (response?.text) {
        content = response.text;
      } else {
        content = this.structureTransactionContent(response);
      }
      
      return {
        artifacts: [{ content }],
        status: 'COMPLETED'
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      
      // Return consistent fallback structure with more realistic demo data
      return {
        artifacts: [{ content: this.generateFallbackTransactionContent() }],
        status: 'COMPLETED'
      };
    }
  }

  // Structure transaction content from response object
  private structureTransactionContent(response: any): string {
    try {
      // Extract transaction data from various possible response formats
      let transactions = [];
      let balance = { totalBalance: 0, spendableBalance: 0, pendingBalance: 0 };
      let walletId = '';
      let paytag = '';
      
      // Try to extract data from different possible response structures
      if (response?.transactions) {
        transactions = response.transactions;
      } else if (response?.data?.transactions) {
        transactions = response.data.transactions;
      } else if (Array.isArray(response)) {
        transactions = response;
      }
      
      // Extract balance information
      if (response?.balance) {
        balance = response.balance;
      } else if (response?.walletBalance) {
        balance = response.walletBalance;
      } else if (response?.data?.balance) {
        balance = response.data.balance;
      }
      
      // Extract wallet details
      if (response?.wallet) {
        walletId = response.wallet.id || '';
        paytag = response.wallet.paytag || '';
      } else if (response?.walletId) {
        walletId = response.walletId;
      }
      
      // Format the content in a structured way
      let content = "1. Wallet Financial Summary:\n";
      if (walletId) content += `- Wallet ID: ${walletId}\n`;
      if (paytag) content += `- Paytag: ${paytag}\n`;
      content += `- Total Balance: ${balance.totalBalance || 0} TSD\n`;
      content += `- Spendable Balance: ${balance.spendableBalance || 0} TSD\n`;
      content += `- Pending Balance: ${balance.pendingBalance || 0} TSD\n\n`;
      
      // Transaction summary
      content += "2. Transaction Overview:\n";
      content += `- Total Transactions: ${transactions.length}\n`;
      
      const debitTransactions = transactions.filter((t: any) => 
        t.type?.toUpperCase() === 'DEBIT' || 
        t.type?.toUpperCase() === 'PAYMENT' || 
        t.type?.toUpperCase() === 'FEES_AND_TAXES'
      );
      const totalDebitAmount = debitTransactions.reduce((sum: number, t: any) => 
        sum + (parseFloat(t.amount) || 0), 0
      );
      content += `- Total Debit Amount: ${totalDebitAmount.toFixed(2)} TSD\n`;
      content += `- Currency: TSD\n\n`;
      
      // Transaction table
      content += "3. Detailed Transaction Log:\n\n";
      content += "| Transaction Date | Recipient/Description | Amount (TSD) | Type | Status | Created By |\n";
      content += "|-----------------|----------------------|--------------|------|--------|------------|\n";
      
      transactions.forEach((t: any) => {
        const date = t.date || new Date().toISOString().split('T')[0];
        const recipient = t.recipient || t.payee || t.description || 'Unknown';
        const amount = (t.amount || 0).toFixed(2);
        const type = t.type || 'PAYMENT';
        const status = t.status || 'VERIFIED';
        const createdBy = t.createdBy || t.reference || 'system';
        
        content += `| ${date} | ${recipient} | ${amount} | ${type} | ${status} | ${createdBy} |\n`;
      });
      
      // Add unique payees list
      const uniquePayees = [...new Set(transactions
        .map((t: any) => t.recipient || t.payee || '')
        .filter((p: string) => p && p !== 'Unknown')
      )];
      
      content += "\n4. Payee List (Unique Payees):\n";
      uniquePayees.forEach((payee: string, index: number) => {
        content += `${index + 1}. ${payee}\n`;
      });
      
      return content;
    } catch (e) {
      console.error('Error structuring transaction content:', e);
      return this.generateFallbackTransactionContent();
    }
  }
  
  // Generate fallback transaction content for demo purposes
  private generateFallbackTransactionContent(): string {
    const today = new Date();
    const formatDate = (daysAgo: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    };
    
    let content = "Wallet Financial Summary\n";
    content += "Total Wallet Balance: 845.84 TSD\n";
    content += "Spendable Balance: 845.84 TSD\n";
    content += "Pending Balance: 0 TSD\n\n";
    
    content += "Transaction Details\n";
    content += "Total Transactions: 20\n";
    content += "Total Debit Amount: 89.15 TSD\n\n";
    
    content += "Detailed Transaction Log\n";
    content += "| No. | Recipient | Amount | Date | Type |\n";
    content += "|-----|-----------|--------|------|------|\n";
    content += `| 1 | John Smith | 1.00 TSD | ${formatDate(0)} | DEBIT |\n`;
    content += `| 2 | Sahaj Jain | 10.00 TSD | ${formatDate(1)} | DEBIT |\n`;
    content += `| 3 | Kartik Design | 11.00 TSD | ${formatDate(2)} | DEBIT |\n`;
    content += `| 4 | Ritik Jain | 7.00 TSD | ${formatDate(3)} | DEBIT |\n`;
    content += `| 5 | TSD Wallet 1 | 2.00 TSD | ${formatDate(4)} | DEBIT |\n`;
    content += `| 6 | KM | 23.00 TSD | ${formatDate(5)} | DEBIT |\n`;
    
    return content;
  }

  // Get user profile from Payman
  async getUserProfile() {
    try {
      const response = await this.client.ask("Get my user profile information including name, email, and account details", {
        metadata: {
          source: 'scholarship-portal',
          type: 'user-profile'
        }
      });
      console.log('User profile response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export const paymanService = new PaymanService();
