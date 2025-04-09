
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
  const { jobTitle, atsFeedback, feedback, apiErrors } = useResumeContext();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (!atsFeedback || !feedback) {
      navigate('/upload');
    }
  }, [atsFeedback, feedback, navigate]);

  if (!atsFeedback || !feedback) {
    return null;
  }

  const handleContinue = () => {
    navigate('/payment');
  };

  // Get the similarity score from JobPostingFulltext_ResumeFulltext_similarity
  // Removed the *100 multiplication
  const atsSimilarity = atsFeedback.JobPostingFulltext_ResumeFulltext_similarity || 0;
  
  // Calculate the improvement percentage
  const improvement = feedback.similarity - atsSimilarity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pt-6">
      <PageContainer className="py-6 justify-start">
        <div className="w-full space-y-6 relative">
          <PageHeader />
          
          {/* Display API errors if any */}
          {apiErrors && apiErrors.length > 0 && (
            <ApiErrorDisplay errors={apiErrors} />
          )}
          
          <MissingKeywords atsFeedback={atsFeedback} />
          <Summary />
          <CompatibilityScore 
            atsSimilarity={atsSimilarity}
            feedbackSimilarity={feedback.similarity}
            improvement={improvement}
            atsQualification={atsFeedback.qualification}
            feedbackQualification={feedback.qualification}
          />
          <ImprovementSuggestions feedback={feedback} />

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
                <h3 className="font-mono text-sm mb-2">ATS Feedback Response:</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(atsFeedback, null, 2)}
                </pre>
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
