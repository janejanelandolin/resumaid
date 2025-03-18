
import { JobPosting } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall } from './utils';

export const getJobPosting = async (jobTitle: string): Promise<JobPosting> => {
  console.log(`Making API call to get job posting for: ${jobTitle}`);
  
  try {
    // Use POST method with query parameter
    const params = new URLSearchParams();
    params.append('job_title', jobTitle);
    
    const response = await fetch(`${API_BASE_URL}job_posting?${params.toString()}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText || 'No error details'}`);
    }
    
    // Parse the response text to handle various response formats
    const responseText = await response.text();
    let result;
    
    try {
      // Try to parse as JSON
      result = JSON.parse(responseText);
      
      // If the response is a string wrapped in quotes, try to parse it again
      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch (e) {
          // If it's just a string, it's fine - create a job posting object with it
          console.log("Response was a string, using as is");
          result = {
            title: jobTitle,
            description: result,
            requirements: [],
            skills: []
          };
        }
      }
      
      // Ensure the result has all required fields
      if (!result.title) {
        result.title = jobTitle;
      }
      
      if (!result.description && typeof result === 'object') {
        // Create a description string from the object
        let descriptionParts = [];
        
        if (result.title) {
          descriptionParts.push(`Title: ${result.title}`);
        }
        
        if (result.requirements && Array.isArray(result.requirements)) {
          descriptionParts.push(`Requirements: ${result.requirements.join(', ')}`);
        }
        
        if (result.skills && Array.isArray(result.skills)) {
          descriptionParts.push(`Skills: ${result.skills.join(', ')}`);
        }
        
        // If we have parts, join them to create the description
        if (descriptionParts.length > 0) {
          result.description = descriptionParts.join('\n\n');
        } else {
          // Fallback description if no content is available
          result.description = `Position for ${jobTitle}`;
        }
      }
      
      // Ensure requirements and skills are arrays
      if (!result.requirements || !Array.isArray(result.requirements)) {
        result.requirements = [];
      }
      
      if (!result.skills || !Array.isArray(result.skills)) {
        result.skills = [];
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      // If parsing fails, use the raw text
      result = { 
        title: jobTitle,
        description: responseText,
        requirements: [],
        skills: []
      };
    }
    
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
};
