
import React, { useEffect } from 'react';

const PaymanCallback: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    // Send the OAuth redirect message to the parent window
    if (window.opener) {
      // This message will be caught by the PaymanLoginButton component
      window.opener.postMessage({
        type: 'payman-oauth-redirect',
        redirectUri: window.location.href
      }, window.location.origin);
      
      window.close();
    } else {
      // If there's no opener (direct navigation), redirect to main page
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Payman authentication...</p>
        <p className="text-sm text-gray-500 mt-2">You can close this window if it doesn't close automatically.</p>
      </div>
    </div>
  );
};

export default PaymanCallback;
