
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: string[];
  onTryAgain: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, onOpenChange, errors, onTryAgain }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            API Error Details
          </DialogTitle>
          <DialogDescription>
            The following errors were encountered during processing:
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 space-y-4">
          {errors.map((error, index) => (
            <Alert key={index} variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="break-words whitespace-pre-wrap">
                {error}
              </AlertDescription>
            </Alert>
          ))}
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2">Suggestions to fix:</h4>
            <ul className="list-disc list-inside text-xs space-y-2">
              <li>Try uploading a smaller or simpler resume file</li>
              <li>Convert your PDF resume to plain text and paste it directly</li>
              <li>Try a different file format (TXT is recommended)</li>
              <li>Ensure your internet connection is stable</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
