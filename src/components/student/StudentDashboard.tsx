import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, DollarSign, Clock, CheckCircle, FileText, Plus, Wallet, Users, XCircle } from 'lucide-react';
import ScholarshipApplicationForm from './ScholarshipApplicationForm';
import PaymanOAuth from './PaymanOAuth';
import StudentPayeeSelector from './StudentPayeeSelector';
import { applicationService, type Application } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';

type DashboardView = 'overview' | 'applications' | 'payments';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load applications from Supabase on component mount and when user changes
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'paid': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const totalAwarded = applications
    .filter(app => app.status === 'approved' || app.status === 'paid')
    .reduce((sum, app) => sum + app.amount, 0);

  const totalPaid = applications
    .filter(app => app.status === 'paid')
    .reduce((sum, app) => sum + app.amount, 0);

  const addApplication = async (newApp: Omit<Application, 'id' | 'appliedDate' | 'status' | 'studentName' | 'studentEmail' | 'studentId'>) => {
    // Refresh applications from Supabase after submission
    await loadStudentApplications();
    setShowApplicationForm(false);
  };

  const handleAuthSuccess = (accessToken: string) => {
    setIsWalletConnected(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Awarded</p>
                <p className="text-3xl font-bold text-green-600">${totalAwarded.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-3xl font-bold text-blue-600">${totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payman Wallet Connection */}
      <PaymanOAuth onAuthSuccess={handleAuthSuccess} />

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{app.scholarshipName}</h3>
                        <Badge className={`${getStatusColor(app.status)} flex items-center gap-1`}>
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{app.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                        <span>Amount: ${app.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          My Applications
        </CardTitle>
        <Button onClick={() => setShowApplicationForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications yet. Apply for your first scholarship!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{app.scholarshipName}</h3>
                      <Badge className={`${getStatusColor(app.status)} flex items-center gap-1`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{app.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                      <span>Amount: ${app.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
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

      {/* Navigation */}
      <div className="flex flex-wrap gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={currentView === 'overview' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('overview')}
          className="rounded-md"
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={currentView === 'applications' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('applications')}
          className="rounded-md"
        >
          <FileText className="h-4 w-4 mr-2" />
          Applications
        </Button>
        <Button
          variant={currentView === 'payments' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('payments')}
          className="rounded-md"
        >
          <Users className="h-4 w-4 mr-2" />
          Payments
        </Button>
      </div>

      {/* Content */}
      {currentView === 'overview' && renderOverview()}
      {currentView === 'applications' && renderApplications()}
      {/* {currentView === 'payments' && <StudentPayeeSelector isWalletConnected={isWalletConnected} />} */}
    </div>
  );
};

export default StudentDashboard;
