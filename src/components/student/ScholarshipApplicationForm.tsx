
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { paymanService } from '@/services/paymanService';
import { applicationService } from '@/services/applicationService';

interface ScholarshipApplicationFormProps {
  onSubmit: (application: {
    scholarshipName: string;
    amount: number;
    description: string;
    category: string;
    requirements: string;
  }) => void;
  onCancel: () => void;
}

const ScholarshipApplicationForm: React.FC<ScholarshipApplicationFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    scholarshipName: '',
    amount: '',
    description: '',
    category: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const scholarshipTypes = [
    { value: 'academic', label: 'Academic Excellence' },
    { value: 'need-based', label: 'Need-Based' },
    { value: 'research', label: 'Research Grant' },
    { value: 'innovation', label: 'Innovation Award' },
    { value: 'community', label: 'Community Service' },
    { value: 'sports', label: 'Sports Scholarship' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.scholarshipName || !formData.amount || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (!user?.email || !user?.name) {
      toast({
        title: "Error",
        description: "User information is missing. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create payee in Payman when student applies
      console.log('Creating payee for student:', user.email, user.name);
      await paymanService.addPayee(user.email, user.name);
      
      // Store application in localStorage
      const newApplication = applicationService.addApplication({
        studentName: user.name,
        studentEmail: user.email,
        studentId: user.studentId || 'N/A',
        scholarshipName: formData.scholarshipName,
        amount,
        description: formData.description,
        category: formData.category,
        requirements: formData.requirements
      });

      toast({
        title: "Application Submitted",
        description: "Your scholarship application has been submitted successfully",
      });

      // Call the parent onSubmit handler
      onSubmit({
        scholarshipName: formData.scholarshipName,
        amount,
        description: formData.description,
        category: formData.category,
        requirements: formData.requirements
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Send className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">New Scholarship Application</CardTitle>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Fill out this form to apply for a scholarship. Upon submission, you'll be automatically added to our payment system.
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="scholarshipName" className="text-sm font-medium text-gray-700">
                  Scholarship Name *
                </Label>
                <Input
                  id="scholarshipName"
                  placeholder="e.g., Academic Excellence Scholarship"
                  value={formData.scholarshipName}
                  onChange={(e) => handleInputChange('scholarshipName', e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Requested Amount ($) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select scholarship category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {scholarshipTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this scholarship and how it will help your education"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                disabled={isSubmitting}
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">
                Additional Requirements/Qualifications
              </Label>
              <Textarea
                id="requirements"
                placeholder="List any specific qualifications, achievements, or requirements for this scholarship"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                disabled={isSubmitting}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Automatic Payee Registration</h3>
              </div>
              <p className="text-sm text-blue-800">
                When you submit this application, you'll be automatically registered in our secure payment system. 
                This ensures you can receive scholarship payments instantly once approved by the government.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting & Creating Payee...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScholarshipApplicationForm;
