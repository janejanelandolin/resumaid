
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useResumeApiProcessor } from '@/hooks/resume/useResumeApiProcessor';
import { mockJobPosting, mockResumeJson, mockScoreResponse, mockTailoredResponse } from '../mocks/resumeTestMocks';
import { apiServiceMock, apiServiceWithErrors } from '../mocks/apiServiceMock';

// Mock the API service
jest.mock('@/services/api', () => ({
  apiService: apiServiceMock
}));

// Mock the resume context
jest.mock('@/contexts/ResumeContext', () => ({
  useResumeContext: () => ({
    jobPosting: mockJobPosting,
    setResumeJson: jest.fn(),
    setOriginalScore: jest.fn(),
    setTailoredResumeJson: jest.fn(),
    setTailoredScore: jest.fn()
  })
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock the component hooks
jest.mock('@/hooks/resume/useResumeScoring', () => ({
  useResumeScoring: () => ({
    scoreResume: jest.fn().mockResolvedValue(true)
  })
}));

jest.mock('@/hooks/resume/useResumeTailoring', () => ({
  useResumeTailoring: () => ({
    tailorResume: jest.fn().mockResolvedValue(true),
    tailoringRationale: mockTailoredResponse.rationale
  })
}));

jest.mock('@/hooks/resume/useResumeContentProcessor', () => ({
  useResumeContentProcessor: () => ({
    processContent: jest.fn().mockResolvedValue(mockResumeJson)
  })
}));

describe('useResumeApiProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processResumeContent processes resume content successfully', async () => {
    const { result } = renderHook(() => useResumeApiProcessor());
    
    const mockSetApiErrors = jest.fn();
    const mockSetProgress = jest.fn();
    const mockSetProgressText = jest.fn();
    const resumeText = 'Sample resume text';
    const apiErrors: string[] = [];
    
    await act(async () => {
      await result.current.processResumeContent(
        resumeText,
        mockSetApiErrors,
        mockSetProgress,
        mockSetProgressText,
        apiErrors
      );
    });
    
    // Check progress updates
    expect(mockSetProgress).toHaveBeenCalled();
    
    // Check that no errors were set
    expect(mockSetApiErrors).not.toHaveBeenCalled();
  });

  test('tailoringRationale is available from hook', async () => {
    const { result } = renderHook(() => useResumeApiProcessor());
    
    // Check that rationale is available
    expect(result.current.tailoringRationale).toEqual(mockTailoredResponse.rationale);
  });
});
