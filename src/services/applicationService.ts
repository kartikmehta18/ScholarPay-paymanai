
export interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  scholarshipName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  description: string;
  category: string;
  requirements: string;
}

const APPLICATIONS_KEY = 'scholarship_applications';

export const applicationService = {
  // Get all applications
  getAllApplications(): Application[] {
    try {
      const stored = localStorage.getItem(APPLICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading applications:', error);
      return [];
    }
  },

  // Get applications for a specific student
  getStudentApplications(studentEmail: string): Application[] {
    const allApplications = this.getAllApplications();
    return allApplications.filter(app => app.studentEmail === studentEmail);
  },

  // Add new application
  addApplication(application: Omit<Application, 'id' | 'appliedDate' | 'status'>): Application {
    const newApplication: Application = {
      ...application,
      id: Math.random().toString(36).substr(2, 9),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const applications = this.getAllApplications();
    applications.unshift(newApplication);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    
    console.log('Application added:', newApplication);
    return newApplication;
  },

  // Update application status
  updateApplicationStatus(applicationId: string, status: 'approved' | 'rejected'): boolean {
    try {
      const applications = this.getAllApplications();
      const applicationIndex = applications.findIndex(app => app.id === applicationId);
      
      if (applicationIndex !== -1) {
        applications[applicationIndex].status = status;
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
        console.log('Application status updated:', applicationId, status);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  },

  // Get approved applications (for payment history)
  getApprovedApplications(): Application[] {
    const allApplications = this.getAllApplications();
    return allApplications.filter(app => app.status === 'approved');
  }
};
