
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, FileText, Wallet } from 'lucide-react';

type DashboardView = 'overview' | 'applications' | 'payments';

interface DashboardNavigationProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
      <Button
        variant={currentView === 'overview' ? 'default' : 'ghost'}
        onClick={() => onViewChange('overview')}
        className="rounded-md"
      >
        <GraduationCap className="h-4 w-4 mr-2" />
        Overview
      </Button>
      <Button
        variant={currentView === 'applications' ? 'default' : 'ghost'}
        onClick={() => onViewChange('applications')}
        className="rounded-md"
      >
        <FileText className="h-4 w-4 mr-2" />
        Applications
      </Button>
      <Button
        variant={currentView === 'payments' ? 'default' : 'ghost'}
        onClick={() => onViewChange('payments')}
        className="rounded-md"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Payments
      </Button>
    </div>
  );
};

export default DashboardNavigation;
