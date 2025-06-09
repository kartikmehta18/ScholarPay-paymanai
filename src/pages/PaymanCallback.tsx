
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymanCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    
    console.log('OAuth callback received:', { code, error, state });

    // Send the OAuth redirect message to the parent window
    if (window.opener) {
      try {
        // This message will be caught by the PaymanOAuthLogin component
        window.opener.postMessage({
          type: 'payman-oauth-redirect',
          redirectUri: window.location.href,
          code,
          error,
          state
        }, window.location.origin);
        
        console.log('OAuth callback message sent to parent window');
        
        // Close the popup after a short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } catch (err) {
        console.error('Error sending message to parent window:', err);
        // Fallback: redirect to main page
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } else {
      // If there's no opener (direct navigation), redirect to main page with params
      console.log('No parent window found, redirecting to main page');
      
      if (code) {
        // Store the code temporarily and redirect
        sessionStorage.setItem('payman_oauth_code', code);
      }
      
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Payman Authentication
        </h2>
        <p className="text-gray-600 mb-4">
          Please wait while we complete your authentication...
        </p>
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="text-sm text-blue-700">
            This window will close automatically once authentication is complete.
          </p>
        </div>
        <button
          onClick={() => window.close()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Close this window manually
        </button>
      </div>
    </div>
  );
};

export default PaymanCallback;
