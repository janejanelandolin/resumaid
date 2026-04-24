
export interface JobPosting {
  id?: string;
  title?: string;
  company?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  userProvided?: boolean;
}

export interface UploadData {
  id: string;
  filename: string;
  content: string;
  text?: string; // For backward compatibility
}

export interface Feedback {
  format_issues?: string[];
}

export interface ScoreResponse {
  similarity: number;
  missing_keywords: string[];
  explanation: string;
  // Additional fields from API response
  evaluatorA_qualification?: string;
  evaluatorB_qualification?: string;
  evaluatorC_qualification?: string;
  consensus_qualification?: string;
}

export interface EditDecision {
  editIndex: number;
  accepted: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  image: string;
  url: string;
  thumbnail: string;
  description: string;
}

export interface ResumeJson {
  basics: {
    name: string;
    label?: string;
    email?: string;
    phone?: string;
    summary?: string;
    location?: {
      address?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      countryCode?: string;
    };
    profiles?: {
      network: string;
      username: string;
      url: string;
    }[];
    website?: string;
  };
  work?: {
    company?: string;
    name?: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education?: {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: {
    name: string;
    keywords?: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }[];
  awards?: {
    title: string;
    date: string;
    awarder: string;
    summary?: string;
  }[];
  publications?: {
    name: string;
    publisher: string;
    releaseDate: string;
    summary?: string;
  }[];
  languages?: {
    language: string;
    fluency: string;
  }[];
  interests?: {
    name: string;
    keywords?: string[];
  }[];
  references?: {
    name: string;
    reference: string;
  }[];
  volunteer?: {
    organization: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  certifications?: {
    name: string;
    date: string;
    issuer: string;
    url?: string;
  }[];
  changes?: {
    positioning: string[];
    organization: string[];
    tone: string[];
    keywords: string[];
    metrics: string[];
    gaps: string[];
    formatting: string[];
  };
}
