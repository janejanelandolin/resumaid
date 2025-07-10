
import { useCallback, useState, useEffect } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
// Import types correctly with the 'type' keyword
import type { ResumeProcessorState, UseResumeProcessorProps } from '@/types/resumeProcessorTypes';
import { createSessionLog } from '@/services/logSessionService';

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
  const { setApiErrors: setGlobalApiErrors, tailoredScore, jobTitle, resumeJson } = useResumeContext();
  // Add state to track if the tailored score has been received
  const [tailoredScoreReceived, setTailoredScoreReceived] = useState(false);
  
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

  // Monitor the tailoredScore and set the flag when it's received
  useEffect(() => {
    if (tailoredScore) {
      console.log("Tailored score received, ready for navigation", tailoredScore);
      setTailoredScoreReceived(true);
      
      // If we're still uploading and have received the tailored score, complete the process
      if (state.isUploading) {
        console.log("Auto-completing workflow since tailored score is now available");
        completeProcessing(
          setUploading,
          setProgress,
          setProgressText,
          state.apiErrors,
          true // tailoredScoreReceived is true
        );
      }
    }
  }, [tailoredScore, state.isUploading, state.apiErrors, setUploading, setProgress, setProgressText, completeProcessing]);

  // Process the uploaded resume
  const processResume = useCallback(async () => {
    try {
      // Reset progress UI and tailored score received state
      setProgress(0);
      setApiErrors([]);
      setUploading(true);
      setProgressText('Processing resume...');
      setTailoredScoreReceived(false);
      
      console.log("Beginning resume processing workflow");
      
      // Create initial session log at the start of processing
      await createSessionLog(jobTitle);
      
      // Get the content from either file upload or text input
      let extractedContent = null;
      if (state.uploadedFile) {
        console.log("Processing from file:", state.uploadedFile.name);
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
        console.log("Processing from text input");
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
        console.error("No resume content to process");
        throw new Error("No resume content to process");
      }
      
      if (!extractedContent) {
        console.error("Failed to extract content from resume");
        throw new Error("Failed to extract content from resume");
      }
      
      console.log("Content extracted, processing with API");
      
      // Process the extracted content with the API - now with parallel processing
      const result = await processWithApi(
        extractedContent,
        setApiErrors,
        setProgress,
        setProgressText,
        state.apiErrors
      );
      
      if (result.success) {
        console.log("API processing successful, checking tailored score status");
        
        // Complete the workflow but only navigate if we have the tailored score
        return completeProcessing(
          setUploading,
          setProgress,
          setProgressText,
          state.apiErrors,
          tailoredScoreReceived
        );
      } else {
        console.error("Resume processing failed");
        throw new Error("Resume processing failed");
      }
    } catch (error) {
      console.error("Error in processResume:", error);
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
    showContentWarning,
    tailoredScoreReceived,
    jobTitle,
    resumeJson
  ]);
  
  return {
    state,
    handleFileUpload,
    handleTextInput,
    processResume,
    reset,
    tailoredScoreReceived
  };
};
