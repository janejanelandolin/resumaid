
import { ResumeJson } from '../../contexts/ResumeContext';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const tailorResume = async (resumeJson: ResumeJson, jobPostingText: string): Promise<ApiResponse<ResumeJson>> => {
  console.log('Tailoring resume to job posting');
  
  try {
    // Prepare the query parameter
    const params = new URLSearchParams();
    params.append('job_posting', jobPostingText);
    
    // Ensure resumeJson has the correct structure
    // Make a copy to avoid modifying the original
    const processedResumeJson = { ...resumeJson };
    
    // Ensure work items have 'name' field
    if (processedResumeJson.work && Array.isArray(processedResumeJson.work)) {
      processedResumeJson.work = processedResumeJson.work.map(item => {
        if (item.company && !item.name) {
          return {
            ...item,
            name: item.company // Copy company to name if needed
          };
        }
        return item;
      });
    }
    
    // Log the API call request
    logApiCall('tailorResume (request)', { 
      jobPostingLength: jobPostingText.length,
      jobPostingPreview: jobPostingText.substring(0, 50) + '...',
      resumeJson: 'ResumeJson object (not shown for brevity)'
    }, 'Sending POST request with request body and query parameter');
    
    const response = await fetch(`${API_BASE_URL}tailor_resume?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(processedResumeJson)
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} - ${responseText || 'No error details'}`;
      logApiCall('tailorResume (response)', { 
        jobPostingLength: jobPostingText.length 
      }, null, errorMessage);
      return { 
        error: errorMessage
      };
    }
    
    try {
      const data = JSON.parse(responseText);
      logApiCall('tailorResume (response)', { 
        jobPostingLength: jobPostingText.length 
      }, data);
      
      return { data };
    } catch (parseError) {
      const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
      logApiCall('tailorResume (parse error)', { 
        jobPostingLength: jobPostingText.length 
      }, null, parseError);
      return { 
        error: errorMessage
      };
    }
  } catch (error) {
    console.error("Failed to tailor resume:", error);
    
    // Fallback to mock data if API call fails - improve original resumeJson
    const fallbackData = resumeJson ? {
      ...resumeJson,
      basics: {
        ...resumeJson.basics,
        summary: resumeJson.basics.summary 
          ? resumeJson.basics.summary + " Expertise in team leadership and project management."
          : "Experienced professional with expertise in team leadership and project management."
      },
      skills: [
        ...(resumeJson.skills || []),
        {
          name: "Leadership",
          keywords: ["Team Management", "Project Planning", "Strategic Decision Making"]
        }
      ],
      // Ensure work items have correct structure in fallback
      work: resumeJson.work ? resumeJson.work.map(item => ({
        ...item,
        name: item.company || item.name || "Example Corporation"
      })) : []
    } : null;
    
    logApiCall('tailorResume (fallback)', { 
      jobPostingLength: jobPostingText.length 
    }, fallbackData, error);
    
    return {
      data: fallbackData || {
        basics: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "(555) 123-4567",
          summary: "Experienced professional with expertise in team leadership and project management."
        },
        work: [
          {
            name: "Example Corporation", // Use name instead of company
            position: "Senior Developer",
            startDate: "2020-01",
            endDate: "2023-04",
            summary: "Led key initiatives and projects.",
            highlights: ["Increased revenue by 20%", "Managed a team of 5"]
          }
        ],
        education: [],
        skills: [
          {
            name: "Leadership",
            keywords: ["Team Management", "Project Planning", "Strategic Decision Making"]
          }
        ]
      },
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
