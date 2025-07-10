
import { useState } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import ApiInputsTab from '@/components/debug/ApiInputsTab';
import ApiOutputsTab from '@/components/debug/ApiOutputsTab';
import ApiEndpointInfo from '@/components/debug/ApiEndpointInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DebugCard from '@/components/debug/DebugCard';
import { formatJobPostingAsText } from '@/hooks/resume/useResumeNormalizer';
import PageContainer from '@/components/PageContainer';
import SessionLogsSection from '@/components/admin/SessionLogsSection';
import AdminPasswordDialog from '@/components/admin/AdminPasswordDialog';
import UserManagement from '@/components/admin/UserManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const { 
    jobPosting, 
    uploadData,
    apiErrors,
    jobTitle,
    resumeJson,
    tailoredResumeJson,
    originalScore,
    tailoredScore
  } = useResumeContext();
  
  // Format job posting as text
  const jobPostingText = jobPosting ? formatJobPostingAsText(jobPosting) : '';
  
  // Get resume content
  const resumeContent = uploadData?.content || '';
  
  // Determine if we have data to display
  const hasJobPosting = !!jobPosting && !!jobPostingText;
  const hasResumeContent = !!resumeContent;

  // Handle authentication success
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };
  
  // If not authenticated, show only the password dialog
  if (!isAuthenticated) {
    return <AdminPasswordDialog onAuthenticated={handleAuthenticated} />;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageContainer className="py-8" centerX={false} showFooter={false}>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Button>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Admin Only</span>
          </div>
          
          {/* Session Logs Section */}
          <SessionLogsSection />
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="inputs">API Inputs</TabsTrigger>
              <TabsTrigger value="outputs">API Outputs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="pt-6">
              <UserManagement />
            </TabsContent>
            
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
          
          <DebugCard
            title="Job Title"
            description="The job title entered by the user"
            data={jobTitle}
            isAvailable={!!jobTitle}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default AdminPage;
