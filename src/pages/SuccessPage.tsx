
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { 
    jobTitle, 
    resumeJson, 
    tailoredResumeJson
  } = useResumeContext();

  useEffect(() => {
    // If no resume data, redirect to home
    if (!resumeJson || !tailoredResumeJson) {
      navigate('/');
    }
  }, [navigate, resumeJson, tailoredResumeJson]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <PageContainer>
        <div className="flex flex-col items-center justify-center space-y-6 py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
          
          <div className="text-center max-w-md">
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your optimized resume for the "{jobTitle}" position is ready to download.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/analysis')}
            >
              View Analysis
            </Button>
            <Button onClick={() => navigate('/download')}>
              Download Resume
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default SuccessPage;
