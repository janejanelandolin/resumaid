
import { JobPosting, UploadData, ATSFeedback } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const getATSFeedback = async (jobPosting: JobPosting, uploadData: UploadData): Promise<ApiResponse<ATSFeedback>> => {
  console.log('Getting ATS feedback');
  
  // Check if content is available
  if (!uploadData.content || uploadData.content.trim() === '') {
    console.error("Resume content is empty or undefined when calling getATSFeedback");
    return { error: "Resume content is missing" };
  }
  
  try {
    console.log(`Resume content preview: ${uploadData.content.substring(0, 100)}...`);
    
    // Log the API call request
    logApiCall('getATSFeedback (request)', { 
      resumeLength: uploadData.content.length,
      resumePreview: uploadData.content.substring(0, 50) + '...',
      jobPostingTitle: jobPosting.title
    }, 'Sending POST request with query params');
    
    // Pass parameters as query params
    const url = new URL(`${API_BASE_URL}atsfeedback`);
    url.searchParams.append('resume', uploadData.content);
    url.searchParams.append('job_posting', JSON.stringify(jobPosting));
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
      logApiCall('getATSFeedback (response)', { 
        jobPostingTitle: jobPosting.title 
      }, null, errorMessage);
      return { 
        error: errorMessage
      };
    }
    
    try {
      const data = JSON.parse(responseText);
      logApiCall('getATSFeedback (response)', { 
        jobPostingTitle: jobPosting.title 
      }, data);
      
      // Add backwards compatibility for existing code that expects similarity property
      if (data.JobPostingFulltext_ResumeFulltext_similarity !== undefined && data.similarity === undefined) {
        data.similarity = data.JobPostingFulltext_ResumeFulltext_similarity;
      }
      
      // Add backwards compatibility for existing code that expects keywords_missing property
      if (data.missing_keywords !== undefined && data.keywords_missing === undefined) {
        data.keywords_missing = data.missing_keywords;
      }
      
      return { data };
    } catch (parseError) {
      const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
      logApiCall('getATSFeedback (parse error)', { 
        jobPostingTitle: jobPosting.title 
      }, null, parseError);
      return { 
        error: errorMessage
      };
    }
  } catch (error) {
    console.error("Failed to get ATS feedback:", error);
    
    // Fallback to mock data if API call fails
    const fallbackData = {
      qualification: "Unqualified",
      JobPostingFulltext_ResumeFulltext_similarity: 0.39,
      JobPostingKeyword_ResumeKeyword_similarity: 0.03,
      JobPostingKeyword_ResumeFulltext_similarity: 0.02,
      missing_keywords: [
        "revenue growth",
        "key alliances",
        "ccm strategic",
        "nicetohaves experience",
        "cpq",
        "partner communication",
        "alignment",
        "recruit",
        "partner conflicts",
        "this role",
        "strong relationships"
      ],
      // For backward compatibility
      similarity: 0.39,
      keywords_missing: [
        "revenue growth",
        "key alliances",
        "ccm strategic",
        "partner communication"
      ],
      format_issues: [
        'Resume lacks proper section headers',
        'Content is not well organized'
      ]
    };
    
    logApiCall('getATSFeedback (fallback)', { 
      jobPostingTitle: jobPosting.title 
    }, fallbackData, error);
    
    return {
      data: fallbackData,
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
