
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

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { 
    jobTitle, 
    atsFeedback, 
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
    const hasOldData = atsFeedback && feedback;
    const hasNewData = originalScore && tailoredScore;
    
    if (!hasOldData && !hasNewData) {
      navigate('/upload');
    }
  }, [atsFeedback, feedback, originalScore, tailoredScore, navigate]);

  // If neither old nor new data is available, don't render
  if ((!atsFeedback || !feedback) && (!originalScore || !tailoredScore)) {
    return null;
  }

  // Debug the actual data we have
  console.log("Analysis Page Data:", {
    originalScore,
    tailoredScore,
    atsFeedback,
    feedback
  });

  const handleContinue = () => {
    navigate('/payment');
  };

  // Determine which data source to use
  const useNewWorkflow = !!originalScore && !!tailoredScore;
  
  // Get the scores based on data availability
  const originalSimilarity = useNewWorkflow 
    ? originalScore?.similarity || 0 
    : atsFeedback?.JobPostingFulltext_ResumeFulltext_similarity || 0;
  
  const tailoredSimilarity = useNewWorkflow
    ? tailoredScore?.similarity || 0
    : feedback?.similarity || 0;
  
  // Calculate the improvement percentage
  const improvement = tailoredSimilarity - originalSimilarity;

  // Log the calculated values for debugging
  console.log("Calculated scores:", {
    originalSimilarity,
    tailoredSimilarity,
    improvement,
    useNewWorkflow
  });

  // Get qualifications
  const originalQualification = useNewWorkflow
    ? originalScore?.qualification || "Unknown"
    : atsFeedback?.qualification || "Unknown";
    
  const tailoredQualification = useNewWorkflow
    ? tailoredScore?.qualification || "Unknown"
    : feedback?.qualification || "Unknown";

  // Get missing keywords
  const missingKeywords = useNewWorkflow
    ? originalScore?.missing_keywords || []
    : atsFeedback?.missing_keywords || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pt-6">
      <PageContainer className="py-6 justify-start">
        <div className="w-full space-y-6 relative">
          <PageHeader />
          
          {/* Display API errors if any */}
          {apiErrors && apiErrors.length > 0 && (
            <ApiErrorDisplay errors={apiErrors} />
          )}
          
          <MissingKeywords 
            atsFeedback={useNewWorkflow ? { missing_keywords: missingKeywords } as any : atsFeedback} 
          />
          
          <Summary />
          
          <CompatibilityScore 
            atsSimilarity={originalSimilarity}
            feedbackSimilarity={tailoredSimilarity}
            improvement={improvement}
            atsQualification={originalQualification}
            feedbackQualification={tailoredQualification}
          />
          
          <ImprovementSuggestions 
            feedback={
              useNewWorkflow 
                ? { 
                    suggested_edits: [], 
                    similarity: tailoredSimilarity,
                    qualification: tailoredQualification,
                    score_reason: tailoredScore?.explanation || "Your resume has been optimized for this job."
                  }
                : feedback
            } 
          />

          <Button 
            onClick={handleContinue} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Download Optimized Resume!
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>Your optimized resume will be ready after the next step</p>
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
                    <h3 className="font-mono text-sm mb-2">ATS Feedback Response:</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(atsFeedback, null, 2)}
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
