-- Remove overly permissive policies
DROP POLICY "Anyone can insert session logs" ON public.session_logs;
DROP POLICY "Public read access for session logs" ON public.session_logs;

-- Add secure policies for authenticated users only
CREATE POLICY "Authenticated users can insert session logs" 
ON public.session_logs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow users to read their own logs, admins to read all
CREATE POLICY "Users can read own logs, admins read all" 
ON public.session_logs 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));