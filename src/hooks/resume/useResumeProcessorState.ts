
import { useState, useCallback } from 'react';
import { ResumeProcessorState } from '@/types/resumeProcessorTypes';

export const useResumeProcessorState = (
  setGlobalApiErrors: (errors: string[]) => void
) => {
  const [state, setState] = useState<ResumeProcessorState>({
    isUploading: false,
    uploadedFile: null,
    resumeText: '',
    apiErrors: [],
    hasAttemptedUpload: false,
  });

  const setApiErrors = useCallback((errors: string[]) => {
    setState(prev => ({ ...prev, apiErrors: errors }));
    setGlobalApiErrors(errors);
  }, [setGlobalApiErrors]);

  const handleFileUpload = useCallback(async (file: File) => {
    console.log("handleFileUpload called with file:", file.name);
    
    // Ensure we're clearing any previous state and setting the new file
    setState(prev => ({ 
      ...prev, 
      uploadedFile: file, 
      resumeText: '',
      apiErrors: [],
      hasAttemptedUpload: true,
      isUploading: false // Make sure isUploading is reset to false
    }));
    
    setApiErrors([]);
  }, [setApiErrors]);

  const handleTextInput = useCallback((text: string) => {
    console.log("handleTextInput called with text length:", text.length);
    
    // Ensure we're clearing any previous state and setting the new text
    setState(prev => ({ 
      ...prev, 
      resumeText: text, 
      uploadedFile: null,
      apiErrors: [],
      hasAttemptedUpload: true,
      isUploading: false // Make sure isUploading is reset to false
    }));
    
    setApiErrors([]);
  }, [setApiErrors]);

  const setUploading = useCallback((isUploading: boolean) => {
    setState(prev => ({ ...prev, isUploading }));
  }, []);

  const createTextFile = useCallback((text: string): File => {
    const blob = new Blob([text], { type: 'text/plain' });
    return new File([blob], 'resume.txt', { type: 'text/plain' });
  }, []);
  
  const reset = useCallback(() => {
    setState({
      isUploading: false,
      uploadedFile: null,
      resumeText: '',
      apiErrors: [],
      hasAttemptedUpload: false,
    });
    setApiErrors([]);
  }, [setApiErrors]);
  
  return {
    state,
    setApiErrors,
    handleFileUpload,
    handleTextInput,
    setUploading,
    createTextFile,
    reset
  };
};
