import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { apiService } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/PageContainer';
import FileUploader from '@/components/FileUploader';
import TypewriterText from '@/components/TypewriterText';
import { Sparkle } from 'lucide-react';

// Import our new components
import UploadProgress from '@/components/upload/UploadProgress';
import ErrorDialog from '@/components/upload/ErrorDialog';
import ContentWarningDialog from '@/components/upload/ContentWarningDialog';
import UploadSummary from '@/components/upload/UploadSummary';
import SubmitButton from '@/components/upload/SubmitButton';
import ErrorAlert from '@/components/upload/ErrorAlert';

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    jobTitle, 
    jobPosting, 
    setUploadData, 
    setAtsFeedback, 
    setFeedback,
    setJobPosting
  } = useResumeContext();
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [showContentWarning, setShowContentWarning] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    if (!jobTitle || !jobPosting) {
      navigate('/');
    }
  }, [jobTitle, jobPosting, navigate]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setResumeText('');
    setApiErrors([]);
  };

  const handleTextInput = (text: string) => {
    setResumeText(text);
    setUploadedFile(null);
    setApiErrors([]);
  };

  const handleJobPostingInput = (text: string) => {
    if (text.trim() && jobPosting) {
      // Create a new jobPosting object with the updated description
      // This handles the case where the user provides their own job posting text
      const updatedJobPosting = {
        ...jobPosting,
        description: text,
        userProvided: true // Mark this as user-provided
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
    setApiErrors([]);

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
        setApiErrors(prev => [...prev, `Upload Error: ${uploadResponse.error}`]);
        setShowErrorDialog(true);
      }
      
      if (!uploadResponse.data) {
        throw new Error("Failed to upload resume: No data returned");
      }
      
      setUploadData(uploadResponse.data);
      
      // Check if content is properly set
      if (!uploadResponse.data.content || uploadResponse.data.content.trim() === '') {
        setIsUploading(false);
        setShowContentWarning(true);
        return;
      }
      
      // Step 2: Get ATS feedback
      setProgress(50);
      setProgressText('Analyzing with ATS systems...');
      const atsFeedbackResponse = await apiService.getATSFeedback(jobPosting, uploadResponse.data);
      
      if (atsFeedbackResponse.error) {
        setApiErrors(prev => [...prev, `ATS Feedback Error: ${atsFeedbackResponse.error}`]);
        if (atsFeedbackResponse.data) {
          setAtsFeedback(atsFeedbackResponse.data);
        } else {
          setShowErrorDialog(true);
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
        setApiErrors(prev => [...prev, `Feedback Error: ${feedbackResponse.error}`]);
        if (feedbackResponse.data) {
          setFeedback(feedbackResponse.data);
        } else {
          setShowErrorDialog(true);
          throw new Error("Failed to get optimization suggestions");
        }
      } else if (feedbackResponse.data) {
        setFeedback(feedbackResponse.data);
      }
      
      // Complete and navigate
      setProgress(100);
      setProgressText('Analysis complete!');
      
      // If we have errors but also data, toast the user
      if (apiErrors.length > 0) {
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
        setApiErrors(prev => [...prev, `Process Error: ${error.message}`]);
      }
      
      setShowErrorDialog(true);
      setIsUploading(false);
    }
  };

  const handleTryAgain = () => {
    setShowErrorDialog(false);
    setApiErrors([]);
  };

  const handlePasteTextInstead = () => {
    setShowContentWarning(false);
    // Find the paste option button by checking for a button with variant="link"
    const pasteOption = document.querySelector('button[variant="link"]');
    if (pasteOption instanceof HTMLButtonElement) {
      pasteOption.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <PageContainer>
        <div className="w-full space-y-6">
          <div className="space-y-2 text-center relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Your Resume
            </h1>
            <div className="text-muted-foreground text-sm">
              <TypewriterText text="Choose how you want to submit your resume..." />
            </div>
          </div>

          <div className="space-y-6 py-4">
            <div className="relative">
              <div className="absolute -top-6 -right-6 text-indigo-300 animate-spin-slow">
                <Sparkle size={20} />
              </div>
              <div className="absolute -bottom-6 -left-6 text-purple-300 animate-pulse">
                <Sparkle size={16} />
              </div>
              
              <ErrorAlert 
                errors={apiErrors} 
                onShowDetails={() => setShowErrorDialog(true)}
              />
              
              <FileUploader 
                onFileUpload={handleFileUpload} 
                onTextInput={handleTextInput}
                onJobPostingInput={handleJobPostingInput}
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

          <UploadSummary jobTitle={jobTitle} />
        </div>
      </PageContainer>

      <ContentWarningDialog
        open={showContentWarning}
        onOpenChange={setShowContentWarning}
        onPasteTextInstead={handlePasteTextInstead}
      />

      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errors={apiErrors}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
};

export default UploadPage;
