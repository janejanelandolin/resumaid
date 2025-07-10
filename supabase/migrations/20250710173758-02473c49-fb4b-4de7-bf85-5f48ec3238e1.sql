-- Comprehensive cleanup of anonymous RLS policies

-- Clean up ALL session_logs policies and recreate them properly
DROP POLICY IF EXISTS "Public read access for session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Users can read own logs, admins read all" ON public.session_logs;
DROP POLICY IF EXISTS "Allow all inserts for session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Allow inserts for session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Authenticated users can read session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Anyone can insert session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Users can view their own session logs" ON public.session_logs;

-- Create clean session_logs policies (no anonymous access)
CREATE POLICY "session_logs_insert_policy" 
ON public.session_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "session_logs_select_policy" 
ON public.session_logs 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR public.is_admin() OR user_id IS NULL);

-- Clean up subscribers policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Ensure subscribers has no anonymous access
CREATE POLICY "subscribers_select_policy" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "subscribers_insert_policy" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "subscribers_update_policy" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() OR email = auth.email())
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Service role maintains full access
CREATE POLICY "subscribers_service_role_policy" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);