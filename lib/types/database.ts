export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      funds: {
        Row: {
          id: string
          name: string
          description: string | null
          country_target: string | null
          total_capital_target: number | null
          total_capital_raised: number | null
          real_estate_percentage: number
          rd_percentage: number
          status: 'active' | 'closed' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          country_target?: string | null
          total_capital_target?: number | null
          total_capital_raised?: number | null
          real_estate_percentage?: number
          rd_percentage?: number
          status?: 'active' | 'closed' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          country_target?: string | null
          total_capital_target?: number | null
          total_capital_raised?: number | null
          real_estate_percentage?: number
          rd_percentage?: number
          status?: 'active' | 'closed' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      investors: {
        Row: {
          id: string
          fund_id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          nationality: string | null
          passport_number: string | null
          date_of_birth: string | null
          investment_amount: number
          real_estate_amount: number | null
          rd_amount: number | null
          status: 'onboarding' | 'active' | 'completed' | 'suspended'
          kyc_status: 'pending' | 'in_review' | 'approved' | 'rejected'
          golden_visa_status: 'not_started' | 'in_progress' | 'approved' | 'completed'
          onboarding_date: string | null
          visa_start_date: string | null
          visa_expected_completion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fund_id: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          nationality?: string | null
          passport_number?: string | null
          date_of_birth?: string | null
          investment_amount: number
          real_estate_amount?: number | null
          rd_amount?: number | null
          status?: 'onboarding' | 'active' | 'completed' | 'suspended'
          kyc_status?: 'pending' | 'in_review' | 'approved' | 'rejected'
          golden_visa_status?: 'not_started' | 'in_progress' | 'approved' | 'completed'
          onboarding_date?: string | null
          visa_start_date?: string | null
          visa_expected_completion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fund_id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          nationality?: string | null
          passport_number?: string | null
          date_of_birth?: string | null
          investment_amount?: number
          real_estate_amount?: number | null
          rd_amount?: number | null
          status?: 'onboarding' | 'active' | 'completed' | 'suspended'
          kyc_status?: 'pending' | 'in_review' | 'approved' | 'rejected'
          golden_visa_status?: 'not_started' | 'in_progress' | 'approved' | 'completed'
          onboarding_date?: string | null
          visa_start_date?: string | null
          visa_expected_completion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          fund_id: string
          name: string
          address: string
          city: string | null
          country: string | null
          postal_code: string | null
          total_size_sqm: number | null
          total_units: number | null
          acquisition_date: string | null
          acquisition_price: number | null
          current_value: number | null
          status: string
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fund_id: string
          name: string
          address: string
          city?: string | null
          country?: string | null
          postal_code?: string | null
          total_size_sqm?: number | null
          total_units?: number | null
          acquisition_date?: string | null
          acquisition_price?: number | null
          current_value?: number | null
          status?: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fund_id?: string
          name?: string
          address?: string
          city?: string | null
          country?: string | null
          postal_code?: string | null
          total_size_sqm?: number | null
          total_units?: number | null
          acquisition_date?: string | null
          acquisition_price?: number | null
          current_value?: number | null
          status?: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      property_units: {
        Row: {
          id: string
          property_id: string
          assigned_investor_id: string | null
          unit_number: string
          floor: number | null
          size_sqm: number | null
          bedrooms: number | null
          bathrooms: number | null
          rental_status: string
          monthly_rent: number | null
          current_tenant_name: string | null
          current_tenant_email: string | null
          lease_start_date: string | null
          lease_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          assigned_investor_id?: string | null
          unit_number: string
          floor?: number | null
          size_sqm?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          rental_status?: string
          monthly_rent?: number | null
          current_tenant_name?: string | null
          current_tenant_email?: string | null
          lease_start_date?: string | null
          lease_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          assigned_investor_id?: string | null
          unit_number?: string
          floor?: number | null
          size_sqm?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          rental_status?: string
          monthly_rent?: number | null
          current_tenant_name?: string | null
          current_tenant_email?: string | null
          lease_start_date?: string | null
          lease_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      golden_visa_milestones: {
        Row: {
          id: string
          investor_id: string
          milestone_type: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          due_date: string | null
          completed_date: string | null
          order_number: number
          documents_required: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          milestone_type: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          due_date?: string | null
          completed_date?: string | null
          order_number: number
          documents_required?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          milestone_type?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          due_date?: string | null
          completed_date?: string | null
          order_number?: number
          documents_required?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          investor_id: string
          type: string
          category: string | null
          name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          upload_date: string
          verified: boolean
          verified_by: string | null
          verified_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          type: string
          category?: string | null
          name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          upload_date?: string
          verified?: boolean
          verified_by?: string | null
          verified_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          type?: string
          category?: string | null
          name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          upload_date?: string
          verified?: boolean
          verified_by?: string | null
          verified_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          investor_id: string
          period: string | null
          type: string | null
          title: string | null
          data_json: Json | null
          pdf_url: string | null
          generated_date: string
          generated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          period?: string | null
          type?: string | null
          title?: string | null
          data_json?: Json | null
          pdf_url?: string | null
          generated_date?: string
          generated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          period?: string | null
          type?: string | null
          title?: string | null
          data_json?: Json | null
          pdf_url?: string | null
          generated_date?: string
          generated_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          investor_id: string
          from_admin: boolean
          from_user_id: string | null
          subject: string | null
          content: string
          read: boolean
          read_date: string | null
          parent_message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          from_admin?: boolean
          from_user_id?: string | null
          subject?: string | null
          content: string
          read?: boolean
          read_date?: string | null
          parent_message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          from_admin?: boolean
          from_user_id?: string | null
          subject?: string | null
          content?: string
          read?: boolean
          read_date?: string | null
          parent_message_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
