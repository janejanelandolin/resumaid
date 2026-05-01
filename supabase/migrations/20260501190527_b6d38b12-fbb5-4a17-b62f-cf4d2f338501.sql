-- Job applications tracker
CREATE TABLE public.job_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'applied'
                  CHECK (status IN ('applied','phone_screen','interview','offer','rejected','withdrawn')),
  applied_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  job_url       TEXT,
  notes         TEXT,
  salary_range  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own applications"
  ON public.job_applications FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indices
CREATE INDEX idx_job_applications_user_date
  ON public.job_applications (user_id, applied_date DESC);

-- Daily goals config (one row per user)
CREATE TABLE public.journey_settings (
  user_id             UUID PRIMARY KEY,
  daily_apply_target  INT NOT NULL DEFAULT 3,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON public.journey_settings FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_journey_settings_updated_at
  BEFORE UPDATE ON public.journey_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();