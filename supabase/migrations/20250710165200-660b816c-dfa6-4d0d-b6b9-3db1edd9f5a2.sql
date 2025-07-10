-- Remove policies that allow anonymous access on subscribers table
DROP POLICY "insert_subscription" ON public.subscribers;
DROP POLICY "update_own_subscription" ON public.subscribers;

-- Add secure policies requiring authentication
CREATE POLICY "Authenticated users can insert subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING ((user_id = auth.uid()) OR (email = auth.email()))
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));