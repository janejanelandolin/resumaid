
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
// Import types correctly with the 'type' keyword
import type { ResumeProcessorState, UseResumeProcessorProps } from '@/types/resumeProcessorTypes';

import { useResumeApiOrchestrator } from './resume/useResumeApiOrchestrator';
import { useResumeFileProcessor } from './resume/useResumeFileProcessor';
import { useResumeProcessingWorkflow } from './resume/useResumeProcessingWorkflow';
import { useResumeProcessorState } from './resume/useResumeProcessorState';

// Re-export types with the 'type' keyword for TypeScript's isolatedModules
export type { ResumeProcessorState, UseResumeProcessorProps };

export const useResumeProcessor = ({ 
  setProgress, 
  setProgressText,
  showErrorDialog,
  showContentWarning 
}: UseResumeProcessorProps) => {
  const { setApiErrors: setGlobalApiErrors } = useResumeContext();
  
  // Resume processing states
  const { 
    state,
    setApiErrors,
    handleFileUpload,
    handleTextInput,
    setUploading,
    createTextFile,
    reset
  } = useResumeProcessorState(setGlobalApiErrors);

  // Resume processing workflow helpers
  const { completeProcessing, handleProcessingError } = useResumeProcessingWorkflow();
  
  // Resume file processor
  const { processResumeFile } = useResumeFileProcessor();
  
  // API orchestrator for the resume processing workflow
  const { processResumeContent: processWithApi } = useResumeApiOrchestrator();

  // Process the uploaded resume
  const processResume = useCallback(async () => {
    try {
      // Reset progress UI
      setProgress(0);
      setApiErrors([]);
      setUploading(true);
      setProgressText('Processing resume...');
      
      // Get the content from either file upload or text input
      let extractedContent = null;
      if (state.uploadedFile) {
        // Process the uploaded file
        extractedContent = await processResumeFile(
          state.uploadedFile, 
          setProgressText, 
          setProgress, 
          state.apiErrors, 
          setApiErrors,
          showContentWarning
        );
      } else if (state.resumeText) {
        // Create a file from the text input for processing
        const textFile = createTextFile(state.resumeText);
        extractedContent = await processResumeFile(
          textFile,
          setProgressText,
          setProgress,
          state.apiErrors,
          setApiErrors,
          showContentWarning
        );
      } else {
        throw new Error("No resume content to process");
      }
      
      if (!extractedContent) {
        throw new Error("Failed to extract content from resume");
      }
      
      // Process the extracted content with the API
      const success = await processWithApi(
        extractedContent,
        setApiErrors,
        setProgress,
        setProgressText,
        state.apiErrors
      );
      
      if (success) {
        // Complete the workflow and navigate to analysis page
        return completeProcessing(
          setUploading,
          setProgress,
          setProgressText,
          state.apiErrors
        );
      } else {
        throw new Error("Resume processing failed");
      }
    } catch (error) {
      // Handle any errors that occur during processing
      return handleProcessingError(
        error,
        setProgress,
        state.apiErrors,
        setApiErrors,
        setUploading
      );
    }
  }, [
    state.uploadedFile, 
    state.resumeText, 
    state.apiErrors, 
    setProgress, 
    setApiErrors, 
    setUploading, 
    setProgressText, 
    processResumeFile, 
    processWithApi, 
    createTextFile, 
    completeProcessing, 
    handleProcessingError, 
    showContentWarning
  ]);
  
  return {
    state,
    handleFileUpload,
    handleTextInput,
    processResume,
    reset
  };
};
