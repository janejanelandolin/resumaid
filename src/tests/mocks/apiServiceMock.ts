
import { ApiResponse } from '@/services/api/utils';
import { mockResumeJson, mockScoreResponse, mockTailoredResponse, mockUploadData } from './resumeTestMocks';

export const apiServiceMock = {
  getJobPosting: jest.fn().mockResolvedValue({ data: { title: 'Software Engineer' } }),
  uploadResume: jest.fn().mockResolvedValue({ data: mockUploadData }),
  getATSFeedback: jest.fn().mockResolvedValue({ data: { format_issues: ['Format issue 1'] } }),
  getFeedback: jest.fn().mockResolvedValue({ data: { format_issues: ['Format issue 1'] } }),
  getResumeSchema: jest.fn().mockResolvedValue({ data: mockResumeJson }),
  scoreResume: jest.fn().mockResolvedValue({ data: mockScoreResponse }),
  tailorResume: jest.fn().mockResolvedValue({ data: mockTailoredResponse })
};

export const apiServiceWithErrors = {
  getJobPosting: jest.fn().mockResolvedValue({ error: 'Failed to get job posting' }),
  uploadResume: jest.fn().mockResolvedValue({ error: 'Failed to upload resume' }),
  getATSFeedback: jest.fn().mockResolvedValue({ error: 'Failed to get ATS feedback' }),
  getFeedback: jest.fn().mockResolvedValue({ error: 'Failed to get feedback' }),
  getResumeSchema: jest.fn().mockResolvedValue({ error: 'Failed to get resume schema', data: mockResumeJson }),
  scoreResume: jest.fn().mockResolvedValue({ error: 'Failed to score resume', data: mockScoreResponse }),
  tailorResume: jest.fn().mockResolvedValue({ error: 'Failed to tailor resume', data: mockTailoredResponse })
};

export const apiServiceWithoutFallbackData = {
  getJobPosting: jest.fn().mockResolvedValue({ error: 'Failed to get job posting' }),
  uploadResume: jest.fn().mockResolvedValue({ error: 'Failed to upload resume' }),
  getATSFeedback: jest.fn().mockResolvedValue({ error: 'Failed to get ATS feedback' }),
  getFeedback: jest.fn().mockResolvedValue({ error: 'Failed to get feedback' }),
  getResumeSchema: jest.fn().mockResolvedValue({ error: 'Failed to get resume schema' }),
  scoreResume: jest.fn().mockResolvedValue({ error: 'Failed to score resume' }),
  tailorResume: jest.fn().mockResolvedValue({ error: 'Failed to tailor resume' })
};
