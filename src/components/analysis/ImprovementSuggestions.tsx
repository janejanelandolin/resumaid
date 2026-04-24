import React from 'react';
import { Target, LayoutList, MessageSquare, Tag, TrendingUp, AlertCircle, AlignLeft } from 'lucide-react';
import { useResumeContext } from '@/contexts/ResumeContext';

const CATEGORIES = [
  {
    key: 'positioning' as const,
    label: 'Positioning',
    icon: Target,
    color: 'text-indigo-600',
    border: 'border-indigo-300',
    bg: 'bg-indigo-50',
  },
  {
    key: 'keywords' as const,
    label: 'Keywords',
    icon: Tag,
    color: 'text-orange-600',
    border: 'border-orange-300',
    bg: 'bg-orange-50',
  },
  {
    key: 'metrics' as const,
    label: 'Metrics & Impact',
    icon: TrendingUp,
    color: 'text-blue-600',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
  },
  {
    key: 'tone' as const,
    label: 'Tone',
    icon: MessageSquare,
    color: 'text-green-600',
    border: 'border-green-300',
    bg: 'bg-green-50',
  },
  {
    key: 'organization' as const,
    label: 'Organization',
    icon: LayoutList,
    color: 'text-purple-600',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
  },
  {
    key: 'formatting' as const,
    label: 'Formatting',
    icon: AlignLeft,
    color: 'text-slate-600',
    border: 'border-slate-300',
    bg: 'bg-slate-50',
  },
  {
    key: 'gaps' as const,
    label: 'Gaps to Address',
    icon: AlertCircle,
    color: 'text-rose-600',
    border: 'border-rose-300',
    bg: 'bg-rose-50',
  },
];

const ImprovementSuggestions: React.FC = () => {
  const { tailoredResumeJson } = useResumeContext();
  const changes = tailoredResumeJson?.changes;

  const hasChanges = changes && CATEGORIES.some(c => (changes[c.key] ?? []).length > 0);
  if (!hasChanges) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Changes Made to Your Resume
      </h3>
      {CATEGORIES.map(({ key, label, icon: Icon, color, border, bg }) => {
        const items = changes?.[key] ?? [];
        if (!items.length) return null;
        return (
          <div key={key} className={`rounded-lg border ${border} ${bg} p-4 space-y-2`}>
            <div className={`flex items-center gap-2 font-semibold text-sm ${color}`}>
              <Icon size={15} />
              {label}
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className={`text-sm text-gray-700 border-l-2 ${border} pl-3`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ImprovementSuggestions;
