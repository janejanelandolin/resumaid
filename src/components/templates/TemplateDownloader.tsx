
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { FileDown, Loader2, Eye } from 'lucide-react';

const TemplateDownloader: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedTemplates, jobTitle, uploadData } = useResumeContext();

  const handleProceed = () => {
    if (selectedTemplates.length === 0) {
      toast({
        title: "No templates selected",
        description: "Please select at least one template to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!uploadData?.content) {
      toast({
        title: "Resume content missing",
        description: "Unable to proceed without resume content.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to the preview page first
    navigate('/preview');
  };

  return (
    <Button 
      onClick={handleProceed} 
      disabled={isDownloading || selectedTemplates.length === 0}
      className="w-full"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Preview {selectedTemplates.length > 0 ? `${selectedTemplates.length} ` : ''}
          {selectedTemplates.length === 1 ? 'Template' : 'Templates'}
        </>
      )}
    </Button>
  );
};

export default TemplateDownloader;
