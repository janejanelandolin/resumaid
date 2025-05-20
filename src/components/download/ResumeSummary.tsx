
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ResumeJson } from '@/types/resume';

interface ResumeSummaryProps {
  resume: ResumeJson;
  originalScoreExplanation?: string;
}

const ResumeSummary: React.FC<ResumeSummaryProps> = ({ resume, originalScoreExplanation }) => {
  return (
    <Card className="border-2 border-indigo-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="text-indigo-800">Optimized Resume Summary</CardTitle>
        <CardDescription>
          A brief overview of your optimized resume with highlighted changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="font-medium text-sm text-indigo-600">Name</h3>
          <p className="bg-indigo-50 p-1 rounded">{resume.basics?.name || 'Not provided'}</p>
        </div>
        
        {resume.basics?.summary && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Summary</h3>
            <p className="text-sm bg-indigo-50 p-2 rounded border-l-2 border-indigo-400">{resume.basics.summary}</p>
          </div>
        )}
        
        {originalScoreExplanation && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Unoptimized Resume Evaluation</h3>
            <div className="text-sm bg-indigo-50 p-2 rounded border-l-2 border-indigo-400">
              {originalScoreExplanation}
            </div>
          </div>
        )}
        
        {resume.work && resume.work.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Experience</h3>
            <p className="text-sm bg-indigo-50 p-1 rounded">
              {resume.work.length} positions including {resume.work[0].name}
            </p>
          </div>
        )}
        
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Skills</h3>
            <p className="text-sm bg-indigo-50 p-1 rounded">
              {resume.skills.length} skill categories
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeSummary;
