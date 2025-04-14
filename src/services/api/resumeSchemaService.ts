
import { ResumeJson } from '../../types/resume';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export const getResumeSchema = async (resumeText: string): Promise<ApiResponse<ResumeJson>> => {
  console.log('Converting resume text to schema');
  
  try {
    // Prepare the body for a POST request with the resume_text in the body
    const requestBody = { resume_text: resumeText };
    
    // Log the API call request
    logApiCall('getResumeSchema (request)', { 
      resumeTextLength: resumeText.length,
      resumeTextPreview: resumeText.substring(0, 50) + '...'
    }, 'Sending POST request with request body');
    
    // Make a POST request with the text in the body
    const response = await fetch(`${API_BASE_URL}resume_schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Resume schema response status:", response.status);
    
    const responseText = await response.text();
    console.log("Resume schema raw response:", responseText.substring(0, 100) + '...');
    
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} - ${responseText.substring(0, 200) || 'No error details'}`;
      logApiCall('getResumeSchema (response)', { 
        resumeTextLength: resumeText.length 
      }, null, errorMessage);
      return { 
        error: errorMessage
      };
    }
    
    try {
      const data = JSON.parse(responseText);
      logApiCall('getResumeSchema (response)', { 
        resumeTextLength: resumeText.length 
      }, data);
      
      return { data };
    } catch (parseError) {
      console.error("Failed to parse server response:", parseError);
      const errorMessage = `Failed to parse server response: ${responseText.substring(0, 100)}...`;
      logApiCall('getResumeSchema (parse error)', { 
        resumeTextLength: resumeText.length 
      }, null, parseError);
      return { 
        error: errorMessage
      };
    }
  } catch (error) {
    console.error("Failed to get resume schema:", error);
    
    // Fallback to mock data if API call fails
    const fallbackData = {
      basics: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        summary: "Experienced professional with a track record of success."
      },
      work: [
        {
          name: "Example Corporation", // Use "name" for the company name (not "company")
          position: "Senior Developer",
          startDate: "2020-01",
          endDate: "2023-04",
          summary: "Led key initiatives and projects.",
          highlights: ["Increased revenue by 20%", "Managed a team of 5"]
        }
      ],
      education: [
        {
          institution: "University of Example",
          area: "Computer Science",
          studyType: "Bachelor",
          startDate: "2014-09",
          endDate: "2018-05"
        }
      ],
      skills: [
        {
          name: "Programming",
          keywords: ["JavaScript", "TypeScript", "React"]
        },
        {
          name: "Soft Skills",
          keywords: ["Leadership", "Communication", "Problem Solving"]
        }
      ]
    };
    
    logApiCall('getResumeSchema (fallback)', { 
      resumeTextLength: resumeText.length 
    }, fallbackData, error);
    
    return {
      data: fallbackData,
      error: `API error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
