
/**
 * Hook for handling resume tailoring operations
 */
import { useState, useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { normalizeSkills } from './useResumeNormalizer';
import { ResumeJson } from '@/types/resume';

export const useResumeTailoring = () => {
  const [tailoringRationale, setTailoringRationale] = useState<string[]>([]);
  const { setTailoredResumeJson } = useResumeContext();
  
  /**
   * Tailor a resume to match a job posting
   * Returns both success status and the tailored resume for parallel processing
   */
  const tailorResume = useCallback(async (
    resumeData: ResumeJson,
    jobPostingText: string,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void,
    autoScore: boolean = true // Flag to determine if scoring should be done here or externally
  ): Promise<{success: boolean, tailoredResume: ResumeJson | null}> => {
    try {
      // Update progress UI appropriately based on parallel vs sequential processing
      if (!autoScore) {
        setProgress(60);
        setProgressText('Optimizing your resume to the job posting...');
      } else {
        setProgress(80);
        setProgressText('Optimizing your resume to the job posting...');
      }
      
      console.log("Sending tailor request with job posting length:", jobPostingText.length);
      console.log("Job posting preview:", jobPostingText.substring(0, 100) + '...');
      
      // We've already normalized skills, so we can use the data directly
      const resumeDataWithValidSkills = resumeData;
      let normalizedTailoredResume: ResumeJson | null = null;
      
      const tailorResponse = await apiService.tailorResume(resumeDataWithValidSkills, jobPostingText);
      console.log("Tailor response:", tailorResponse);
      
      if (tailorResponse.error) {
        const newErrors = [...apiErrors, `Tailor Error: ${tailorResponse.error}`];
        setApiErrors(newErrors);
        
        if (tailorResponse.data && tailorResponse.data.resume) {
          // Normalize skills in tailored resume
          normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
          // Attach rationale to the resume json so UI can access it
          if (tailorResponse.data.rationale) {
            normalizedTailoredResume = { ...normalizedTailoredResume, rationale: tailorResponse.data.rationale };
            setTailoringRationale(tailorResponse.data.rationale);
          }
          setTailoredResumeJson(normalizedTailoredResume);
        }
      } else if (tailorResponse.data) {
        // Normalize skills in tailored resume
        normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
        // Attach rationale to the resume json so UI can access it
        if (tailorResponse.data.rationale) {
          normalizedTailoredResume = { ...normalizedTailoredResume, rationale: tailorResponse.data.rationale };
          setTailoringRationale(tailorResponse.data.rationale);
        }
        setTailoredResumeJson(normalizedTailoredResume);
      }
      
      return { 
        success: true, 
        tailoredResume: normalizedTailoredResume 
      };
    } catch (error) {
      console.error("Error tailoring resume:", error);
      const newErrors = [...apiErrors, `Tailor Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      // Return partial success since we may at least have the original resume
      return { 
        success: false, 
        tailoredResume: null 
      };
    }
  }, [setTailoredResumeJson]);
  
  return {
    tailorResume,
    tailoringRationale
  };
};
