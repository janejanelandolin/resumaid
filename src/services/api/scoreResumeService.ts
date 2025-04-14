
import { ScoreResponse, ResumeJson } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const scoreResume = async (resumeJson: ResumeJson, jobPostingText: string): Promise<ApiResponse<ScoreResponse>> => {
  console.log('Scoring resume against job posting');
  
  try {
    // Prepare the query parameter - encode the job posting text
    const encodedJobPosting = encodeURIComponent(jobPostingText);
    const url = `${API_BASE_URL}score_resume?job_posting=${encodedJobPosting}`;
    
    // Log the API call request
    logApiCall('scoreResume (request)', { 
      jobPostingLength: jobPostingText.length,
      jobPostingPreview: jobPostingText.substring(0, 50) + '...',
      resumeJsonPreview: 'ResumeJson object (not shown for brevity)',
      endpoint: url
    }, 'Sending POST request with resume JSON in body and job_posting as query parameter');
    
    // Send the resume JSON in the body and job posting as query parameter
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
      logApiCall('scoreResume (response)', { 
        jobPostingLength: jobPostingText.length 
      }, null, errorMessage);
      return { 
        error: errorMessage
      };
    }
    
    try {
      const data = JSON.parse(responseText);
      logApiCall('scoreResume (response)', { 
        jobPostingLength: jobPostingText.length 
      }, data);
      
      return { data };
    } catch (parseError) {
      const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
      logApiCall('scoreResume (parse error)', { 
        jobPostingLength: jobPostingText.length 
      }, null, parseError);
      return { 
        error: errorMessage
      };
    }
  } catch (error) {
    console.error("Failed to score resume:", error);
    
    // Fallback to mock data if API call fails
    const fallbackData = {
      score: 0.65,
      qualification: "Somewhat qualified",
      missing_keywords: ["leadership", "team management", "project planning"],
      explanation: "Your resume shows some relevant skills but is missing key qualifications required for this position."
    };
    
    logApiCall('scoreResume (fallback)', { 
      jobPostingLength: jobPostingText.length 
    }, fallbackData, error);
    
    return {
      data: fallbackData,
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
