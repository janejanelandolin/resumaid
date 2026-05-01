import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type AppStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: AppStatus;
  applied_date: string;
  job_url?: string;
  notes?: string;
  salary_range?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneySettings {
  daily_apply_target: number;
}

// Days in a row with ≥1 application
function computeStreak(apps: JobApplication[]): number {
  if (!apps.length) return 0;
  const days = new Set(apps.map(a => a.applied_date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
    } else if (i > 0) {
      break; // gap — streak is over
    }
  }
  return streak;
}

export const useJourney = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [settings, setSettings] = useState<JourneySettings>({ daily_apply_target: 3 });
  const [loading, setLoading] = useState(true);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [appsRes, settingsRes] = await Promise.all([
        supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('applied_date', { ascending: false }),
        supabase
          .from('journey_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (appsRes.data) setApplications(appsRes.data as JobApplication[]);
      if (settingsRes.data) setSettings({ daily_apply_target: settingsRes.data.daily_apply_target });
    } catch (err) {
      console.error('useJourney fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Add application ────────────────────────────────────────────────────────
  const addApplication = useCallback(async (
    fields: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('job_applications')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single();
    if (error) {
      toast({ title: 'Could not save application', variant: 'destructive' });
      return;
    }
    setApplications(prev => [data as JobApplication, ...prev]);
    toast({ title: 'Application added!' });
  }, [user, toast]);

  // ── Update status ──────────────────────────────────────────────────────────
  const updateStatus = useCallback(async (id: string, status: AppStatus) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id);
    if (error) { toast({ title: 'Could not update status', variant: 'destructive' }); return; }
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, [toast]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteApplication = useCallback(async (id: string) => {
    const { error } = await supabase.from('job_applications').delete().eq('id', id);
    if (error) { toast({ title: 'Could not delete', variant: 'destructive' }); return; }
    setApplications(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Application removed' });
  }, [toast]);

  // ── Update daily target ────────────────────────────────────────────────────
  const updateDailyTarget = useCallback(async (target: number) => {
    if (!user) return;
    await supabase
      .from('journey_settings')
      .upsert({ user_id: user.id, daily_apply_target: target });
    setSettings({ daily_apply_target: target });
  }, [user]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const appliedToday = applications.filter(a => a.applied_date === today).length;
  const streak = computeStreak(applications);

  return {
    applications,
    settings,
    loading,
    appliedToday,
    streak,
    addApplication,
    updateStatus,
    deleteApplication,
    updateDailyTarget,
    refetch: fetchAll,
  };
};
