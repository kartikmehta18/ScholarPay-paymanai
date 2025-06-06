
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface PaymanOAuthProps {
  onAuthSuccess?: (accessToken: string) => void;
}

const PaymanOAuth: React.FC<PaymanOAuthProps> = ({ onAuthSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    const token = localStorage.getItem('payman_access_token');
    if (token) {
      setIsConnected(true);
      paymanService.initializeWithToken(token, 3600);
    }

    // Listen for OAuth callback messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "payman-oauth-redirect") {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get("code");
        if (code) {
          exchangeCodeForToken(code);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      setIsConnecting(true);
      
      // Simulate token exchange (in a real app, this would be a backend call)
      // For demo purposes, we'll use a mock token
      const mockTokenResponse = {
        accessToken: `mock_token_${code}_${Date.now()}`,
        expiresIn: 3600
      };

      const { accessToken, expiresIn } = mockTokenResponse;
      
      // Store token and initialize service
      localStorage.setItem('payman_access_token', accessToken);
      localStorage.setItem('payman_token_expiry', (Date.now() + expiresIn * 1000).toString());
      
      paymanService.initializeWithToken(accessToken, expiresIn);
      setIsConnected(true);
      
      toast({
        title: "Success",
        description: "Successfully connected to Payman wallet",
      });

      if (onAuthSuccess) {
        onAuthSuccess(accessToken);
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Payman wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Create the Payman connect button dynamically
    const connectDiv = document.createElement('div');
    connectDiv.id = 'payman-connect-temp';
    document.body.appendChild(connectDiv);

    const script = document.createElement('script');
    script.src = 'https://app.paymanai.com/js/pm.js';
    script.setAttribute('data-client-id', 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl');
    script.setAttribute('data-scopes', 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet');
    script.setAttribute('data-redirect-uri', `http://localhost:8080/`);
    script.setAttribute('data-target', '#payman-connect-temp');
    script.setAttribute('data-dark-mode', 'false');
    script.setAttribute('data-styles', JSON.stringify({
      borderRadius: "8px",
      fontSize: "14px"
    }));

    script.onload = () => {
      // Auto-click the connect button
      setTimeout(() => {
        const button = document.querySelector('#payman-connect-temp button');
        if (button) {
          (button as HTMLButtonElement).click();
        }
      }, 100);
    };

    document.head.appendChild(script);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('payman_access_token');
    localStorage.removeItem('payman_token_expiry');
    setIsConnected(false);
    
    toast({
      title: "Disconnected",
      description: "Payman wallet disconnected",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Payman Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isConnected ? 'Connected to Payman' : 'Not Connected'}
                </p>
                <p className="text-sm text-gray-600">
                  {isConnected ? 'You can now make payments' : 'Connect to access payment features'}
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="space-y-2">
            {!isConnected ? (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Payman Wallet'}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Connected successfully!</strong> You can now select payees and make payments.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymanOAuth;
