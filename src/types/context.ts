
import {
  JobPosting,
  UploadData,
  ResumeJson,
  ScoreResponse,
  EditDecision,
  ResumeTemplate
} from './resume';

export interface ResumeContextType {
  // Basic resume data
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobPosting: JobPosting | null;
  setJobPosting: (jobPosting: JobPosting) => void;
  uploadData: UploadData | null;
  setUploadData: (uploadData: UploadData) => void;

  // Raw resume input (file or pasted text) stored before processing
  rawResumeFile: File | null;
  setRawResumeFile: (file: File | null) => void;
  rawResumeText: string;
  setRawResumeText: (text: string) => void;

  // Error handling
  apiErrors: string[];
  setApiErrors: (errors: string[]) => void;

  // Template management
  selectedTemplates: ResumeTemplate[];
  addTemplate: (template: ResumeTemplate) => void;
  removeTemplate: (templateId: string) => void;

  // Edit management
  editDecisions: EditDecision[];
  addEditDecision: (decision: EditDecision) => void;

  // Resume content management
  parseResumeContent: (content: string) => void;

  // Get optimized resume
  getOptimizedResume: () => ResumeJson | null;

  // Reset all state when returning to home
  resetAllState: () => void;

  // Mark the workflow as complete (to trigger reset on next home visit)
  markWorkflowComplete: () => void;

  // Workflow output
  resumeJson: ResumeJson | null;
  setResumeJson: (resumeJson: ResumeJson | null) => void;
  tailoredResumeJson: ResumeJson | null;
  setTailoredResumeJson: (tailoredResumeJson: ResumeJson | null) => void;
  originalScore: ScoreResponse | null;
  setOriginalScore: (score: ScoreResponse | null) => void;
  tailoredScore: ScoreResponse | null;
  setTailoredScore: (score: ScoreResponse | null) => void;
}
