
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ContentWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPasteTextInstead: () => void;
}

const ContentWarningDialog: React.FC<ContentWarningDialogProps> = ({ 
  open, 
  onOpenChange,
  onPasteTextInstead
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Resume Content Issue
          </DialogTitle>
          <DialogDescription>
            We couldn't extract the content from your resume properly. This may affect the analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">Please try one of these options:</p>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Convert your resume to plain text (.txt) format and upload again</li>
            <li>Copy the text from your resume and paste it directly</li>
          </ul>
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={onPasteTextInstead}
            >
              Paste Text Instead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentWarningDialog;
