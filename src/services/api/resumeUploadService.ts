
import { UploadData } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const uploadResume = async (file: File): Promise<ApiResponse<UploadData>> => {
  console.log(`Uploading resume: ${file.name} (${file.type}) - Size: ${file.size} bytes`);
  
  try {
    const formData = new FormData();
    formData.append('file', file); // Use 'file' as the field name to match API expectation
    
    console.log("Upload endpoint:", `${API_BASE_URL}upload`);
    logApiCall('uploadResume (request)', { 
      fileName: file.name, 
      fileType: file.type, 
      fileSize: file.size 
    }, 'FormData object (not shown for brevity)');
    
    const response = await fetch(`${API_BASE_URL}upload`, {
      method: 'POST',
      body: formData
      // Don't set Content-Type header, let the browser set it with the boundary
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
      
      // If we can't parse the response but it was successful, try to extract content
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string || '';
          console.log("Extracted content locally after parse error, length:", content.length);
          
          const localResult = {
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            content: content
          };
          
          logApiCall('uploadResume (parse error fallback)', { 
            fileName: file.name 
          }, { contentLength: content.length, id: localResult.id });
          
          resolve({
            data: localResult,
            error: `Failed to parse server response: ${responseText.substring(0, 100)}...`
          });
        };
        reader.readAsText(file);
      });
    }
    
    // Log the result for debugging
    logApiCall('uploadResume (response)', { 
      fileName: file.name 
    }, result);
    
    // Check if content is empty or undefined
    if (!result.content || result.content.trim() === '') {
      console.warn("Resume content is empty or undefined in API response, reading file locally");
      
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
          
          logApiCall('uploadResume (local content fallback)', { 
            fileName: file.name 
          }, { contentLength: content.length, id: localResult.id });
          
          resolve({
            data: localResult
          });
        };
        
        // For PDFs and binary files, attempt to read as text but we might not get good results
        if (file.type === 'application/pdf' || file.type.includes('word')) {
          console.log("Binary file detected, attempting to read as text");
        }
        
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
};
