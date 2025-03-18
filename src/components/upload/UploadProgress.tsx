
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  progressText: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading, progress, progressText }) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between text-sm">
        <span className="flex items-center">
          {progressText}
          {progress === 100 && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
        </span>
        <span className="font-medium text-indigo-600">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-indigo-100" 
      />
      <div className="h-1 w-full bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-30 animate-pulse"></div>
    </div>
  );
};

export default UploadProgress;
