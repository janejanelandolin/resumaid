import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useProcessingOrchestrator, ProcessingStep, StepStatus } from '@/hooks/useProcessingOrchestrator';
import { Button } from '@/components/ui/button';

// ── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'active':
      return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin flex-shrink-0" />;
    case 'done':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />;
    default:
      return <Clock className="h-5 w-5 text-gray-300 flex-shrink-0" />;
  }
}

// ── Single step row ──────────────────────────────────────────────────────────

function StepRow({ step }: { step: ProcessingStep }) {
  const isActive = step.status === 'active';
  const isDone = step.status === 'done';
  const isPending = step.status === 'pending';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-500 ${
        isActive
          ? 'bg-indigo-50 border border-indigo-200 shadow-sm'
          : isDone
          ? 'bg-emerald-50/60 border border-emerald-100'
          : isPending
          ? 'opacity-40'
          : 'bg-amber-50 border border-amber-100'
      }`}
    >
      <div className="mt-0.5">
        <StepIcon status={step.status} />
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold ${
            isActive
              ? 'text-indigo-700'
              : isDone
              ? 'text-emerald-700'
              : isPending
              ? 'text-gray-400'
              : 'text-amber-700'
          }`}
        >
          {step.label}
        </p>
        <p
          className={`text-xs mt-0.5 ${
            isActive ? 'text-indigo-500' : isDone ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          {step.sublabel}
        </p>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const ProcessingPage = () => {
  const navigate = useNavigate();
  const { jobTitle, rawResumeFile, rawResumeText } = useResumeContext();
  const { steps, isComplete, completionSummary, fatalError, run } =
    useProcessingOrchestrator();

  // Guard: if there's nothing to process, send back to upload
  useEffect(() => {
    if (!rawResumeFile && !rawResumeText) {
      navigate('/upload');
      return;
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeStep = steps.find(s => s.status === 'active');
  const doneCount = steps.filter(s => s.status === 'done').length;
  const progressPct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Optimising your resume
            </h1>
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
          {jobTitle && (
            <p className="text-sm text-gray-500">
              for <span className="font-medium text-gray-700">{jobTitle}</span>
            </p>
          )}
        </div>

        {/* Step list */}
        <div className="space-y-2">
          {steps.map(step => (
            <StepRow key={step.id} step={step} />
          ))}
        </div>

        {/* Progress bar */}
        {!isComplete && !fatalError && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {activeStep && (
              <p className="text-xs text-center text-gray-400 animate-pulse">
                {activeStep.sublabel}
              </p>
            )}
          </div>
        )}

        {/* Completion card */}
        {isComplete && completionSummary && (
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white text-center shadow-lg animate-fade-in space-y-2">
            <p className="text-lg font-bold">🎉 Your resume is ready!</p>
            <p className="text-sm opacity-90">
              <span className="font-medium">{completionSummary.originalQ}</span>
              <ArrowRight className="inline h-4 w-4 mx-1" />
              <span className="font-bold">{completionSummary.tailoredQ}</span>
            </p>
            {completionSummary.improvementPct > 0 && (
              <p className="text-xs opacity-75">
                +{completionSummary.improvementPct}% compatibility improvement
              </p>
            )}
            <p className="text-xs opacity-60 mt-1">Heading to your results…</p>
          </div>
        )}

        {/* Fatal error */}
        {fatalError && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-red-700">Something went wrong</p>
            <p className="text-sm text-red-600">{fatalError}</p>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => navigate('/upload')}
            >
              ← Go back and try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingPage;
