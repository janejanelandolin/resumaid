-- Add missing UPDATE policy for session_logs table
-- This will allow updates to session logs for the same conditions as SELECT
CREATE POLICY "session_logs_update_policy" 
ON public.session_logs 
FOR UPDATE 
USING ((user_id = auth.uid()) OR is_admin() OR (user_id IS NULL));