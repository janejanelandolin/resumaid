
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

  // Raw resume input — stored before processing so ProcessingPage can pick it up
  const [rawResumeFile, setRawResumeFile] = useState<File | null>(null);
  const [rawResumeText, setRawResumeText] = useState<string>('');

  // Error handling
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  // Workflow output
  const [resumeJson, setResumeJson] = useState<ResumeJson | null>(null);
  const [tailoredResumeJson, setTailoredResumeJson] = useState<ResumeJson | null>(null);
  const [originalScore, setOriginalScore] = useState<ScoreResponse | null>(null);
  const [tailoredScore, setTailoredScore] = useState<ScoreResponse | null>(null);

  // Edit decisions
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);

  // Template management
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);

  const addEditDecision = (decision: EditDecision) => {
    setEditDecisions(prev => [...prev, decision]);
  };

  const addTemplate = (template: any) => {
    setSelectedTemplates(prev => [...prev, template]);
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const { parseResumeContent } = useResumeParser();

  const getOptimizedResume = () => tailoredResumeJson || resumeJson;

  const resetAllState = () => {
    setJobTitle('');
    setJobPosting(null);
    setUploadData(null);
    setRawResumeFile(null);
    setRawResumeText('');
    setApiErrors([]);
    setResumeJson(null);
    setTailoredResumeJson(null);
    setOriginalScore(null);
    setTailoredScore(null);
    setSelectedTemplates([]);
    setEditDecisions([]);
  };

  const markWorkflowComplete = () => {
    sessionStorage.setItem('resumeWorkflowComplete', 'true');
  };

  const value: ResumeContextType = {
    jobTitle, setJobTitle,
    jobPosting, setJobPosting,
    uploadData, setUploadData,
    rawResumeFile, setRawResumeFile,
    rawResumeText, setRawResumeText,
    apiErrors, setApiErrors,
    selectedTemplates,
    addTemplate,
    removeTemplate,
    editDecisions,
    addEditDecision,
    parseResumeContent,
    getOptimizedResume,
    resetAllState,
    markWorkflowComplete,
    resumeJson, setResumeJson,
    tailoredResumeJson, setTailoredResumeJson,
    originalScore, setOriginalScore,
    tailoredScore, setTailoredScore,
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
