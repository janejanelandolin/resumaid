import { JobPosting, UploadData, Feedback } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const getFeedback = async (jobPosting: JobPosting, uploadData: UploadData): Promise<ApiResponse<Feedback>> => {
  console.log('Getting optimization feedback');
  
  if (!uploadData.content || uploadData.content.trim() === '') {
    console.error("Resume content is empty or undefined when calling getFeedback");
    return { error: "Resume content is missing" };
  }
  
  try {
    // Log the API call request
    logApiCall('getFeedback (request)', { 
      resumeLength: uploadData.content.length,
      resumePreview: uploadData.content.substring(0, 50) + '...',
      jobPostingTitle: jobPosting.title
    }, 'Sending POST request with query parameters');
    
    // Build query parameters - using exactly 'resume' and 'job_posting' as parameter names
    const params = new URLSearchParams();
    params.append('resume', uploadData.content);
    
    // For job posting, we want to prioritize the description field from jobPosting object
    // This handles both API-generated job postings and user-entered text
    const jobPostingContent = jobPosting.description || '';
    console.log('Job posting being sent:', jobPostingContent.substring(0, 100) + '...');
    
    params.append('job_posting', jobPostingContent);
    
    // Send as POST with query parameters in the URL
    const response = await fetch(`${API_BASE_URL}feedback?${params.toString()}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      }
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
    console.error("Failed to get feedback:", error);
    
    // Fallback to mock data if API call fails
    const fallbackData = {
      similarity: 0.45,
      score_reason: "Your resume shows some relevant experience but is missing key skills and experiences that the job requires.",
      qualification: "Somewhat qualified",
      suggested_edits: [
        {
          section: "Skills",
          suggestion: "Highlight partner management experience and communication skills",
          edit_reason: "The job posting emphasizes partner relationships and communication",
          resume_line_old: "Computing Linux (bash), Amazon Web Services",
          resume_line_new: "Partner Management, Strategic Communications, Computing Linux (bash), Amazon Web Services"
        },
        {
          section: "Experience",
          suggestion: "Emphasize team leadership and stakeholder management",
          edit_reason: "The job requires managing relationships with multiple stakeholders",
          resume_line_old: "Directed team of 14 engineers and scientists with 3 direct reports/team leads.",
          resume_line_new: "Directed cross-functional team of 14 engineers and scientists, managing key stakeholder relationships and strategic partnerships."
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
