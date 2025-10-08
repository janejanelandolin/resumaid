
import { UploadData } from '../../types/resume';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const uploadResume = async (file: File): Promise<ApiResponse<UploadData>> => {
  console.log(`Uploading resume: ${file.name} (${file.type}) - Size: ${file.size} bytes`);
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log("Upload endpoint:", `${API_BASE_URL}upload`);
    logApiCall('uploadResume (request)', { 
      fileName: file.name, 
      fileType: file.type, 
      fileSize: file.size 
    }, 'FormData object (not shown for brevity)');
    
    // Log the form data entries to verify content
    for (const pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
    }
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Don't set Content-Type header, let the browser set it with the boundary
    });
    
    clearTimeout(timeoutId);
    
    console.log("Upload response status:", response.status);
    console.log("Upload response headers:", [...response.headers.entries()]);
    
    // Store the raw response text for potential error debugging
    const responseText = await response.text();
    console.log("Upload raw response:", responseText.substring(0, 200) + '...');
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} - ${responseText.substring(0, 200) || 'No error details'}`;
      logApiCall('uploadResume (response)', { 
        fileName: file.name 
      }, null, errorMessage);
      return {
        error: errorMessage
      };
    }
    
    // The response is now a plain text string (extracted resume content)
    // Create an UploadData object with the response text as content
    const uploadData: UploadData = {
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      content: responseText,
      text: responseText // For backward compatibility
    };
    
    logApiCall('uploadResume (response)', { 
      fileName: file.name 
    }, { contentLength: responseText.length, id: uploadData.id });
    
    return { data: uploadData };
    
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    console.error(`Failed to upload resume${isTimeout ? ' (timeout)' : ''}:`, error);
    
    // If API call fails or times out, read the file locally as fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        console.log("Using fallback content extraction, length:", content.length);
        
        const localResult = {
          id: Math.random().toString(36).substr(2, 9),
          filename: file.name,
          content: content,
          text: content // For backward compatibility
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
};
