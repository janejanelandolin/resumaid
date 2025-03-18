
import { JobPosting } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall } from './utils';

export const getJobPosting = async (jobTitle: string): Promise<JobPosting> => {
  console.log(`Making API call to get job posting for: ${jobTitle}`);
  
  try {
    // Use GET method with query parameter
    const params = new URLSearchParams();
    params.append('job_title', jobTitle);
    
    const response = await fetch(`${API_BASE_URL}job_posting?${params.toString()}`, {
      method: 'GET',  // Changed to GET since we're using query parameters
      headers: {
        'accept': 'application/json',
      }
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
};
