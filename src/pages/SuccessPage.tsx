
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import { CheckCircle, ArrowRight } from 'lucide-react';
import TemplateGallery from '@/components/templates/TemplateGallery';
import TemplateDownloader from '@/components/templates/TemplateDownloader';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobTitle } = useResumeContext();
  
  // Get transaction details from location state
  const transactionDetails = location.state || {};
  
  useEffect(() => {
    // If no transaction details exist, redirect to homepage
    if (!transactionDetails.transactionId) {
      navigate('/');
    }
  }, [transactionDetails, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          
          <p className="text-muted-foreground">
            Your optimized resume for <span className="font-medium">{jobTitle}</span> is ready.
          </p>
          
          {transactionDetails.transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 max-w-md mx-auto">
              <h3 className="font-medium">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono">{transactionDetails.transactionId.substring(0, 12)}...</span>
                </div>
                {transactionDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>${transactionDetails.amount.toFixed(2)}</span>
                  </div>
                )}
                {transactionDetails.date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(transactionDetails.date)}</span>
                  </div>
                )}
                {transactionDetails.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{transactionDetails.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <TemplateGallery />
        </div>
        
        <div className="space-y-4">
          <TemplateDownloader />
          
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" />
            Return to Homepage
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SuccessPage;
