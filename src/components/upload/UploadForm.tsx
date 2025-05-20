
import { useResumeContext } from '@/contexts/ResumeContext';
import FileUploader from '@/components/FileUploader';
import { Sparkle } from 'lucide-react';

// Import our components
import UploadProgress from '@/components/upload/UploadProgress';
import ErrorAlert from '@/components/upload/ErrorAlert';
import SubmitButton from '@/components/upload/SubmitButton';
import { useResumeProcessor } from '@/hooks/useResumeProcessor';
import { useEffect } from 'react';

interface UploadFormProps {
  showErrorDialog: () => void;
  showContentWarning: () => void;
  setApiErrors: (errors: string[]) => void;
  setProgress: (progress: number) => void;
  setProgressText: (text: string) => void;
  progress: number;
  progressText: string;
}

const UploadForm = ({
  showErrorDialog,
  showContentWarning,
  setApiErrors,
  setProgress,
  setProgressText,
  progress,
  progressText,
}: UploadFormProps) => {
  const { jobPosting } = useResumeContext();
  
  const { 
    state,
    handleFileUpload,
    handleTextInput,
    processResume
  } = useResumeProcessor({
    setProgress,
    setProgressText,
    showErrorDialog,
    showContentWarning,
  });

  // Log state changes for debugging
  useEffect(() => {
    console.log("UploadForm state updated:", {
      hasFile: !!state.uploadedFile,
      hasText: !!state.resumeText,
      isUploading: state.isUploading,
      hasAttemptedUpload: state.hasAttemptedUpload,
      fileName: state.uploadedFile?.name || 'No file'
    });
  }, [state]);

  // Update API errors when state changes
  useEffect(() => {
    setApiErrors(state.apiErrors);
  }, [state.apiErrors, setApiErrors]);

  // Determine if the submit button should be disabled
  const isSubmitDisabled = (!state.uploadedFile && !state.resumeText) || state.isUploading;

  return (
    <div className="space-y-6 py-4">
      <div className="relative">
        <div className="absolute -top-6 -right-6 text-indigo-300 animate-spin-slow">
          <Sparkle size={20} />
        </div>
        <div className="absolute -bottom-6 -left-6 text-purple-300 animate-pulse">
          <Sparkle size={16} />
        </div>
        
        <ErrorAlert 
          errors={state.apiErrors} 
          onShowDetails={showErrorDialog}
        />
        
        <FileUploader 
          onFileUpload={handleFileUpload} 
          onTextInput={handleTextInput}
          isProcessing={state.isUploading}
        />
      </div>
      
      <UploadProgress
        isUploading={state.isUploading}
        progress={progress}
        progressText={progressText}
      />
      
      <SubmitButton
        onClick={processResume}
        disabled={isSubmitDisabled}
        isUploading={state.isUploading}
      />
    </div>
  );
};

export default UploadForm;
