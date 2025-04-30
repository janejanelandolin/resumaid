
/**
 * Hook for processing resume scoring operations
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { ResumeJson, ScoreResponse } from '@/types/resume';

export const useResumeScoring = () => {
  const { setOriginalScore, setTailoredScore } = useResumeContext();
  
  /**
   * Score a resume against a job posting
   */
  const scoreResume = useCallback(async (
    resumeData: ResumeJson,
    jobPostingText: string,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void,
    isTailored: boolean = false
  ): Promise<boolean> => {
    try {
      // Update progress UI
      if (!isTailored) {
        setProgress(60);
        setProgressText('Scoring your resume...');
      } else {
        setProgress(90);
        setProgressText('Evaluating optimized resume...');
      }
      
      const resumeDataWithValidSkills = resumeData;
      
      const scoreResponse = await apiService.scoreResume(resumeDataWithValidSkills, jobPostingText);
      console.log(`${isTailored ? 'Tailored s' : 'S'}core response:`, scoreResponse);
      
      if (scoreResponse.error) {
        const newErrors = [...apiErrors, `${isTailored ? 'Tailored ' : ''}Score Error: ${scoreResponse.error}`];
        setApiErrors(newErrors);
        if (scoreResponse.data) {
          if (isTailored) {
            setTailoredScore(scoreResponse.data);
          } else {
            setOriginalScore(scoreResponse.data);
          }
        }
      } else if (scoreResponse.data) {
        if (isTailored) {
          setTailoredScore(scoreResponse.data);
        } else {
          setOriginalScore(scoreResponse.data);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error scoring ${isTailored ? 'tailored ' : ''}resume:`, error);
      const newErrors = [...apiErrors, `${isTailored ? 'Tailored ' : ''}Score Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      // Continue processing even if scoring fails
      return true;
    }
  }, [setOriginalScore, setTailoredScore]);
  
  return {
    scoreResume
  };
};
