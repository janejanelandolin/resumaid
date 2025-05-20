
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ResumeJson } from '@/types/resume';
import SummaryComparison from './SummaryComparison';
import SkillsComparison from './SkillsComparison';
import ExperienceComparison from './ExperienceComparison';

interface ResumeSummaryProps {
  resume: ResumeJson;
  originalScoreExplanation?: string;
  tailoredScoreExplanation?: string;
  originalQualification?: string;
  tailoredQualification?: string;
  originalResume?: ResumeJson | null;
}

const ResumeSummary: React.FC<ResumeSummaryProps> = ({ 
  resume, 
  originalScoreExplanation, 
  tailoredScoreExplanation,
  originalQualification,
  tailoredQualification,
  originalResume
}) => {
  // Helper function to determine qualification badge color
  const getQualificationColor = (qualification: string) => {
    if (!qualification || qualification === 'Not Available') return 'bg-gray-100 text-gray-800';
    
    // Updated color logic based on qualification text
    if (qualification.toLowerCase().includes('irrelevant')) return 'bg-red-100 text-red-800';
    if (qualification.toLowerCase().includes('qualified')) {
      // Check for underqualified or overqualified (yellow)
      if (qualification.toLowerCase().includes('under') || 
          qualification.toLowerCase().includes('over')) {
        return 'bg-yellow-100 text-yellow-800';
      }
      // Regular qualified (green)
      return 'bg-green-100 text-green-800';
    }
    
    // Default to yellow for all other cases
    return 'bg-yellow-100 text-yellow-800';
  };

  // Get the original and optimized summaries
  const originalSummary = originalResume?.basics?.summary;
  const optimizedSummary = resume.basics?.summary;

  // Get the original and optimized skills
  const originalSkills = originalResume?.skills;
  const optimizedSkills = resume.skills;

  // Get the original and optimized work experience
  const originalExperience = originalResume?.work;
  const optimizedExperience = resume.work;

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
        
        <div>
          <h3 className="font-medium text-sm text-indigo-600">Summary</h3>
          <SummaryComparison 
            originalSummary={originalSummary} 
            optimizedSummary={optimizedSummary} 
          />
        </div>
        
        {originalScoreExplanation && (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-indigo-600">Original Resume Evaluation</h3>
              {originalQualification && (
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getQualificationColor(originalQualification)}`}>
                  {originalQualification}
                </div>
              )}
            </div>
            <div className="text-sm bg-indigo-50 p-2 rounded border-l-2 border-indigo-400">
              {originalScoreExplanation}
            </div>
          </div>
        )}
        
        {tailoredScoreExplanation && (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-indigo-600">Optimized Resume Evaluation</h3>
              {tailoredQualification && (
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getQualificationColor(tailoredQualification)}`}>
                  {tailoredQualification}
                </div>
              )}
            </div>
            <div className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-400">
              {tailoredScoreExplanation}
            </div>
          </div>
        )}
        
        {(optimizedSkills?.length > 0 || originalSkills?.length > 0) && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Skills</h3>
            <SkillsComparison
              originalSkills={originalSkills}
              optimizedSkills={optimizedSkills}
            />
          </div>
        )}
        
        {(optimizedExperience?.length > 0 || originalExperience?.length > 0) && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Experience</h3>
            <ExperienceComparison
              originalExperience={originalExperience}
              optimizedExperience={optimizedExperience}
            />
          </div>
        )}
        
        {resume.work && resume.work.length > 0 && !originalResume && (
          <div>
            <h3 className="font-medium text-sm text-indigo-600">Experience</h3>
            <p className="text-sm bg-indigo-50 p-1 rounded">
              {resume.work.length} positions including {resume.work[0].name || resume.work[0].company}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeSummary;
