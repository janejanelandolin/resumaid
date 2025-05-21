
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing the resume processing workflow
 */
export const useResumeProcessingWorkflow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  /**
   * Completes the resume processing workflow and navigates to analysis page
   */
  const completeProcessing = useCallback((
    setUploading: (isUploading: boolean) => void,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[],
    tailoredScoreReceived: boolean
  ) => {
    // Update progress UI
    setProgress(100);
    setProgressText('Analysis complete!');
    
    // Check if we have critical errors that should prevent navigation
    const hasCriticalErrors = apiErrors.some(err => 
      err.includes('Schema Error') || 
      err.includes('Upload Error') || 
      err.includes('Process Error')
    );
    
    if (hasCriticalErrors) {
      toast({
        title: "Warning",
        description: "We encountered some errors processing your resume. Please check the details and try again.",
        variant: "destructive",
      });
      setUploading(false);
      return false;
    }
    
    // If we have non-critical errors but also data, toast the user
    if (apiErrors.length > 0) {
      toast({
        title: "Warning",
        description: "Some API errors occurred but we've generated results with available data",
        variant: "destructive",
      });
    }

    // Check if the tailored resume score has been received
    if (!tailoredScoreReceived) {
      console.log("Tailored resume score not yet received, waiting for score before navigation");
      // Don't navigate yet, but don't return false either as processing isn't failed
      return true;
    }
    
    // Store in sessionStorage that we've completed the resume upload
    sessionStorage.setItem('resumeUploaded', 'true');
    
    // Reset state and navigate now that we have the tailored score
    console.log("Processing complete with tailored score available, navigating to analysis page");
    
    setUploading(false);
    navigate('/analysis');
    
    return true;
  }, [navigate, toast]);
  
  /**
   * Handles navigation failures and sets appropriate errors
   */
  const handleProcessingError = useCallback((
    error: unknown,
    setProgress: (progress: number) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void,
    setUploading: (isUploading: boolean) => void
  ) => {
    console.error('Error processing resume:', error);
    setProgress(0);
    toast({
      title: "Error",
      description: "Failed to process your resume",
      variant: "destructive",
    });
    
    if (error instanceof Error) {
      const newErrors = [...apiErrors, `Process Error: ${error.message}`];
      setApiErrors(newErrors);
    }
    
    setUploading(false);
    return false;
  }, [toast]);
  
  return {
    completeProcessing,
    handleProcessingError
  };
};
