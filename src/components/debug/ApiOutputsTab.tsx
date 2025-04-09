
import React from 'react';
import DebugCard from './DebugCard';
import { JobPosting, UploadData, ATSFeedback, Feedback, ResumeJson, ScoreResponse } from '../../contexts/ResumeContext';

interface ApiOutputsTabProps {
  jobPosting: JobPosting | null;
  uploadData: UploadData | null;
  atsFeedback: ATSFeedback | null;
  feedback: Feedback | null;
  // Add new workflow data
  resumeJson: ResumeJson | null;
  tailoredResumeJson: ResumeJson | null;
  originalScore: ScoreResponse | null;
  tailoredScore: ScoreResponse | null;
  hasData: (obj: any) => boolean;
}

const ApiOutputsTab: React.FC<ApiOutputsTabProps> = ({
  jobPosting,
  uploadData,
  atsFeedback,
  feedback,
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

      {/* Old workflow responses */}
      <DebugCard
        title="ATS Feedback Response (Legacy)"
        description="Response from the ATS feedback API endpoint (old workflow)"
        data={atsFeedback}
        isAvailable={hasData(atsFeedback)}
        notAvailableText="No ATS feedback available."
      />

      <DebugCard
        title="Optimization Feedback Response (Legacy)"
        description="Response from the optimization feedback API endpoint (old workflow)"
        data={feedback}
        isAvailable={hasData(feedback)}
        notAvailableText="No optimization feedback available."
      />

      {/* New workflow responses */}
      <DebugCard
        title="Resume Schema Response"
        description="Response from the resume schema API endpoint (new workflow)"
        data={resumeJson}
        isAvailable={hasData(resumeJson)}
        notAvailableText="No resume schema available."
      />

      <DebugCard
        title="Original Score Response"
        description="Response from scoring the original resume (new workflow)"
        data={originalScore}
        isAvailable={hasData(originalScore)}
        notAvailableText="No original score available."
      />

      <DebugCard
        title="Tailored Resume Response"
        description="Response from the tailor resume API endpoint (new workflow)"
        data={tailoredResumeJson}
        isAvailable={hasData(tailoredResumeJson)}
        notAvailableText="No tailored resume available."
      />

      <DebugCard
        title="Tailored Score Response"
        description="Response from scoring the tailored resume (new workflow)"
        data={tailoredScore}
        isAvailable={hasData(tailoredScore)}
        notAvailableText="No tailored score available."
      />
    </div>
  );
};

export default ApiOutputsTab;
