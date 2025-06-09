
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthProps {
  defaultRole?: 'student' | 'government';
  onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ defaultRole = 'student', onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        )}
        {isLogin ? (
          <LoginForm />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => setIsLogin(true)}
            defaultRole={defaultRole}
          />
        )}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
