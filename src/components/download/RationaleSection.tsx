
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface RationaleSectionProps {
  rationale?: string[];
}

const RationaleSection: React.FC<RationaleSectionProps> = ({ rationale }) => {
  if (!rationale || rationale.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Rationale</CardTitle>
        <CardDescription>
          Here's how we optimized your resume for this job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {rationale.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RationaleSection;
