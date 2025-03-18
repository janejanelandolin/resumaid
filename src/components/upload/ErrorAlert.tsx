
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  errors: string[];
  onShowDetails: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errors, onShowDetails }) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Some errors occurred. Click "Details" for more information.
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={onShowDetails}
        >
          Details
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
