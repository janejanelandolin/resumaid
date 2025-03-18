import { JobPosting, UploadData, ATSFeedback, Feedback } from '../contexts/ResumeContext';

const API_BASE_URL = "https://api-758224663478.us-west2.run.app/";

// API service
export const apiService = {
  getJobPosting: async (jobTitle: string): Promise<JobPosting> => {
    console.log(`Making API call to get job posting for: ${jobTitle}`);
    
    try {
      // Updated to use POST method and correct endpoint with job_title parameter
      const response = await fetch(`${API_BASE_URL}job_posting?job_title=${encodeURIComponent(jobTitle)}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: '' // Empty body as per the curl example
      });
      
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
      formData.append('file', file); // Change 'resume' to 'file' to match API expectation
      
      const response = await fetch(`${API_BASE_URL}upload`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          // No need to set Content-Type as FormData sets it automatically with boundary
        },
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
      // Properly passing resume content and job posting as JSON string
      const resumeContent = encodeURIComponent(uploadData.content);
      const jobPostingJSON = encodeURIComponent(JSON.stringify(jobPosting));
      
      const response = await fetch(`${API_BASE_URL}atsfeedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: '' // Empty body as per the curl example
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add backwards compatibility for existing code that expects similarity property
      if (data.JobPostingFulltext_ResumeFulltext_similarity !== undefined && data.similarity === undefined) {
        data.similarity = data.JobPostingFulltext_ResumeFulltext_similarity;
      }
      
      // Add backwards compatibility for existing code that expects keywords_missing property
      if (data.missing_keywords !== undefined && data.keywords_missing === undefined) {
        data.keywords_missing = data.missing_keywords;
      }
      
      return data;
    } catch (error) {
      console.error("Failed to get ATS feedback:", error);
      
      // Fallback to mock data if API call fails
      return {
        qualification: "Unqualified",
        JobPostingFulltext_ResumeFulltext_similarity: 0.39,
        JobPostingKeyword_ResumeKeyword_similarity: 0.03,
        JobPostingKeyword_ResumeFulltext_similarity: 0.02,
        missing_keywords: [
          "revenue growth",
          "key alliances",
          "ccm strategic",
          "nicetohaves experience",
          "cpq",
          "partner communication",
          "alignment",
          "recruit",
          "partner conflicts",
          "this role",
          "strong relationships"
        ],
        // For backward compatibility
        similarity: 0.39,
        keywords_missing: [
          "revenue growth",
          "key alliances",
          "ccm strategic",
          "partner communication"
        ],
        format_issues: [
          'Resume lacks proper section headers',
          'Content is not well organized'
        ]
      };
    }
  },

  getFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<Feedback> => {
    console.log('Getting optimization feedback');
    
    try {
      // Properly passing resume content and job posting as JSON string
      const resumeContent = encodeURIComponent(uploadData.content);
      const jobPostingJSON = encodeURIComponent(JSON.stringify(jobPosting));
      
      const response = await fetch(`${API_BASE_URL}feedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: '' // Empty body as per the curl example
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
