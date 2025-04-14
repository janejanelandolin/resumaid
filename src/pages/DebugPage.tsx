
import React, { useState } from 'react';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileJson, Webhook } from 'lucide-react';
import ApiInputsTab from '@/components/debug/ApiInputsTab';
import ApiOutputsTab from '@/components/debug/ApiOutputsTab';
import ApiEndpointInfo from '@/components/debug/ApiEndpointInfo';

const DebugPage = () => {
  const { 
    jobPosting, 
    uploadData, 
    feedback,
    // Add new workflow state values
    resumeJson,
    tailoredResumeJson,
    originalScore,
    tailoredScore
  } = useResumeContext();
  const [activeTab, setActiveTab] = useState('inputs');

  // Format JSON for display with proper indentation
  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error formatting data';
    }
  };

  // Helper to check if an object has data
  const hasData = (obj: any) => obj && Object.keys(obj).length > 0;

  // Prepare API input previews for ATS and Feedback calls
  const getATSApiInput = () => {
    if (!jobPosting || !uploadData?.content) return "Job posting or resume not available";
    
    // Create a preview of what's sent to the API with query parameters
    // Important: Using exactly 'resume' and 'job_posting' as parameter names
    const apiInput = {
      parameters: {
        resume: uploadData.content.substring(0, 200) + '...',
        job_posting: jobPosting // Send the full job posting object
      },
      method: 'POST'
    };
    
    return formatJSON(apiInput);
  };

  const getFeedbackApiInput = () => {
    if (!jobPosting || !uploadData?.content) return "Job posting or resume not available";
    
    // Create a preview of what's sent to the API with query parameters
    // Important: Using exactly 'resume' and 'job_posting' as parameter names
    const apiInput = {
      parameters: {
        resume: uploadData.content.substring(0, 200) + '...',
        job_posting: jobPosting // Send the full job posting object
      },
      method: 'POST'
    };
    
    return formatJSON(apiInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">API Debug</h1>
              <p className="text-muted-foreground">Inspect API inputs and outputs</p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
          </div>

          <Tabs defaultValue="inputs" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="inputs" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                <span>API Inputs</span>
              </TabsTrigger>
              <TabsTrigger value="outputs" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                <span>API Outputs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inputs">
              <ApiInputsTab 
                jobPosting={jobPosting}
                uploadData={uploadData}
                getATSApiInput={getATSApiInput}
                getFeedbackApiInput={getFeedbackApiInput}
              />
            </TabsContent>

            <TabsContent value="outputs">
              <ApiOutputsTab 
                jobPosting={jobPosting}
                uploadData={uploadData}
                feedback={feedback}
                resumeJson={resumeJson}
                tailoredResumeJson={tailoredResumeJson}
                originalScore={originalScore}
                tailoredScore={tailoredScore}
                hasData={hasData}
              />
            </TabsContent>
          </Tabs>

          <Separator />

          <ApiEndpointInfo />
        </div>
      </PageContainer>
    </div>
  );
};

export default DebugPage;
