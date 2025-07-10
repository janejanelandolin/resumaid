
/**
 * Hook for processing resume scoring operations
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { ResumeJson } from '@/types/resume';
import useAppVersion from '@/hooks/useAppVersion';
import { updateSessionWithOriginalScore, updateSessionWithOptimizedScore } from '@/services/logSessionService';

export const useResumeScoring = () => {
  const { setOriginalScore, setTailoredScore } = useResumeContext();
  const { isDebugMode } = useAppVersion();
  
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
      // Update progress UI with more specific messaging
      if (!isTailored) {
        setProgress(44);
        setProgressText('Analyzing resume against job requirements...');
        
        // Brief pause to show progress
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProgress(48);
        setProgressText('Evaluating your qualifications match...');
      } else {
        setProgress(84);
        setProgressText('Evaluating optimized resume against job requirements...');
        
        // Brief pause to show progress
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProgress(88);
        setProgressText('Calculating qualification improvements...');
      }
      
      const resumeDataWithValidSkills = resumeData;
      
      // Simulated progress during API call
      const startApiCallProgress = !isTailored ? 48 : 88;
      const endApiCallProgress = !isTailored ? 58 : 94;
      let currentProgress = startApiCallProgress;
      
      const progressInterval = setInterval(() => {
        if (currentProgress >= endApiCallProgress) {
          clearInterval(progressInterval);
          return;
        }
        
        currentProgress += 1;
        setProgress(currentProgress);
      }, 400);
      
      // Specific message halfway through scoring
      setTimeout(() => {
        setProgressText(!isTailored 
          ? 'Assessing keyword match with job description...' 
          : 'Measuring improvement in keyword alignment...');
      }, 1500);
      
      const scoreResponse = await apiService.scoreResume(resumeDataWithValidSkills, jobPostingText);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      setProgress(endApiCallProgress);
      
      if (isDebugMode) {
        console.log(`${isTailored ? 'Tailored s' : 'S'}core response:`, scoreResponse);
      }
      
      if (scoreResponse.error) {
        const newErrors = [...apiErrors, `${isTailored ? 'Tailored ' : ''}Score Error: ${scoreResponse.error}`];
        setApiErrors(newErrors);
        if (scoreResponse.data) {
          if (isTailored) {
            setTailoredScore(scoreResponse.data);
            // Update session log with optimized score
            await updateSessionWithOptimizedScore(scoreResponse.data);
          } else {
            setOriginalScore(scoreResponse.data);
            // Update session log with original score
            await updateSessionWithOriginalScore(scoreResponse.data);
          }
        }
      } else if (scoreResponse.data) {
        if (isTailored) {
          setTailoredScore(scoreResponse.data);
          // Update session log with optimized score
          await updateSessionWithOptimizedScore(scoreResponse.data);
        } else {
          setOriginalScore(scoreResponse.data);
          // Update session log with original score
          await updateSessionWithOriginalScore(scoreResponse.data);
        }
      }
      
      // Final update after scoring
      setProgress(isTailored ? 96 : 60);
      setProgressText(isTailored 
        ? 'Optimization analysis complete!' 
        : 'Resume evaluation complete, now optimizing...');
      
      return true;
    } catch (error) {
      if (isDebugMode) {
        console.error(`Error scoring ${isTailored ? 'tailored ' : ''}resume:`, error);
      }
      const newErrors = [...apiErrors, `${isTailored ? 'Tailored ' : ''}Score Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      // Continue processing even if scoring fails
      return true;
    }
  }, [setOriginalScore, setTailoredScore, isDebugMode]);
  
  return {
    scoreResume
  };
};
