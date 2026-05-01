import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, ArrowLeft, TrendingUp, Briefcase, Phone, Users, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourney, AppStatus } from '@/hooks/useJourney';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import PageContainer from '@/components/PageContainer';
import AddApplicationModal from '@/components/journey/AddApplicationModal';
import ApplicationCard from '@/components/journey/ApplicationCard';
import AuthModal from '@/components/auth/AuthModal';

// ── Status summary counts ────────────────────────────────────────────────────
const StatusStat = ({ label, count, icon: Icon, color }: { label: string; count: number; icon: React.ElementType; color: string }) => (
  <div className={`flex flex-col items-center p-3 rounded-xl border ${color} bg-white`}>
    <Icon size={16} className="mb-1 opacity-70" />
    <span className="text-xl font-bold">{count}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

// ── Main page ────────────────────────────────────────────────────────────────
const JourneyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    applications, settings, loading,
    appliedToday, streak,
    addApplication, updateStatus, deleteApplication, updateDailyTarget,
  } = useJourney();

  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(String(settings.daily_apply_target));
  const [filter, setFilter] = useState<AppStatus | 'all'>('all');

  // Derived stats
  const total = applications.length;
  const counts = {
    interview: applications.filter(a => a.status === 'interview').length,
    offer:     applications.filter(a => a.status === 'offer').length,
    rejected:  applications.filter(a => a.status === 'rejected').length,
    phone_screen: applications.filter(a => a.status === 'phone_screen').length,
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const goalPct = Math.min(100, Math.round((appliedToday / settings.daily_apply_target) * 100));
  const goalMet = appliedToday >= settings.daily_apply_target;

  // If not logged in, prompt to sign in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-5xl">🗺️</div>
          <h1 className="text-2xl font-bold text-gray-800">My Career Journey</h1>
          <p className="text-gray-500 text-sm">
            Track your job applications, set daily goals, and stay on top of your search — all in one place.
          </p>
          <AuthModal trigger={
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Sign in to get started
            </Button>
          } />
          <button onClick={() => navigate('/')} className="text-xs text-gray-400 underline">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <PageContainer className="py-8 justify-start">
        <div className="w-full max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={14} /> Home
            </button>
            <AddApplicationModal onAdd={addApplication} />
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Career Journey
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                <Flame size={14} />
                {streak}-day streak
              </div>
            )}
          </div>

          {/* Daily goal card */}
          <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-indigo-500" />
                <span className="font-semibold text-sm text-gray-700">Today's goal</span>
              </div>
              {!editingTarget ? (
                <button
                  className="text-xs text-gray-400 underline hover:text-gray-600"
                  onClick={() => { setTargetDraft(String(settings.daily_apply_target)); setEditingTarget(true); }}
                >
                  Edit target
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1} max={20}
                    value={targetDraft}
                    onChange={e => setTargetDraft(e.target.value)}
                    className="w-16 h-7 text-xs text-center"
                  />
                  <Button size="sm" className="h-7 text-xs" onClick={() => {
                    const n = Math.max(1, parseInt(targetDraft) || 3);
                    updateDailyTarget(n);
                    setEditingTarget(false);
                  }}>Save</Button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{appliedToday} of {settings.daily_apply_target} applied today</span>
                {goalMet && <span className="text-emerald-600 font-semibold">Goal reached! 🎉</span>}
              </div>
              <Progress value={goalPct} className="h-2" />
            </div>

            {!goalMet && (
              <p className="text-xs text-gray-400">
                {settings.daily_apply_target - appliedToday} more application{settings.daily_apply_target - appliedToday !== 1 ? 's' : ''} to hit your goal today
              </p>
            )}
          </div>

          {/* Stats row */}
          {total > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <StatusStat label="Total" count={total} icon={Briefcase} color="border-gray-200" />
              <StatusStat label="Interviews" count={counts.interview} icon={Users} color="border-indigo-200" />
              <StatusStat label="Phone screens" count={counts.phone_screen} icon={Phone} color="border-yellow-200" />
              <StatusStat label="Offers" count={counts.offer} icon={Trophy} color="border-emerald-200" />
            </div>
          )}

          {/* Applications list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 text-sm">
                Applications{total > 0 ? ` (${total})` : ''}
              </h2>
              {total > 0 && (
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as AppStatus | 'all')}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white"
                >
                  <option value="all">All statuses</option>
                  <option value="applied">Applied</option>
                  <option value="phone_screen">Phone Screen</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              )}
            </div>

            {loading && (
              <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">📋</div>
                <p className="text-gray-500 text-sm">
                  {total === 0
                    ? 'No applications yet. Log your first one!'
                    : `No ${filter.replace('_', ' ')} applications.`}
                </p>
                {total === 0 && <AddApplicationModal onAdd={addApplication} />}
              </div>
            )}

            {!loading && filtered.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                onStatusChange={updateStatus}
                onDelete={deleteApplication}
              />
            ))}
          </div>

          {/* Encouragement if offer exists */}
          {counts.offer > 0 && (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white text-center">
              <p className="font-bold">🎊 You have {counts.offer} offer{counts.offer > 1 ? 's' : ''}!</p>
              <p className="text-xs opacity-80 mt-1">That's what persistence looks like.</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default JourneyPage;
