export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          amount: number
          applied_date: string
          category: string
          created_at: string
          description: string
          id: string
          requirements: string | null
          scholarship_name: string
          status: string
          student_email: string
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          amount: number
          applied_date?: string
          category: string
          created_at?: string
          description: string
          id?: string
          requirements?: string | null
          scholarship_name: string
          status?: string
          student_email: string
          student_id: string
          student_name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          applied_date?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          requirements?: string | null
          scholarship_name?: string
          status?: string
          student_email?: string
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bounties: {
        Row: {
          agent_id: string | null
          amount: number
          created_at: string
          currency: string
          deadline: string
          description: string
          id: string
          requirements: string[] | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          deadline: string
          description: string
          id?: string
          requirements?: string[] | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          deadline?: string
          description?: string
          id?: string
          requirements?: string[] | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bounties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          agent_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          payment_schedule: string
          role: string
          salary: number
          status: string
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          payment_schedule: string
          role: string
          salary: number
          status?: string
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          payment_schedule?: string
          role?: string
          salary?: number
          status?: string
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          agent_id: string | null
          amount: number
          created_at: string
          currency: string
          description: string | null
          due_date: string
          id: string
          status: string
          title: string
          updated_at: string
          vendor: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          due_date: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          vendor: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          role: string
          student_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id?: string
          name: string
          role: string
          student_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          student_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profit_sharing: {
        Row: {
          agent_id: string | null
          contributor_name: string
          created_at: string
          currency: string
          id: string
          percentage: number
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          contributor_name: string
          created_at?: string
          currency?: string
          id?: string
          percentage: number
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          contributor_name?: string
          created_at?: string
          currency?: string
          id?: string
          percentage?: number
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profit_sharing_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          agent_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          reason: string
          requester: string
          status: string
          task_id: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          reason: string
          requester: string
          status?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          reason?: string
          requester?: string
          status?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agent_id: string | null
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          payman_response: Json | null
          recipient: string
          status: string
          type: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payman_response?: Json | null
          recipient: string
          status: string
          type: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payman_response?: Json | null
          recipient?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
