import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Map } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import DownloadButtons from '@/components/download/DownloadButtons';
import RationaleSection from '@/components/download/RationaleSection';
import CoverLetterModal from '@/components/download/CoverLetterModal';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import StripePaymentListener from '@/components/payments/StripePaymentListener';
import CompatibilityScore from '@/components/analysis/CompatibilityScore';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    jobTitle,
    tailoredResumeJson,
    resumeJson,
    originalScore,
    tailoredScore,
    resetAllState,
    markWorkflowComplete,
  } = useResumeContext();

  const resume = tailoredResumeJson ?? resumeJson;
  const rawChanges = tailoredResumeJson?.changes;
  const changes = rawChanges && !Array.isArray(rawChanges) ? rawChanges : undefined;

  const originalSimilarity = originalScore?.similarity ?? 0;
  const tailoredSimilarity = tailoredScore?.similarity ?? 0;
  const improvement = tailoredSimilarity - originalSimilarity;
  const atsQualification = originalScore?.consensus_qualification ?? '';
  const tailoredQualification = tailoredScore?.consensus_qualification ?? '';

  // Positioning narrative — first item in the positioning changes array
  const positioningNarrative =
    tailoredResumeJson?.changes?.positioning?.[0] ?? null;

  useEffect(() => {
    if (!resume) navigate('/upload');
  }, [resume, navigate]);

  const handleHome = () => {
    markWorkflowComplete();
    resetAllState();
    navigate('/');
  };

  if (!resume) return null;

  return (
    <PageContainer>
      <StripePaymentListener />
      <div className="w-full max-w-3xl mx-auto space-y-8">

        {/* Top nav */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <FeedbackDialog />
          <div className="flex gap-2">
            {user && (
              <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/journey')}>
                <Map className="h-4 w-4" />
                Career Journey
              </Button>
            )}
            <Button onClick={handleHome} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Try another job
            </Button>
          </div>
        </div>

        {/* Positioning narrative */}
        {positioningNarrative && (
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white text-center shadow-md">
            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">
              Your career narrative
            </p>
            <p className="text-lg font-semibold">{positioningNarrative}</p>
          </div>
        )}

        {/* Score comparison */}
        {(originalScore || tailoredScore) && (
          <div className="rounded-2xl bg-white shadow-sm border border-purple-100 p-4">
            <CompatibilityScore
              atsSimilarity={originalSimilarity}
              feedbackSimilarity={tailoredSimilarity}
              improvement={improvement}
              atsQualification={atsQualification}
              feedbackQualification={tailoredQualification}
            />
          </div>
        )}

        {/* Action row */}
        <div className="flex flex-wrap gap-3 justify-center">
          <CoverLetterModal />
          <DownloadButtons resume={resume} jobTitle={jobTitle} />
        </div>

        {/* What changed */}
        <RationaleSection changes={changes} />
      </div>
    </PageContainer>
  );
};

export default ResultsPage;
