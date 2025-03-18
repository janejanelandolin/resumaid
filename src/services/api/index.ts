
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getATSFeedback } from './atsFeedbackService';
import { getFeedback } from './optimizationFeedbackService';

export const apiService = {
  getJobPosting,
  uploadResume,
  getATSFeedback,
  getFeedback
};
