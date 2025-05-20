
/**
 * Main orchestrator hook for resume API processing workflow
 * Coordinates the content processing, scoring, and tailoring steps
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useResumeScoring } from './useResumeScoring';
import { useResumeTailoring } from './useResumeTailoring';
import { useResumeContentProcessor } from './useResumeContentProcessor';
import { useJobPostingPreparation } from './useJobPostingPreparation';

export const useResumeApiOrchestrator = () => {
  const { jobPosting } = useResumeContext();
  const { scoreResume } = useResumeScoring();
  const { tailorResume, tailoringRationale } = useResumeTailoring();
  const { processContent } = useResumeContentProcessor();
  const { prepareJobPosting } = useJobPostingPreparation();
  
  /**
   * Orchestrates the complete resume processing workflow
   */
  const processResumeContent = useCallback(async (
    extractedContent: string, 
    setApiErrors: (errors: string[]) => void,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[]
  ): Promise<boolean> => {
    let isSuccessful = true;
    
    try {
      // Step 1: Process the content to get structured resume data
      const resumeData = await processContent(
        extractedContent,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      if (!resumeData) {
        isSuccessful = false;
        throw new Error("Failed to process resume content");
      }
      
      // Format job posting as a simple string
      const jobPostingText = prepareJobPosting(jobPosting);
      
      // Step 2: Score the original resume
      await scoreResume(
        resumeData,
        jobPostingText,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      // Step 3: Tailor the resume and score the tailored version
      await tailorResume(
        resumeData,
        jobPostingText,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      return isSuccessful;
    } catch (error) {
      console.error("Error in resume processing workflow:", error);
      return false;
    }
  }, [jobPosting, processContent, scoreResume, tailorResume, prepareJobPosting]);

  return {
    processResumeContent,
    tailoringRationale
  };
};
