
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
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DownloadButtonsProps {
  resume: ResumeJson;
  jobTitle: string | undefined;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ resume, jobTitle }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { subscribed, createSubscription, isLoading: subLoading } = useSubscription();

  const handleDownloadDocx = async () => {
    if (subscribed) {
      await handleActualDocxDownload();
    } else {
      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe to our premium service.",
          variant: "destructive",
        });
        return;
      }

      // Prompt for subscription
      toast({
        title: "Premium Feature",
        description: "Subscribe to download unlimited optimized resumes.",
        variant: "default",
      });
      try {
        await createSubscription();
      } catch (error) {
        console.error("Subscription error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          title: "Subscription Error",
          description: `Failed to start subscription process: ${errorMessage}`,
          variant: "destructive",
        });
      }
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
          {!subscribed ? (
            <>
              <Button 
                onClick={handleDownloadDocx}
                disabled={subLoading} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300"
              >
                {subLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting subscription...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {user ? 'Subscribe for $14.99/month' : 'Sign in to Subscribe'}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {user ? 'Subscription required for downloads' : 'Please sign in first to subscribe'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-green-600 text-center font-medium">
                Premium Member - Unlimited Downloads
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
  );
};

export default DownloadButtons;
