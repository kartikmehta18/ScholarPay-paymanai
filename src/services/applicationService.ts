
import { supabase } from "@/integrations/supabase/client";

export interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  scholarshipName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  appliedDate: string;
  description: string;
  category: string;
  requirements: string;
}

export const applicationService = {
  // Get all applications (for government users)
  async getAllApplications(): Promise<Application[]> {
    try {
      console.log('Fetching all applications from Supabase...');
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching applications:', error);
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      console.log('Successfully fetched applications:', data?.length || 0);
      return data.map(app => ({
        id: app.id,
        studentName: app.student_name,
        studentEmail: app.student_email,
        studentId: app.student_id,
        scholarshipName: app.scholarship_name,
        amount: app.amount,
        status: app.status as 'pending' | 'approved' | 'rejected' | 'paid',
        appliedDate: app.applied_date,
        description: app.description,
        category: app.category,
        requirements: app.requirements || ''
      }));
    } catch (error) {
      console.error('Error reading applications:', error);
      throw error;
    }
  },

  // Get applications for a specific student
  async getStudentApplications(studentEmail: string): Promise<Application[]> {
    try {
      console.log('Fetching applications for student:', studentEmail);
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_email', studentEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching student applications:', error);
        throw new Error(`Failed to fetch student applications: ${error.message}`);
      }

      console.log('Successfully fetched student applications:', data?.length || 0);
      return data.map(app => ({
        id: app.id,
        studentName: app.student_name,
        studentEmail: app.student_email,
        studentId: app.student_id,
        scholarshipName: app.scholarship_name,
        amount: app.amount,
        status: app.status as 'pending' | 'approved' | 'rejected' | 'paid',
        appliedDate: app.applied_date,
        description: app.description,
        category: app.category,
        requirements: app.requirements || ''
      }));
    } catch (error) {
      console.error('Error reading student applications:', error);
      throw error;
    }
  },

  // Add new application - optimized for speed
  async addApplication(application: Omit<Application, 'id' | 'appliedDate' | 'status'>): Promise<Application | null> {
    try {
      console.log('Adding new application to Supabase:', application);
      
      // Use faster insert without additional session check since auth is handled by RLS
      const { data, error } = await supabase
        .from('applications')
        .insert({
          student_name: application.studentName,
          student_email: application.studentEmail,
          student_id: application.studentId,
          scholarship_name: application.scholarshipName,
          amount: application.amount,
          description: application.description,
          category: application.category,
          requirements: application.requirements
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding application:', error);
        throw new Error(`Failed to submit application: ${error.message}`);
      }

      const newApplication: Application = {
        id: data.id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        studentId: data.student_id,
        scholarshipName: data.scholarship_name,
        amount: data.amount,
        status: data.status as 'pending' | 'approved' | 'rejected' | 'paid',
        appliedDate: data.applied_date,
        description: data.description,
        category: data.category,
        requirements: data.requirements || ''
      };

      console.log('Application added successfully:', newApplication);
      return newApplication;
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId: string, status: 'approved' | 'rejected' | 'paid'): Promise<boolean> {
    try {
      console.log('Updating application status:', applicationId, status);
      
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);
      
      if (error) {
        console.error('Supabase error updating application status:', error);
        throw new Error(`Failed to update application status: ${error.message}`);
      }

      console.log('Application status updated successfully:', applicationId, status);
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get approved applications (for payment history)
  async getApprovedApplications(): Promise<Application[]> {
    try {
      console.log('Fetching approved applications...');
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching approved applications:', error);
        throw new Error(`Failed to fetch approved applications: ${error.message}`);
      }

      console.log('Successfully fetched approved applications:', data?.length || 0);
      return data.map(app => ({
        id: app.id,
        studentName: app.student_name,
        studentEmail: app.student_email,
        studentId: app.student_id,
        scholarshipName: app.scholarship_name,
        amount: app.amount,
        status: app.status as 'pending' | 'approved' | 'rejected' | 'paid',
        appliedDate: app.applied_date,
        description: app.description,
        category: app.category,
        requirements: app.requirements || ''
      }));
    } catch (error) {
      console.error('Error reading approved applications:', error);
      throw error;
    }
  }
};
