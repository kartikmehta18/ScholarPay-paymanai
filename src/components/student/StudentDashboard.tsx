
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { applicationService, type Application } from '@/services/applicationService';
import ScholarshipApplicationForm from './ScholarshipApplicationForm';
import PaymanOAuth from './PaymanOAuth';
import StudentPayeeSelector from './StudentPayeeSelector';
import DashboardStats from './DashboardStats';
import DashboardNavigation from './DashboardNavigation';
import RecentApplicationsList from './RecentApplicationsList';
import ApplicationsList from './ApplicationsList';

type DashboardView = 'overview' | 'applications' | 'payments';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load applications with optimized loading state
  useEffect(() => {
    if (user?.email) {
      loadStudentApplications();
    }
  }, [user?.email]);

  const loadStudentApplications = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const userApplications = await applicationService.getStudentApplications(user.email);
      setApplications(userApplications);
      console.log('Loaded student applications:', userApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (newApp: Omit<Application, 'id' | 'appliedDate' | 'status' | 'studentName' | 'studentEmail' | 'studentId'>) => {
    await loadStudentApplications();
    setShowApplicationForm(false);
  };

  const handleAuthSuccess = (accessToken: string) => {
    setIsWalletConnected(true);
    console.log('Payman wallet connected successfully');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <DashboardStats applications={applications} />
      <PaymanOAuth onAuthSuccess={handleAuthSuccess} />
      <RecentApplicationsList applications={applications} loading={loading} />
    </div>
  );

  const renderApplications = () => (
    <ApplicationsList 
      applications={applications} 
      loading={loading} 
      onNewApplication={() => setShowApplicationForm(true)}
    />
  );

  const renderPayments = () => (
    <StudentPayeeSelector isWalletConnected={isWalletConnected} />
  );

  if (showApplicationForm) {
    return (
      <ScholarshipApplicationForm
        onSubmit={addApplication}
        onCancel={() => setShowApplicationForm(false)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600">Student ID: {user?.studentId}</p>
      </div>

      <DashboardNavigation currentView={currentView} onViewChange={setCurrentView} />

      {/* Content */}
      {currentView === 'overview' && renderOverview()}
      {currentView === 'applications' && renderApplications()}
      {currentView === 'payments' && renderPayments()}
    </div>
  );
};

export default StudentDashboard;
