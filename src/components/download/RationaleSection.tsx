
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface RationaleSectionProps {
  changes?: string[];
}

const RationaleSection: React.FC<RationaleSectionProps> = ({ changes }) => {
  if (!changes || changes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changes Made to Your Resume</CardTitle>
        <CardDescription>
          Here's how we optimized your resume for this job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {changes.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RationaleSection;
