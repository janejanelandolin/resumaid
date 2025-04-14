
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobPosting } from '@/types/resume';

export const useJobPostingHandler = (
  jobPosting: JobPosting | null,
  setJobPosting: (jobPosting: JobPosting) => void
) => {
  const { toast } = useToast();
  
  const handleJobPostingInput = useCallback((text: string) => {
    if (text.trim() && jobPosting) {
      const updatedJobPosting = {
        ...jobPosting,
        description: text,
        userProvided: true
      };
      setJobPosting(updatedJobPosting);
      
      toast({
        title: "Job Posting Updated",
        description: "The job posting has been updated with your text input.",
      });
    }
  }, [jobPosting, setJobPosting, toast]);

  return {
    handleJobPostingInput
  };
};
