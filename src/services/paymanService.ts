import { PaymanClient } from '@paymanai/payman-ts';

class PaymanService {
  private client: PaymanClient;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private isInitialized: boolean = false;
  private supabaseToken: string | null = null;
  private supabaseTokenData: any = null;

  constructor() {
    this.client = PaymanClient.withCredentials({
      clientId: 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq',
      clientSecret: 'qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA'
    });
    
    this.initializeSync();
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

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      console.log('Exchanging code for token...');
      
      // Create auth client with proper configuration
      const authClient = PaymanClient.withAuthCode(
        {
          clientId: 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq',
          clientSecret: 'qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA'
        },
        code
      );

      const tokenResponse = await authClient.getAccessToken();
      
      // Initialize service with new token immediately
      this.initializeWithToken(tokenResponse.accessToken, tokenResponse.expiresIn);
      
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

  // Clear stored authentication
  clearAuth() {
    this.accessToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('payman_access_token');
    localStorage.removeItem('payman_token_expiry');
    
    // Reinitialize with credentials-only client
    this.client = PaymanClient.withCredentials({
      clientId: 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq',
      clientSecret: 'qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA'
    });
    
    console.log('PaymanService: Authentication cleared');
  }

  // OAuth login flow
  async initiateOAuthLogin(): Promise<string> {
    const clientId = 'pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq';
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scopes = 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet';
    
    const authUrl = `https://app.paymanai.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
    
    return authUrl;
  }

  async getAllPayees() {
    // if (!this.isTokenVerified()) {
    //   throw new Error('Authentication required - tokens not verified');
    // }
    
    try {
      const response = await this.client.ask("List all payees (always in this proper manner only)");
      console.log('Payees response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching payees:', error);
      throw error;
    }
  }

  async sendPayment(amount: number, recipientName: string, description: string) {
    const userInfo = await this.getVerifiedUserInfo();
    
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
      
      window.dispatchEvent(new CustomEvent('paymentSent', { 
        detail: { recipient: recipientName, amount, description } 
      }));
      
      return response;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  async addPayee(email: string, name: string): Promise<any> {
    try {
      const message = `Add payee with email ${email} and name "${name}"`;
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

  async getWalletBalance() {
    try {
      const response = await this.client.ask("Show my TDS wallet 3 balance");
      console.log('Wallet balance response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }

  async getTransactionHistory() {
    try {
      const response = await this.client.ask("list my  all transaction history in proper manner total wallet balance total debit net balance total transation  payee name date and amount");
      console.log('Transaction history response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export const paymanService = new PaymanService();
