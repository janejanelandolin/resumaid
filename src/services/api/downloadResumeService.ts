
import { ResumeJson } from '@/types/resume';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const downloadResumeAsDocx = async (resumeJson: ResumeJson, jobTitle: string): Promise<ApiResponse<Blob>> => {
  console.log('Downloading resume as DOCX');
  
  try {
    const url = `${API_BASE_URL}docx`;
    
    // Log the API call request
    logApiCall('downloadResumeAsDocx (request)', { 
      resumeJson: 'ResumeJson object (not shown for brevity)',
      endpoint: url
    }, 'Sending POST request with resume JSON to convert to DOCX');
    
    // Send request with resume as JSON in body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/octet-stream',
      },
      body: JSON.stringify(resumeJson)
    });
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status}`;
      logApiCall('downloadResumeAsDocx (response)', {}, null, errorMessage);
      return { error: errorMessage };
    }
    
    // Get blob from response
    const blob = await response.blob();
    logApiCall('downloadResumeAsDocx (response)', { 
      contentType: blob.type,
      size: `${Math.round(blob.size / 1024)}KB`
    }, 'Successfully received DOCX file');
    
    return { data: blob };
  } catch (error) {
    console.error("Failed to download resume as DOCX:", error);
    
    logApiCall('downloadResumeAsDocx (error)', {}, null, error);
    
    return {
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Update the API service index to expose the new function
