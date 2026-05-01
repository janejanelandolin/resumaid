
import { getJobPosting } from './jobPostingService';
import { uploadResume } from './resumeUploadService';
import { getResumeSchema } from './resumeSchemaService';
import { scoreResume } from './scoreResumeService';
import { tailorResume } from './tailorResumeService';
import { downloadResumeAsDocx } from './downloadResumeService';
import { downloadResumeAsJson } from './downloadResumeJsonService';
import { fetchJobPostingFromUrl } from './fetchJobPostingService';
import { generateCoverLetter } from './coverLetterService';

export const apiService = {
  getJobPosting,
  uploadResume,
  getResumeSchema,
  scoreResume,
  tailorResume,
  downloadResumeAsDocx,
  downloadResumeAsJson,
  fetchJobPostingFromUrl,
  generateCoverLetter,
};
