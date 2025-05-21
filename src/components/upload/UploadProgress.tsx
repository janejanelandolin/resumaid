
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Sparkle } from 'lucide-react';
import EncouragingMessages from './EncouragingMessages';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  progressText: string; // This prop is now unused but kept for backward compatibility
}

const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading, progress }) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center space-x-2">
          <span className="flex items-center">
            {/* Encouraging message */}
            <EncouragingMessages progress={progress} />
            {progress === 100 && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
          </span>
        </div>
        <span className="font-medium text-indigo-600 flex items-center">
          {progress === 100 && <Sparkle className="mr-1 h-4 w-4 text-yellow-400 animate-spin-slow" />}
          {progress}%
        </span>
      </div>
      
      {/* Enhanced progress bar with animations */}
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-2 bg-indigo-100" 
        />
        <div className="h-1 w-full bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-30 animate-pulse"></div>
        
        {/* Animated sparkles that follow the progress */}
        {progress > 10 && (
          <Sparkle 
            className="absolute top-0 text-purple-400 animate-pulse h-3 w-3" 
            style={{ left: `${Math.min(progress - 10, 90)}%`, transform: 'translateY(-50%)' }}
          />
        )}
      </div>
    </div>
  );
};

export default UploadProgress;
