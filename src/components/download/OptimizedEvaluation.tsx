
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OptimizedEvaluationProps {
  tailoredScoreExplanation?: string;
  qualification?: string;
}

const OptimizedEvaluation: React.FC<OptimizedEvaluationProps> = ({ 
  tailoredScoreExplanation,
  qualification 
}) => {
  if (!tailoredScoreExplanation) {
    return null;
  }
  
  // Helper function to determine qualification badge color
  const getQualificationColor = (qualification: string) => {
    if (!qualification || qualification === 'Not Available') return 'bg-gray-100 text-gray-800';
    
    if (qualification.toLowerCase().includes('irrelevant')) return 'bg-red-100 text-red-800';
    if (qualification.toLowerCase().includes('qualified')) {
      if (qualification.toLowerCase().includes('under') || 
          qualification.toLowerCase().includes('over')) {
        return 'bg-yellow-100 text-yellow-800';
      }
      return 'bg-green-100 text-green-800';
    }
    
    return 'bg-yellow-100 text-yellow-800';
  };
  
  return (
    <Card className="border-2 border-green-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardTitle className="text-green-800">Optimized Resume Evaluation</CardTitle>
        <CardDescription>
          How your optimized resume performs against the job requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="border-l-2 border-green-400 pl-3 p-2 bg-green-50/50 rounded text-sm">
              {tailoredScoreExplanation}
            </div>
          </div>
          {qualification && (
            <div className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getQualificationColor(qualification)}`}>
              {qualification}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedEvaluation;
