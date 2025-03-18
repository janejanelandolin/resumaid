
import { JobPosting, UploadData, ATSFeedback, Feedback } from '../contexts/ResumeContext';

const API_BASE_URL = "https://api-758224663478.us-west2.run.app/";

// Helper function to log API inputs and outputs
const logApiCall = (endpoint: string, input: any, output: any, error?: any) => {
  console.log(`===== API CALL: ${endpoint} =====`);
  console.log('INPUT:', input);
  console.log('OUTPUT:', output);
  if (error) {
    console.error('ERROR:', error);
  }
  console.log('=============================');
};

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
      
      const result = await response.json();
      logApiCall('getJobPosting', { jobTitle }, result);
      return result;
    } catch (error) {
      console.error("Failed to fetch job posting:", error);
      // Fallback to a basic job posting if the API call fails
      const fallbackResult = {
        title: jobTitle,
        description: `Position for ${jobTitle}`,
        requirements: ['Experience required'],
        skills: ['Relevant skills']
      };
      logApiCall('getJobPosting', { jobTitle }, fallbackResult, error);
      return fallbackResult;
    }
  },

  uploadResume: async (file: File): Promise<{data?: UploadData, error?: string}> => {
    console.log(`Uploading resume: ${file.name} (${file.type}) - Size: ${file.size} bytes`);
    
    try {
      const formData = new FormData();
      formData.append('file', file); // Change 'resume' to 'file' to match API expectation
      
      console.log("Upload endpoint:", `${API_BASE_URL}upload`);
      logApiCall('uploadResume (request)', { 
        fileName: file.name, 
        fileType: file.type, 
        fileSize: file.size 
      }, 'FormData object (not shown for brevity)');
      
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
        const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
        logApiCall('uploadResume (response)', { 
          fileName: file.name 
        }, null, errorMessage);
        return {
          error: errorMessage
        };
      }
      
      // Parse the response JSON manually since we already read the text
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
        logApiCall('uploadResume (parse error)', { 
          fileName: file.name 
        }, null, errorMessage);
        return {
          error: errorMessage
        };
      }
      
      // Log the result for debugging
      logApiCall('uploadResume (response)', { 
        fileName: file.name 
      }, result);
      
      // Check if content is empty or undefined
      if (!result.content || result.content.trim() === '') {
        console.warn("Resume content is empty or undefined in API response");
        
        // Read the file locally to extract content
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string || '';
            console.log("Extracted content locally, length:", content.length);
            const localResult = {
              id: result.id || Math.random().toString(36).substr(2, 9),
              filename: file.name,
              content: content
            };
            
            logApiCall('uploadResume (local fallback)', { 
              fileName: file.name 
            }, { contentLength: content.length, id: localResult.id });
            
            resolve({
              data: localResult
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
          
          const localResult = {
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            content: content
          };
          
          logApiCall('uploadResume (error fallback)', { 
            fileName: file.name 
          }, { contentLength: content.length, id: localResult.id }, error);
          
          resolve({
            data: localResult,
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
      console.log(`Resume content preview: ${uploadData.content.substring(0, 100)}...`);
      
      // Use proper encoding for URL parameters
      const encodedResume = encodeURIComponent(uploadData.content);
      const encodedJobPosting = encodeURIComponent(JSON.stringify(jobPosting));
      
      // Log the API input 
      logApiCall('getATSFeedback (request)', { 
        resumeLength: uploadData.content.length,
        resumePreview: uploadData.content.substring(0, 50) + '...',
        jobPostingTitle: jobPosting.title,
        encodedResumeLength: encodedResume.length,
        encodedJobPostingLength: encodedJobPosting.length
      }, 'Sending GET request with encoded parameters');
      
      // Using GET with properly encoded URL parameters
      const response = await fetch(`${API_BASE_URL}atsfeedback?resume=${encodedResume}&job_posting=${encodedJobPosting}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
        logApiCall('getATSFeedback (response)', { 
          jobPostingTitle: jobPosting.title 
        }, null, errorMessage);
        return { 
          error: errorMessage
        };
      }
      
      try {
        const data = JSON.parse(responseText);
        logApiCall('getATSFeedback (response)', { 
          jobPostingTitle: jobPosting.title 
        }, data);
        
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
        const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
        logApiCall('getATSFeedback (parse error)', { 
          jobPostingTitle: jobPosting.title 
        }, null, parseError);
        return { 
          error: errorMessage
        };
      }
    } catch (error) {
      console.error("Failed to get ATS feedback:", error);
      
      // Fallback to mock data if API call fails
      const fallbackData = {
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
      
      logApiCall('getATSFeedback (fallback)', { 
        jobPostingTitle: jobPosting.title 
      }, fallbackData, error);
      
      return {
        data: fallbackData,
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
      console.log(`Resume content preview for feedback: ${uploadData.content.substring(0, 100)}...`);
      
      // Log the API input
      logApiCall('getFeedback (request)', { 
        resumeLength: uploadData.content.length,
        resumePreview: uploadData.content.substring(0, 50) + '...',
        jobPostingTitle: jobPosting.title
      }, 'Sending POST request with JSON body');
      
      // UPDATED: Always use POST with body to avoid URL length limitations and encoding issues
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
        const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
        logApiCall('getFeedback (response)', { 
          jobPostingTitle: jobPosting.title 
        }, null, errorMessage);
        return { 
          error: errorMessage
        };
      }
      
      try {
        const data = JSON.parse(responseText);
        logApiCall('getFeedback (response)', { 
          jobPostingTitle: jobPosting.title 
        }, data);
        return { data };
      } catch (parseError) {
        const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
        logApiCall('getFeedback (parse error)', { 
          jobPostingTitle: jobPosting.title 
        }, null, parseError);
        return { 
          error: errorMessage
        };
      }
    } catch (error) {
      console.error("Failed to get optimization feedback:", error);
      
      // Fallback to mock data if API call fails
      const fallbackData = {
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
      };
      
      logApiCall('getFeedback (fallback)', { 
        jobPostingTitle: jobPosting.title 
      }, fallbackData, error);
      
      return {
        data: fallbackData,
        error: `API error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};
