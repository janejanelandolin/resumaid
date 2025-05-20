
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FileDown, ArrowLeft, Loader2, FileJson, FileCheck } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const DownloadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingJson, setIsDownloadingJson] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    jobTitle, 
    tailoredResumeJson, 
    resumeJson,
    originalScore
  } = useResumeContext();
  
  // Get rationale from tailored resume if available
  const resume = tailoredResumeJson || resumeJson;
  const rationale = tailoredResumeJson?.rationale || [];
  
  // Get score explanation from the original score
  const scoreExplanation = originalScore?.explanation;
  
  useEffect(() => {
    if (!resume) {
      navigate('/upload');
    }
  }, [resume, navigate]);

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
  
  if (!resume) {
    return null;
  }

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/analysis')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Download Your Optimized Resume</h1>
            <p className="text-muted-foreground">
              Your optimized resume is ready for download
            </p>
          </div>
        </div>
        
        {/* Download buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Download Optimized Resume</CardTitle>
            <CardDescription>
              Get your resume in your preferred format, ready for final adjustments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx || isDownloadingJson} 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isDownloadingDocx ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Word document...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Resume (.docx)
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDownloadJson}
              disabled={isDownloadingDocx || isDownloadingJson} 
              variant="outline"
              className="w-full"
            >
              {isDownloadingJson ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing JSON file...
                </>
              ) : (
                <>
                  <FileJson className="mr-2 h-4 w-4" />
                  Download Resume (.json)
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
        
        {/* ATS Evaluation Summary - moved from Analysis page */}
        {scoreExplanation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 text-indigo-500 mr-2" />
                ATS Evaluation Summary
              </CardTitle>
              <CardDescription>
                How your resume is evaluated by Applicant Tracking Systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem 
                  value="score-explanation"
                  className="border border-indigo-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                    View ATS Evaluation Details
                  </AccordionTrigger>
                  <AccordionContent className="text-sm px-4 py-3 bg-white/80">
                    <div className="border-l-2 border-indigo-300 pl-3">
                      {scoreExplanation}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}
        
        {/* Rationale section */}
        {rationale && rationale.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Optimization Rationale</CardTitle>
              <CardDescription>
                Here's how we optimized your resume for this job
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {rationale.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Renamed Resume Summary to Optimized Resume Summary with highlights */}
        <Card className="border-2 border-indigo-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-indigo-800">Optimized Resume Summary</CardTitle>
            <CardDescription>
              A brief overview of your optimized resume with highlighted changes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <h3 className="font-medium text-sm text-indigo-600">Name</h3>
              <p className="bg-indigo-50 p-1 rounded">{resume.basics?.name || 'Not provided'}</p>
            </div>
            
            {resume.basics?.summary && (
              <div>
                <h3 className="font-medium text-sm text-indigo-600">Summary</h3>
                <p className="text-sm bg-indigo-50 p-2 rounded border-l-2 border-indigo-400">{resume.basics.summary}</p>
              </div>
            )}
            
            {resume.work && resume.work.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-indigo-600">Experience</h3>
                <p className="text-sm bg-indigo-50 p-1 rounded">
                  {resume.work.length} positions including {resume.work[0].name}
                </p>
              </div>
            )}
            
            {resume.skills && resume.skills.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-indigo-600">Skills</h3>
                <p className="text-sm bg-indigo-50 p-1 rounded">
                  {resume.skills.length} skill categories
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default DownloadPage;
