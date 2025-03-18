
import { JobPosting, UploadData, ATSFeedback, Feedback } from '../contexts/ResumeContext';

const API_BASE_URL = "https://app-286835625207.us-central1.run.app/";

// API service
export const apiService = {
  getJobPosting: async (jobTitle: string): Promise<JobPosting> => {
    console.log(`Making API call to get job posting for: ${jobTitle}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}job-posting?title=${encodeURIComponent(jobTitle)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch job posting:", error);
      // Fallback to a basic job posting if the API call fails
      return {
        title: jobTitle,
        description: `Position for ${jobTitle}`,
        requirements: ['Experience required'],
        skills: ['Relevant skills']
      };
    }
  },

  uploadResume: async (file: File): Promise<UploadData> => {
    console.log(`Uploading resume: ${file.name}`);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch(`${API_BASE_URL}upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to upload resume:", error);
      
      // If API call fails, read the file locally as fallback
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
    }
  },

  getATSFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<ATSFeedback> => {
    console.log('Getting ATS feedback');
    
    try {
      const response = await fetch(`${API_BASE_URL}ats-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobPosting,
          resumeData: uploadData
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to get ATS feedback:", error);
      
      // Fallback to mock data if API call fails
      return {
        similarity: Math.floor(Math.random() * 40) + 20,
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
    }
  },

  getFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<Feedback> => {
    console.log('Getting optimization feedback');
    
    try {
      const response = await fetch(`${API_BASE_URL}feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobPosting,
          resumeData: uploadData
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to get optimization feedback:", error);
      
      // Fallback to mock data if API call fails
      return {
        similarity: Math.floor(Math.random() * 30) + 65,
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
    }
  }
};
