
/**
 * Main hook for processing resume with APIs
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { formatJobPostingAsText } from './useResumeNormalizer';
import { useResumeScoring } from './useResumeScoring';
import { useResumeTailoring } from './useResumeTailoring';
import { useResumeContentProcessor } from './useResumeContentProcessor';

export const useResumeApiProcessor = () => {
  const { 
    jobPosting,
  } = useResumeContext();
  
  const { scoreResume } = useResumeScoring();
  const { tailorResume, tailoringRationale } = useResumeTailoring();
  const { processContent } = useResumeContentProcessor();
  
  // Process the uploaded resume with the API
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
      let jobPostingText = '';
      try {
        jobPostingText = formatJobPostingAsText(jobPosting);
      } catch (error) {
        isSuccessful = false;
        throw error;
      }
      
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
  }, [jobPosting, processContent, scoreResume, tailorResume]);

  return {
    processResumeContent,
    tailoringRationale
  };
};
