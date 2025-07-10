import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useResumeContentProcessor } from '@/hooks/resume/useResumeContentProcessor';
import { apiServiceMock } from '../mocks/apiServiceMock';
import { mockResumeJson } from '../mocks/resumeTestMocks';

// Mock dependencies
jest.mock('@/services/api', () => ({
  apiService: apiServiceMock
}));

jest.mock('@/contexts/ResumeContext', () => ({
  useResumeContext: () => ({
    setResumeJson: jest.fn()
  })
}));

// Mock session logging
jest.mock('@/services/logSessionService', () => ({
  updateSessionWithResumeData: jest.fn().mockResolvedValue(undefined)
}));

describe('useResumeContentProcessor', () => {
  const mockSetProgress = jest.fn();
  const mockSetProgressText = jest.fn();
  const mockSetApiErrors = jest.fn();
  let apiErrors: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    apiErrors = [];
    
    // Reset API service mocks
    apiServiceMock.getResumeSchema.mockResolvedValue({ data: mockResumeJson });
  });

  describe('processContent', () => {
    it('should process content successfully', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toEqual(mockResumeJson);
      expect(mockSetProgressText).toHaveBeenCalledWith('Converting resume to structured format...');
      expect(mockSetProgress).toHaveBeenCalledWith(45);
      expect(apiServiceMock.getResumeSchema).toHaveBeenCalledWith(extractedContent);
    });

    it('should handle API error with fallback data', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';

      // Mock API error with fallback data
      apiServiceMock.getResumeSchema.mockResolvedValueOnce({
        error: 'API error',
        data: mockResumeJson
      });

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toEqual(mockResumeJson);
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Schema Error: API error']);
    });

    it('should handle API error without fallback data', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';

      // Mock API error without fallback data
      apiServiceMock.getResumeSchema.mockResolvedValueOnce({
        error: 'API error',
        data: undefined
      });

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Schema Error: API error']);
    });

    it('should handle network errors', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';

      // Mock network error
      apiServiceMock.getResumeSchema.mockRejectedValueOnce(new Error('Network error'));

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Schema Error: Network error']);
    });

    it('should handle empty content', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = '';

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(apiServiceMock.getResumeSchema).toHaveBeenCalledWith('');
    });

    it('should handle very long content', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'A'.repeat(10000); // Very long content

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toEqual(mockResumeJson);
      expect(apiServiceMock.getResumeSchema).toHaveBeenCalledWith(extractedContent);
    });

    it('should preserve existing errors in array', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';
      const existingErrors = ['Previous error'];

      // Mock API error
      apiServiceMock.getResumeSchema.mockResolvedValueOnce({
        error: 'New API error',
        data: undefined
      });

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          existingErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Previous error', 'Schema Error: New API error']);
    });

    it('should handle non-Error exceptions', async () => {
      const { result } = renderHook(() => useResumeContentProcessor());
      const extractedContent = 'Sample resume content';

      // Mock string error
      apiServiceMock.getResumeSchema.mockRejectedValueOnce('String error');

      let processedData = null;

      await act(async () => {
        processedData = await result.current.processContent(
          extractedContent,
          mockSetProgress,
          mockSetProgressText,
          apiErrors,
          mockSetApiErrors
        );
      });

      expect(processedData).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Schema Error: String error']);
    });
  });
});