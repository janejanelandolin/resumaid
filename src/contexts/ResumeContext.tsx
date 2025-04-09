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

// Add ResumeJson interface for /resume_schema endpoint
export interface ResumeJson {
  basics: {
    name: string;
    email: string;
    phone: string;
    summary?: string;
    location?: {
      address?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      countryCode?: string;
    };
    profiles?: Array<{
      network: string;
      username: string;
      url?: string;
    }>;
  };
  work: Array<{
    name: string; // Changed from company to name to match API requirements
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    company?: string; // Keep for backward compatibility
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level?: string;
    keywords: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

// Add ScoreResponse interface for /score_resume endpoint
export interface ScoreResponse {
  score: number;
  qualification: string;
  missing_keywords: string[];
  explanation: string;
}

// Add EditDecision interface
export interface EditDecision {
  editIndex: number;
  accepted: boolean;
}

// Add ResumeTemplate interface
export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

// JSON Resume interfaces for getOptimizedResume
export interface ResumeBasics {
  name: string;
  email: string;
  phone: string;
  url?: string;
  summary?: string;
}

export interface ResumeWorkExperience {
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ResumeEducation {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
}

export interface ResumeSkill {
  name: string;
  keywords: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface OptimizedResume {
  basics: ResumeBasics;
  work: ResumeWorkExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects?: ResumeProject[];
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
  
  // Add missing properties
  selectedTemplates: ResumeTemplate[];
  addTemplate: (template: ResumeTemplate) => void;
  removeTemplate: (templateId: string) => void;
  editDecisions: EditDecision[];
  addEditDecision: (decision: EditDecision) => void;
  parseResumeContent: (content: string) => void;
  getOptimizedResume: () => OptimizedResume | null;
  
  // Add new properties for the updated workflow
  resumeJson: ResumeJson | null;
  setResumeJson: (resumeJson: ResumeJson | null) => void;
  tailoredResumeJson: ResumeJson | null;
  setTailoredResumeJson: (tailoredResumeJson: ResumeJson | null) => void;
  originalScore: ScoreResponse | null;
  setOriginalScore: (score: ScoreResponse | null) => void;
  tailoredScore: ScoreResponse | null;
  setTailoredScore: (score: ScoreResponse | null) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  
  // Add state for the missing properties
  const [selectedTemplates, setSelectedTemplates] = useState<ResumeTemplate[]>([]);
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);
  const [parsedResume, setParsedResume] = useState<OptimizedResume | null>(null);
  
  // Add new state for the updated workflow
  const [resumeJson, setResumeJson] = useState<ResumeJson | null>(null);
  const [tailoredResumeJson, setTailoredResumeJson] = useState<ResumeJson | null>(null);
  const [originalScore, setOriginalScore] = useState<ScoreResponse | null>(null);
  const [tailoredScore, setTailoredScore] = useState<ScoreResponse | null>(null);

  // Template management functions
  const addTemplate = (template: ResumeTemplate) => {
    if (selectedTemplates.length < 5 && !selectedTemplates.some(t => t.id === template.id)) {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(selectedTemplates.filter(t => t.id !== templateId));
  };

  // Edit decision management
  const addEditDecision = (decision: EditDecision) => {
    // If a decision for this edit already exists, replace it
    const existingIndex = editDecisions.findIndex(d => d.editIndex === decision.editIndex);
    
    if (existingIndex >= 0) {
      const newDecisions = [...editDecisions];
      newDecisions[existingIndex] = decision;
      setEditDecisions(newDecisions);
    } else {
      setEditDecisions([...editDecisions, decision]);
    }
  };

  // Parse resume content from uploaded text
  const parseResumeContent = (content: string) => {
    try {
      // This is a simplified implementation - in a real app, this would parse
      // the resume content into a structured format
      
      // Mock implementation - create a basic resume structure
      const mockResume: OptimizedResume = {
        basics: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "(555) 123-4567",
          summary: "Experienced professional with a track record of success."
        },
        work: [
          {
            name: "Example Company",
            position: "Senior Position",
            startDate: "2020-01",
            endDate: "2023-01",
            summary: "Led key initiatives and projects.",
            highlights: ["Increased revenue by 20%", "Managed a team of 5"]
          }
        ],
        education: [
          {
            institution: "University of Example",
            area: "Computer Science",
            studyType: "Bachelor",
            startDate: "2014-09",
            endDate: "2018-05"
          }
        ],
        skills: [
          {
            name: "Programming",
            keywords: ["JavaScript", "TypeScript", "React"]
          },
          {
            name: "Soft Skills",
            keywords: ["Leadership", "Communication", "Problem Solving"]
          }
        ]
      };
      
      setParsedResume(mockResume);
    } catch (error) {
      console.error("Error parsing resume content:", error);
    }
  };

  // Get optimized resume with edit decisions applied
  const getOptimizedResume = (): OptimizedResume | null => {
    if (!parsedResume) return null;
    
    // In a real implementation, this would apply all accepted edits
    // to the resume content and return the optimized version
    return parsedResume;
  };

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
    
    // Add the missing properties to the context value
    selectedTemplates,
    addTemplate,
    removeTemplate,
    editDecisions,
    addEditDecision,
    parseResumeContent,
    getOptimizedResume,
    
    // Add new properties to the context value
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
