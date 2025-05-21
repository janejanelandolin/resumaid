
import { useResumeContext } from '@/contexts/ResumeContext';
import FileUploader from '@/components/FileUploader';
import { Sparkle } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

// Import our components
import UploadProgress from '@/components/upload/UploadProgress';
import ErrorAlert from '@/components/upload/ErrorAlert';
import SubmitButton from '@/components/upload/SubmitButton';
import { useResumeProcessor } from '@/hooks/useResumeProcessor';
import { useEffect, useState } from 'react';
import RotatingTips from './RotatingTips';

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
  const [showTypewriter, setShowTypewriter] = useState(false);
  
  const { 
    state,
    handleFileUpload,
    handleTextInput,
    processResume,
    reset
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

  // Reset state when component mounts
  useEffect(() => {
    // Reset state when the component mounts to ensure a fresh start
    reset();
    setShowTypewriter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle analyze button click - start both API calls and typewriter animation
  const handleAnalyzeClick = () => {
    // Start typewriter animation
    setShowTypewriter(true);
    
    // Start API calls immediately (don't wait for animation)
    processResume();
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled = (!state.uploadedFile && !state.resumeText) || state.isUploading;

  // ATS improvement text from Summary component
  const atsImprovementText = `Your resume needs optimization to pass Applicant Tracking System (ATS) filters. We've identified several opportunities to highlight your relevant experience and add keywords that will help you get past automated screening systems and into the hands of a hiring manager.`;

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
      
      {/* Show rotating tips during processing */}
      <RotatingTips isShowing={state.isUploading} />
      
      {/* ATS Improvement Text with Typewriter effect - shows when analyze button is clicked */}
      {showTypewriter && (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-lg relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-bl-full"></div>
          <div className="absolute -top-4 -right-4 text-purple-300 animate-pulse">
            <Sparkle size={24} />
          </div>
          <div className="absolute top-32 -left-8 text-blue-400 animate-spin-slow">
            <Sparkle size={16} />
          </div>
          <TypewriterText
            text={atsImprovementText}
            className="text-sm relative z-10"
          />
        </div>
      )}
      
      <UploadProgress
        isUploading={state.isUploading}
        progress={progress}
        progressText={progressText}
      />
      
      <SubmitButton
        onClick={handleAnalyzeClick}
        disabled={isSubmitDisabled}
        isUploading={state.isUploading}
      />
      
      {/* Additional animated elements during processing */}
      {state.isUploading && (
        <div className="fixed bottom-4 right-4 flex space-x-2 animate-fade-in">
          <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
