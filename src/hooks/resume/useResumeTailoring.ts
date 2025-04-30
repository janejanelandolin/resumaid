
/**
 * Hook for handling resume tailoring operations
 */
import { useState, useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { normalizeSkills } from './useResumeNormalizer';
import { useResumeScoring } from './useResumeScoring';
import { ResumeJson } from '@/types/resume';

export const useResumeTailoring = () => {
  const [tailoringRationale, setTailoringRationale] = useState<string[]>([]);
  const { setTailoredResumeJson } = useResumeContext();
  const { scoreResume } = useResumeScoring();
  
  /**
   * Tailor a resume to match a job posting
   */
  const tailorResume = useCallback(async (
    resumeData: ResumeJson,
    jobPostingText: string,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void
  ): Promise<boolean> => {
    try {
      // Update progress UI
      setProgress(80);
      setProgressText('Tailoring your resume to the job...');
      
      console.log("Sending tailor request with job posting length:", jobPostingText.length);
      console.log("Job posting preview:", jobPostingText.substring(0, 100) + '...');
      
      // We've already normalized skills, so we can use the data directly
      const resumeDataWithValidSkills = resumeData;
      
      const tailorResponse = await apiService.tailorResume(resumeDataWithValidSkills, jobPostingText);
      console.log("Tailor response:", tailorResponse);
      
      if (tailorResponse.error) {
        const newErrors = [...apiErrors, `Tailor Error: ${tailorResponse.error}`];
        setApiErrors(newErrors);
        
        if (tailorResponse.data && tailorResponse.data.resume) {
          // Normalize skills in tailored resume
          const normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
          // Extract just the resume object from the response
          setTailoredResumeJson(normalizedTailoredResume);
          // Store the rationale for UI display if needed
          if (tailorResponse.data.rationale) {
            setTailoringRationale(tailorResponse.data.rationale);
          }
        }
      } else if (tailorResponse.data) {
        // Normalize skills in tailored resume
        const normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
        // Extract just the resume object from the response
        setTailoredResumeJson(normalizedTailoredResume);
        // Store the rationale for UI display if needed
        if (tailorResponse.data.rationale) {
          setTailoringRationale(tailorResponse.data.rationale);
        }
        
        // Score the tailored resume
        await scoreResume(
          normalizedTailoredResume, 
          jobPostingText,
          setProgress,
          setProgressText,
          apiErrors,
          setApiErrors,
          true // This is the tailored version
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error tailoring resume:", error);
      const newErrors = [...apiErrors, `Tailor Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      // Return partial success since we may at least have the original resume
      return true;
    }
  }, [setTailoredResumeJson, scoreResume]);
  
  return {
    tailorResume,
    tailoringRationale
  };
};
