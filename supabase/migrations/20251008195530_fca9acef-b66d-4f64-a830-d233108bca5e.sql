-- Fix session_logs RLS policies to prevent PII exposure and unauthorized access
-- Step 1: Remove orphaned records with NULL user_id (these expose PII publicly)
DELETE FROM public.session_logs WHERE user_id IS NULL;

-- Step 2: Drop existing permissive policies
DROP POLICY IF EXISTS "session_logs_insert_policy" ON public.session_logs;
DROP POLICY IF EXISTS "session_logs_select_policy" ON public.session_logs;
DROP POLICY IF EXISTS "session_logs_update_policy" ON public.session_logs;

-- Step 3: Create secure INSERT policy - only authenticated users can create sessions
CREATE POLICY "Authenticated users can insert own sessions"
ON public.session_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 4: Create secure SELECT policy - users can only read their own data, admins can read all
CREATE POLICY "Users can view own sessions"
ON public.session_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- Step 5: Create secure UPDATE policy - users can only update their own data, admins can update all
CREATE POLICY "Users can update own sessions"
ON public.session_logs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

-- Step 6: Make user_id NOT NULL to prevent future NULL insertions
ALTER TABLE public.session_logs 
ALTER COLUMN user_id SET NOT NULL;