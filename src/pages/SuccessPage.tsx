
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/PageContainer';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { 
    jobTitle, 
    resumeJson, 
    tailoredResumeJson
  } = useResumeContext();
  const { hasPaid, isVerifying } = usePaymentStatus();

  useEffect(() => {
    // If payment is verified, redirect to download page after a short delay
    if (hasPaid && !isVerifying) {
      const timer = setTimeout(() => {
        navigate('/download');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasPaid, isVerifying, navigate]);

  useEffect(() => {
    // If no resume data and no payment verification in progress, redirect to home
    if (!resumeJson && !tailoredResumeJson && !isVerifying) {
      navigate('/');
    }
  }, [navigate, resumeJson, tailoredResumeJson, isVerifying]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <PageContainer>
        <div className="flex flex-col items-center justify-center space-y-6 py-10">
          {isVerifying ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-center">Verifying Payment...</h1>
              <p className="text-gray-600 text-center">
                Please wait while we confirm your payment.
              </p>
            </>
          ) : hasPaid ? (
            <>
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
                <p className="text-sm text-gray-500">
                  Redirecting you to the download page...
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
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-yellow-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-center">Payment Processing...</h1>
              
              <div className="text-center max-w-md">
                <p className="text-gray-600 mb-4">
                  We're still processing your payment. This may take a few moments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Go Home
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default SuccessPage;
