
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface OptimizedEvaluationProps {
  tailoredScoreExplanation?: string;
}

const OptimizedEvaluation: React.FC<OptimizedEvaluationProps> = ({ tailoredScoreExplanation }) => {
  if (!tailoredScoreExplanation) {
    return null;
  }
  
  return (
    <Card className="border-2 border-green-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardTitle className="text-green-800">Optimized Resume Evaluation</CardTitle>
        <CardDescription>
          How your optimized resume performs against the job requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-l-2 border-green-400 pl-3 p-2 bg-green-50/50 rounded text-sm">
          {tailoredScoreExplanation}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedEvaluation;
