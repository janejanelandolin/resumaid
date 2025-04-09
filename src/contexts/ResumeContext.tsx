import React, { createContext, useState, useContext } from 'react';

export interface JobPosting {
  id?: string;
  title: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  userProvided?: boolean;
}

export interface UploadData {
  id: string;
  filename: string;
  content: string;
}

export interface ATSFeedback {
  JobPostingFulltext_ResumeFulltext_similarity: number;
  JobPostingKeyword_ResumeKeyword_similarity: number;
  JobPostingKeyword_ResumeFulltext_similarity: number;
  missing_keywords: string[];
  format_issues: string[];
  qualification: string;
  similarity?: number;
  keywords_missing?: string[];
}

export interface Feedback {
  similarity: number;
  score_reason: string;
  qualification: string;
  suggested_edits: {
    section: string;
    suggestion: string;
    edit_reason: string;
    resume_line_old: string;
    resume_line_new: string;
  }[];
}

export interface ResumeContextType {
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobPosting: JobPosting | null;
  setJobPosting: (jobPosting: JobPosting) => void;
  uploadData: UploadData | null;
  setUploadData: (uploadData: UploadData) => void;
  atsFeedback: ATSFeedback | null;
  setAtsFeedback: (atsFeedback: ATSFeedback) => void;
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
  apiErrors: string[];
  setApiErrors: (errors: string[]) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Add API errors state
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const value = {
    jobTitle,
    setJobTitle,
    jobPosting,
    setJobPosting,
    uploadData,
    setUploadData,
    atsFeedback,
    setAtsFeedback,
    feedback,
    setFeedback,
    apiErrors,
    setApiErrors,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};
