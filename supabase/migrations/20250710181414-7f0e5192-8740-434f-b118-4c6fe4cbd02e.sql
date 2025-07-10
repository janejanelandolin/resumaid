-- Add admin role to landolin@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'landolin@gmail.com';