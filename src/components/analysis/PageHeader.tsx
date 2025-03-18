
import React from 'react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bug } from 'lucide-react';

const PageHeader: React.FC = () => {
  const { jobTitle, uploadData } = useResumeContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b">
      <div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 p-0 h-auto" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-muted-foreground text-sm">Back</span>
          </Button>
          <Badge variant="outline" className="ml-2">
            {uploadData?.filename || 'resume'}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-2">
          Resume Analysis for {jobTitle}
        </h1>
        <p className="text-muted-foreground mt-1">
          Review your ATS compatibility score and optimization recommendations
        </p>
      </div>
      <div className="flex mt-4 md:mt-0 gap-2">
        <Button 
          variant="outline"
          size="sm"
          className="gap-1" 
          onClick={() => navigate('/debug')}
        >
          <Bug className="h-4 w-4" />
          <span>API Debug</span>
        </Button>
        <Button onClick={() => navigate('/payment')}>
          Get Full Report
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
