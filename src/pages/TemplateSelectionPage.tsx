
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileEdit } from 'lucide-react';
import TemplateGallery from '@/components/templates/TemplateGallery';
import TemplateDownloader from '@/components/templates/TemplateDownloader';
import { useResumeContext } from '@/contexts/ResumeContext';

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const { uploadData, feedback } = useResumeContext();
  
  // If there's no resume data, redirect to the homepage
  React.useEffect(() => {
    if (!uploadData?.content) {
      navigate('/');
    }
  }, [uploadData, navigate]);

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/success')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Success
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Select Resume Templates</h1>
              <p className="text-muted-foreground">Choose up to 5 templates to download your optimized resume</p>
            </div>
          </div>
          
          {feedback?.suggested_edits && feedback.suggested_edits.length > 0 && (
            <Button 
              onClick={() => navigate('/edit-resume')}
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Edit Resume Content
            </Button>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <TemplateGallery />
        </div>
        
        <div className="space-y-4">
          <TemplateDownloader />
        </div>
      </div>
    </PageContainer>
  );
};

export default TemplateSelectionPage;
