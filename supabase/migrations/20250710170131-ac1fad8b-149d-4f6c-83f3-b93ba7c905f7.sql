-- Fix RLS policies for all tables

-- Fix session_logs policies - allow both authenticated and anonymous access for logging
DROP POLICY IF EXISTS "Authenticated users can insert session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Authenticated users can read session logs" ON public.session_logs;
DROP POLICY IF EXISTS "Users can view their own session logs" ON public.session_logs;

CREATE POLICY "Allow all inserts for session logs" 
ON public.session_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can read own logs, admins read all" 
ON public.session_logs 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Public read access for session logs" 
ON public.session_logs 
FOR SELECT 
TO anon
USING (true);

-- Fix subscribers policies - ensure proper access
DROP POLICY IF EXISTS "Authenticated users can insert subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view own subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can insert own subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() OR email = auth.email())
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Fix user_roles policies to ensure proper admin access
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

CREATE POLICY "Service role can manage user roles" 
ON public.user_roles 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());