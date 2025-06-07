import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, DollarSign, TrendingUp, Eye, LogOut } from 'lucide-react';
import PayeeManagement from './PayeeManagement';
import ApplicationReview from './ApplicationReview';
import PaymentProcessor from './PaymentProcessor';
import WalletOverview from './WalletOverview';
import PaymentHistory from './PaymentHistory';
import { useToast } from '@/hooks/use-toast';
import { applicationService, type Application } from '@/services/applicationService';

type DashboardView = 'overview' | 'payees' | 'applications' | 'payments' | 'history';

const GovernmentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load applications from Supabase on component mount
  useEffect(() => {
    loadAllApplications();
  }, []);

  // Refresh applications when switching to applications view
  useEffect(() => {
    if (currentView === 'applications') {
      loadAllApplications();
    }
  }, [currentView]);

  const loadAllApplications = async () => {
    setLoading(true);
    try {
      const allApplications = await applicationService.getAllApplications();
      setApplications(allApplications);
      console.log('Loaded all applications for government:', allApplications);
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

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const totalAwarded = applications
    .filter(app => app.status === 'approved')
    .reduce((sum, app) => sum + app.amount, 0);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{pendingApplications}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedApplications}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Awarded</p>
                <p className="text-3xl font-bold text-blue-600">${totalAwarded.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Overview */}
      <WalletOverview />

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
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
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{app.studentName}</h4>
                      <p className="text-gray-600">{app.scholarshipName}</p>
                      <p className="text-sm text-gray-500">${app.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Government Portal
          </h1>
          <p className="text-gray-600">Welcome, {user?.name} - {user?.department}</p>
        </div>
        <Button
          variant="outline"
          onClick={logout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={currentView === 'overview' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('overview')}
          className="rounded-md"
        >
          Overview
        </Button>
        <Button
          variant={currentView === 'applications' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('applications')}
          className="rounded-md"
        >
          Applications
        </Button>
        <Button
          variant={currentView === 'payees' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('payees')}
          className="rounded-md"
        >
          Payees
        </Button>
        <Button
          variant={currentView === 'payments' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('payments')}
          className="rounded-md"
        >
          Payments
        </Button>
        <Button
          variant={currentView === 'history' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('history')}
          className="rounded-md"
        >
          History
        </Button>
      </div>

      {/* Content */}
      {currentView === 'overview' && renderOverview()}
      {currentView === 'applications' && <ApplicationReview applications={applications} onApplicationUpdate={loadAllApplications} />}
      {currentView === 'payees' && <PayeeManagement />}
      {currentView === 'payments' && <PaymentProcessor />}
      {currentView === 'history' && <PaymentHistory />}
    </div>
  );
};

export default GovernmentDashboard;
