
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our API responses
export interface JobPosting {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  userProvided?: boolean; // Flag to indicate if this was directly provided by the user
}

export interface UploadData {
  id: string;
  filename: string;
  content: string;
}

export interface ATSFeedback {
  qualification?: string;
  JobPostingFulltext_ResumeFulltext_similarity?: number;
  JobPostingKeyword_ResumeKeyword_similarity?: number;
  JobPostingKeyword_ResumeFulltext_similarity?: number;
  missing_keywords?: string[];
  // Keep backward compatibility for existing code
  similarity?: number;
  keywords_missing?: string[];
  format_issues?: string[];
}

export interface Feedback {
  similarity: number;
  score_reason: string;
  created_at?: string;
  qualification?: string;
  genai_prompt_version?: string;
  suggested_edits: {
    section?: string;
    suggestion?: string;
    edit_reason?: string;
    resume_line_old?: string;
    resume_line_new?: string;
  }[];
}

interface ResumeContextProps {
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobPosting: JobPosting | null;
  setJobPosting: (posting: JobPosting | null) => void;
  uploadData: UploadData | null;
  setUploadData: (data: UploadData | null) => void;
  atsFeedback: ATSFeedback | null;
  setAtsFeedback: (feedback: ATSFeedback | null) => void;
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback | null) => void;
  resetData: () => void;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const resetData = () => {
    setJobTitle('');
    setJobPosting(null);
    setUploadData(null);
    setAtsFeedback(null);
    setFeedback(null);
  };

  return (
    <ResumeContext.Provider
      value={{
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
        resetData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
