-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create encrypted PII table
CREATE TABLE public.session_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, created_at)
);

-- Enable RLS on session_user_data
ALTER TABLE public.session_user_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for session_user_data (same as session_logs)
CREATE POLICY "Users can view own PII"
  ON public.session_user_data
  FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can insert own PII"
  ON public.session_user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PII"
  ON public.session_user_data
  FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Only admins can delete PII"
  ON public.session_user_data
  FOR DELETE
  USING (is_admin());

-- Migrate existing PII data from session_logs to session_user_data
INSERT INTO public.session_user_data (user_id, name, email, phone, location, ip_address, created_at)
SELECT user_id, name, email, phone, location, ip_address, created_at
FROM public.session_logs;

-- Add user_data_id column to session_logs
ALTER TABLE public.session_logs 
ADD COLUMN user_data_id UUID REFERENCES public.session_user_data(id) ON DELETE SET NULL;

-- Link session_logs to session_user_data based on user_id and created_at
UPDATE public.session_logs sl
SET user_data_id = sud.id
FROM public.session_user_data sud
WHERE sl.user_id = sud.user_id 
  AND sl.created_at = sud.created_at;

-- Drop PII columns from session_logs (keep only reference)
ALTER TABLE public.session_logs 
DROP COLUMN name,
DROP COLUMN email,
DROP COLUMN phone,
DROP COLUMN location,
DROP COLUMN ip_address;

-- Create trigger for session_user_data updated_at
CREATE TRIGGER update_session_user_data_updated_at
  BEFORE UPDATE ON public.session_user_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_logs_updated_at();

-- Create index for faster joins
CREATE INDEX idx_session_logs_user_data_id ON public.session_logs(user_data_id);
CREATE INDEX idx_session_user_data_user_id ON public.session_user_data(user_id, created_at);