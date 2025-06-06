
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Header from '@/components/Header';
import StudentDashboard from '@/components/student/StudentDashboard';
import GovernmentDashboard from '@/components/government/GovernmentDashboard';
import LandingPage from '@/components/LandingPage';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'government'>('student');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleGetStarted = (role: 'student' | 'government') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!user && showAuth) {
    return (
      <Auth 
        defaultRole={authRole} 
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {user.role === 'student' ? <StudentDashboard /> : <GovernmentDashboard />}
      </main>
    </div>
  );
};

export default Index;
