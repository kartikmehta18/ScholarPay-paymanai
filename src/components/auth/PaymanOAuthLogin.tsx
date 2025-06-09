
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, Shield, Loader2 } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface PaymanOAuthLoginProps {
  onAuthSuccess?: (userInfo: any) => void;
  onSwitchToSupabase?: () => void;
}

const PaymanOAuthLogin: React.FC<PaymanOAuthLoginProps> = ({ 
  onAuthSuccess, 
  onSwitchToSupabase 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for OAuth callback messages
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "payman-oauth-redirect") {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        
        if (error) {
          toast({
            title: "Authentication Failed",
            description: error,
            variant: "destructive"
          });
          setIsConnecting(false);
          return;
        }

        if (code) {
          await exchangeCodeForToken(code);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      setIsConnecting(true);
      
      const { accessToken, expiresIn } = await paymanService.exchangeCodeForToken(code);
      
      // Get user profile from Payman
      const userProfile = await paymanService.getUserProfile();
      
      toast({
        title: "Success",
        description: "Successfully authenticated with Payman!",
      });

      if (onAuthSuccess) {
        onAuthSuccess({
          accessToken,
          expiresIn,
          profile: userProfile
        });
      }
    } catch (error) {
      console.error('Payman authentication failed:', error);
      toast({
        title: "Error",
        description: "Failed to complete Payman authentication",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePaymanLogin = () => {
    setIsConnecting(true);
    
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const authUrl = paymanService.getOAuthAuthorizationUrl(redirectUri);
      
      console.log('Opening Payman OAuth URL:', authUrl);
      
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
      console.error('Error initiating Payman OAuth:', error);
      toast({
        title: "Error",
        description: "Failed to initiate Payman authentication",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 bg-blue-600 p-3 rounded-full w-fit">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Connect with Payman</CardTitle>
        <p className="text-gray-600">Secure OAuth authentication</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Secure Access</h4>
              <p className="text-sm text-blue-700 mt-1">
                Payman OAuth provides secure access to your wallet and payment features with granular permissions.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handlePaymanLogin}
          disabled={isConnecting}
          className="w-full flex items-center gap-2"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting to Payman...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Login with Payman OAuth
              <Shield className="h-4 w-4" />
            </>
          )}
        </Button>

        {onSwitchToSupabase && (
          <div className="text-center text-sm">
            <span className="text-gray-600">Prefer traditional login? </span>
            <button
              type="button"
              onClick={onSwitchToSupabase}
              className="text-blue-600 hover:underline font-medium"
              disabled={isConnecting}
            >
              Use Supabase Login
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>By connecting, you agree to grant access to:</p>
          <ul className="mt-1 space-y-0.5">
            <li>• View wallet balances and transactions</li>
            <li>• Manage payees</li>
            <li>• Send payments (with your approval)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymanOAuthLogin;
