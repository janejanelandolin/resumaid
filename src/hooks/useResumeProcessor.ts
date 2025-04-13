
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UseResumeProcessorProps {
  setProgress: (progress: number) => void;
  setProgressText: (text: string) => void;
  showErrorDialog: () => void;
  showContentWarning: () => void;
}

interface ResumeProcessorState {
  isUploading: boolean;
  uploadedFile: File | null;
  resumeText: string;
  apiErrors: string[];
}

export const useResumeProcessor = ({
  setProgress,
  setProgressText,
  showErrorDialog,
  showContentWarning,
}: UseResumeProcessorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    jobPosting, 
    setUploadData, 
    setApiErrors: setGlobalApiErrors,
    setJobPosting,
    setResumeJson,
    setTailoredResumeJson,
    setOriginalScore,
    setTailoredScore
  } = useResumeContext();
  
  const [state, setState] = useState<ResumeProcessorState>({
    isUploading: false,
    uploadedFile: null,
    resumeText: '',
    apiErrors: [],
  });

  const setApiErrors = (errors: string[]) => {
    setState(prev => ({ ...prev, apiErrors: errors }));
    setGlobalApiErrors(errors);
  };

  const handleFileUpload = async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      uploadedFile: file, 
      resumeText: '',
      apiErrors: [] 
    }));
    setApiErrors([]);
  };

  const handleTextInput = (text: string) => {
    setState(prev => ({ 
      ...prev, 
      resumeText: text, 
      uploadedFile: null,
      apiErrors: [] 
    }));
    setApiErrors([]);
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

  const processResume = async () => {
    const { uploadedFile, resumeText } = state;
    
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
    setState(prev => ({ ...prev, isUploading: true }));
    setProgress(0);
    setProgressText('Processing resume...');
    setApiErrors([]);

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
          const newErrors = [...state.apiErrors, `Upload Error: ${uploadResponse.error}`];
          setApiErrors(newErrors);
          showErrorDialog();
        }
        
        if (!uploadResponse.data) {
          throw new Error("Failed to upload resume: No data returned");
        }
        
        setUploadData(uploadResponse.data);
        
        // Check if content is properly set
        if (!uploadResponse.data.content || uploadResponse.data.content.trim() === '') {
          setState(prev => ({ ...prev, isUploading: false }));
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
        const newErrors = [...state.apiErrors, `Resume Schema Error: ${resumeSchemaResponse.error}`];
        setApiErrors(newErrors);
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
          const newErrors = [...state.apiErrors, `Score Error: ${scoreResponse.error}`];
          setApiErrors(newErrors);
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
          const newErrors = [...state.apiErrors, `Tailor Error: ${tailorResponse.error}`];
          setApiErrors(newErrors);
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
            const newErrors = [...state.apiErrors, `Tailored Score Error: ${tailoredScoreResponse.error}`];
            setApiErrors(newErrors);
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
      if (state.apiErrors.length > 0) {
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
        const newErrors = [...state.apiErrors, `Process Error: ${error.message}`];
        setApiErrors(newErrors);
      }
      
      showErrorDialog();
      setState(prev => ({ ...prev, isUploading: false }));
    }
  };

  return {
    state,
    handleFileUpload,
    handleTextInput,
    handleJobPostingInput,
    processResume,
  };
};
