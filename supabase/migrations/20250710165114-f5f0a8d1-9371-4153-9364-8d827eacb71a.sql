-- Remove overly permissive policies
DROP POLICY "Anyone can insert session logs" ON public.session_logs;
DROP POLICY "Public read access for session logs" ON public.session_logs;

-- Add secure policies for authenticated users only
CREATE POLICY "Authenticated users can insert session logs" 
ON public.session_logs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can read session logs
CREATE POLICY "Authenticated users can read session logs" 
ON public.session_logs 
FOR SELECT 
TO authenticated
USING (true);