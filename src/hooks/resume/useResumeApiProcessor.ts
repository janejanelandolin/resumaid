
/**
 * Main hook for processing resume with APIs
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { normalizeSkills, formatJobPostingAsText } from './useResumeNormalizer';
import { useResumeScoring } from './useResumeScoring';
import { useResumeTailoring } from './useResumeTailoring';

export const useResumeApiProcessor = () => {
  const { toast } = useToast();
  const { 
    jobPosting,
    setResumeJson,
  } = useResumeContext();
  
  const { scoreResume } = useResumeScoring();
  const { tailorResume, tailoringRationale } = useResumeTailoring();
  
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
    
    // Normalize the skills data before processing
    if (resumeSchemaResponse.data) {
      resumeSchemaResponse.data = normalizeSkills(resumeSchemaResponse.data);
    }
    
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
    try {
      jobPostingText = formatJobPostingAsText(jobPosting);
    } catch (error) {
      isSuccessful = false;
      throw error;
    }
    
    if (resumeSchemaResponse.data) {
      // Step 3: Score the original resume
      await scoreResume(
        resumeSchemaResponse.data,
        jobPostingText,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
      
      // Step 4: Tailor the resume and score the tailored version
      await tailorResume(
        resumeSchemaResponse.data,
        jobPostingText,
        setProgress,
        setProgressText,
        apiErrors,
        setApiErrors
      );
    }
    
    return isSuccessful;
  }, [jobPosting, setResumeJson, scoreResume, tailorResume]);

  return {
    processResumeContent,
    tailoringRationale
  };
};
