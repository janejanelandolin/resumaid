
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import FileUploader from '@/components/FileUploader';
import { Sparkle } from 'lucide-react';

// Import our components
import UploadProgress from '@/components/upload/UploadProgress';
import ErrorAlert from '@/components/upload/ErrorAlert';
import SubmitButton from '@/components/upload/SubmitButton';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    jobPosting, 
    setUploadData, 
    setAtsFeedback, 
    setFeedback,
    setJobPosting,
    setApiErrors: setGlobalApiErrors // Use the global API errors state
  } = useResumeContext();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [apiErrorsLocal, setApiErrorsLocal] = useState<string[]>([]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setResumeText('');
    setApiErrorsLocal([]);
    setApiErrors([]);
    setGlobalApiErrors([]); // Clear global API errors
  };

  const handleTextInput = (text: string) => {
    setResumeText(text);
    setUploadedFile(null);
    setApiErrorsLocal([]);
    setApiErrors([]);
    setGlobalApiErrors([]); // Clear global API errors
  };

  const handleJobPostingInput = (text: string) => {
    if (text.trim() && jobPosting) {
      const updatedJobPosting = {
        ...jobPosting,
        description: text,
        userProvided: true
      };
      setJobPosting(updatedJobPosting);
      
      toast({
        title: "Job Posting Updated",
        description: "The job posting has been updated with your text input.",
      });
    }
  };

  const createTextFile = (text: string): File => {
    const blob = new Blob([text], { type: 'text/plain' });
    return new File([blob], 'resume.txt', { type: 'text/plain' });
  };

  const handleSubmit = async () => {
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
    setIsUploading(true);
    setProgress(0);
    setProgressText('Uploading resume...');
    setApiErrorsLocal([]);
    setApiErrors([]);
    setGlobalApiErrors([]); // Clear global API errors

    try {
      // Step 1: Upload resume
      setProgress(20);
      let fileToUpload = uploadedFile;
      
      if (!fileToUpload && resumeText) {
        fileToUpload = createTextFile(resumeText);
      }
      
      if (!fileToUpload) {
        throw new Error("No file or text to upload");
      }
      
      const uploadResponse = await apiService.uploadResume(fileToUpload);
      console.log("Upload response:", uploadResponse);
      
      if (uploadResponse.error) {
        const newErrors = [...apiErrorsLocal, `Upload Error: ${uploadResponse.error}`];
        setApiErrorsLocal(newErrors);
        setApiErrors(newErrors);
        setGlobalApiErrors(newErrors); // Set global API errors
        showErrorDialog();
      }
      
      if (!uploadResponse.data) {
        throw new Error("Failed to upload resume: No data returned");
      }
      
      setUploadData(uploadResponse.data);
      
      // Check if content is properly set
      if (!uploadResponse.data.content || uploadResponse.data.content.trim() === '') {
        setIsUploading(false);
        showContentWarning();
        return;
      }
      
      // Step 2: Get ATS feedback
      setProgress(50);
      setProgressText('Analyzing with ATS systems...');
      const atsFeedbackResponse = await apiService.getATSFeedback(jobPosting, uploadResponse.data);
      
      if (atsFeedbackResponse.error) {
        const newErrors = [...apiErrorsLocal, `ATS Feedback Error: ${atsFeedbackResponse.error}`];
        setApiErrorsLocal(newErrors);
        setApiErrors(newErrors);
        setGlobalApiErrors(newErrors); // Set global API errors
        if (atsFeedbackResponse.data) {
          setAtsFeedback(atsFeedbackResponse.data);
        } else {
          showErrorDialog();
          throw new Error("Failed to get ATS feedback");
        }
      } else if (atsFeedbackResponse.data) {
        setAtsFeedback(atsFeedbackResponse.data);
      }
      
      // Step 3: Get optimization feedback
      setProgress(80);
      setProgressText('Generating optimization suggestions...');
      const feedbackResponse = await apiService.getFeedback(jobPosting, uploadResponse.data);
      
      if (feedbackResponse.error) {
        const newErrors = [...apiErrorsLocal, `Feedback Error: ${feedbackResponse.error}`];
        setApiErrorsLocal(newErrors);
        setApiErrors(newErrors);
        setGlobalApiErrors(newErrors); // Set global API errors
        if (feedbackResponse.data) {
          setFeedback(feedbackResponse.data);
        } else {
          showErrorDialog();
          throw new Error("Failed to get optimization suggestions");
        }
      } else if (feedbackResponse.data) {
        setFeedback(feedbackResponse.data);
      }
      
      // Complete and navigate
      setProgress(100);
      setProgressText('Analysis complete!');
      
      // If we have errors but also data, toast the user
      if (apiErrorsLocal.length > 0) {
        toast({
          title: "Warning",
          description: "Some API errors occurred but we've generated results with available data",
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
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
        const newErrors = [...apiErrorsLocal, `Process Error: ${error.message}`];
        setApiErrorsLocal(newErrors);
        setApiErrors(newErrors);
        setGlobalApiErrors(newErrors); // Set global API errors
      }
      
      showErrorDialog();
      setIsUploading(false);
    }
  };

  const handlePasteTextInstead = () => {
    // Find and click the resume text collapsible trigger
    const resumeTextTrigger = document.querySelector('span:contains("Paste Resume Text")');
    if (resumeTextTrigger) {
      const triggerButton = resumeTextTrigger.closest('button');
      if (triggerButton instanceof HTMLButtonElement) {
        triggerButton.click();
      }
    }
  };

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
          errors={apiErrorsLocal} 
          onShowDetails={showErrorDialog}
        />
        
        <FileUploader 
          onFileUpload={handleFileUpload} 
          onTextInput={handleTextInput}
          jobPosting={jobPosting?.description}
        />
      </div>
      
      <UploadProgress
        isUploading={isUploading}
        progress={progress}
        progressText={progressText}
      />
      
      <SubmitButton
        onClick={handleSubmit}
        disabled={(!uploadedFile && !resumeText) || isUploading}
        isUploading={isUploading}
      />
    </div>
  );
};

export default UploadForm;
