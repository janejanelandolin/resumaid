
import { ResumeJson } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

// Define the response type from the tailor_resume endpoint
interface TailorResumeResponse {
  changes: string[];
  resume: ResumeJson;
}

export const tailorResume = async (resumeJson: ResumeJson, jobPostingText: string): Promise<ApiResponse<TailorResumeResponse>> => {
  console.log('Tailoring resume to job posting');
  
  try {
    // Prepare the query parameter - encode the job posting text
    const encodedJobPosting = encodeURIComponent(jobPostingText);
    const url = `${API_BASE_URL}tailor_resume?job_posting=${encodedJobPosting}`;
    
    // Log the API call request
    logApiCall('tailorResume (request)', { 
      jobPostingLength: jobPostingText.length,
      jobPostingPreview: jobPostingText.substring(0, 50) + '...',
      resumeJson: 'ResumeJson object (not shown for brevity)',
      endpoint: url
    }, 'Sending POST request with resume JSON in body and job_posting as query parameter');
    
    // Send the request with job posting as query parameter and resume JSON in body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(resumeJson)
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
      logApiCall('tailorResume (response)', { 
        jobPostingLength: jobPostingText.length 
      }, null, errorMessage);
      return { 
        error: errorMessage
      };
    }
    
    try {
      const data = JSON.parse(responseText) as TailorResumeResponse;
      logApiCall('tailorResume (response)', { 
        jobPostingLength: jobPostingText.length,
        changes: data.changes
      }, data);
      
      return { data };
    } catch (parseError) {
      const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
      logApiCall('tailorResume (parse error)', { 
        jobPostingLength: jobPostingText.length 
      }, null, parseError);
      return { 
        error: errorMessage
      };
    }
  } catch (error) {
    console.error("Failed to tailor resume:", error);
    
    // Fallback to mock data if API call fails - improve original resumeJson
    const fallbackData = {
      changes: [
        "Added relevant keywords to align with job requirements",
        "Restructured work experience to highlight relevant accomplishments",
        "Enhanced summary to better match job description"
      ],
      resume: resumeJson ? {
        ...resumeJson,
        basics: {
          ...resumeJson.basics,
          summary: resumeJson.basics.summary 
            ? resumeJson.basics.summary + " Expertise in team leadership and project management."
            : "Experienced professional with expertise in team leadership and project management."
        },
        skills: [
          ...(resumeJson.skills || []),
          {
            name: "Leadership",
            keywords: ["Team Management", "Project Planning", "Strategic Decision Making"]
          }
        ],
        // Ensure work items have correct structure in fallback
        work: resumeJson.work ? resumeJson.work.map(item => ({
          ...item,
          name: item.company || item.name || "Example Corporation"
        })) : []
      } : null
    };
    
    logApiCall('tailorResume (fallback)', { 
      jobPostingLength: jobPostingText.length 
    }, fallbackData, error);
    
    return {
      data: fallbackData,
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
