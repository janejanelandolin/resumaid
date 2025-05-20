
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  isUploading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, isUploading }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group"
    >
      <span className="flex items-center gap-2">
        {isUploading ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            Analyze
          </>
        )}
      </span>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-[2px] bg-white/30 rounded-full blur-sm"></div>
    </Button>
  );
};

export default SubmitButton;
