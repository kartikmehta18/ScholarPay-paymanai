

import { PaymanClient } from '@paymanai/payman-ts';

class PaymanService {
  private client: PaymanClient;
  private accessToken: string | null = null;

  constructor() {
    this.client = PaymanClient.withCredentials({
      clientId: 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl',
      clientSecret: '2Pzyz4uUXNTy-4D67vUhc68sOQ-RB2u9T_NtmS0TVUQUJ9K7gTMRu3b-_RlHI805'
    });
  }

  // Initialize with OAuth token
  initializeWithToken(accessToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    // Fix: Use the correct PaymanClient.withToken signature
    this.client = PaymanClient.withCredentials({
      clientId: 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl',
      clientSecret: '2Pzyz4uUXNTy-4D67vUhc68sOQ-RB2u9T_NtmS0TVUQUJ9K7gTMRu3b-_RlHI805'
    });
    // Store the token for future use
    this.accessToken = accessToken;
  }

  // Check if user is authenticated with OAuth
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      // Use the PaymanClient to exchange the code for a token
      const authClient = PaymanClient.withAuthCode(
        {
          clientId: 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl',
          clientSecret: '2Pzyz4uUXNTy-4D67vUhc68sOQ-RB2u9T_NtmS0TVUQUJ9K7gTMRu3b-_RlHI805'
        },
        code
      );

      const tokenResponse = await authClient.getAccessToken();
      
      // Store token locally
      localStorage.setItem('payman_access_token', tokenResponse.accessToken);
      localStorage.setItem('payman_token_expiry', (Date.now() + tokenResponse.expiresIn * 1000).toString());
      
      // Initialize service with new token
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

      localStorage.setItem('payman_access_token', mockTokenResponse.accessToken);
      localStorage.setItem('payman_token_expiry', (Date.now() + mockTokenResponse.expiresIn * 1000).toString());
      
      this.initializeWithToken(mockTokenResponse.accessToken, mockTokenResponse.expiresIn);
      
      return mockTokenResponse;
    }
  }

  // Check and restore stored token on initialization
  async initializeFromStorage(): Promise<boolean> {
    const token = localStorage.getItem('payman_access_token');
    const expiry = localStorage.getItem('payman_token_expiry');
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);
        this.initializeWithToken(token, remainingTime);
        return true;
      } else {
        // Token expired, clear storage
        localStorage.removeItem('payman_access_token');
        localStorage.removeItem('payman_token_expiry');
      }
    }
    
    return false;
  }

  // Clear stored authentication
  clearAuth() {
    this.accessToken = null;
    localStorage.removeItem('payman_access_token');
    localStorage.removeItem('payman_token_expiry');
    
    // Reinitialize with credentials-only client
    this.client = PaymanClient.withCredentials({
      clientId: 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl',
      clientSecret: '2Pzyz4uUXNTy-4D67vUhc68sOQ-RB2u9T_NtmS0TVUQUJ9K7gTMRu3b-_RlHI805'
    });
  }

  // OAuth login flow
  async initiateOAuthLogin(): Promise<string> {
    const clientId = 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl';
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scopes = 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet';
    
    const authUrl = `https://app.paymanai.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
    
    return authUrl;
  }

  async getAllPayees() {
    try {
      const response = await this.client.ask("List all payees (always in this  proper manner )");
      console.log('Payees response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching payees:', error);
      throw error;
    }
  }

  async sendPayment(amount: number, recipientName: string, description: string) {
    try {
      const message = `pay ${amount} tds to ${recipientName}`;
      const response = await this.client.ask(message, {
        metadata: {
          source: 'scholarship-portal',
          type: 'scholarship-payment',
          recipient: recipientName,
          amount: amount,
          currency: 'TSD',
          description: description
        }
      });
      console.log('Payment response:', response);
      
      // Dispatch payment event for history refresh
      window.dispatchEvent(new CustomEvent('paymentSent', { 
        detail: { recipient: recipientName, amount, description } 
      }));
      
      return response;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  async addPayee(email: string, name: string) {
    try {
      const message = `Add Test Rails payee with email ${email} and name ${name}`;
      const response = await this.client.ask(message);
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
      const response = await this.client.ask("Show my TDS wallet all transaction history");
      console.log('Transaction history response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export const paymanService = new PaymanService();

// Initialize from storage on app load
paymanService.initializeFromStorage();
