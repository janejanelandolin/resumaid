
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
  getAtsFeedback: getATSFeedback, // Alias to maintain backward compatibility with existing code
  getOptimizationFeedback: getFeedback, // Alias to maintain backward compatibility with existing code
  downloadResumeAsDocx
};
