
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useToast } from '@/hooks/use-toast';
import { UseResumeProcessorProps } from '@/types/resumeProcessorTypes';
import { useResumeProcessorState } from './resume/useResumeProcessorState';
import { useResumeApiProcessor } from './resume/useResumeApiProcessor';
import { useResumeFileProcessor } from './resume/useResumeFileProcessor';
import { useResumeProcessingWorkflow } from './resume/useResumeProcessingWorkflow';

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
  
  // Hook compositions
  const { 
    state, 
    setApiErrors, 
    handleFileUpload, 
    handleTextInput, 
    setUploading,
    createTextFile,
    reset
  } = useResumeProcessorState(setGlobalApiErrors);
  
  const { processResumeContent } = useResumeApiProcessor();
  const { processResumeFile } = useResumeFileProcessor();
  const { completeProcessing, handleProcessingError } = useResumeProcessingWorkflow();

  const processResume = useCallback(async () => {
    console.log("processResume called with state:", {
      hasFile: !!state.uploadedFile,
      hasText: !!state.resumeText,
      isUploading: state.isUploading,
      hasAttemptedUpload: state.hasAttemptedUpload
    });
    
    // Guard against double-processing (already uploading)
    if (state.isUploading) {
      console.log("Already uploading, ignoring duplicate request");
      return;
    }
    
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
        const fileContent = await processResumeFile(
          uploadedFile,
          setProgressText,
          setProgress,
          state.apiErrors,
          setApiErrors,
          showContentWarning
        );
        
        if (!fileContent) {
          setUploading(false);
          showErrorDialog();
          return;
        }
        
        extractedContent = fileContent;
      } else if (resumeText) {
        // If we have direct text input, use it directly
        extractedContent = resumeText;
        
        // Create an upload data object from the text input
        const textFile = createTextFile(resumeText);
        const uploadData = {
          id: Math.random().toString(36).substr(2, 9),
          filename: 'resume.txt',
          content: resumeText
        };
        setUploadData(uploadData);
        
        setProgress(30);
      }
      
      // Process the resume with the API
      const processingResult = await processResumeContent(
        extractedContent,
        setApiErrors,
        setProgress,
        setProgressText,
        state.apiErrors
      );
      
      if (processingResult) {
        completeProcessing(
          setUploading,
          setProgress,
          setProgressText,
          state.apiErrors
        );
      } else {
        showErrorDialog();
        setUploading(false);
      }
      
    } catch (error) {
      handleProcessingError(
        error,
        setProgress,
        state.apiErrors,
        setApiErrors,
        setUploading
      );
      showErrorDialog();
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
    processResumeContent,
    createTextFile,
    processResumeFile,
    completeProcessing,
    handleProcessingError
  ]);

  return {
    state,
    handleFileUpload,
    handleTextInput,
    processResume,
    reset
  };
};
