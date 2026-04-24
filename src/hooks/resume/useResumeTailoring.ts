
/**
 * Hook for handling resume tailoring operations
 */
import { useState, useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { normalizeSkills } from './useResumeNormalizer';
import { ResumeJson } from '@/types/resume';

export const useResumeTailoring = () => {
  const [tailoringChanges, setTailoringChanges] = useState<string[]>([]);
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
    autoScore: boolean = true
  ): Promise<{success: boolean, tailoredResume: ResumeJson | null}> => {
    try {
      if (!autoScore) {
        setProgress(60);
        setProgressText('Optimizing your resume to the job posting...');
      } else {
        setProgress(80);
        setProgressText('Optimizing your resume to the job posting...');
      }

      console.log("Sending tailor request with job posting length:", jobPostingText.length);
      console.log("Job posting preview:", jobPostingText.substring(0, 100) + '...');

      let normalizedTailoredResume: ResumeJson | null = null;

      const tailorResponse = await apiService.tailorResume(resumeData, jobPostingText);
      console.log("Tailor response:", tailorResponse);

      if (tailorResponse.error) {
        const newErrors = [...apiErrors, `Tailor Error: ${tailorResponse.error}`];
        setApiErrors(newErrors);

        if (tailorResponse.data && tailorResponse.data.resume) {
          normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
          if (tailorResponse.data.changes) {
            normalizedTailoredResume = { ...normalizedTailoredResume, changes: tailorResponse.data.changes };
            setTailoringChanges(tailorResponse.data.changes);
          }
          setTailoredResumeJson(normalizedTailoredResume);
        }
      } else if (tailorResponse.data) {
        normalizedTailoredResume = normalizeSkills(tailorResponse.data.resume);
        if (tailorResponse.data.changes) {
          normalizedTailoredResume = { ...normalizedTailoredResume, changes: tailorResponse.data.changes };
          setTailoringChanges(tailorResponse.data.changes);
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
      return {
        success: false,
        tailoredResume: null
      };
    }
  }, [setTailoredResumeJson]);

  return {
    tailorResume,
    tailoringChanges
  };
};
