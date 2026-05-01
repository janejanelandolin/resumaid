import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { AppStatus, JobApplication } from '@/hooks/useJourney';

interface Props {
  onAdd: (fields: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const STATUSES: { value: AppStatus; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const today = () => new Date().toISOString().slice(0, 10);

const AddApplicationModal: React.FC<Props> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'applied' as AppStatus,
    applied_date: today(),
    job_url: '',
    salary_range: '',
    notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    setLoading(true);
    await onAdd(form);
    setLoading(false);
    setOpen(false);
    setForm({ company: '', role: '', status: 'applied', applied_date: today(), job_url: '', salary_range: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus size={15} /> Add application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log a job application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Senior Engineer" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">Date applied</Label>
              <Input id="date" type="date" value={form.applied_date} onChange={e => set('applied_date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="salary">Salary range</Label>
              <Input id="salary" value={form.salary_range} onChange={e => set('salary_range', e.target.value)} placeholder="$120k–$150k" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="url">Job URL</Label>
              <Input id="url" value={form.job_url} onChange={e => set('job_url', e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Recruiter name, next steps, etc." className="min-h-[70px] text-sm" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            {loading ? 'Saving…' : 'Save application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplicationModal;
