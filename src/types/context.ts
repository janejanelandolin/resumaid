
import {
  JobPosting,
  UploadData,
  Feedback,
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
  
  // Legacy feedback data
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
  
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
  
  // New workflow properties
  resumeJson: ResumeJson | null;
  setResumeJson: (resumeJson: ResumeJson | null) => void;
  tailoredResumeJson: ResumeJson | null;
  setTailoredResumeJson: (tailoredResumeJson: ResumeJson | null) => void;
  originalScore: ScoreResponse | null;
  setOriginalScore: (score: ScoreResponse | null) => void;
  tailoredScore: ScoreResponse | null;
  setTailoredScore: (score: ScoreResponse | null) => void;
}
