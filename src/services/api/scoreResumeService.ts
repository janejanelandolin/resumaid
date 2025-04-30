
import { ScoreResponse, ResumeJson } from '../../types/resume';
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
      
      // Map from backend format to our expected format if needed
      const mappedData: ScoreResponse = {
        missing_keywords: data.missing_keywords || [],
        explanation: data.score_reason || data.explanation || "",
        similarity: data.similarity || 0,
        // Keep original fields too
        evaluatorA_qualification: data.evaluatorA_qualification,
        evaluatorB_qualification: data.evaluatorB_qualification,
        evaluatorC_qualification: data.evaluatorC_qualification,
        consensus_qualification: data.consensus_qualification,
      };
      
      console.log('Score response mapped data:', mappedData);
      
      return { data: mappedData };
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
      missing_keywords: ["leadership", "team management", "project planning"],
      explanation: "Your resume shows some relevant skills but is missing key qualifications required for this position.",
      similarity: 0.65,
      consensus_qualification: "Potentially Qualified"
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
