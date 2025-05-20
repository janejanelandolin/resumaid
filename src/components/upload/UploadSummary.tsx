
import React from 'react';
import { Sparkle } from 'lucide-react';

interface UploadSummaryProps {
  jobTitle: string;
}

const UploadSummary: React.FC<UploadSummaryProps> = ({ jobTitle }) => {
  return (
    <div className="text-center space-y-2 py-4 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
      <div className="inline-flex items-center gap-1 mb-2">
        <Sparkle className="h-4 w-4 text-indigo-400" />
        <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Optimizing for: <span className="font-bold">{jobTitle}</span>
        </p>
        <Sparkle className="h-4 w-4 text-indigo-400" />
      </div>
      <p className="text-xs text-indigo-500/80">
        We will analyze your resume against Applicant Tracking Systems (ATS) and job requirements...
      </p>
    </div>
  );
};

export default UploadSummary;
