import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Eye, CheckCircle, XCircle, DollarSign, Calendar, User, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { applicationService, type Application } from '@/services/applicationService';
import { paymanService } from '@/services/paymanService';

interface ApplicationReviewProps {
  applications: Application[];
  onApplicationUpdate?: () => void;
}

const ApplicationReview: React.FC<ApplicationReviewProps> = ({ 
  applications: propApplications,
  onApplicationUpdate 
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [appList, setAppList] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingApproval, setProcessingApproval] = useState(false);
  const { toast } = useToast();

  // Load applications from Supabase
  useEffect(() => {
    loadApplications();
  }, [propApplications]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const allApplications = await applicationService.getAllApplications();
      setAppList(allApplications);
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

  const handleReview = async (applicationId: string, decision: 'approved' | 'rejected') => {
    try {
      // If approving, first create payee in PaymanAI
      if (decision === 'approved' && selectedApplication) {
        setProcessingApproval(true);
        
        try {
          console.log('Creating payee for approved application:', selectedApplication);
          
          // Create payee using student's name and email
          await paymanService.addPayee(
            selectedApplication.studentEmail, 
            selectedApplication.studentName
          );
          
          toast({
            title: "Payee Created",
            description: `Payee created for ${selectedApplication.studentName}`,
            variant: "default"
          });
        } catch (payeeError) {
          console.error('Error creating payee:', payeeError);
          toast({
            title: "Warning",
            description: "Application approved but payee creation failed. You may need to create the payee manually.",
            variant: "destructive"
          });
        }
      }
      
      const success = await applicationService.updateApplicationStatus(applicationId, decision);
      
      if (success) {
        // Refresh the list from Supabase
        await loadApplications();

        toast({
          title: decision === 'approved' ? "Application Approved" : "Application Rejected",
          description: `The application has been ${decision}`,
          variant: decision === 'approved' ? 'default' : 'destructive'
        });

        // Notify parent component to refresh
        if (onApplicationUpdate) {
          onApplicationUpdate();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setProcessingApproval(false);
      setSelectedApplication(null);
      setReviewComment('');
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
      case 'pending': return <FileText className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'paid': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const pendingApplications = appList.filter(app => app.status === 'pending');
  const reviewedApplications = appList.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg font-medium text-gray-700">Loading Applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Applications ({pendingApplications.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadApplications}
            disabled={loading}
            className="flex items-center gap-2 "
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? 'Refreshing...' : 'Refresh Applications'}
          </Button>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending applications to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{app.studentName}</h3>
                          <p className="text-sm text-gray-600">{app.studentEmail}</p>
                        </div>
                      </div>
                      
                      <div className="ml-10 space-y-2">
                        <h4 className="font-medium text-blue-600">{app.scholarshipName}</h4>
                        <p className="text-gray-700">{app.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${app.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white">
                          <DialogHeader>
                            <DialogTitle>Review Application</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Student Name</p>
                                  <p className="font-semibold">{selectedApplication.studentName}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Email</p>
                                  <p className="font-semibold">{selectedApplication.studentEmail}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Scholarship</p>
                                  <p className="font-semibold">{selectedApplication.scholarshipName}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Amount</p>
                                  <p className="font-semibold text-green-600">${selectedApplication.amount.toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                                <p className="text-gray-800 bg-white p-3 rounded border">{selectedApplication.description}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-gray-600 mb-2 block">Review Comments</label>
                                <Textarea
                                  placeholder="Add your review comments..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => handleReview(selectedApplication.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                  disabled={processingApproval}
                                >
                                  {processingApproval ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                  {processingApproval ? 'Creating Payee...' : 'Approve'}
                                </Button>
                                <Button
                                  onClick={() => handleReview(selectedApplication.id, 'rejected')}
                                  variant="destructive"
                                  className="flex items-center gap-2"
                                  disabled={processingApproval}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Applications */}
      {reviewedApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Reviewed Applications ({reviewedApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewedApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{app.studentName}</h3>
                        <p className="text-sm text-gray-600">{app.scholarshipName}</p>
                        <p className="text-sm text-gray-500">${app.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationReview;
