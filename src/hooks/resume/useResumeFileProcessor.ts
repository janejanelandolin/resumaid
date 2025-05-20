
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
      // Make sure we're working with a valid file
      if (!file || file.size === 0) {
        throw new Error("Invalid or empty file");
      }
      
      console.log("Processing file:", file.name, "Size:", file.size, "Type:", file.type);
      
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
      
      setProgress(30); // Update progress after successful upload
      
      // Return the extracted content
      return uploadResponse.data.content;
      
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const newErrors = [...apiErrors, `Upload Error: ${errorMessage}`];
      setApiErrors(newErrors);
      return null;
    }
  }, [setUploadData]);
  
  return {
    processResumeFile
  };
};
