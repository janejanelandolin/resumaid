
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
        const errorText = await response.text();
        console.error(`API error: ${response.status}`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'No error details'}`);
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

  uploadResume: async (file: File): Promise<{data?: UploadData, error?: string}> => {
    console.log(`Uploading resume: ${file.name} (${file.type}) - Size: ${file.size} bytes`);
    
    try {
      const formData = new FormData();
      formData.append('file', file); // Change 'resume' to 'file' to match API expectation
      
      console.log("Upload endpoint:", `${API_BASE_URL}upload`);
      
      const response = await fetch(`${API_BASE_URL}upload`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          // No need to set Content-Type as FormData sets it automatically with boundary
        },
        body: formData
      });
      
      // Store the raw response text for potential error debugging
      const responseText = await response.text();
      console.log("Upload raw response:", responseText);
      
      if (!response.ok) {
        return {
          error: `API error: ${response.status} - ${responseText || 'No error details'}`
        };
      }
      
      // Parse the response JSON manually since we already read the text
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        return {
          error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
        };
      }
      
      // Log the result for debugging
      console.log("Upload result:", result);
      
      // Check if content is empty or undefined
      if (!result.content || result.content.trim() === '') {
        console.warn("Resume content is empty or undefined in API response");
        
        // Read the file locally to extract content
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string || '';
            console.log("Extracted content locally, length:", content.length);
            
            resolve({
              data: {
                id: result.id || Math.random().toString(36).substr(2, 9),
                filename: file.name,
                content: content
              }
            });
          };
          reader.readAsText(file);
        });
      }
      
      return { data: result };
    } catch (error) {
      console.error("Failed to upload resume:", error);
      
      // If API call fails, read the file locally as fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string || '';
          console.log("Using fallback content extraction, length:", content.length);
          
          resolve({
            data: {
              id: Math.random().toString(36).substr(2, 9),
              filename: file.name,
              content: content
            },
            error: `API error: ${error instanceof Error ? error.message : String(error)}`
          });
        };
        reader.readAsText(file);
      });
    }
  },

  getATSFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<{data?: ATSFeedback, error?: string}> => {
    console.log('Getting ATS feedback');
    
    // Check if content is available
    if (!uploadData.content || uploadData.content.trim() === '') {
      console.error("Resume content is empty or undefined when calling getATSFeedback");
      return { error: "Resume content is missing" };
    }
    
    try {
      // Log the first 100 chars of resume content for debugging
      console.log(`Resume content preview: ${uploadData.content.substring(0, 100)}...`);
      
      // Calculate the full URL length to debug potential URL length issues
      const resumeContent = encodeURIComponent(uploadData.content);
      const jobPostingJSON = encodeURIComponent(JSON.stringify(jobPosting));
      
      // Check if URL might be too long
      const urlLength = `${API_BASE_URL}atsfeedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`.length;
      console.log("ATS Feedback URL length:", urlLength);
      
      // If URL is extremely long, consider using a different approach like POST with request body
      if (urlLength > 2000) {
        console.warn("URL may be too long for GET request, attempting to use POST with body");
        
        const response = await fetch(`${API_BASE_URL}atsfeedback`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resume: uploadData.content,
            job_posting: jobPosting
          })
        });
        
        const responseText = await response.text();
        
        if (!response.ok) {
          return { 
            error: `API error: ${response.status} - ${responseText || 'No error details'}`
          };
        }
        
        try {
          const data = JSON.parse(responseText);
          console.log("ATS Feedback response:", data);
          
          // Add backwards compatibility for existing code that expects similarity property
          if (data.JobPostingFulltext_ResumeFulltext_similarity !== undefined && data.similarity === undefined) {
            data.similarity = data.JobPostingFulltext_ResumeFulltext_similarity;
          }
          
          // Add backwards compatibility for existing code that expects keywords_missing property
          if (data.missing_keywords !== undefined && data.keywords_missing === undefined) {
            data.keywords_missing = data.missing_keywords;
          }
          
          return { data };
        } catch (parseError) {
          return { 
            error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
          };
        }
      }
      
      // Original implementation using URL parameters
      const url = `${API_BASE_URL}atsfeedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: '' // Empty body as per the curl example
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        return { 
          error: `API error: ${response.status} - ${responseText || 'No error details'}`
        };
      }
      
      try {
        const data = JSON.parse(responseText);
        console.log("ATS Feedback response:", data);
        
        // Add backwards compatibility for existing code that expects similarity property
        if (data.JobPostingFulltext_ResumeFulltext_similarity !== undefined && data.similarity === undefined) {
          data.similarity = data.JobPostingFulltext_ResumeFulltext_similarity;
        }
        
        // Add backwards compatibility for existing code that expects keywords_missing property
        if (data.missing_keywords !== undefined && data.keywords_missing === undefined) {
          data.keywords_missing = data.missing_keywords;
        }
        
        return { data };
      } catch (parseError) {
        return { 
          error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
        };
      }
    } catch (error) {
      console.error("Failed to get ATS feedback:", error);
      
      // Fallback to mock data if API call fails
      return {
        data: {
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
        },
        error: `API error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  },

  getFeedback: async (jobPosting: JobPosting, uploadData: UploadData): Promise<{data?: Feedback, error?: string}> => {
    console.log('Getting optimization feedback');
    
    // Check if content is available
    if (!uploadData.content || uploadData.content.trim() === '') {
      console.error("Resume content is empty or undefined when calling getFeedback");
      return { error: "Resume content is missing" };
    }
    
    try {
      // Log the first 100 chars of resume content for debugging
      console.log(`Resume content preview for feedback: ${uploadData.content.substring(0, 100)}...`);
      
      // Calculate the full URL length to debug potential URL length issues
      const resumeContent = encodeURIComponent(uploadData.content);
      const jobPostingJSON = encodeURIComponent(JSON.stringify(jobPosting));
      
      // Check if URL might be too long
      const urlLength = `${API_BASE_URL}feedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`.length;
      console.log("Feedback URL length:", urlLength);
      
      // If URL is extremely long, consider using a different approach like POST with request body
      if (urlLength > 2000) {
        console.warn("URL may be too long for GET request, attempting to use POST with body");
        
        const response = await fetch(`${API_BASE_URL}feedback`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resume: uploadData.content,
            job_posting: jobPosting
          })
        });
        
        const responseText = await response.text();
        
        if (!response.ok) {
          return { 
            error: `API error: ${response.status} - ${responseText || 'No error details'}`
          };
        }
        
        try {
          const data = JSON.parse(responseText);
          console.log("Feedback response:", data);
          return { data };
        } catch (parseError) {
          return { 
            error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
          };
        }
      }
      
      // Original implementation using URL parameters
      const url = `${API_BASE_URL}feedback?resume=${resumeContent}&job_posting=${jobPostingJSON}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: '' // Empty body as per the curl example
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        return { 
          error: `API error: ${response.status} - ${responseText || 'No error details'}`
        };
      }
      
      try {
        const data = JSON.parse(responseText);
        console.log("Feedback response:", data);
        return { data };
      } catch (parseError) {
        return { 
          error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
        };
      }
    } catch (error) {
      console.error("Failed to get optimization feedback:", error);
      
      // Fallback to mock data if API call fails
      return {
        data: {
          similarity: Math.floor(Math.random() * 30) + 65,
          score_reason: `Your resume could be better aligned with the ${jobPosting.title} position. We've identified several opportunities to highlight your relevant experience and add keywords that will help you pass ATS screening.`,
          suggested_edits: [
            {
              section: 'Summary',
              suggestion: 'Add a concise professional summary that highlights your experience as a ' + jobPosting.title
            },
            {
              section: 'Skills',
              suggestion: 'Include these keywords: ' + (jobPosting.skills || ['relevant skills']).join(', ')
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
        },
        error: `API error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};
