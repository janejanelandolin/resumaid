
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
  });

  const setApiErrors = useCallback((errors: string[]) => {
    setState(prev => ({ ...prev, apiErrors: errors }));
    setGlobalApiErrors(errors);
  }, [setGlobalApiErrors]);

  const handleFileUpload = useCallback(async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      uploadedFile: file, 
      resumeText: '',
      apiErrors: [] 
    }));
    setApiErrors([]);
  }, [setApiErrors]);

  const handleTextInput = useCallback((text: string) => {
    setState(prev => ({ 
      ...prev, 
      resumeText: text, 
      uploadedFile: null,
      apiErrors: [] 
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
  
  return {
    state,
    setApiErrors,
    handleFileUpload,
    handleTextInput,
    setUploading,
    createTextFile
  };
};
