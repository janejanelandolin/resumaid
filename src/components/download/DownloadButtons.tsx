import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileDown, FileJson, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { ResumeJson } from '@/types/resume';

interface DownloadButtonsProps {
  resume: ResumeJson;
  jobTitle: string | undefined;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ resume, jobTitle }) => {
  const { toast } = useToast();
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingJson, setIsDownloadingJson] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStripeButton, setShowStripeButton] = useState(false);

  // Listen for Stripe payment success
  useEffect(() => {
    const handleStripePaymentSuccess = () => {
      console.log('Stripe payment successful, triggering DOCX download');
      handleActualDocxDownload();
    };

    // Listen for the custom event that Stripe buy button fires on success
    window.addEventListener('stripe-payment-success', handleStripePaymentSuccess);
    
    return () => {
      window.removeEventListener('stripe-payment-success', handleStripePaymentSuccess);
    };
  }, [resume, jobTitle]);

  const handleDownloadDocx = async () => {
    // Show the Stripe buy button instead of directly downloading
    setShowStripeButton(true);
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
        
        // Hide the Stripe button after successful download
        setShowStripeButton(false);
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
  
  const handleDownloadJson = async () => {
    if (!resume) {
      toast({
        title: "Error",
        description: "Resume data is missing. Please go back and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloadingJson(true);
      setError(null);
      const formattedJobTitle = jobTitle ? jobTitle.replace(/\s+/g, '-').toLowerCase() : 'my-resume';
      const fileName = `optimized-resume-${formattedJobTitle}.json`;
      
      const response = await apiService.downloadResumeAsJson(resume, jobTitle);
      
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
          description: "Your optimized resume has been downloaded as a JSON file.",
        });
      }
    } catch (error) {
      console.error("JSON download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "JSON download failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingJson(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-purple-600">Download your optimized resume</CardTitle>
        <CardDescription>
          Get your resume in your preferred format, ready for final adjustments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showStripeButton ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Complete your payment to download the Word document:
            </p>
            <div 
              dangerouslySetInnerHTML={{
                __html: `
                  <script async src="https://js.stripe.com/v3/buy-button.js"></script>
                  <stripe-buy-button
                    buy-button-id="buy_btn_1RbQMwQOfmy5vWZJTsFkcxKA"
                    publishable-key="pk_test_51RbPMLQOfmy5vWZJAHdDadRVDL0dYOA7J6QuvvPX8nONpeOn7Dw9ZTDItMGhs1qloBVHUNmGruxGLKqdlZNNBEpg00TAYRO9Sg"
                  >
                  </stripe-buy-button>
                `
              }}
            />
            {isDownloadingDocx && (
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Preparing your download...</span>
              </div>
            )}
          </div>
        ) : (
          <Button 
            onClick={handleDownloadDocx}
            disabled={isDownloadingDocx || isDownloadingJson} 
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
                Download as Word (.docx)
              </>
            )}
          </Button>
        )}
        
        <Button 
          onClick={handleDownloadJson}
          disabled={isDownloadingDocx || isDownloadingJson} 
          variant="outline"
          className="w-full hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300"
        >
          {isDownloadingJson ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing JSON file...
            </>
          ) : (
            <>
              <FileJson className="mr-2 h-4 w-4" />
              Download as JSON (.json)
            </>
          )}
        </Button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
            <p className="font-medium">Error: Unable to download resume</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2">Please try again or contact support if the issue persists.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadButtons;
