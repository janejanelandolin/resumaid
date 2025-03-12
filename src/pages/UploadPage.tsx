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

  useEffect(() => {
    if (!jobTitle || !jobPosting) {
      navigate('/');
    }
  }, [jobTitle, jobPosting, navigate]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    if (!jobPosting) {
      navigate('/');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setProgressText('Uploading resume...');

    try {
      // Step 1: Upload resume
      setProgress(20);
      const uploadResponse = await apiService.uploadResume(uploadedFile);
      setUploadData(uploadResponse);
      
      // Step 2: Get ATS feedback
      setProgress(50);
      setProgressText('Analyzing with ATS systems...');
      const atsFeedbackResponse = await apiService.getATSFeedback(jobPosting, uploadResponse);
      setAtsFeedback(atsFeedbackResponse);
      
      // Step 3: Get optimization feedback
      setProgress(80);
      setProgressText('Generating optimization suggestions...');
      const feedbackResponse = await apiService.getFeedback(jobPosting, uploadResponse);
      setFeedback(feedbackResponse);
      
      // Complete and navigate
      setProgress(100);
      setProgressText('Analysis complete!');
      
      setTimeout(() => {
        navigate('/analysis');
      }, 500);
      
    } catch (error) {
      console.error('Error processing resume:', error);
      toast({
        title: "Error",
        description: "Failed to process your resume",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Upload Your Resume</h1>
          <p className="text-muted-foreground text-sm">
            <TypewriterText text="Upload your resume to get started..." />
          </p>
        </div>

        <div className="space-y-6 py-4">
          <FileUploader onFileUpload={handleFileUpload} />
          
          {isUploading && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span>{progressText}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={handleSubmit} 
            disabled={!uploadedFile || isUploading}
            className="w-full"
          >
            {isUploading ? "Processing..." : "Check compatibility score"}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Optimizing for: <span className="font-medium text-primary">{jobTitle}</span></p>
          <p className="mt-1">
            We'll analyze your resume against ATS systems and job requirements.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default UploadPage;
