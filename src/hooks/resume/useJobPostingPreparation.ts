
/**
 * Hook for preparing job posting data for API requests
 */
import { useCallback } from 'react';
import { formatJobPostingAsText } from './useResumeNormalizer';
import { JobPosting } from '@/types/resume';

export const useJobPostingPreparation = () => {
  /**
   * Prepares a job posting for use in API requests
   */
  const prepareJobPosting = useCallback((jobPosting: JobPosting | null): string => {
    if (!jobPosting) {
      throw new Error("No job posting available");
    }
    
    try {
      return formatJobPostingAsText(jobPosting);
    } catch (error) {
      console.error("Error formatting job posting:", error);
      throw error;
    }
  }, []);
  
  return {
    prepareJobPosting
  };
};
