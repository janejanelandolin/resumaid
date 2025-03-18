
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/analysis/PageHeader';
import Summary from '@/components/analysis/Summary';
import CompatibilityScore from '@/components/analysis/CompatibilityScore';
import ImprovementSuggestions from '@/components/analysis/ImprovementSuggestions';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { jobTitle, atsFeedback, feedback } = useResumeContext();

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
          <PageHeader jobTitle={jobTitle} />
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
        </div>
      </PageContainer>
    </div>
  );
};

export default AnalysisPage;
