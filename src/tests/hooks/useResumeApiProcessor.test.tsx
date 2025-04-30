
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

// Mock the other hooks we created
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
    
    // Check that API calls were made
    expect(apiServiceMock.getResumeSchema).toHaveBeenCalledWith(resumeText);
    
    // Check progress updates
    expect(mockSetProgress).toHaveBeenCalledWith(40);
    
    // Check progress text updates
    expect(mockSetProgressText).toHaveBeenCalledWith('Converting resume to structured format...');
    
    // Check that no errors were set
    expect(mockSetApiErrors).not.toHaveBeenCalled();
  });

  test('processResumeContent handles API errors', async () => {
    // Change the mock to return errors
    jest.resetModules();
    jest.mock('@/services/api', () => ({
      apiService: apiServiceWithErrors
    }));
    
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
    
    // Check that errors were set
    expect(mockSetApiErrors).toHaveBeenCalled();
    expect(mockSetApiErrors.mock.calls[0][0]).toContain('Resume Schema Error');
  });

  test('tailoringRationale is available from hook', async () => {
    const { result } = renderHook(() => useResumeApiProcessor());
    
    // Check that rationale is available
    expect(result.current.tailoringRationale).toEqual(mockTailoredResponse.rationale);
  });
});
