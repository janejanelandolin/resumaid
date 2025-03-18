
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
import { FileUp, Sparkle, CheckCircle2, UploadCloud } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <PageContainer>
        <div className="w-full space-y-6">
          <div className="space-y-2 text-center relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Your Resume
            </h1>
            <p className="text-muted-foreground text-sm">
              <TypewriterText text="Upload your resume to get started..." />
            </p>
          </div>

          <div className="space-y-6 py-4">
            <div className="relative">
              <div className="absolute -top-6 -right-6 text-indigo-300 animate-spin-slow">
                <Sparkle size={20} />
              </div>
              <div className="absolute -bottom-6 -left-6 text-purple-300 animate-pulse">
                <Sparkle size={16} />
              </div>
              
              <FileUploader onFileUpload={handleFileUpload} />
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
              disabled={!uploadedFile || isUploading}
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
    </div>
  );
};

export default UploadPage;
