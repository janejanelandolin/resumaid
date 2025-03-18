
import React from 'react';
import DebugCard from './DebugCard';
import { JobPosting, UploadData, ATSFeedback, Feedback } from '../../contexts/ResumeContext';

interface ApiOutputsTabProps {
  jobPosting: JobPosting | null;
  uploadData: UploadData | null;
  atsFeedback: ATSFeedback | null;
  feedback: Feedback | null;
  hasData: (obj: any) => boolean;
}

const ApiOutputsTab: React.FC<ApiOutputsTabProps> = ({
  jobPosting,
  uploadData,
  atsFeedback,
  feedback,
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

      <DebugCard
        title="ATS Feedback Response"
        description="Response from the ATS feedback API endpoint"
        data={atsFeedback}
        isAvailable={hasData(atsFeedback)}
        notAvailableText="No ATS feedback available. Process a resume to get feedback."
      />

      <DebugCard
        title="Optimization Feedback Response"
        description="Response from the optimization feedback API endpoint"
        data={feedback}
        isAvailable={hasData(feedback)}
        notAvailableText="No optimization feedback available. Process a resume to get feedback."
      />
    </div>
  );
};

export default ApiOutputsTab;
