
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

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

// Resume Schema based on JSON Resume standard
export interface ResumeSchema {
  basics: {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  work: Array<{
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>;
  volunteer: Array<{
    organization: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
  }>;
  awards: Array<{
    title: string;
    date: string;
    awarder: string;
    summary: string;
  }>;
  certificates: Array<{
    name: string;
    date: string;
    issuer: string;
    url: string;
  }>;
  publications: Array<{
    name: string;
    publisher: string;
    releaseDate: string;
    url: string;
    summary: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
    keywords: string[];
  }>;
  references: Array<{
    name: string;
    reference: string;
  }>;
  projects: Array<{
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
    url: string;
  }>;
}

// Interface for tracking edit decisions
export interface EditDecision {
  editIndex: number;
  accepted: boolean;
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
  selectedTemplates: ResumeTemplate[];
  addTemplate: (template: ResumeTemplate) => void;
  removeTemplate: (templateId: string) => void;
  resetData: () => void;
  resumeData: ResumeSchema | null;
  setResumeData: (data: ResumeSchema) => void;
  parseResumeContent: (content: string) => void;
  editDecisions: EditDecision[];
  addEditDecision: (decision: EditDecision) => void;
  clearEditDecisions: () => void;
  getOptimizedResume: () => ResumeSchema | null;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};

// Default empty resume schema
const defaultResumeSchema: ResumeSchema = {
  basics: {
    name: "",
    label: "",
    image: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: {
      address: "",
      postalCode: "",
      city: "",
      countryCode: "",
      region: ""
    },
    profiles: []
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  certificates: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: []
};

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<ResumeTemplate[]>([]);
  const [resumeData, setResumeData] = useState<ResumeSchema | null>(null);
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);

  const addTemplate = (template: ResumeTemplate) => {
    setSelectedTemplates(current => {
      // Check if we already have 5 templates
      if (current.length >= 5) {
        return current;
      }
      // Check if this template is already selected
      if (current.some(t => t.id === template.id)) {
        return current;
      }
      return [...current, template];
    });
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(current => 
      current.filter(template => template.id !== templateId)
    );
  };

  const resetData = () => {
    setJobTitle('');
    setJobPosting(null);
    setUploadData(null);
    setAtsFeedback(null);
    setFeedback(null);
    setSelectedTemplates([]);
    setResumeData(null);
    setEditDecisions([]);
  };

  // Parse raw resume content into structured schema
  const parseResumeContent = (content: string) => {
    try {
      console.log("Parsing resume content:", content.substring(0, 100) + "...");
      
      // Basic parsing logic - this would be more sophisticated in a real app
      const sections = content.split(/\n(?=[A-Z]+:)|\n(?=[A-Z]+\s)/);
      const result = { ...defaultResumeSchema };
      
      // Try to extract the summary
      const summaryMatch = content.match(/SUMMARY[:\s]+(.*?)(?=\n[A-Z]+|$)/s);
      if (summaryMatch && summaryMatch[1]) {
        result.basics.summary = summaryMatch[1].trim();
      }

      // Look for education section
      const educationMatch = content.match(/EDUCATION[:\s]+(.*?)(?=\n[A-Z]+|$)/s);
      if (educationMatch && educationMatch[1]) {
        const eduText = educationMatch[1];
        const institutions = eduText.split(/\n(?=[A-Za-z])/);
        
        institutions.forEach(inst => {
          if (inst.trim()) {
            const degreeMatch = inst.match(/(Bachelor|Master|Doctor|PhD|BS|MS|BA|MA|MD|JD)/i);
            result.education.push({
              institution: inst.split('\n')[0].trim(),
              url: "",
              area: degreeMatch ? inst.split(degreeMatch[0])[1]?.trim() || "" : "",
              studyType: degreeMatch ? degreeMatch[0] : "",
              startDate: "",
              endDate: "",
              score: "",
              courses: []
            });
          }
        });
      }

      // Try to extract work experience
      const experienceMatch = content.match(/EXPERIENCE[:\s]+(.*?)(?=\n[A-Z]+|$)/s);
      if (experienceMatch && experienceMatch[1]) {
        const expText = experienceMatch[1];
        const jobs = expText.split(/\n(?=[A-Za-z])/);
        
        jobs.forEach(job => {
          if (job.trim()) {
            const jobLines = job.split('\n');
            const companyLine = jobLines[0];
            const companyMatch = companyLine.match(/(.+?)(?:\s+[-–]\s+|$)/);
            
            if (companyMatch) {
              const company = companyMatch[1].trim();
              const positionMatch = companyLine.match(/[-–]\s+(.+?)(?:\s+\d|$)/);
              const position = positionMatch ? positionMatch[1].trim() : "";
              
              const highlights = jobLines.slice(1).filter(line => line.trim());
              
              result.work.push({
                name: company,
                position: position,
                url: "",
                startDate: "",
                endDate: "",
                summary: highlights.length > 0 ? highlights[0] : "",
                highlights: highlights.slice(1)
              });
            }
          }
        });
      }

      // Try to extract skills
      const skillsMatch = content.match(/SKILLS[:\s]+(.*?)(?=\n[A-Z]+|$)/s);
      if (skillsMatch && skillsMatch[1]) {
        const skillsText = skillsMatch[1];
        const skillCategories = skillsText.split(/\n(?=[A-Za-z])/);
        
        skillCategories.forEach(category => {
          if (category.trim()) {
            const categoryLines = category.split('\n');
            const categoryName = categoryLines[0].split(/\s+/)[0];
            const keywords = categoryLines.join(' ')
              .replace(categoryName, '')
              .split(/[,()]/)
              .map(k => k.trim())
              .filter(k => k);
            
            result.skills.push({
              name: categoryName,
              level: "",
              keywords: keywords
            });
          }
        });
      }
      
      console.log("Parsed resume schema:", JSON.stringify(result).substring(0, 100) + "...");
      setResumeData(result);
    } catch (error) {
      console.error("Error parsing resume content:", error);
      // Set a default schema on error
      setResumeData(defaultResumeSchema);
    }
  };

  // Add an edit decision
  const addEditDecision = (decision: EditDecision) => {
    setEditDecisions(current => {
      // Remove any existing decision for this edit index
      const filtered = current.filter(d => d.editIndex !== decision.editIndex);
      // Add the new decision
      return [...filtered, decision];
    });
  };

  // Clear all edit decisions
  const clearEditDecisions = () => {
    setEditDecisions([]);
  };

  // Get optimized resume with accepted edits applied
  const getOptimizedResume = () => {
    if (!resumeData || !feedback || !feedback.suggested_edits) {
      return resumeData;
    }

    // Start with a copy of the current resume
    const optimizedResume = { ...resumeData };

    // Apply accepted edits
    feedback.suggested_edits.forEach((edit, index) => {
      const decision = editDecisions.find(d => d.editIndex === index);
      
      // Only apply edits that were explicitly accepted
      if (decision && decision.accepted) {
        // This is a simplified version - a real implementation would be more sophisticated
        // Update the relevant section based on the edit
        if (edit.section?.toLowerCase().includes('summary') && edit.resume_line_new) {
          optimizedResume.basics.summary = edit.resume_line_new;
        }
        // Add additional logic for other sections as needed
      }
    });

    return optimizedResume;
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
        selectedTemplates,
        addTemplate,
        removeTemplate,
        resetData,
        resumeData,
        setResumeData,
        parseResumeContent,
        editDecisions,
        addEditDecision,
        clearEditDecisions,
        getOptimizedResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
