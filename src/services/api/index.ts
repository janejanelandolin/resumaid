
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getResumeSchema } from './resumeSchemaService';
import { scoreResume } from './scoreResumeService';
import { tailorResume } from './tailorResumeService';
import { getATSFeedback } from './atsFeedbackService';
import { getFeedback } from './optimizationFeedbackService';
import { downloadResumeAsDocx } from './downloadResumeService';

// Centralized API service for the application
export const apiService = {
  getJobPosting,
  uploadResume,
  getResumeSchema,
  scoreResume,
  tailorResume,
  // Mark as deprecated since we should use scoreResume instead
  getAtsFeedback: scoreResume, // Use scoreResume instead of getATSFeedback 
  getOptimizationFeedback: getFeedback, // Keep this alias for backward compatibility
  downloadResumeAsDocx
};
