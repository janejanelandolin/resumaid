
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import DownloadButtons from '@/components/download/DownloadButtons';
import ResumeSummary from '@/components/download/ResumeSummary';
import RationaleSection from '@/components/download/RationaleSection';

const DownloadPage = () => {
  const navigate = useNavigate();
  
  const { 
    jobTitle, 
    tailoredResumeJson, 
    resumeJson,
    originalScore,
    tailoredScore
  } = useResumeContext();
  
  // Get rationale from tailored resume if available
  const resume = tailoredResumeJson || resumeJson;
  const rationale = tailoredResumeJson?.rationale || [];
  
  // Get score explanation from the original score
  const originalScoreExplanation = originalScore?.explanation;
  const tailoredScoreExplanation = tailoredScore?.explanation;
  
  // Get qualifications
  const originalQualification = originalScore?.consensus_qualification;
  const tailoredQualification = tailoredScore?.consensus_qualification;
  
  useEffect(() => {
    if (!resume) {
      navigate('/upload');
    }
  }, [resume, navigate]);

  if (!resume) {
    return null;
  }

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/analysis')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Download Your Optimized Resume</h1>
            <p className="text-muted-foreground">
              Your optimized resume is ready for download
            </p>
          </div>
        </div>
        
        {/* Download buttons */}
        <DownloadButtons 
          resume={resume} 
          jobTitle={jobTitle} 
        />
        
        {/* Resume Summary (now includes both evaluations) */}
        <ResumeSummary 
          resume={resume} 
          originalScoreExplanation={originalScoreExplanation}
          tailoredScoreExplanation={tailoredScoreExplanation}
          originalQualification={originalQualification}
          tailoredQualification={tailoredQualification}
        />
        
        {/* Rationale section */}
        <RationaleSection rationale={rationale} />
      </div>
    </PageContainer>
  );
};

export default DownloadPage;
