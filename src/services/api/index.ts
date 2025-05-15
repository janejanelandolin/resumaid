
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getResumeSchema } from './resumeSchemaService';
import { scoreResume } from './scoreResumeService';
import { tailorResume } from './tailorResumeService';
import { getAtsFeedback } from './atsFeedbackService';
import { getOptimizationFeedback } from './optimizationFeedbackService';
import { downloadResumeAsDocx } from './downloadResumeService';

// Centralized API service for the application
export const apiService = {
  getJobPosting,
  uploadResume,
  getResumeSchema,
  scoreResume,
  tailorResume,
  getAtsFeedback,
  getOptimizationFeedback,
  downloadResumeAsDocx
};
