
import React from 'react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bug } from 'lucide-react';
import useAppVersion from '@/hooks/useAppVersion';

const PageHeader: React.FC = () => {
  const { jobTitle } = useResumeContext();
  const navigate = useNavigate();
  const { isDebugMode, isFreeVersion, isFeatureEnabled } = useAppVersion();

  return (
    <div className="flex flex-col items-center justify-between pb-4 mb-6 border-b">
      <div className="w-full flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 p-0 h-auto" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-muted-foreground text-sm">Back</span>
        </Button>
        {isDebugMode && (
          <Button 
            variant="outline"
            size="sm"
            className="gap-1" 
            onClick={() => navigate('/debug')}
          >
            <Bug className="h-4 w-4" />
            <span>API Debug</span>
          </Button>
        )}
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Resume Analysis for {jobTitle}
        </h1>
      </div>
      
      {isFeatureEnabled('payment') && (
        <div className="mt-4">
          <Button onClick={() => navigate('/payment')}>
            {isFreeVersion ? 'Upgrade to Pro' : 'Get Full Report'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
