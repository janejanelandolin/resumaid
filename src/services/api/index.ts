
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getATSFeedback, getFeedback } from './feedbackService';

export const apiService = {
  getJobPosting,
  uploadResume,
  getATSFeedback,
  getFeedback
};
