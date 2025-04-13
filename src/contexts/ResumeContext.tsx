
import React, { createContext, useState, useContext } from 'react';
import { useResumeParser } from '../hooks/useResumeParser';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { useEditDecisions } from '../hooks/useEditDecisions';
import { ResumeContextType } from '../types/context';
import { 
  JobPosting, 
  UploadData, 
  ATSFeedback, 
  Feedback, 
  ResumeJson, 
  ScoreResponse
} from '../types/resume';

export * from '../types/resume';
export type { ResumeContextType };

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Basic resume data
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  
  // Legacy feedback data
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  // Error handling
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  
  // New workflow properties
  const [resumeJson, setResumeJson] = useState<ResumeJson | null>(null);
  const [tailoredResumeJson, setTailoredResumeJson] = useState<ResumeJson | null>(null);
  const [originalScore, setOriginalScore] = useState<ScoreResponse | null>(null);
  const [tailoredScore, setTailoredScore] = useState<ScoreResponse | null>(null);

  // Custom hooks
  const { selectedTemplates, addTemplate, removeTemplate } = useTemplateManager();
  const { editDecisions, addEditDecision } = useEditDecisions();
  const { parseResumeContent, getOptimizedResume } = useResumeParser();

  const value: ResumeContextType = {
    // Basic resume data
    jobTitle,
    setJobTitle,
    jobPosting,
    setJobPosting,
    uploadData,
    setUploadData,
    
    // Legacy feedback data
    atsFeedback,
    setAtsFeedback,
    feedback,
    setFeedback,
    
    // Error handling
    apiErrors,
    setApiErrors,
    
    // Template management
    selectedTemplates,
    addTemplate,
    removeTemplate,
    
    // Edit management
    editDecisions,
    addEditDecision,
    
    // Resume content management
    parseResumeContent,
    getOptimizedResume,
    
    // New workflow properties
    resumeJson,
    setResumeJson,
    tailoredResumeJson,
    setTailoredResumeJson,
    originalScore,
    setOriginalScore,
    tailoredScore,
    setTailoredScore,
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
