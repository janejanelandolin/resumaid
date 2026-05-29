import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { normalizeSkills, formatJobPostingAsText } from './resume/useResumeNormalizer';
import {
  createSessionLog,
  updateSessionWithResumeData,
  updateSessionWithOriginalScore,
  updateSessionWithOptimizedScore,
} from '@/services/logSessionService';

export type StepStatus = 'pending' | 'active' | 'done' | 'error';

export interface ProcessingStep {
  id: string;
  label: string;
  sublabel: string;
  status: StepStatus;
}

export interface CompletionSummary {
  originalQ: string;
  tailoredQ: string;
  improvementPct: number;
}

const INITIAL_STEPS: ProcessingStep[] = [
  {
    id: 'upload',
    label: 'Reading your resume',
    sublabel: 'Uploading and extracting text…',
    status: 'pending',
  },
  {
    id: 'parse',
    label: 'Understanding your experience',
    sublabel: 'Structuring your skills, history, and education…',
    status: 'pending',
  },
  {
    id: 'score',
    label: 'Scoring your original resume',
    sublabel: 'Evaluating keyword match against the job posting…',
    status: 'pending',
  },
  {
    id: 'tailor',
    label: 'Tailoring to the job posting',
    sublabel: 'Rewriting to maximise your match score…',
    status: 'pending',
  },
  {
    id: 'rescore',
    label: 'Scoring your optimised resume',
    sublabel: 'Measuring how much you improved…',
    status: 'pending',
  },
];

