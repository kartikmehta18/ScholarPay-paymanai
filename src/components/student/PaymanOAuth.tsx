
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, CheckCircle, AlertCircle, Users, DollarSign } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymanOAuthProps {
  onAuthSuccess?: (accessToken: string) => void;
}

const PaymanOAuth: React.FC<PaymanOAuthProps> = ({ onAuthSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [walletBalance, setWalletBalance] = useState<any>(null);
  const [payeeCount, setPayeeCount] = useState(0);
  const { toast } = useToast();
  const { accessToken } = useAuth();

  useEffect(() => {
    // Check authentication and verification status
    const connected = paymanService.isAuthenticated();
    setIsConnected(connected);
    
    // Set Supabase token in PaymanService for verification
    if (accessToken) {
      paymanService.setSupabaseToken(accessToken);
      const verified = paymanService.isTokenVerified();
      setIsVerified(verified);
      console.log('Token verification status:', verified);
      
      // Load wallet data if connected and verified
      if (connected && verified) {
        loadWalletData();
        if (onAuthSuccess) {
          onAuthSuccess(accessToken);
        }
      }
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
  }, [accessToken, onAuthSuccess]);

  const loadWalletData = async () => {
    try {
      // Load wallet balance
      const balanceResponse = await paymanService.getWalletBalance();
      setWalletBalance(balanceResponse.parsedBalance);
      
      // Load payee count
      const payeesResponse = await paymanService.getAllPayees();
      setPayeeCount(payeesResponse.parsedPayees?.length || 0);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      setIsConnecting(true);
      
      const { accessToken: paymanToken, expiresIn } = await paymanService.exchangeCodeForToken(code);
      
      setIsConnected(true);
      setIsVerified(true);
      
      // Load wallet data after successful connection
      await loadWalletData();
      
      toast({
        title: "Success",
        description: "Successfully connected to Payman wallet and created payee profile",
      });

      if (onAuthSuccess) {
        onAuthSuccess(paymanToken);
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

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const authUrl = paymanService.getOAuthAuthorizationUrl(redirectUri);
      
      console.log('Opening OAuth URL:', authUrl);
      
      // Open OAuth URL in a popup
      const popup = window.open(
        authUrl,
        'payman-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Monitor popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast({
        title: "Error",
        description: "Failed to initiate Payman connection",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    paymanService.clearAuth();
    setIsConnected(false);
    setIsVerified(false);
    setWalletBalance(null);
    setPayeeCount(0);
    
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
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isConnected && isVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isConnected && isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isConnected && isVerified ? 'Connected & Verified' : 'Not Connected'}
                </p>
                <p className="text-sm text-gray-600">
                  {isConnected && isVerified ? 'Ready for payments and payee management' : 'Connect to access payment features'}
                </p>
              </div>
            </div>
            <Badge variant={isConnected && isVerified ? 'default' : 'secondary'}>
              {isConnected && isVerified ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Wallet Statistics */}
          {isConnected && isVerified && walletBalance && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Wallet Balance</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  TSD {walletBalance.totalBalance?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-blue-700">
                  Spendable: TSD {walletBalance.spendableBalance?.toLocaleString() || '0'}
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Active Payees</span>
                </div>
                <p className="text-lg font-bold text-green-600">{payeeCount}</p>
                <p className="text-xs text-green-700">Ready for payments</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  className="flex-1"
                >
                  Disconnect Wallet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={loadWalletData}
                  className="flex-1"
                >
                  Refresh Data
                </Button>
              </div>
            )}
          </div>

          {/* Success Message */}
          {isConnected && isVerified && (
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Connected successfully!</strong> You can now manage payees and make payments in the Payments tab. Your profile has been automatically added as a payee.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymanOAuth;
