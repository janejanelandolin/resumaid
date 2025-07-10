-- Add admin role to janejanelandolin@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'janejanelandolin@gmail.com';