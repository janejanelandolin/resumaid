
import { useState } from 'react';

interface UploadStateManagerProps {
  children: (props: {
    progress: number;
    progressText: string;
    setProgress: (progress: number) => void;
    setProgressText: (text: string) => void;
  }) => React.ReactNode;
}

const UploadStateManager: React.FC<UploadStateManagerProps> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  return (
    <>
      {children({
        progress,
        progressText,
        setProgress,
        setProgressText,
      })}
    </>
  );
};

export default UploadStateManager;
