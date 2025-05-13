
-- Store this in your project. You'll need to run these SQL statements in your Supabase project
-- to create the stored procedures needed by the dashboard components

-- Function to get tickets grouped by category
CREATE OR REPLACE FUNCTION get_tickets_by_category()
RETURNS TABLE (
  category TEXT,
  count BIGINT
) LANGUAGE SQL AS $$
  SELECT category, COUNT(*) 
  FROM tickets 
  GROUP BY category;
$$;

-- Function to get tickets grouped by status
CREATE OR REPLACE FUNCTION get_tickets_by_status()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) LANGUAGE SQL AS $$
  SELECT status, COUNT(*) 
  FROM tickets 
  GROUP BY status;
$$;

-- Function to get users grouped by role
CREATE OR REPLACE FUNCTION get_users_by_role()
RETURNS TABLE (
  role TEXT,
  count BIGINT
) LANGUAGE SQL AS $$
  SELECT role, COUNT(*) 
  FROM profiles 
  GROUP BY role;
$$;

-- Create table for service status if it doesn't exist
CREATE TABLE IF NOT EXISTS service_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wifi_campus TEXT NOT NULL DEFAULT 'operational',
  biblioteca_virtual TEXT NOT NULL DEFAULT 'operational',
  plataforma_lms TEXT NOT NULL DEFAULT 'operational',
  portal_estudiantes TEXT NOT NULL DEFAULT 'operational',
  correo_institucional TEXT NOT NULL DEFAULT 'operational',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial service status if table is empty
INSERT INTO service_status 
  (wifi_campus, biblioteca_virtual, plataforma_lms, portal_estudiantes, correo_institucional)
SELECT 
  'operational', 'operational', 'degraded', 'operational', 'operational'
WHERE NOT EXISTS (SELECT 1 FROM service_status);

-- Create a function to get the latest service status
CREATE OR REPLACE FUNCTION get_service_status()
RETURNS JSON LANGUAGE SQL AS $$
  SELECT row_to_json(s)
  FROM (
    SELECT 
      wifi_campus, 
      biblioteca_virtual, 
      plataforma_lms, 
      portal_estudiantes, 
      correo_institucional
    FROM service_status
    ORDER BY updated_at DESC 
    LIMIT 1
  ) s;
$$;