export const useProcessingOrchestrator = () => {
  const navigate = useNavigate();
  const {
    rawResumeFile,
    rawResumeText,
    jobTitle,
    jobPosting,
    setResumeJson,
    setTailoredResumeJson,
    setOriginalScore,
    setTailoredScore,
    setUploadData,
    setApiErrors,
  } = useResumeContext();

  const [steps, setSteps] = useState<ProcessingStep[]>(
    INITIAL_STEPS.map(s => ({ ...s }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<CompletionSummary | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const updateStep = useCallback(
    (id: string, status: StepStatus, sublabel?: string) => {
      setSteps(prev =>
        prev.map(s =>
          s.id === id ? { ...s, status, ...(sublabel != null ? { sublabel } : {}) } : s
        )
      );
    },
    []
  );

  const run = useCallback(async () => {
    setSteps(INITIAL_STEPS.map(s => ({ ...s })));
    setIsComplete(false);
    setFatalError(null);
    setApiErrors([]);

    try {
      await createSessionLog(jobTitle);

      // ── Step 1: Upload / Read text ──────────────────────────────────
      let resumeContent: string | null = null;

      if (rawResumeText?.trim()) {
        // Paste mode — use the text directly, no upload needed
        updateStep('upload', 'active', 'Reading pasted resume…');
        resumeContent = rawResumeText.trim();
        setUploadData({ id: 'pasted', filename: 'pasted-resume.txt', content: resumeContent, text: resumeContent });
        updateStep('upload', 'done', 'Resume text received ✓');
      } else if (rawResumeFile) {
        // File mode — upload to backend for text extraction (PDF/DOCX)
        updateStep('upload', 'active', 'Uploading your resume…');
        const uploadResponse = await apiService.uploadResume(rawResumeFile);

        if (uploadResponse.error || !uploadResponse.data?.content) {
          updateStep('upload', 'error', uploadResponse.error ?? 'Upload failed');
          setFatalError(
            'Failed to read your resume. Please try a different file format (PDF or DOCX), or paste the text directly.'
          );
          return;
        }

        // Detect backend rejecting unsupported formats (returns JSON error with 200)
        const content = uploadResponse.data.content.trim();
        if (content.startsWith('{"error"') || content.startsWith("{'error'")) {
          updateStep('upload', 'error', 'Unsupported file format');
          setFatalError(
            'This file format is not supported. Please upload a PDF or DOCX file, or paste your resume text directly.'
          );
          return;
        }

        setUploadData(uploadResponse.data);
        resumeContent = content;
        updateStep('upload', 'done', 'Resume received ✓');
      } else {
        setFatalError('No resume found. Please go back and upload a file or paste your resume text.');
        return;
      }

      // ── Step 2: Parse ───────────────────────────────────────────────
      updateStep(
        'parse',
        'active',
        'Extracting your work history, skills, and education…'
      );
      const schemaResponse = await apiService.getResumeSchema(resumeContent);

      if (!schemaResponse.data) {
        updateStep('parse', 'error', 'Could not parse resume structure');
        setFatalError(
          'Could not parse your resume. Try pasting the text directly using Option 2 on the upload page.'
        );
        return;
      }

      const resumeData = normalizeSkills(schemaResponse.data)!;
      setResumeJson(resumeData);
      await updateSessionWithResumeData(resumeData);
      updateStep('parse', 'done', 'Resume structure extracted ✓');

      // ── Steps 3 + 4: Score original & Tailor — in parallel ─────────
      const jobPostingText = formatJobPostingAsText(jobPosting);
      updateStep('score', 'active', 'Running keyword analysis against job requirements…');
      updateStep('tailor', 'active', 'Rewriting summary and inserting missing keywords…');

      const [scoreResult, tailorResult] = await Promise.all([
        apiService.scoreResume(resumeData, jobPostingText),
        apiService.tailorResume(resumeData, jobPostingText),
      ]);

      // Handle original score
      if (scoreResult.data) {
        setOriginalScore(scoreResult.data);
        await updateSessionWithOriginalScore(scoreResult.data);
        updateStep(
          'score',
          'done',
          `Original assessment: ${scoreResult.data.consensus_qualification} ✓`
        );
      } else {
        updateStep('score', 'error', 'Scoring unavailable — continuing without baseline');
      }

      // Handle tailor
      let tailoredResume = null;
      if (tailorResult.data?.resume) {
        tailoredResume = normalizeSkills(tailorResult.data.resume);
        if (tailorResult.data.changes && tailoredResume) {
          tailoredResume = { ...tailoredResume, changes: tailorResult.data.changes };
        }
        setTailoredResumeJson(tailoredResume);
        updateStep('tailor', 'done', 'Resume optimised ✓');
      } else {
        updateStep(
          'tailor',
          'error',
          'Optimisation incomplete — showing original resume'
        );
      }

      // ── Step 5: Score tailored ──────────────────────────────────────
      const resumeToScore = tailoredResume ?? resumeData;
      updateStep('rescore', 'active', 'Calculating your new match score…');
      const rescoreResult = await apiService.scoreResume(resumeToScore, jobPostingText);

      if (rescoreResult.data) {
        setTailoredScore(rescoreResult.data);
        await updateSessionWithOptimizedScore(rescoreResult.data);
        updateStep(
          'rescore',
          'done',
          `Optimised assessment: ${rescoreResult.data.consensus_qualification} ✓`
        );

        // Build completion summary
        const origSim = scoreResult.data?.similarity ?? 0;
        const tailSim = rescoreResult.data.similarity ?? 0;
        const improvementPct = Math.round(((tailSim - origSim) / 2) * 100);
        setCompletionSummary({
          originalQ: scoreResult.data?.consensus_qualification ?? 'Unknown',
          tailoredQ: rescoreResult.data.consensus_qualification,
          improvementPct,
        });
      } else {
        updateStep('rescore', 'error', 'Re-scoring unavailable');
      }

      setIsComplete(true);
      await new Promise(r => setTimeout(r, 2200));
      sessionStorage.setItem('resumeUploaded', 'true');
      navigate('/results');
    } catch (err) {
      console.error('Processing orchestrator error:', err);
      setFatalError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    }
  }, [
    rawResumeFile,
    rawResumeText,
    jobTitle,
    jobPosting,
    navigate,
    updateStep,
    setResumeJson,
    setTailoredResumeJson,
    setOriginalScore,
    setTailoredScore,
    setUploadData,
    setApiErrors,
  ]);

  return { steps, isComplete, completionSummary, fatalError, run };
};
