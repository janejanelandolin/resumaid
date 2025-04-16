
import { useCallback, useState } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useResumeApiProcessor = () => {
  const { toast } = useToast();
  const [tailoringRationale, setTailoringRationale] = useState<string[]>([]);
  
  const { 
    jobPosting,
    setResumeJson,
    setOriginalScore,
    setTailoredResumeJson,
    setTailoredScore
  } = useResumeContext();
  
  // Process the uploaded resume with the API
  const processResumeContent = useCallback(async (
    extractedContent: string, 
    setApiErrors: (errors: string[]) => void,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[]
  ): Promise<boolean> => {
    let isSuccessful = true;
    console.log("Content to process length:", extractedContent.length);
    console.log("Content preview:", extractedContent.substring(0, 100) + '...');
    
    // Step 2: Get Resume Schema - Using the extracted text content
    setProgress(40);
    setProgressText('Converting resume to structured format...');
    
    const resumeSchemaResponse = await apiService.getResumeSchema(extractedContent);
    console.log("Resume schema response:", resumeSchemaResponse);
    
    if (resumeSchemaResponse.error) {
      const newErrors = [...apiErrors, `Resume Schema Error: ${resumeSchemaResponse.error}`];
      setApiErrors(newErrors);
      if (resumeSchemaResponse.data) {
        setResumeJson(resumeSchemaResponse.data);
      } else {
        isSuccessful = false;
        throw new Error("Failed to process resume schema");
      }
    } else if (resumeSchemaResponse.data) {
      setResumeJson(resumeSchemaResponse.data);
    }
    
    // Format job posting as a simple string
    let jobPostingText = '';
    if (!jobPosting) {
      isSuccessful = false;
      throw new Error("No job posting available");
    }
    
    if (jobPosting.userProvided && jobPosting.description) {
      jobPostingText = jobPosting.description;
    } else if (jobPosting.description) {
      jobPostingText = jobPosting.description;
    } else {
      jobPostingText = jobPosting.title || '';
      
      if (jobPosting.requirements && jobPosting.requirements.length > 0) {
        jobPostingText += `\n\nRequirements:\n${jobPosting.requirements.join('\n')}`;
      }
      
      if (jobPosting.skills && jobPosting.skills.length > 0) {
        jobPostingText += `\n\nSkills:\n${jobPosting.skills.join('\n')}`;
      }
    }
    
    // Step 3: Score the original resume
    setProgress(60);
    setProgressText('Scoring your resume...');
    
    if (resumeSchemaResponse.data) {
      try {
        // Ensure the resume data has a 'skills' array property if it doesn't exist
        const resumeDataWithValidSkills = { 
          ...resumeSchemaResponse.data,
          skills: Array.isArray(resumeSchemaResponse.data.skills) 
            ? resumeSchemaResponse.data.skills 
            : []
        };
        
        const scoreResponse = await apiService.scoreResume(resumeDataWithValidSkills, jobPostingText);
        console.log("Score response:", scoreResponse);
        
        if (scoreResponse.error) {
          const newErrors = [...apiErrors, `Score Error: ${scoreResponse.error}`];
          setApiErrors(newErrors);
          if (scoreResponse.data) {
            setOriginalScore(scoreResponse.data);
          }
        } else if (scoreResponse.data) {
          setOriginalScore(scoreResponse.data);
        }
      } catch (error) {
        console.error("Error scoring resume:", error);
        const newErrors = [...apiErrors, `Score Error: ${error instanceof Error ? error.message : String(error)}`];
        setApiErrors(newErrors);
        // Continue processing even if scoring fails
      }
      
      // Step 4: Tailor the resume
      setProgress(80);
      setProgressText('Tailoring your resume to the job...');
      
      console.log("Sending tailor request with job posting length:", jobPostingText.length);
      console.log("Job posting preview:", jobPostingText.substring(0, 100) + '...');
      
      try {
        // Ensure the resume data has a 'skills' array property
        const resumeDataWithValidSkills = { 
          ...resumeSchemaResponse.data,
          skills: Array.isArray(resumeSchemaResponse.data.skills) 
            ? resumeSchemaResponse.data.skills 
            : []
        };
        
        const tailorResponse = await apiService.tailorResume(resumeDataWithValidSkills, jobPostingText);
        console.log("Tailor response:", tailorResponse);
        
        if (tailorResponse.error) {
          const newErrors = [...apiErrors, `Tailor Error: ${tailorResponse.error}`];
          setApiErrors(newErrors);
          if (tailorResponse.data && tailorResponse.data.resume) {
            // Extract just the resume object from the response
            setTailoredResumeJson(tailorResponse.data.resume);
            // Store the rationale for UI display if needed
            if (tailorResponse.data.rationale) {
              setTailoringRationale(tailorResponse.data.rationale);
            }
          }
        } else if (tailorResponse.data) {
          // Extract just the resume object from the response
          setTailoredResumeJson(tailorResponse.data.resume);
          // Store the rationale for UI display if needed
          if (tailorResponse.data.rationale) {
            setTailoringRationale(tailorResponse.data.rationale);
          }
          
          // Step 5: Score the tailored resume
          setProgress(90);
          setProgressText('Evaluating optimized resume...');
          
          try {
            // Ensure the tailored resume has a skills array
            const tailoredResumeWithValidSkills = {
              ...tailorResponse.data.resume,
              skills: Array.isArray(tailorResponse.data.resume.skills) 
                ? tailorResponse.data.resume.skills 
                : []
            };
            
            // Use the resume object from the tailor response
            const tailoredScoreResponse = await apiService.scoreResume(
              tailoredResumeWithValidSkills, 
              jobPostingText
            );
            
            if (tailoredScoreResponse.error) {
              const newErrors = [...apiErrors, `Tailored Score Error: ${tailoredScoreResponse.error}`];
              setApiErrors(newErrors);
              if (tailoredScoreResponse.data) {
                setTailoredScore(tailoredScoreResponse.data);
              }
            } else if (tailoredScoreResponse.data) {
              setTailoredScore(tailoredScoreResponse.data);
            }
          } catch (error) {
            console.error("Error scoring tailored resume:", error);
            const newErrors = [...apiErrors, `Tailored Score Error: ${error instanceof Error ? error.message : String(error)}`];
            setApiErrors(newErrors);
            // Continue processing even if tailored scoring fails
          }
        }
      } catch (error) {
        console.error("Error tailoring resume:", error);
        const newErrors = [...apiErrors, `Tailor Error: ${error instanceof Error ? error.message : String(error)}`];
        setApiErrors(newErrors);
        // Set as partial success since we at least have the original resume
        isSuccessful = resumeSchemaResponse.data !== null;
      }
    }
    
    return isSuccessful;
  }, [jobPosting, setResumeJson, setOriginalScore, setTailoredResumeJson, setTailoredScore]);

  return {
    processResumeContent,
    tailoringRationale
  };
};
