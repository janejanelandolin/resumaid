
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Confetti, Home } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import DownloadButtons from '@/components/download/DownloadButtons';
import ResumeSummary from '@/components/download/ResumeSummary';
import RationaleSection from '@/components/download/RationaleSection';
import TypewriterText from '@/components/TypewriterText';

const DownloadPage = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
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
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [resume, navigate]);

  if (!resume) {
    return null;
  }

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/analysis')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Try another Job
          </Button>
        </div>
        
        <div className="text-center mb-6 relative">
          {showConfetti && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Confetti className="h-6 w-6 text-yellow-500 absolute top-0 left-1/4 animate-bounce" />
              <Confetti className="h-6 w-6 text-indigo-500 absolute top-5 right-1/4 animate-bounce delay-75" />
              <Confetti className="h-6 w-6 text-green-500 absolute top-10 left-1/3 animate-bounce delay-150" />
              <Confetti className="h-6 w-6 text-red-500 absolute top-2 right-1/3 animate-bounce delay-300" />
              <Confetti className="h-6 w-6 text-purple-500 absolute top-8 left-1/2 animate-bounce delay-200" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-purple-600">Resume and Report</h1>
          <p className="text-muted-foreground">
            <TypewriterText text="Your optimized resume is ready for download" delay={100} />
          </p>
        </div>
        
        {/* Download buttons */}
        <DownloadButtons 
          resume={resume} 
          jobTitle={jobTitle} 
        />
        
        {/* Resume Summary (now includes both evaluations and summary comparison) */}
        <ResumeSummary 
          resume={resume}
          originalResume={resumeJson}
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
