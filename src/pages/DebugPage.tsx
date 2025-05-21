
// Update only the parts that reference 'feedback'
import React, { useState } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import AdminFooter from '@/components/AdminFooter';
import DebugCard from '@/components/debug/DebugCard';
import { formatJobPostingAsText } from '@/hooks/resume/useResumeNormalizer';
import ApiEndpointInfo from '@/components/debug/ApiEndpointInfo';
import ApiInputsTab from '@/components/debug/ApiInputsTab';
import ApiOutputsTab from '@/components/debug/ApiOutputsTab';
import ApiDebugHelper from '@/components/debug/ApiDebugHelper';

const DebugPage = () => {
  const [selectedTab, setSelectedTab] = useState('endpoints');
  const { 
    jobPosting,
    uploadData,
    resumeJson,
    tailoredResumeJson,
    originalScore,
    tailoredScore
  } = useResumeContext();

  // Helper function to determine if an object has data
  const hasData = (obj: any) => obj && Object.keys(obj).length > 0;

  // Format job posting as text for display
  const jobPostingText = jobPosting ? formatJobPostingAsText(jobPosting) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Debug Console</h1>
          </div>

          <DebugCard />

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
              <TabsTrigger value="inputs">API Inputs</TabsTrigger>
              <TabsTrigger value="outputs">API Outputs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoints" className="py-4">
              <ApiEndpointInfo />
            </TabsContent>
            
            <TabsContent value="inputs" className="py-4">
              <ApiInputsTab 
                jobTitle={jobPosting?.jobTitle || ''}
                jobPostingText={jobPostingText}
                resumeContent={uploadData?.content || ''}
                hasJobPosting={hasData(jobPosting)}
                hasResumeContent={Boolean(uploadData?.content)}
              />
            </TabsContent>
            
            <TabsContent value="outputs" className="py-4">
              <ApiOutputsTab 
                jobPosting={jobPosting}
                uploadData={uploadData}
                resumeJson={resumeJson}
                tailoredResumeJson={tailoredResumeJson}
                originalScore={originalScore}
                tailoredScore={tailoredScore}
                hasData={hasData}
              />
            </TabsContent>
          </Tabs>

          <div className="pt-4">
            <ApiDebugHelper />
          </div>

          <AdminFooter />
        </div>
      </PageContainer>
    </div>
  );
};

export default DebugPage;
