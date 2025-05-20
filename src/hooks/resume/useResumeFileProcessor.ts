
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';

/**
 * Hook for handling resume file uploads and processing
 */
export const useResumeFileProcessor = () => {
  const { setUploadData } = useResumeContext();
  
  /**
   * Process an uploaded resume file
   */
  const processResumeFile = useCallback(async (
    file: File,
    setProgressText: (text: string) => void,
    setProgress: (progress: number) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void,
    showContentWarning: () => void,
  ) => {
    setProgressText('Uploading resume file...');
    setProgress(15);
    
    try {
      const uploadResponse = await apiService.uploadResume(file);
      console.log("Upload response:", uploadResponse);
      
      if (uploadResponse.error) {
        const newErrors = [...apiErrors, `Upload Error: ${uploadResponse.error}`];
        setApiErrors(newErrors);
        return null;
      }
      
      if (!uploadResponse.data) {
        throw new Error("Failed to upload resume: No data returned");
      }
      
      setUploadData(uploadResponse.data);
      
      // Check if content is properly set
      if (!uploadResponse.data.content || uploadResponse.data.content.trim() === '') {
        showContentWarning();
        return null;
      }
      
      // Return the extracted content
      return uploadResponse.data.content;
      
    } catch (error) {
      console.error("Error uploading file:", error);
      const newErrors = [...apiErrors, `Upload Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      return null;
    }
  }, [setUploadData]);
  
  return {
    processResumeFile
  };
};
