-- ClientPulse Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Agencies table
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'client')),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  portal_token TEXT NOT NULL UNIQUE DEFAULT replace(uuid_generate_v4()::text, '-', ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  due_date DATE,
  budget DECIMAL(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages table (for real-time chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT message_author_check CHECK (user_id IS NOT NULL OR client_id IS NOT NULL)
);

-- Files table
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  number TEXT NOT NULL UNIQUE,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_agency ON public.users(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_agency ON public.clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_portal_token ON public.clients(portal_token);
CREATE INDEX IF NOT EXISTS idx_projects_agency ON public.projects(agency_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_messages_project ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_files_project ON public.files(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_agency ON public.invoices(agency_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON public.invoices(client_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper function to get user's agency_id
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- AGENCIES policies
CREATE POLICY "Users can view their own agency"
  ON public.agencies FOR SELECT
  USING (id = get_user_agency_id());

CREATE POLICY "Admins can update their agency"
  ON public.agencies FOR UPDATE
  USING (id = get_user_agency_id() AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- USERS policies
CREATE POLICY "Users can view users in their agency"
  ON public.users FOR SELECT
  USING (agency_id = get_user_agency_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their agency"
  ON public.users FOR ALL
  USING (
    agency_id = get_user_agency_id() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- CLIENTS policies
CREATE POLICY "Users can view clients in their agency"
  ON public.clients FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Users can create clients in their agency"
  ON public.clients FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "Users can update clients in their agency"
  ON public.clients FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Admins can delete clients in their agency"
  ON public.clients FOR DELETE
  USING (
    agency_id = get_user_agency_id() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow client portal access via token (anon users)
CREATE POLICY "Portal access for clients"
  ON public.clients FOR SELECT
  USING (true); -- Token validation happens at application level

-- PROJECTS policies
CREATE POLICY "Users can view projects in their agency"
  ON public.projects FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Users can create projects in their agency"
  ON public.projects FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "Users can update projects in their agency"
  ON public.projects FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Admins can delete projects in their agency"
  ON public.projects FOR DELETE
  USING (
    agency_id = get_user_agency_id() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Projects visible via client portal
CREATE POLICY "Clients can view their projects via portal"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = projects.client_id
    )
  );

-- TASKS policies
CREATE POLICY "Users can view tasks for their agency projects"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can create tasks for their agency projects"
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can update tasks for their agency projects"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can delete tasks for their agency projects"
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

-- MESSAGES policies (for real-time chat)
CREATE POLICY "Users can view messages for their agency projects"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = messages.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can send messages to their agency projects"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = messages.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

-- Allow clients to view and send messages via portal
CREATE POLICY "Clients can view messages via portal"
  ON public.messages FOR SELECT
  USING (true); -- Token validation at app level

CREATE POLICY "Clients can send messages via portal"
  ON public.messages FOR INSERT
  WITH CHECK (true); -- Token validation at app level

-- FILES policies
CREATE POLICY "Users can view files for their agency projects"
  ON public.files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = files.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can upload files to their agency projects"
  ON public.files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = files.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "Users can delete files from their agency projects"
  ON public.files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = files.project_id 
      AND projects.agency_id = get_user_agency_id()
    )
  );

-- INVOICES policies
CREATE POLICY "Users can view invoices for their agency"
  ON public.invoices FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Users can create invoices for their agency"
  ON public.invoices FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "Users can update invoices for their agency"
  ON public.invoices FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "Admins can delete invoices"
  ON public.invoices FOR DELETE
  USING (
    agency_id = get_user_agency_id() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime for messages and tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- ============================================
-- FUNCTION: Create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  agency_id UUID;
  agency_slug TEXT;
BEGIN
  -- Generate a unique agency slug
  agency_slug := lower(replace(split_part(NEW.email, '@', 1), '.', '-')) || '-' || substr(md5(random()::text), 1, 6);
  
  -- Create a new agency for each user (they can be invited to existing ones later)
  INSERT INTO public.agencies (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'agency_name', split_part(NEW.email, '@', 1) || '''s Agency'),
    agency_slug
  )
  RETURNING id INTO agency_id;

  -- Create the user profile
  INSERT INTO public.users (id, email, full_name, role, agency_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'admin', -- First user is admin of their agency
    agency_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Optional - remove in production)
-- ============================================

-- Uncomment below to insert sample data for testing
/*
DO $$
DECLARE
  test_agency_id UUID;
  test_client_id UUID;
  test_project_id UUID;
BEGIN
  -- This will only work if you have a user already created
  -- The trigger above creates an agency automatically

  -- Get the first agency
  SELECT id INTO test_agency_id FROM public.agencies LIMIT 1;
  
  IF test_agency_id IS NOT NULL THEN
    -- Create a sample client
    INSERT INTO public.clients (agency_id, name, email, company)
    VALUES (test_agency_id, 'John Smith', 'john@example.com', 'Acme Corp')
    RETURNING id INTO test_client_id;

    -- Create a sample project
    INSERT INTO public.projects (agency_id, client_id, name, description, status, progress)
    VALUES (test_agency_id, test_client_id, 'Website Redesign', 'Complete redesign of corporate website', 'in_progress', 45)
    RETURNING id INTO test_project_id;

    -- Create sample tasks
    INSERT INTO public.tasks (project_id, title, status) VALUES
      (test_project_id, 'Design mockups', 'done'),
      (test_project_id, 'Frontend development', 'in_progress'),
      (test_project_id, 'Backend integration', 'todo');

    -- Create a sample invoice
    INSERT INTO public.invoices (agency_id, client_id, project_id, number, amount, due_date, status)
    VALUES (test_agency_id, test_client_id, test_project_id, 'INV-2024-0001', 5000.00, CURRENT_DATE + INTERVAL '30 days', 'sent');
  END IF;
END $$;
*/
