
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
    setApiErrors: setGlobalApiErrors,
    setJobPosting,
    // Add new context values for the updated workflow
    setResumeJson,
    setTailoredResumeJson,
    setOriginalScore,
    setTailoredScore
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
    setProgressText('Processing resume...');
    setApiErrorsLocal([]);
    setApiErrors([]);
    setGlobalApiErrors([]); // Clear global API errors

    try {
      // Different processing flow based on whether we have a file or text input
      let extractedContent = '';
      
      // If we have a file, upload it through the /upload endpoint
      if (uploadedFile) {
        setProgressText('Uploading resume file...');
        setProgress(15);
        
        const uploadResponse = await apiService.uploadResume(uploadedFile);
        console.log("Upload response:", uploadResponse);
        
        if (uploadResponse.error) {
          const newErrors = [...apiErrorsLocal, `Upload Error: ${uploadResponse.error}`];
          setApiErrorsLocal(newErrors);
          setApiErrors(newErrors);
          setGlobalApiErrors(newErrors);
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
        
        // Extract the resume text content from the upload response
        extractedContent = uploadResponse.data.content;
      } else if (resumeText) {
        // If we have direct text input, use it directly
        extractedContent = resumeText;
        setProgress(30);
      }
      
      console.log("Content to process length:", extractedContent.length);
      console.log("Content preview:", extractedContent.substring(0, 100) + '...');
      
      // Step 2: Get Resume Schema - Using the extracted text content
      setProgress(40);
      setProgressText('Converting resume to structured format...');
      
      const resumeSchemaResponse = await apiService.getResumeSchema(extractedContent);
      console.log("Resume schema response:", resumeSchemaResponse);
      
      if (resumeSchemaResponse.error) {
        const newErrors = [...apiErrorsLocal, `Resume Schema Error: ${resumeSchemaResponse.error}`];
        setApiErrorsLocal(newErrors);
        setApiErrors(newErrors);
        setGlobalApiErrors(newErrors);
        if (resumeSchemaResponse.data) {
          setResumeJson(resumeSchemaResponse.data);
        } else {
          showErrorDialog();
          throw new Error("Failed to get resume schema");
        }
      } else if (resumeSchemaResponse.data) {
        setResumeJson(resumeSchemaResponse.data);
      }
      
      // Format job posting as a simple string
      let jobPostingText = '';
      if (jobPosting.userProvided && jobPosting.description) {
        jobPostingText = jobPosting.description;
      } else if (jobPosting.description) {
        jobPostingText = jobPosting.description;
      } else {
        jobPostingText = jobPosting.title || '';
        
        if (jobPosting.requirements && jobPosting.requirements.length > 0) {
          jobPostingText += `\n\nRequirements:\n${jobPosting.requirements.join('\n')}`;
        }
        
        if (jobPosting.skills && jobPosting.skills.length > 0) {
          jobPostingText += `\n\nSkills:\n${jobPosting.skills.join('\n')}`;
        }
      }
      
      // Step 3: Score the original resume
      setProgress(60);
      setProgressText('Scoring your resume...');
      
      if (resumeSchemaResponse.data) {
        const scoreResponse = await apiService.scoreResume(resumeSchemaResponse.data, jobPostingText);
        
        if (scoreResponse.error) {
          const newErrors = [...apiErrorsLocal, `Score Error: ${scoreResponse.error}`];
          setApiErrorsLocal(newErrors);
          setApiErrors(newErrors);
          setGlobalApiErrors(newErrors);
          if (scoreResponse.data) {
            setOriginalScore(scoreResponse.data);
          }
        } else if (scoreResponse.data) {
          setOriginalScore(scoreResponse.data);
        }
        
        // Step 4: Tailor the resume
        setProgress(80);
        setProgressText('Tailoring your resume to the job...');
        const tailorResponse = await apiService.tailorResume(resumeSchemaResponse.data, jobPostingText);
        
        if (tailorResponse.error) {
          const newErrors = [...apiErrorsLocal, `Tailor Error: ${tailorResponse.error}`];
          setApiErrorsLocal(newErrors);
          setApiErrors(newErrors);
          setGlobalApiErrors(newErrors);
          if (tailorResponse.data) {
            setTailoredResumeJson(tailorResponse.data);
          }
        } else if (tailorResponse.data) {
          setTailoredResumeJson(tailorResponse.data);
          
          // Step 5: Score the tailored resume
          setProgress(90);
          setProgressText('Evaluating optimized resume...');
          const tailoredScoreResponse = await apiService.scoreResume(tailorResponse.data, jobPostingText);
          
          if (tailoredScoreResponse.error) {
            const newErrors = [...apiErrorsLocal, `Tailored Score Error: ${tailoredScoreResponse.error}`];
            setApiErrorsLocal(newErrors);
            setApiErrors(newErrors);
            setGlobalApiErrors(newErrors);
            if (tailoredScoreResponse.data) {
              setTailoredScore(tailoredScoreResponse.data);
            }
          } else if (tailoredScoreResponse.data) {
            setTailoredScore(tailoredScoreResponse.data);
          }
        }
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
        setGlobalApiErrors(newErrors);
      }
      
      showErrorDialog();
      setIsUploading(false);
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
