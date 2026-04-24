import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, LayoutList, MessageSquare } from 'lucide-react';

interface Changes {
  positioning: string[];
  organization: string[];
  tone: string[];
}

interface RationaleSectionProps {
  changes?: Changes;
}

const CATEGORIES = [
  { key: 'positioning' as const, label: 'Positioning', icon: Target, color: 'text-indigo-500', border: 'border-indigo-200' },
  { key: 'organization' as const, label: 'Organization', icon: LayoutList, color: 'text-purple-500', border: 'border-purple-200' },
  { key: 'tone' as const, label: 'Tone', icon: MessageSquare, color: 'text-green-500', border: 'border-green-200' },
];

const RationaleSection: React.FC<RationaleSectionProps> = ({ changes }) => {
  const hasChanges = changes && CATEGORIES.some(c => changes[c.key]?.length > 0);
  if (!hasChanges) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changes Made to Your Resume</CardTitle>
        <CardDescription>Here's how we optimized your resume for this job</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {CATEGORIES.map(({ key, label, icon: Icon, color, border }) => {
          const items = changes?.[key] ?? [];
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
