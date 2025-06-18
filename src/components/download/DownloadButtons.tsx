
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileDown, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { ResumeJson } from '@/types/resume';
import PaymentModal from '@/components/payments/PaymentModal';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface DownloadButtonsProps {
  resume: ResumeJson;
  jobTitle: string | undefined;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ resume, jobTitle }) => {
  const { toast } = useToast();
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { hasPaid, isVerifying } = usePaymentStatus();

  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handleDownloadDocx = async () => {
    if (hasPaid) {
      await handleActualDocxDownload();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleActualDocxDownload = async () => {
    if (!resume) {
      toast({
        title: "Error",
        description: "Resume data is missing. Please go back and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloadingDocx(true);
      setError(null);
      const formattedJobTitle = jobTitle ? jobTitle.replace(/\s+/g, '-').toLowerCase() : 'my-resume';
      const fileName = `optimized-resume-${formattedJobTitle}.docx`;
      
      const response = await apiService.downloadResumeAsDocx(resume, jobTitle || '');
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        toast({
          title: "Download successful",
          description: "Your optimized resume has been downloaded as a Word document.",
        });
      }
    } catch (error) {
      console.error("DOCX download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "DOCX download failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-purple-600">Download your optimized resume</CardTitle>
          <CardDescription>
            Get your resume in your preferred format, ready for final adjustments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Word Document Download Section */}
          <div className="space-y-2">
            {!hasPaid ? (
              <>
                <p className="text-sm text-gray-500 text-center">
                  Please pay to download optimized resume in Word format (.docx)
                </p>
                <Button 
                  onClick={handlePaymentClick}
                  disabled={isDownloadingDocx || isVerifying} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay $4.99
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 text-center">
                  Thank you for payment
                </p>
                <Button 
                  onClick={handleDownloadDocx}
                  disabled={isDownloadingDocx} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300"
                >
                  {isDownloadingDocx ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Word document...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download in Word (.docx)
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              <p className="font-medium">Error: Unable to download resume</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </>
  );
};

export default DownloadButtons;
