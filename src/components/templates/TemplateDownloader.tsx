
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useResumeContext } from '@/contexts/ResumeContext';
import { downloadSelectedTemplates } from '@/services/resumeTemplatesService';
import { FileDown, Loader2 } from 'lucide-react';

const TemplateDownloader: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { selectedTemplates, jobTitle, uploadData } = useResumeContext();

  const handleDownload = async () => {
    if (selectedTemplates.length === 0) {
      toast({
        title: "No templates selected",
        description: "Please select at least one template to download.",
        variant: "destructive",
      });
      return;
    }

    if (!uploadData?.content) {
      toast({
        title: "Resume content missing",
        description: "Unable to download templates without resume content.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadSelectedTemplates(
        selectedTemplates,
        jobTitle,
        uploadData.content
      );

      if (success) {
        toast({
          title: "Templates downloaded successfully",
          description: `Downloaded ${selectedTemplates.length} templates tailored for ${jobTitle}.`,
        });
      } else {
        throw new Error("Failed to download templates");
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading || selectedTemplates.length === 0}
      className="w-full"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading Templates...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Download {selectedTemplates.length > 0 ? `${selectedTemplates.length} ` : ''}
          {selectedTemplates.length === 1 ? 'Template' : 'Templates'}
        </>
      )}
    </Button>
  );
};

export default TemplateDownloader;
