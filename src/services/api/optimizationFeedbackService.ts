
import { JobPosting, UploadData, Feedback } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const getFeedback = async (jobPosting: JobPosting, uploadData: UploadData): Promise<ApiResponse<Feedback>> => {
  console.log('Getting optimization feedback');
  
  // Check if content is available
  if (!uploadData.content || uploadData.content.trim() === '') {
    console.error("Resume content is empty or undefined when calling getFeedback");
    return { error: "Resume content is missing" };
  }
  
  try {
    console.log(`Resume content length: ${uploadData.content.length} characters`);
    
    // Log the API input
    logApiCall('getFeedback (request)', { 
      resumeLength: uploadData.content.length,
      resumePreview: uploadData.content.substring(0, 50) + '...',
      jobPostingTitle: jobPosting.title
    }, 'Sending POST request with FormData');
    
    // Create FormData and append the job posting and resume file
    const formData = new FormData();
    
    // Convert resume content to a file-like object
    const resumeBlob = new Blob([uploadData.content], { type: 'text/plain' });
    const resumeFile = new File([resumeBlob], uploadData.filename || 'resume.txt', { type: 'text/plain' });
    
    // Add file to FormData
    formData.append('file', resumeFile);
    
    // Add job posting as JSON string
    formData.append('job_posting', JSON.stringify(jobPosting));
    
    const response = await fetch(`${API_BASE_URL}feedback`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        // No need to set Content-Type as FormData sets it automatically
      },
      body: formData
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
};
