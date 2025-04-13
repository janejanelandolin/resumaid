
// Resume data interfaces
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

// Resume JSON schema
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
    name: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    company?: string;
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

// Score response interface
export interface ScoreResponse {
  score: number;
  qualification: string;
  missing_keywords: string[];
  explanation: string;
}

// Edit decision interface
export interface EditDecision {
  editIndex: number;
  accepted: boolean;
}

// Resume template interface
export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

// JSON Resume interfaces for optimized resume
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
