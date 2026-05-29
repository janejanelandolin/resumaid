import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import NavBar from '@/components/layout/NavBar';
import UploadForm from '@/components/upload/UploadForm';

const UploadPage = () => {
  const navigate = useNavigate();
  const { jobTitle, jobPosting } = useResumeContext();

  useEffect(() => {
    if (!jobPosting) {
      navigate('/');
    }
  }, [jobPosting, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <NavBar />
      <PageContainer>
        <div className="w-full max-w-lg mx-auto space-y-5">
          {/* Context strip */}
          {jobTitle && (
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Optimising for</p>
              <p className="font-semibold text-gray-700 text-lg">{jobTitle}</p>
            </div>
          )}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload your resume
            </h1>
            <p className="text-sm text-gray-500">
              Drop a PDF, DOCX, or TXT — or paste the text
            </p>
          </div>
          <UploadForm />
        </div>
      </PageContainer>
    </div>
  );
};

export default UploadPage;
