import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import UploadForm from '@/components/upload/UploadForm';

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
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload your resume
            </h1>
            <p className="text-sm text-gray-500">
              Drop a PDF, DOCX, or TXT file — or paste the text below
            </p>
          </div>
          <UploadForm />
        </div>
      </PageContainer>
    </div>
  );
};

export default UploadPage;
