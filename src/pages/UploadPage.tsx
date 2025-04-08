
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import TypewriterText from '@/components/TypewriterText';
import { Sparkle } from 'lucide-react';

// Import our new component managers
import UploadDialogManager from '@/components/upload/UploadDialogManager';
import UploadStateManager from '@/components/upload/UploadStateManager';
import UploadForm from '@/components/upload/UploadForm';
import UploadSummary from '@/components/upload/UploadSummary';

const UploadPage = () => {
  const navigate = useNavigate();
  const { jobTitle, jobPosting } = useResumeContext();
  
  useEffect(() => {
    if (!jobTitle || !jobPosting) {
      navigate('/');
    }
  }, [jobTitle, jobPosting, navigate]);

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

          <UploadDialogManager>
            {({ showErrorDialog, showContentWarning, apiErrors, setApiErrors }) => (
              <UploadStateManager>
                {({ progress, progressText, setProgress, setProgressText }) => (
                  <UploadForm
                    showErrorDialog={showErrorDialog}
                    showContentWarning={showContentWarning}
                    setApiErrors={setApiErrors}
                    setProgress={setProgress}
                    setProgressText={setProgressText}
                    progress={progress}
                    progressText={progressText}
                  />
                )}
              </UploadStateManager>
            )}
          </UploadDialogManager>

          <UploadSummary jobTitle={jobTitle} />
        </div>
      </PageContainer>
    </div>
  );
};

export default UploadPage;
