import { JobPosting, UploadData, Feedback } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const getFeedback = async (jobPosting: JobPosting, uploadData: UploadData): Promise<ApiResponse<Feedback>> => {
  console.log('Getting optimization feedback');
  
  if (!uploadData.content || uploadData.content.trim() === '') {
    console.error("Resume content is empty or undefined when calling getFeedback");
    return { error: "Resume content is missing" };
  }
  
  try {
    // Format job posting as a simple string - prioritizing user input if available
    let jobPostingContent = '';
    
    if (jobPosting) {
      // If it's user-provided, use it directly
      if (jobPosting.userProvided && jobPosting.description) {
        jobPostingContent = jobPosting.description;
        console.log('Using user-provided job posting text');
      }
      // Otherwise, if it's a full job posting object from API, use description or format as string
      else if (jobPosting.description) {
        jobPostingContent = jobPosting.description;
        console.log('Using job posting description from API');
      } else {
        // Fallback to constructing a string from parts
        jobPostingContent = jobPosting.title || '';
        
        // Add requirements if available
        if (jobPosting.requirements && jobPosting.requirements.length > 0) {
          jobPostingContent += `\n\nRequirements:\n${jobPosting.requirements.join('\n')}`;
        }
        
        // Add skills if available
        if (jobPosting.skills && jobPosting.skills.length > 0) {
          jobPostingContent += `\n\nSkills:\n${jobPosting.skills.join('\n')}`;
        }
        console.log('Using constructed job posting string from title and details');
      }
    }
    
    console.log(`Job posting content type: ${jobPosting.userProvided ? 'user-provided' : 'API-generated'}`);
    console.log('Job posting preview:', jobPostingContent.substring(0, 100) + '...');
    
    // Log the API call request
    logApiCall('getFeedback (request)', { 
      resumeLength: uploadData.content.length,
      resumePreview: uploadData.content.substring(0, 50) + '...',
      jobPostingTitle: jobPosting.title,
      jobPostingContentPreview: jobPostingContent.substring(0, 50) + '...',
      jobPostingSource: jobPosting.userProvided ? 'user-provided' : 'API-generated'
    }, 'Sending POST request with request body');
    
    // FIX: Send as POST with request body instead of query parameters
    const response = await fetch(`${API_BASE_URL}feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        resume: uploadData.content,
        job_posting: jobPostingContent
      })
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
    const fallbackData: Feedback = {
      format_issues: [
        'Resume lacks proper section headers',
        'Content is not well organized',
        'Skills section needs to be more prominent'
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
