import React from 'react';
import DebugCard from './DebugCard';
import { JobPosting, UploadData, Feedback, ResumeJson, ScoreResponse } from '../../types/resume';

interface ApiOutputsTabProps {
  jobPosting: JobPosting | null;
  uploadData: UploadData | null;
  feedback: Feedback | null;
  // Keep new workflow data
  resumeJson: ResumeJson | null;
  tailoredResumeJson: ResumeJson | null;
  originalScore: ScoreResponse | null;
  tailoredScore: ScoreResponse | null;
  hasData: (obj: any) => boolean;
}

const ApiOutputsTab: React.FC<ApiOutputsTabProps> = ({
  jobPosting,
  uploadData,
  feedback,
  // Keep new workflow props
  resumeJson,
  tailoredResumeJson,
  originalScore,
  tailoredScore,
  hasData
}) => {
  return (
    <div className="mt-4 space-y-4">
      <DebugCard
        title="Job Posting API Response"
        description="Response from the job posting API endpoint"
        data={jobPosting}
        isAvailable={hasData(jobPosting)}
        notAvailableText="No job posting API response available."
      />

      <DebugCard
        title="Resume Upload API Response"
        description="Response from the resume upload API endpoint"
        data={uploadData}
        isAvailable={hasData(uploadData)}
        notAvailableText="No resume upload API response available."
        renderContent={(data) => {
          if (!data) return '';
          return JSON.stringify({
            id: data.id,
            filename: data.filename,
            content_excerpt: data.content ? data.content.substring(0, 200) + '...' : ''
          }, null, 2);
        }}
      />

      {/* New workflow responses - rearranged to match API workflow */}
      <DebugCard
        title="Resume Schema Response"
        description="Response from the /resume_schema API endpoint"
        data={resumeJson}
        isAvailable={hasData(resumeJson)}
        notAvailableText="No resume schema available."
      />

      <DebugCard
        title="Original Score Response (Unoptimized)"
        description="Response from the /score_resume API for original resume"
        data={originalScore}
        isAvailable={hasData(originalScore)}
        notAvailableText="No original score available."
      />

      <DebugCard
        title="Tailored Resume Response"
        description="Response from the /tailor_resume API endpoint"
        data={tailoredResumeJson}
        isAvailable={hasData(tailoredResumeJson)}
        notAvailableText="No tailored resume available."
        renderContent={(data) => {
          if (!data) return '';
          
          // Include rationale in debug display if available
          const rationale = data.rationale ? 
            { 
              ...data,
              rationale: data.rationale 
            } : 
            data;
            
          return JSON.stringify(rationale, null, 2);
        }}
      />

      <DebugCard
        title="Optimized Score Response"
        description="Response from the /score_resume API for tailored resume"
        data={tailoredScore}
        isAvailable={hasData(tailoredScore)}
        notAvailableText="No tailored score available."
      />
      
      <DebugCard
        title="Legacy Feedback Response"
        description="Response from the /feedback API endpoint"
        data={feedback}
        isAvailable={hasData(feedback)}
        notAvailableText="No feedback response available."
      />
    </div>
  );
};

export default ApiOutputsTab;
