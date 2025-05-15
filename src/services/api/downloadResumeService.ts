
import { ResumeJson } from '@/types/resume';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const downloadResumeAsDocx = async (resumeJson: ResumeJson, jobTitle: string): Promise<ApiResponse<Blob>> => {
  console.log('Downloading resume as DOCX');
  
  try {
    const url = `${API_BASE_URL}docx`;
    
    // Log the API call request with more details
    logApiCall('downloadResumeAsDocx (request)', { 
      resumeBasics: resumeJson.basics ? { 
        name: resumeJson.basics.name,
        hasEmail: !!resumeJson.basics.email,
        hasPhone: !!resumeJson.basics.phone,
        hasSummary: !!resumeJson.basics.summary
      } : 'Missing basics',
      workExperience: resumeJson.work ? `${resumeJson.work.length} entries` : 'No work entries',
      endpoint: url
    }, 'Sending POST request with resume JSON to convert to DOCX');
    
    // Send request with resume as JSON in body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'  // Changed from application/octet-stream to application/json
      },
      body: JSON.stringify(resumeJson)  // Send the resume JSON directly
    });
    
    // Enhanced error handling with status text
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      const errorMessage = `API error: ${response.status} - ${response.statusText}. Details: ${errorText}`;
      console.error("DOCX download failed:", errorMessage);
      logApiCall('downloadResumeAsDocx (response)', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, null, errorMessage);
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

