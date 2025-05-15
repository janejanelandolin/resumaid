
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/analysis/PageHeader';
import MissingKeywords from '@/components/analysis/MissingKeywords';
import Summary from '@/components/analysis/Summary';
import CompatibilityScore from '@/components/analysis/CompatibilityScore';
import ImprovementSuggestions from '@/components/analysis/ImprovementSuggestions';
import ApiDebugHelper from '@/components/debug/ApiDebugHelper';
import ApiErrorDisplay from '@/components/analysis/ApiErrorDisplay';
import useAppVersion from '@/hooks/useAppVersion';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { isFreeVersion } = useAppVersion();
  const { 
    jobTitle, 
    feedback, 
    apiErrors,
    // New workflow values
    originalScore,
    tailoredScore,
    resumeJson,
    tailoredResumeJson
  } = useResumeContext();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Check if we have at least the new data or the old data
    const hasOldData = feedback;
    const hasNewData = originalScore && tailoredScore;
    
    if (!hasOldData && !hasNewData) {
      navigate('/upload');
    }
  }, [feedback, originalScore, tailoredScore, navigate]);

  // If neither old nor new data is available, don't render
  if (!feedback && (!originalScore || !tailoredScore)) {
    return null;
  }

  // Debug the actual data we have
  console.log("Analysis Page Data:", {
    originalScore,
    tailoredScore,
    feedback
  });

  // Handle continue button click with version check
  const handleContinue = () => {
    if (isFreeVersion) {
      navigate('/download');
    } else {
      navigate('/payment');
    }
  };

  // Determine which data source to use
  const useNewWorkflow = !!originalScore && !!tailoredScore;
  
  // Get the scores based on data availability
  const originalSimilarity = useNewWorkflow 
    ? originalScore?.similarity || 0 
    : 0;
  
  const tailoredSimilarity = useNewWorkflow
    ? tailoredScore?.similarity || 0
    : 0;
  
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
    feedbackQualification,
    useNewWorkflow
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
          
          {originalScore && (
            <MissingKeywords scoreResponse={originalScore} />
          )}
          
          <Summary />
          
          <CompatibilityScore 
            atsSimilarity={originalSimilarity}
            feedbackSimilarity={tailoredSimilarity}
            improvement={improvement}
            atsQualification={atsQualification}
            feedbackQualification={feedbackQualification}
          />
          
          <ImprovementSuggestions 
            feedback={
              useNewWorkflow 
                ? { 
                    format_issues: []
                  }
                : feedback
            } 
          />

          <Button 
            onClick={handleContinue} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            {isFreeVersion ? 'Download Optimized Resume' : 'Download Optimized Resume!'}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>{isFreeVersion ? 'Get your optimized resume now' : 'Your optimized resume will be ready after the next step'}</p>
          </div>
          
          {/* Debug section */}
          <div className="mt-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDebug(!showDebug)}
              className="w-full"
            >
              {showDebug ? "Hide" : "Show"} API Response Details
            </Button>
            
            {showDebug && (
              <div className="mt-4 p-4 bg-slate-800 text-slate-100 rounded-md overflow-auto max-h-[400px]">
                {useNewWorkflow ? (
                  <>
                    <h3 className="font-mono text-sm mb-2">Original Score Response:</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(originalScore, null, 2)}
                    </pre>
                    
                    <h3 className="font-mono text-sm mt-4 mb-2">Tailored Score Response:</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(tailoredScore, null, 2)}
                    </pre>
                  </>
                ) : (
                  <>
                    <h3 className="font-mono text-sm mb-2">Feedback Response:</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(feedback, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Add the API debug helper */}
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
