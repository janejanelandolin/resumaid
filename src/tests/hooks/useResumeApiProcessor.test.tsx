
import { renderHook, act } from '@testing-library/react-hooks';
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
    expect(apiServiceMock.scoreResume).toHaveBeenCalled();
    expect(apiServiceMock.tailorResume).toHaveBeenCalled();
    
    // Check progress updates
    expect(mockSetProgress).toHaveBeenCalledWith(40);
    expect(mockSetProgress).toHaveBeenCalledWith(60);
    expect(mockSetProgress).toHaveBeenCalledWith(80);
    expect(mockSetProgress).toHaveBeenCalledWith(90);
    
    // Check progress text updates
    expect(mockSetProgressText).toHaveBeenCalledWith('Converting resume to structured format...');
    expect(mockSetProgressText).toHaveBeenCalledWith('Scoring your resume...');
    expect(mockSetProgressText).toHaveBeenCalledWith('Tailoring your resume to the job...');
    expect(mockSetProgressText).toHaveBeenCalledWith('Evaluating optimized resume...');
    
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

  test('tailoringRationale is stored from API response', async () => {
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
    
    // Check that rationale was stored
    expect(result.current.tailoringRationale).toEqual(mockTailoredResponse.rationale);
  });
});
