
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/PageContainer';
import FileUploader from '@/components/FileUploader';
import TypewriterText from '@/components/TypewriterText';
import { FileUp, Sparkle, CheckCircle2, UploadCloud, AlertTriangle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    jobTitle, 
    jobPosting, 
    setUploadData, 
    setAtsFeedback, 
    setFeedback 
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
              
              {apiErrors.length > 0 && !showErrorDialog && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Some errors occurred. Click "Details" for more information.
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowErrorDialog(true)}
                    >
                      Details
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <FileUploader 
                onFileUpload={handleFileUpload} 
                onTextInput={handleTextInput}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    {progressText}
                    {progress === 100 && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
                  </span>
                  <span className="font-medium text-indigo-600">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-indigo-100" 
                />
                <div className="h-1 w-full bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-30 animate-pulse"></div>
              </div>
            )}
            
            <Button 
              onClick={handleSubmit} 
              disabled={(!uploadedFile && !resumeText) || isUploading}
              className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group"
            >
              <span className="flex items-center gap-2">
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Check compatibility score
                    <UploadCloud className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </>
                )}
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-[2px] bg-white/30 rounded-full blur-sm"></div>
            </Button>
          </div>

          <div className="text-center space-y-2 py-4 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
            <div className="inline-flex items-center gap-1 mb-2">
              <Sparkle className="h-4 w-4 text-indigo-400" />
              <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Optimizing for: <span className="font-bold">{jobTitle}</span>
              </p>
              <Sparkle className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-xs text-indigo-500/80">
              We'll analyze your resume against ATS systems and job requirements.
            </p>
          </div>
        </div>
      </PageContainer>

      {/* Content warning dialog */}
      <Dialog open={showContentWarning} onOpenChange={setShowContentWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Resume Content Issue
            </DialogTitle>
            <DialogDescription>
              We couldn't extract the content from your resume properly. This may affect the analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">Please try one of these options:</p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Convert your resume to plain text (.txt) format and upload again</li>
              <li>Copy the text from your resume and paste it directly</li>
            </ul>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowContentWarning(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowContentWarning(false);
                  // Safely find the button by its text content rather than trying to access click
                  const pasteOption = document.querySelector('button[variant="link"]');
                  if (pasteOption instanceof HTMLButtonElement) {
                    pasteOption.click();
                  }
                }}
              >
                Paste Text Instead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Errors Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              API Error Details
            </DialogTitle>
            <DialogDescription>
              The following errors were encountered during processing:
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 space-y-4">
            {apiErrors.map((error, index) => (
              <Alert key={index} variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="break-words whitespace-pre-wrap">
                  {error}
                </AlertDescription>
              </Alert>
            ))}
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">Suggestions to fix:</h4>
              <ul className="list-disc list-inside text-xs space-y-2">
                <li>Try uploading a smaller or simpler resume file</li>
                <li>Convert your PDF resume to plain text and paste it directly</li>
                <li>Try a different file format (TXT is recommended)</li>
                <li>Ensure your internet connection is stable</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowErrorDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowErrorDialog(false);
                setApiErrors([]);
              }}
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadPage;
