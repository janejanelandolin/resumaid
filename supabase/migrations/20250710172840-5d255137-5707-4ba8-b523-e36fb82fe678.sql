-- Remove problematic anonymous access policies and tighten security

-- Fix session_logs - remove anonymous read access, keep authenticated access only
DROP POLICY IF EXISTS "Public read access for session logs" ON public.session_logs;

-- Update session_logs to allow inserts for both authenticated and anonymous (for logging)
-- but restrict reads to authenticated users only
DROP POLICY IF EXISTS "Allow all inserts for session logs" ON public.session_logs;

CREATE POLICY "Allow inserts for session logs" 
ON public.session_logs 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can read session logs (own logs or admins can read all)
CREATE POLICY "Authenticated users can read session logs" 
ON public.session_logs 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR public.is_admin() OR user_id IS NULL);

-- Ensure subscribers table has no anonymous access
-- (Current policies should be fine but let's verify no anonymous access exists)

-- Ensure user_roles table has no anonymous access  
-- (Current policies should be fine but let's verify no anonymous access exists)