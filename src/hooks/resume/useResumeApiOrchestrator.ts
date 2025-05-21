
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
      setProgressText('Analyzing resume content...');
      const resumeData = await processContent(
        extractedContent,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      if (!resumeData) {
        console.error("Failed to process resume content - no data returned");
        isSuccessful = false;
        return false;
      }
      
      // Format job posting as a simple string
      const jobPostingText = prepareJobPosting(jobPosting);
      if (!jobPostingText) {
        console.error("Failed to prepare job posting text");
        isSuccessful = false;
        return false;
      }
      
      // Step 2 & 3: Score the original resume AND tailor the resume in parallel
      setProgressText('Processing resume in parallel...');
      
      console.log("Starting parallel processing of scoring and tailoring");
      
      // Run both API calls in parallel
      const [scoreResult, tailorResult] = await Promise.all([
        // Score original resume
        scoreResume(
          resumeData,
          jobPostingText,
          (progress) => setProgress(40 + progress * 0.2), // Scale to 40-60% range
          setProgressText,
          apiErrors,
          setApiErrors
        ),
        
        // Tailor resume simultaneously
        tailorResume(
          resumeData,
          jobPostingText,
          (progress) => setProgress(60 + progress * 0.3), // Scale to 60-90% range
          setProgressText,
          apiErrors,
          setApiErrors,
          false // Don't auto-score the tailored resume here
        )
      ]);
      
      // Check if both operations succeeded
      isSuccessful = scoreResult && tailorResult.success;
      
      // If we successfully tailored the resume, score the tailored version
      if (tailorResult.success && tailorResult.tailoredResume) {
        // Step 4: Score the tailored resume
        setProgressText('Evaluating optimized resume...');
        await scoreResume(
          tailorResult.tailoredResume,
          jobPostingText,
          (progress) => setProgress(90 + progress * 0.1), // Scale to 90-100% range
          setProgressText,
          apiErrors,
          setApiErrors,
          true // This is the tailored version
        );
      }
      
      // Ensure we tell the caller if we were successful
      console.log("Resume processing workflow complete, success:", isSuccessful);
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
