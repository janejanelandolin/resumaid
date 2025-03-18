
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, ArrowLeft, FileText, FileJson, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DownloadOptimizedResumePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle, selectedTemplates, getOptimizedResume } = useResumeContext();
  
  // Redirect if no templates selected
  React.useEffect(() => {
    if (selectedTemplates.length === 0) {
      navigate('/templates');
    }
  }, [selectedTemplates, navigate]);
  
  const optimizedResume = getOptimizedResume();
  const selectedTemplate = selectedTemplates.length > 0 ? selectedTemplates[0] : null;
  
  const handleDownload = (format: 'pdf' | 'docx' | 'txt' | 'json') => {
    if (!optimizedResume) {
      toast({
        title: "Error",
        description: "Resume data is missing. Please go back and try again.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would call an API to generate the file
    // For demo purposes, we'll just show a success message
    
    let formatName = "";
    switch (format) {
      case 'pdf': formatName = "PDF"; break;
      case 'docx': formatName = "Word"; break;
      case 'txt': formatName = "Text"; break;
      case 'json': formatName = "JSON"; break;
    }
    
    toast({
      title: "Download started",
      description: `Your optimized resume is being downloaded in ${formatName} format.`,
    });
    
    // Simulate download - in a real app, this would be an actual download
    setTimeout(() => {
      console.log(`Downloading optimized resume in ${format} format`);
      console.log('Resume data:', optimizedResume);
      console.log('Selected template:', selectedTemplate);
      
      // For JSON format, we can actually create a real download
      if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(optimizedResume, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `optimized-resume-${jobTitle.replace(/\s+/g, '-').toLowerCase()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    }, 1000);
  };
  
  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/templates')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Download Your Optimized Resume</h1>
            <p className="text-muted-foreground">
              Choose a format to download your optimized resume
              {selectedTemplate && ` with the ${selectedTemplate.name} template`}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Document Formats
              </CardTitle>
              <CardDescription>
                Standard document formats for sending to employers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleDownload('pdf')} 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <FileDown className="h-4 w-4 mr-2 text-red-500" />
                Download as PDF
              </Button>
              <Button 
                onClick={() => handleDownload('docx')} 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <FileDown className="h-4 w-4 mr-2 text-blue-500" />
                Download as Word Document (.docx)
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileJson className="h-5 w-5 mr-2 text-green-500" />
                Data Formats
              </CardTitle>
              <CardDescription>
                Raw data formats for technical uses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleDownload('txt')} 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <FileDown className="h-4 w-4 mr-2 text-gray-500" />
                Download as Plain Text (.txt)
              </Button>
              <Button 
                onClick={() => handleDownload('json')} 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <FileDown className="h-4 w-4 mr-2 text-yellow-500" />
                Download as JSON
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {selectedTemplate && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Resume will be formatted using the {selectedTemplate.name} template
            </p>
            <div className="mx-auto w-64 h-80 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={selectedTemplate.thumbnail} 
                alt={`${selectedTemplate.name} preview`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DownloadOptimizedResumePage;
