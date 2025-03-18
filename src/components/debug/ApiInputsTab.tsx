
import React from 'react';
import DebugCard from './DebugCard';
import { JobPosting, UploadData } from '../../contexts/ResumeContext';

interface ApiInputsTabProps {
  jobPosting: JobPosting | null;
  uploadData: UploadData | null;
  getATSApiInput: () => string;
  getFeedbackApiInput: () => string;
}

const ApiInputsTab: React.FC<ApiInputsTabProps> = ({
  jobPosting,
  uploadData,
  getATSApiInput,
  getFeedbackApiInput
}) => {
  return (
    <div className="mt-4 space-y-4">
      <DebugCard
        title="Job Posting Input"
        description="Data sent to the job posting API endpoint"
        data={jobPosting}
        isAvailable={!!jobPosting}
        notAvailableText="No job posting data available. Submit a job title on the home page."
      />

      <DebugCard
        title="Resume Input"
        description="Resume content uploaded and sent to API endpoints"
        data={uploadData?.content}
        isAvailable={!!uploadData?.content}
        notAvailableText="No resume content available. Upload a resume on the upload page."
        renderContent={(content) => {
          if (!content) return '';
          
          // For binary content like PDFs, show a preview of the first 100 chars and the length
          if (content.startsWith('%PDF') || content.includes('binary data')) {
            return `Binary or PDF content detected (${content.length} bytes)\nPreview: ${content.substring(0, 100)}...`;
          }
          
          // For text content, show first 5000 chars
          return content.substring(0, 5000) + (content.length > 5000 ? '...' : '');
        }}
      />

      <DebugCard
        title="ATS Feedback API Input (Query Parameters)"
        description="Data sent to the ATS feedback API endpoint"
        data={null}
        isAvailable={!!uploadData?.content && !!jobPosting}
        notAvailableText="No data available. Both job posting and resume are required."
        renderContent={() => getATSApiInput()}
      />

      <DebugCard
        title="Optimization Feedback API Input (Query Parameters)"
        description="Data sent to the optimization feedback API endpoint"
        data={null}
        isAvailable={!!uploadData?.content && !!jobPosting}
        notAvailableText="No data available. Both job posting and resume are required."
        renderContent={() => getFeedbackApiInput()}
      />
    </div>
  );
};

export default ApiInputsTab;
