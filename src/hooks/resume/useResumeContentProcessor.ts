
/**
 * Hook for extracting and processing resume content
 */
import { useCallback } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { normalizeSkills } from './useResumeNormalizer';
import { ResumeJson } from '@/types/resume';
import useAppVersion from '@/hooks/useAppVersion';

export const useResumeContentProcessor = () => {
  const { setResumeJson } = useResumeContext();
  const { isDebugMode } = useAppVersion();
  
  /**
   * Process extracted content to get resume schema
   */
  const processContent = useCallback(async (
    extractedContent: string,
    setProgress: (progress: number) => void,
    setProgressText: (text: string) => void,
    apiErrors: string[],
    setApiErrors: (errors: string[]) => void
  ): Promise<ResumeJson | null> => {
    console.log("Content to process length:", extractedContent.length);
    console.log("Content preview:", extractedContent.substring(0, 100) + '...');
    
    // Update progress UI
    setProgress(40);
    setProgressText('Converting resume to structured format...');
    
    try {
      const resumeSchemaResponse = await apiService.getResumeSchema(extractedContent);
      if (isDebugMode) {
        console.log("Resume schema response:", resumeSchemaResponse);
      }
      
      // Normalize the skills data before processing
      let normalizedData = null;
      if (resumeSchemaResponse.data) {
        normalizedData = normalizeSkills(resumeSchemaResponse.data);
      }
      
      if (resumeSchemaResponse.error) {
        const newErrors = [...apiErrors, `Resume Schema Error: ${resumeSchemaResponse.error}`];
        setApiErrors(newErrors);
        if (normalizedData) {
          setResumeJson(normalizedData);
        } else {
          throw new Error("Failed to process resume schema");
        }
      } else if (normalizedData) {
        setResumeJson(normalizedData);
      }
      
      return normalizedData;
    } catch (error) {
      console.error("Error processing content:", error);
      const newErrors = [...apiErrors, `Schema Error: ${error instanceof Error ? error.message : String(error)}`];
      setApiErrors(newErrors);
      return null;
    }
  }, [setResumeJson, isDebugMode]);
  
  return {
    processContent
  };
};
