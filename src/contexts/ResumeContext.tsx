
import React, { createContext, useState, useContext } from 'react';
import { useResumeParser } from '../hooks/useResumeParser';
import { ResumeContextType } from '../types/context';
import { 
  JobPosting, 
  UploadData,
  ResumeJson, 
  ScoreResponse,
  EditDecision
} from '../types/resume';

export * from '../types/resume';
export type { ResumeContextType };

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Basic resume data
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  
  // Error handling
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  
  // New workflow properties
  const [resumeJson, setResumeJson] = useState<ResumeJson | null>(null);
  const [tailoredResumeJson, setTailoredResumeJson] = useState<ResumeJson | null>(null);
  const [originalScore, setOriginalScore] = useState<ScoreResponse | null>(null);
  const [tailoredScore, setTailoredScore] = useState<ScoreResponse | null>(null);
  
  // Edit decisions
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);
  
  // Template management (simplified without external hook)
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);
  
  const addEditDecision = (decision: EditDecision) => {
    setEditDecisions(prev => [...prev, decision]);
  };

  const resetEditDecisions = () => {
    setEditDecisions([]);
  };

  const addTemplate = (template: any) => {
    setSelectedTemplates(prev => [...prev, template]);
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const resetTemplates = () => {
    setSelectedTemplates([]);
  };

  // Custom hooks
  const { parseResumeContent } = useResumeParser();

  // Function to get optimized resume for preview and download
  const getOptimizedResume = () => {
    return tailoredResumeJson || resumeJson;
  };

  // Function to reset all state when returning to home page
  const resetAllState = () => {
    // Reset basic resume data
    setJobTitle('');
    setJobPosting(null);
    setUploadData(null);
    
    // Reset error handling
    setApiErrors([]);
    
    // Reset resume JSON and scores
    setResumeJson(null);
    setTailoredResumeJson(null);
    setOriginalScore(null);
    setTailoredScore(null);
    
    // Reset templates and edit decisions
    resetTemplates();
    resetEditDecisions();
  };

  // Function to mark workflow as complete when reaching the final page
  const markWorkflowComplete = () => {
    sessionStorage.setItem('resumeWorkflowComplete', 'true');
  };

  const value: ResumeContextType = {
    // Basic resume data
    jobTitle,
    setJobTitle,
    jobPosting,
    setJobPosting,
    uploadData,
    setUploadData,
    
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
    
    // Get optimized resume
    getOptimizedResume,
    
    // Reset function
    resetAllState,
    markWorkflowComplete,
    
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
