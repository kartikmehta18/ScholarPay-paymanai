
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, DollarSign, Wallet } from 'lucide-react';
import { Application } from '@/services/applicationService';
import { paymanService } from '@/services/paymanService';

interface DashboardStatsProps {
  applications: Application[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ applications }) => {
  const totalAwarded = applications
    .filter(app => app.status === 'approved' || app.status === 'paid')
    .reduce((sum, app) => sum + app.amount, 0);

  const totalPaid = applications
    .filter(app => app.status === 'paid')
    .reduce((sum, app) => sum + app.amount, 0);

  const isPaymanConnected = paymanService.isAuthenticated() && paymanService.isTokenVerified();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payman Wallet</p>
              <p className={`text-lg font-bold ${isPaymanConnected ? 'text-green-600' : 'text-gray-400'}`}>
                {isPaymanConnected ? 'Connected' : 'Not Connected'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${isPaymanConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Wallet className={`h-6 w-6 ${isPaymanConnected ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
