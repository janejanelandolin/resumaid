import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AppStatus, JobApplication } from '@/hooks/useJourney';

const STATUS_STYLES: Record<AppStatus, string> = {
  applied:      'bg-blue-100 text-blue-700',
  phone_screen: 'bg-yellow-100 text-yellow-700',
  interview:    'bg-indigo-100 text-indigo-700',
  offer:        'bg-emerald-100 text-emerald-700',
  rejected:     'bg-red-100 text-red-600',
  withdrawn:    'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<AppStatus, string> = {
  applied:      'Applied',
  phone_screen: 'Phone Screen',
  interview:    'Interview',
  offer:        'Offer 🎉',
  rejected:     'Rejected',
  withdrawn:    'Withdrawn',
};

const STATUSES = Object.keys(STATUS_LABELS) as AppStatus[];

interface Props {
  app: JobApplication;
  onStatusChange: (id: string, status: AppStatus) => void;
  onDelete: (id: string) => void;
}

const ApplicationCard: React.FC<Props> = ({ app, onStatusChange, onDelete }) => {
  const dateStr = new Date(app.applied_date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-gray-100 bg-white hover:border-purple-100 hover:shadow-sm transition-all group">
      {/* Company + role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-800 truncate">{app.company}</span>
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={12} className="text-gray-400 hover:text-indigo-500" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500 truncate">{app.role}</span>
          {app.salary_range && (
            <span className="text-xs text-gray-400">· {app.salary_range}</span>
          )}
        </div>
        {app.notes && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{app.notes}</p>
        )}
      </div>

      {/* Date */}
      <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{dateStr}</span>

      {/* Status selector */}
      <Select value={app.status} onValueChange={v => onStatusChange(app.id, v as AppStatus)}>
        <SelectTrigger className={`h-7 text-xs border-0 rounded-full px-2 font-medium w-auto min-w-[110px] ${STATUS_STYLES[app.status]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map(s => (
            <SelectItem key={s} value={s} className="text-xs">
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        onClick={() => onDelete(app.id)}
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
};

export default ApplicationCard;
