-- Create session_logs table for capturing all app sessions
CREATE TABLE public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  job_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  ip_address TEXT,
  unoptimized_score INTEGER DEFAULT 0,
  unoptimized_qualification TEXT,
  optimized_score INTEGER DEFAULT 0,
  optimized_qualification TEXT,
  recommendation INTEGER, -- Feedback score 1-10
  feedback TEXT, -- Feedback comments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for session logs
CREATE POLICY "Anyone can insert session logs" 
ON public.session_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own session logs" 
ON public.session_logs 
FOR SELECT 
USING (user_id = auth.uid());

-- Admin users can view all session logs (we'll implement admin role checking later)
CREATE POLICY "Public read access for session logs" 
ON public.session_logs 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_session_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_session_logs_updated_at
  BEFORE UPDATE ON public.session_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_logs_updated_at();

-- Create index for better performance
CREATE INDEX idx_session_logs_created_at ON public.session_logs(created_at DESC);
CREATE INDEX idx_session_logs_user_id ON public.session_logs(user_id);