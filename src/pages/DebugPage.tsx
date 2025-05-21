
import { useState } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import ApiInputsTab from '@/components/debug/ApiInputsTab';
import ApiOutputsTab from '@/components/debug/ApiOutputsTab';
import ApiEndpointInfo from '@/components/debug/ApiEndpointInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DebugCard from '@/components/debug/DebugCard';
import { formatJobPostingAsText } from '@/hooks/resume/useResumeNormalizer';
import PageContainer from '@/components/PageContainer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DebugPage = () => {
  const [activeTab, setActiveTab] = useState('inputs');
  const navigate = useNavigate();
  
  const { 
    jobPosting, 
    uploadData,
    apiErrors,
    jobTitle,
    resumeJson,
    tailoredResumeJson,
    originalScore,
    tailoredScore,
  } = useResumeContext();
  
  // Format job posting as text
  const jobPostingText = jobPosting ? formatJobPostingAsText(jobPosting) : '';
  
  // Get resume content
  const resumeContent = uploadData?.content || '';
  
  // Determine if we have data to display
  const hasJobPosting = !!jobPosting && !!jobPostingText;
  const hasResumeContent = !!resumeContent;
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageContainer className="py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Debug Dashboard</h1>
            <Button onClick={() => navigate(-1)} variant="outline" size="sm">
              Back
            </Button>
          </div>
          
          <DebugCard
            title="Job Title"
            description="The job title entered by the user"
            data={jobTitle}
            isAvailable={!!jobTitle}
          />
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="inputs">API Inputs</TabsTrigger>
              <TabsTrigger value="outputs">API Outputs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inputs" className="pt-6">
              <div className="grid gap-6">
                <ApiEndpointInfo />
                
                <ApiInputsTab
                  jobPostingText={jobPostingText}
                  resumeContent={resumeContent}
                  hasJobPosting={hasJobPosting}
                  hasResumeContent={hasResumeContent}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="outputs" className="pt-6">
              <ApiOutputsTab
                originalScore={originalScore}
                tailoredScore={tailoredScore}
                resumeJson={resumeJson}
                tailoredResumeJson={tailoredResumeJson}
                apiErrors={apiErrors}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  );
};

export default DebugPage;
