
import { JobPosting, UploadData, ATSFeedback, Feedback } from '../contexts/ResumeContext';

// For now, we'll mock the API responses
const mockJobPostingResponse = (jobTitle: string): JobPosting => {
  return {
    title: jobTitle,
    description: `We are looking for a talented ${jobTitle} to join our team.`,
    requirements: [
      'Bachelor\'s degree or equivalent experience',
      '3+ years of experience in a similar role',
      'Excellent communication skills',
      'Problem-solving abilities'
    ],
    skills: [
      'Project management',
      'Team leadership',
      'Strategic thinking',
      'Technical knowledge specific to the role'
    ]
  };
};

const mockUploadResponse = (file: File): Promise<UploadData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        content: e.target?.result as string || 'Sample resume content'
      });
    };
    reader.readAsText(file);
  });
};

const mockATSFeedbackResponse = (jobPosting: JobPosting, uploadData: UploadData): ATSFeedback => {
  return {
    similarity: Math.floor(Math.random() * 40) + 20, // Random number between 20-60
    keywords_missing: [
      'strategic planning',
      'team management',
      'budget oversight',
      'stakeholder communication'
    ],
    format_issues: [
      'Resume lacks proper section headers',
      'Content is not well organized',
      'Too much text in paragraphs rather than bullet points'
    ]
  };
};

const mockFeedbackResponse = (jobPosting: JobPosting, uploadData: UploadData): Feedback => {
  return {
    similarity: Math.floor(Math.random() * 30) + 65, // Random number between 65-95
    score_reason: `Your resume could be better aligned with the ${jobPosting.title} position. We've identified several opportunities to highlight your relevant experience and add keywords that will help you pass ATS screening.`,
    suggested_edits: [
      {
        section: 'Summary',
        suggestion: 'Add a concise professional summary that highlights your experience as a ' + jobPosting.title
      },
      {
        section: 'Skills',
        suggestion: 'Include these keywords: ' + jobPosting.skills.join(', ')
      },
      {
        section: 'Experience',
        suggestion: 'Quantify your achievements with metrics and results'
      },
      {
        section: 'Education',
        suggestion: 'List relevant certifications and courses'
      }
    ]
  };
};

// API service
export const apiService = {
  getJobPosting: async (jobTitle: string): Promise<JobPosting> => {
    // In a real app, this would be an API call
    console.log(`Making API call to get job posting for: ${jobTitle}`);
    
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockJobPostingResponse(jobTitle));
      }, 1000);
    });
  },

  uploadResume: async (file: File): Promise<UploadData> => {
    console.log(`Uploading resume: ${file.name}`);
    
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await mockUploadResponse(file);
        resolve(response);
      }, 1500);
    });
  },

  getATSFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<ATSFeedback> => {
    console.log('Getting ATS feedback');
    
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockATSFeedbackResponse(jobPosting, uploadData));
      }, 2000);
    });
  },

  getFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<Feedback> => {
    console.log('Getting optimization feedback');
    
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFeedbackResponse(jobPosting, uploadData));
      }, 2500);
    });
  }
};
