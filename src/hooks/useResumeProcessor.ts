
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { UseResumeProcessorProps } from '@/types/resumeProcessorTypes';
import { useResumeProcessorState } from './resume/useResumeProcessorState';
import { useResumeApiProcessor } from './resume/useResumeApiProcessor';

export const useResumeProcessor = ({
  setProgress,
  setProgressText,
  showErrorDialog,
  showContentWarning,
}: UseResumeProcessorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    jobPosting, 
    setUploadData, 
    setApiErrors: setGlobalApiErrors,
  } = useResumeContext();
  
  const { 
    state, 
    setApiErrors, 
    handleFileUpload, 
    handleTextInput, 
    setUploading,
    createTextFile
  } = useResumeProcessorState(setGlobalApiErrors);
  
  const { processResumeContent } = useResumeApiProcessor();

  const processResume = useCallback(async () => {
    const { uploadedFile, resumeText } = state;
    
    if (!uploadedFile && !resumeText) {
      toast({
        title: "Error",
        description: "Please upload your resume or paste your resume text",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobPosting) {
      navigate('/');
      return;
    }

    // Reset state
    setUploading(true);
    setProgress(0);
    setProgressText('Processing resume...');
    setApiErrors([]);

    try {
      // Different processing flow based on whether we have a file or text input
      let extractedContent = '';
      
      // If we have a file, upload it through the /upload endpoint
      if (uploadedFile) {
        setProgressText('Uploading resume file...');
        setProgress(15);
        
        const uploadResponse = await apiService.uploadResume(uploadedFile);
        console.log("Upload response:", uploadResponse);
        
        if (uploadResponse.error) {
          const newErrors = [...state.apiErrors, `Upload Error: ${uploadResponse.error}`];
          setApiErrors(newErrors);
          showErrorDialog();
          setUploading(false);
          return; // Add early return to prevent navigation on error
        }
        
        if (!uploadResponse.data) {
          setUploading(false);
          throw new Error("Failed to upload resume: No data returned");
        }
        
        setUploadData(uploadResponse.data);
        
        // Check if content is properly set
        if (!uploadResponse.data.content || uploadResponse.data.content.trim() === '') {
          setUploading(false);
          showContentWarning();
          return;
        }
        
        // Extract the resume text content from the upload response
        extractedContent = uploadResponse.data.content;
      } else if (resumeText) {
        // If we have direct text input, use it directly
        extractedContent = resumeText;
        setProgress(30);
      }
      
      // Process the resume with the API
      await processResumeContent(
        extractedContent,
        setApiErrors,
        setProgress,
        setProgressText,
        state.apiErrors
      );
      
      // Complete and navigate
      setProgress(100);
      setProgressText('Analysis complete!');
      
      // If we have errors but also data, toast the user
      if (state.apiErrors.length > 0) {
        toast({
          title: "Warning",
          description: "Some API errors occurred but we've generated results with available data",
          variant: "destructive",
        });
      }
      
      // Store in sessionStorage that we've completed the resume upload
      sessionStorage.setItem('resumeUploaded', 'true');
      
      setTimeout(() => {
        setUploading(false);
        navigate('/analysis');
      }, 500);
      
    } catch (error) {
      console.error('Error processing resume:', error);
      setProgress(0);
      toast({
        title: "Error",
        description: "Failed to process your resume",
        variant: "destructive",
      });
      
      if (error instanceof Error) {
        const newErrors = [...state.apiErrors, `Process Error: ${error.message}`];
        setApiErrors(newErrors);
      }
      
      showErrorDialog();
      setUploading(false);
    }
  }, [
    state,
    toast,
    jobPosting,
    navigate,
    setProgress,
    setProgressText,
    setApiErrors,
    showErrorDialog,
    showContentWarning,
    setUploadData,
    setUploading,
    processResumeContent
  ]);

  return {
    state,
    handleFileUpload,
    handleTextInput,
    processResume,
  };
};
