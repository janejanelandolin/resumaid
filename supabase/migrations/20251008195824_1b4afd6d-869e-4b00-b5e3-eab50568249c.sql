-- Complete the security fix by cleaning up NULL user_id records and enforcing NOT NULL constraint

-- Step 1: Remove orphaned records with NULL user_id (these expose PII publicly)
DELETE FROM public.session_logs WHERE user_id IS NULL;

-- Step 2: Make user_id NOT NULL to prevent future NULL insertions
-- This ensures all session logs are tied to an authenticated user
ALTER TABLE public.session_logs 
ALTER COLUMN user_id SET NOT NULL;