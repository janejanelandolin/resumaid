import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/analysis/PageHeader';
import Summary from '@/components/analysis/Summary';
import CompatibilityScore from '@/components/analysis/CompatibilityScore';
import ApiErrorDisplay from '@/components/analysis/ApiErrorDisplay';
import ApiDebugHelper from '@/components/debug/ApiDebugHelper';
import useAppVersion from '@/hooks/useAppVersion';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { isFreeVersion } = useAppVersion();
  const { 
    jobTitle, 
    apiErrors,
    // New workflow values
    originalScore,
    tailoredScore,
    resumeJson,
    tailoredResumeJson,
    markWorkflowComplete
  } = useResumeContext();

  useEffect(() => {
    // Check if we have the necessary data
    if (!originalScore || !tailoredScore) {
      navigate('/upload');
    }
  }, [originalScore, tailoredScore, navigate]);

  // If no data is available, don't render
  if (!originalScore || !tailoredScore) {
    return null;
  }

  // Debug the actual data we have
  console.log("Analysis Page Data:", {
    jobTitle,
    originalScore,
    tailoredScore
  });

  // Handle continue button click with version check and pass state
  const handleContinue = () => {
    markWorkflowComplete(); // Mark workflow as complete before navigating
    
    if (isFreeVersion) {
      navigate('/results', { state: { fromAnalysis: true } });
    } else {
      navigate('/payment', { state: { fromAnalysis: true } });
    }
  };
  
  // Get the scores
  const originalSimilarity = originalScore?.similarity || 0;
  const tailoredSimilarity = tailoredScore?.similarity || 0;
  
  // Calculate the improvement percentage
  const improvement = tailoredSimilarity - originalSimilarity;

  // Get the qualification values from the API responses
  const atsQualification = originalScore?.consensus_qualification || "Not Available";
  const feedbackQualification = tailoredScore?.consensus_qualification || "Not Available";

  // Log the calculated values for debugging
  console.log("Calculated scores:", {
    originalSimilarity,
    tailoredSimilarity,
    improvement,
    atsQualification,
    feedbackQualification
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pt-6">
      <PageContainer className="py-6 justify-start">
        <div className="w-full space-y-6 relative">
          <PageHeader />
          
          {/* Display API errors if any */}
          {apiErrors && apiErrors.length > 0 && (
            <ApiErrorDisplay errors={apiErrors} />
          )}
          
          <Summary />
          
          <CompatibilityScore 
            atsSimilarity={originalSimilarity}
            feedbackSimilarity={tailoredSimilarity}
            improvement={improvement}
            atsQualification={atsQualification}
            feedbackQualification={feedbackQualification}
            originalScoreExplanation={originalScore?.explanation}
            tailoredScoreExplanation={tailoredScore?.explanation}
          />

          <Button 
            onClick={handleContinue} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Next
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>{isFreeVersion ? 'Get your optimized resume and comprehensive report now' : 'Your optimized resume will be ready after the next step'}</p>
          </div>
          
          {/* API debug helper for errors */}
          {apiErrors && apiErrors.length > 0 && (
            <ApiDebugHelper 
              error="API errors occurred while processing your resume. Check details above or try the troubleshooting options."
            />
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default AnalysisPage;
