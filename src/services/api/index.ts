
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getATSFeedback } from './atsFeedbackService';
import { getFeedback } from './optimizationFeedbackService';
import { getResumeSchema } from './resumeSchemaService';
import { scoreResume } from './scoreResumeService';
import { tailorResume } from './tailorResumeService';

export const apiService = {
  getJobPosting,
  uploadResume,
  getATSFeedback,
  getFeedback,
  getResumeSchema,
  scoreResume,
  tailorResume
};
