
import { ApiResponse } from '@/services/api/utils';
import { mockResumeJson, mockScoreResponse, mockTailoredResponse, mockUploadData } from './resumeTestMocks';

export const apiServiceMock = {
  getJobPosting: jest.fn().mockResolvedValue({ data: { title: 'Software Engineer' } }),
  uploadResume: jest.fn().mockResolvedValue({ data: mockUploadData }),
  getResumeSchema: jest.fn().mockResolvedValue({ data: mockResumeJson }),
  scoreResume: jest.fn().mockResolvedValue({ data: mockScoreResponse }),
  tailorResume: jest.fn().mockResolvedValue({ data: mockTailoredResponse }),
  downloadResumeAsDocx: jest.fn().mockResolvedValue({ data: { url: 'mock-download-url.docx' } }),
  downloadResumeAsJson: jest.fn().mockResolvedValue({ data: { url: 'mock-download-url.json' } })
};

export const apiServiceWithErrors = {
  getJobPosting: jest.fn().mockResolvedValue({ error: 'Failed to get job posting' }),
  uploadResume: jest.fn().mockResolvedValue({ error: 'Failed to upload resume' }),
  getResumeSchema: jest.fn().mockResolvedValue({ error: 'Failed to get resume schema', data: mockResumeJson }),
  scoreResume: jest.fn().mockResolvedValue({ error: 'Failed to score resume', data: mockScoreResponse }),
  tailorResume: jest.fn().mockResolvedValue({ error: 'Failed to tailor resume', data: mockTailoredResponse }),
  downloadResumeAsDocx: jest.fn().mockResolvedValue({ error: 'Failed to download resume' }),
  downloadResumeAsJson: jest.fn().mockResolvedValue({ error: 'Failed to download resume as JSON' })
};

export const apiServiceWithoutFallbackData = {
  getJobPosting: jest.fn().mockResolvedValue({ error: 'Failed to get job posting' }),
  uploadResume: jest.fn().mockResolvedValue({ error: 'Failed to upload resume' }),
  getResumeSchema: jest.fn().mockResolvedValue({ error: 'Failed to get resume schema' }),
  scoreResume: jest.fn().mockResolvedValue({ error: 'Failed to score resume' }),
  tailorResume: jest.fn().mockResolvedValue({ error: 'Failed to tailor resume' }),
  downloadResumeAsDocx: jest.fn().mockResolvedValue({ error: 'Failed to download resume' }),
  downloadResumeAsJson: jest.fn().mockResolvedValue({ error: 'Failed to download resume as JSON' })
};
