
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useResumeApiProcessor = () => {
  const { toast } = useToast();
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
  ) => {
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
        throw new Error("Failed to process resume schema");
      }
    } else if (resumeSchemaResponse.data) {
      setResumeJson(resumeSchemaResponse.data);
    }
    
    // Format job posting as a simple string
    let jobPostingText = '';
    if (!jobPosting) {
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
      const scoreResponse = await apiService.scoreResume(resumeSchemaResponse.data, jobPostingText);
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
      
      // Step 4: Tailor the resume
      setProgress(80);
      setProgressText('Tailoring your resume to the job...');
      
      console.log("Sending tailor request with job posting length:", jobPostingText.length);
      console.log("Job posting preview:", jobPostingText.substring(0, 100) + '...');
      
      const tailorResponse = await apiService.tailorResume(resumeSchemaResponse.data, jobPostingText);
      console.log("Tailor response:", tailorResponse);
      
      if (tailorResponse.error) {
        const newErrors = [...apiErrors, `Tailor Error: ${tailorResponse.error}`];
        setApiErrors(newErrors);
        if (tailorResponse.data) {
          setTailoredResumeJson(tailorResponse.data);
        }
      } else if (tailorResponse.data) {
        setTailoredResumeJson(tailorResponse.data);
        
        // Step 5: Score the tailored resume
        setProgress(90);
        setProgressText('Evaluating optimized resume...');
        const tailoredScoreResponse = await apiService.scoreResume(tailorResponse.data, jobPostingText);
        
        if (tailoredScoreResponse.error) {
          const newErrors = [...apiErrors, `Tailored Score Error: ${tailoredScoreResponse.error}`];
          setApiErrors(newErrors);
          if (tailoredScoreResponse.data) {
            setTailoredScore(tailoredScoreResponse.data);
          }
        } else if (tailoredScoreResponse.data) {
          setTailoredScore(tailoredScoreResponse.data);
        }
      }
    }
    
    return true;
  }, [jobPosting, setResumeJson, setOriginalScore, setTailoredResumeJson, setTailoredScore]);

  return {
    processResumeContent
  };
};
