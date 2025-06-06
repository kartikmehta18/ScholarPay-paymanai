import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Shield } from 'lucide-react';
import { paymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymanLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const PaymanLoginButton: React.FC<PaymanLoginButtonProps> = ({ 
  onSuccess, 
  className = '',
  variant = 'default',
  size = 'default'
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [buttonContainerId] = useState(`payman-connect-${Math.random().toString(36).substr(2, 9)}`);
  const { toast } = useToast();
  const { login } = useAuth();

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
      // Exchange code for token using our service
      await paymanService.exchangeCodeForToken(code);

      // Fetch payees from Payman (assuming the user selects one during auth)
      const payeesResponse = await paymanService.getAllPayees();
      const parsePayeesFromResponse = (response: any) => {
        if (response.artifacts && response.artifacts.length > 0) {
          const artifact = response.artifacts[0];
          let content = artifact.content || artifact.text || '';
          const lines = content.split('\n');
          const payees = lines.map((line: string, index: number) => {
            const match = line.match(/^(?:\d+\.)?\s*(.+?)\s*\((.+?)\)/);
            if (match) {
              return { name: match[1], email: match[2] };
            }
            return null;
          }).filter(Boolean);
          return payees;
        }
        return [];
      };
      const payees = parsePayeesFromResponse(payeesResponse);
      let selectedPayee = payees[0]; // Default to first payee
      // Optionally, prompt user to select payee if multiple exist (UI needed)
      if (!selectedPayee) {
        toast({
          title: "No Payee Found",
          description: "No payee was found for your account.",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }
      // Use selected payee's email and name for login
      const success = await login(selectedPayee.email, 'payman123', 'student');
      if (success) {
        toast({
          title: "Success",
          description: `Successfully logged in as ${selectedPayee.name} with Payman wallet!`,
        });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
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
    
    // Create container for Payman Connect button
    const existingContainer = document.getElementById(buttonContainerId);
    if (existingContainer) {
      existingContainer.remove();
    }

    const connectDiv = document.createElement('div');
    connectDiv.id = buttonContainerId;
    connectDiv.style.display = 'none'; // Hide the actual Payman button
    document.body.appendChild(connectDiv);

    // Create and load the Payman script
    const script = document.createElement('script');
    script.src = 'https://app.paymanai.com/js/pm.js';
    script.setAttribute('data-client-id', 'pm-test-OWyu8jmZ3rFI5RLBN8WyJOXl');
    script.setAttribute('data-scopes', 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet');
    script.setAttribute('data-redirect-uri', `http://localhost:8080/`);
    script.setAttribute('data-target', `#${buttonContainerId}`);
    script.setAttribute('data-dark-mode', 'false');
    script.setAttribute('data-styles', JSON.stringify({
      borderRadius: "8px",
      fontSize: "14px"
    }));

    script.onload = () => {
      // Auto-click the Payman Connect button after it's loaded
      setTimeout(() => {
        const paymanButton = document.querySelector(`#${buttonContainerId} button`);
        if (paymanButton) {
          (paymanButton as HTMLButtonElement).click();
        } else {
          setIsConnecting(false);
          toast({
            title: "Error",
            description: "Failed to load Payman Connect button",
            variant: "destructive"
          });
        }
      }, 500);
    };

    script.onerror = () => {
      setIsConnecting(false);
      toast({
        title: "Error",
        description: "Failed to load Payman script",
        variant: "destructive"
      });
    };

    document.head.appendChild(script);
  };

  return (
    <Button
      onClick={handlePaymanLogin}
      disabled={isConnecting}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Login with Payman
          <Shield className="h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default PaymanLoginButton;
