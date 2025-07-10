
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
  ): Promise<{ success: boolean; resumeData: any }> => {
    let isSuccessful = true;
    
    try {
      // Initial setup - 0-5%
      setProgress(5);
      setProgressText('Analyzing document structure...');
      
      // Step 1: Process the content to get structured resume data - 5-40%
      // Set progress to 12% to show we're starting content extraction
      setProgress(12);
      setProgressText('Extracting resume information...');
      
      const resumeData = await processContent(
        extractedContent,
        (p) => setProgress(12 + Math.floor(p * 0.28)), // Scale to 12-40% range
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      if (!resumeData) {
        console.error("Failed to process resume content - no data returned");
        isSuccessful = false;
        return { success: false, resumeData: null };
      }
      
      // Format job posting as a simple string - 40-44%
      setProgress(40);
      setProgressText('Preparing job description for analysis...');
      
      const jobPostingText = prepareJobPosting(jobPosting);
      if (!jobPostingText) {
        console.error("Failed to prepare job posting text");
        isSuccessful = false;
        return { success: false, resumeData: null };
      }
      
      // Move to 44% after job posting preparation
      setProgress(44);
      
      // Step 2 & 3: Score the original resume AND tailor the resume in parallel - 44-88%
      setProgressText('Processing resume in parallel operations...');
      
      console.log("Starting parallel processing of scoring and tailoring");
      
      // Run both API calls in parallel
      const [scoreResult, tailorResult] = await Promise.all([
        // Score original resume - 44-60% range
        scoreResume(
          resumeData,
          jobPostingText,
          (p) => setProgress(44 + Math.floor(p * 0.16)), // Scale to 44-60% range
          (text) => setProgressText(`Scoring original resume: ${text}`),
          apiErrors,
          setApiErrors
        ),
        
        // Tailor resume simultaneously - 60-84% range
        tailorResume(
          resumeData,
          jobPostingText,
          (p) => setProgress(60 + Math.floor(p * 0.24)), // Scale to 60-84% range
          (text) => setProgressText(`Optimizing resume: ${text}`),
          apiErrors,
          setApiErrors,
          false // Don't auto-score the tailored resume here
        )
      ]);
      
      // Check if both operations succeeded
      isSuccessful = scoreResult && tailorResult.success;
      
      // If we successfully tailored the resume, score the tailored version - 84-96%
      if (tailorResult.success && tailorResult.tailoredResume) {
        // Step 4: Score the tailored resume
        setProgress(84);
        setProgressText('Evaluating optimized resume...');
        await scoreResume(
          tailorResult.tailoredResume,
          jobPostingText,
          (p) => setProgress(84 + Math.floor(p * 0.12)), // Scale to 84-96% range
          (text) => setProgressText(`Evaluating optimized resume: ${text}`),
          apiErrors,
          setApiErrors,
          true // This is the tailored version
        );
      }
      
      // Final wrap-up - 96-100%
      setProgress(96);
      setProgressText('Finalizing analysis and preparing results...');
      
      // Small delay to ensure UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Complete
      setProgress(100);
      setProgressText('Analysis complete!');
      
      // Ensure we tell the caller if we were successful
      console.log("Resume processing workflow complete, success:", isSuccessful);
      return { success: isSuccessful, resumeData };
    } catch (error) {
      console.error("Error in resume processing workflow:", error);
      return { success: false, resumeData: null };
    }
  }, [jobPosting, processContent, scoreResume, tailorResume, prepareJobPosting]);

  return {
    processResumeContent,
    tailoringRationale
  };
};
