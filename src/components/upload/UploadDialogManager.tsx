
import { useState } from 'react';
import ContentWarningDialog from '@/components/upload/ContentWarningDialog';
import ErrorDialog from '@/components/upload/ErrorDialog';

interface UploadDialogManagerProps {
  children: (props: {
    showErrorDialog: () => void;
    showContentWarning: () => void;
    apiErrors: string[];
    setApiErrors: (errors: string[]) => void;
  }) => React.ReactNode;
}

const UploadDialogManager: React.FC<UploadDialogManagerProps> = ({ children }) => {
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showContentWarning, setShowContentWarning] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const handleShowErrorDialog = () => {
    setShowErrorDialog(true);
  };

  const handleShowContentWarning = () => {
    setShowContentWarning(true);
  };

  const handleTryAgain = () => {
    setShowErrorDialog(false);
    setApiErrors([]);
  };

  const handlePasteTextInstead = () => {
    setShowContentWarning(false);
    
    // Find and click the resume text collapsible trigger
    const resumeTextTrigger = document.querySelector('span:contains("Paste Resume Text")');
    if (resumeTextTrigger) {
      const triggerButton = resumeTextTrigger.closest('button');
      if (triggerButton instanceof HTMLButtonElement) {
        triggerButton.click();
      }
    }
  };

  return (
    <>
      {children({
        showErrorDialog: handleShowErrorDialog,
        showContentWarning: handleShowContentWarning,
        apiErrors,
        setApiErrors,
      })}

      <ContentWarningDialog
        open={showContentWarning}
        onOpenChange={setShowContentWarning}
        onPasteTextInstead={handlePasteTextInstead}
      />

      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errors={apiErrors}
        onTryAgain={handleTryAgain}
      />
    </>
  );
};

export default UploadDialogManager;
