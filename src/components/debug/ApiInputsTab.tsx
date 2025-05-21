
import React from 'react';
import DebugCard from './DebugCard';
import { JobPosting, UploadData } from '@/types/resume';
import { formatJobPostingAsText } from '@/hooks/resume/useResumeNormalizer';

interface ApiInputsTabProps {
  jobPosting?: JobPosting | null;
  uploadData?: UploadData | null;
  jobPostingText?: string;
  resumeContent?: string;
  hasJobPosting?: boolean;
  hasResumeContent?: boolean;
  getATSApiInput?: () => string;
  getFeedbackApiInput?: () => string;
}

const ApiInputsTab: React.FC<ApiInputsTabProps> = ({
  jobPosting,
  uploadData,
  jobPostingText,
  resumeContent,
  hasJobPosting,
  hasResumeContent,
  getATSApiInput,
  getFeedbackApiInput
}) => {
  // Helper function to extract the simplified job posting string for API calls
  const getJobPostingString = (jobPosting: JobPosting | null): string => {
    if (!jobPosting) return '';
    
    // If user directly provided the job description, use that
    if (jobPosting.userProvided && jobPosting.description) {
      return jobPosting.description;
    }
    
    // Otherwise, format the job posting object into a string
    if (jobPosting.description) {
      return jobPosting.description;
    }
    
    let jobPostingStr = jobPosting.title || '';
    
    if (jobPosting.requirements && jobPosting.requirements.length > 0) {
      jobPostingStr += `\n\nRequirements:\n${jobPosting.requirements.join('\n')}`;
    }
    
    if (jobPosting.skills && jobPosting.skills.length > 0) {
      jobPostingStr += `\n\nSkills:\n${jobPosting.skills.join('\n')}`;
    }
    
    return jobPostingStr;
  };

  // Use provided jobPostingText or generate it if not provided
  const finalJobPostingText = jobPostingText || (jobPosting ? formatJobPostingAsText(jobPosting) : '');
  // Use the provided resumeContent or get from uploadData
  const finalResumeContent = resumeContent || (uploadData?.content || '');
  // Use provided flags or calculate them
  const isJobPostingAvailable = hasJobPosting !== undefined ? hasJobPosting : (!!jobPosting || !!finalJobPostingText);
  const isResumeContentAvailable = hasResumeContent !== undefined ? hasResumeContent : !!finalResumeContent;

  return (
    <div className="mt-4 space-y-4">
      <DebugCard
        title="Job Posting Input"
        description="Data sent to the job posting API endpoint"
        data={jobPosting}
        isAvailable={isJobPostingAvailable}
        notAvailableText="No job posting data available. Submit a job title on the home page."
        renderContent={() => {
          if (!jobPosting) return '';
          
          return (
            <div>
              <p><strong>Job Title:</strong> {jobPosting.title}</p>
              {jobPosting.userProvided ? (
                <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <p><strong>Source:</strong> User-provided job posting text</p>
                </div>
              ) : (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <p><strong>Source:</strong> API-generated from job title</p>
                </div>
              )}
              <div className="mt-2">
                <p><strong>Description (actual content sent to API):</strong></p>
                <p className="whitespace-pre-wrap text-sm mt-1">{getJobPostingString(jobPosting)}</p>
              </div>
            </div>
          );
        }}
      />

      <DebugCard
        title="Resume Input"
        description="Resume content uploaded and sent to API endpoints"
        data={finalResumeContent}
        isAvailable={isResumeContentAvailable}
        notAvailableText="No resume content available. Upload a resume on the upload page."
        renderContent={(content) => {
          if (!content) return '';
          
          // For binary content like PDFs, show a preview of the first 100 chars and the length
          if (typeof content === 'string' && (content.startsWith('%PDF') || content.includes('binary data'))) {
            return `Binary or PDF content detected (${content.length} bytes)\nPreview: ${content.substring(0, 100)}...`;
          }
          
          // For text content, show first 5000 chars
          if (typeof content === 'string') {
            return content.substring(0, 5000) + (content.length > 5000 ? '...' : '');
          }
          
          return String(content);
        }}
      />

      {getATSApiInput && (
        <DebugCard
          title="ATS Feedback API Input (POST with Query Parameters)"
          description="Data sent to the ATS feedback API endpoint"
          data={null}
          isAvailable={isResumeContentAvailable && isJobPostingAvailable}
          notAvailableText="No data available. Both job posting and resume are required."
          renderContent={() => getATSApiInput()}
        />
      )}

      {getFeedbackApiInput && (
        <DebugCard
          title="Optimization Feedback API Input (POST with Query Parameters)"
          description="Data sent to the optimization feedback API endpoint"
          data={null}
          isAvailable={isResumeContentAvailable && isJobPostingAvailable}
          notAvailableText="No data available. Both job posting and resume are required."
          renderContent={() => getFeedbackApiInput()}
        />
      )}
    </div>
  );
};

export default ApiInputsTab;
