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
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'admin' | 'member' | 'client'
          agency_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'admin' | 'member' | 'client'
          agency_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'admin' | 'member' | 'client'
          agency_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          agency_id: string
          name: string
          email: string
          company: string | null
          phone: string | null
          portal_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          email: string
          company?: string | null
          phone?: string | null
          portal_token?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          email?: string
          company?: string | null
          phone?: string | null
          portal_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          agency_id: string
          client_id: string
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          progress: number
          start_date: string | null
          due_date: string | null
          budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          client_id: string
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          progress?: number
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          progress?: number
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          assignee_id: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          project_id: string
          user_id: string | null
          client_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id?: string | null
          client_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string | null
          client_id?: string | null
          content?: string
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          name: string
          url: string
          size: number
          mime_type: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          url: string
          size: number
          mime_type: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          url?: string
          size?: number
          mime_type?: string
          uploaded_by?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          agency_id: string
          client_id: string
          project_id: string | null
          number: string
          amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          due_date: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          client_id: string
          project_id?: string | null
          number: string
          amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          due_date: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          client_id?: string
          project_id?: string | null
          number?: string
          amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          due_date?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
