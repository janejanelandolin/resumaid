import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, LayoutList, MessageSquare, Tag, TrendingUp, AlertCircle, AlignLeft } from 'lucide-react';

interface Changes {
  positioning: string[];
  organization: string[];
  tone: string[];
  keywords: string[];
  metrics: string[];
  gaps: string[];
  formatting: string[];
}

interface RationaleSectionProps {
  changes?: Changes;
}

const CATEGORIES = [
  { key: 'positioning' as const, label: 'Positioning', icon: Target, color: 'text-indigo-600', border: 'border-indigo-200' },
  { key: 'keywords' as const, label: 'Keywords', icon: Tag, color: 'text-orange-600', border: 'border-orange-200' },
  { key: 'metrics' as const, label: 'Metrics & Impact', icon: TrendingUp, color: 'text-blue-600', border: 'border-blue-200' },
  { key: 'tone' as const, label: 'Tone', icon: MessageSquare, color: 'text-green-600', border: 'border-green-200' },
  { key: 'organization' as const, label: 'Organization', icon: LayoutList, color: 'text-purple-600', border: 'border-purple-200' },
  { key: 'formatting' as const, label: 'Formatting', icon: AlignLeft, color: 'text-slate-600', border: 'border-slate-200' },
  { key: 'gaps' as const, label: 'Gaps to Address', icon: AlertCircle, color: 'text-rose-600', border: 'border-rose-200' },
];

const RationaleSection: React.FC<RationaleSectionProps> = ({ changes }) => {
  const hasChanges = changes && CATEGORIES.some(c => (changes[c.key] ?? []).length > 0);
  if (!hasChanges) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changes Made to Your Resume</CardTitle>
        <CardDescription>Here's how we optimized your resume for this job</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {CATEGORIES.map(({ key, label, icon: Icon, color, border }) => {
          const raw = changes?.[key];
          const items = Array.isArray(raw) ? raw : [];
          if (!items.length) return null;
          return (
            <div key={key}>
              <div className={`flex items-center gap-2 font-semibold text-sm mb-2 ${color}`}>
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
      </CardContent>
    </Card>
  );
};

export default RationaleSection;
