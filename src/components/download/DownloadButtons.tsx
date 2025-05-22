
import React, { useState } from 'react';
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

  const handleDownloadDocx = async () => {
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
      
      // Log the resume structure before sending
      console.log('Resume structure being sent to API:', {
        hasBasics: !!resume.basics,
        name: resume.basics?.name,
        workEntries: resume.work?.length,
        educationEntries: resume.education?.length,
        skillsEntries: resume.skills?.length
      });
      
      const response = await apiService.downloadResumeAsDocx(resume, jobTitle);
      
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
      console.error("Download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Download failed",
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
