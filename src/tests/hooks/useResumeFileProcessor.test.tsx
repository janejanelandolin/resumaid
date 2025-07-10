import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useResumeFileProcessor } from '@/hooks/resume/useResumeFileProcessor';
import { apiServiceMock } from '../mocks/apiServiceMock';
import { createMockFile } from '../mocks/resumeTestMocks';

// Mock dependencies
jest.mock('@/services/api', () => ({
  apiService: apiServiceMock
}));

jest.mock('@/contexts/ResumeContext', () => ({
  useResumeContext: () => ({
    setUploadData: jest.fn()
  })
}));

describe('useResumeFileProcessor', () => {
  const mockSetProgressText = jest.fn();
  const mockSetProgress = jest.fn();
  const mockSetApiErrors = jest.fn();
  const mockShowContentWarning = jest.fn();
  let apiErrors: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    apiErrors = [];
  });

  describe('processResumeFile', () => {
    it('should process valid file successfully', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBe('Resume content goes here');
      expect(mockSetProgressText).toHaveBeenCalledWith('Uploading resume file...');
      expect(mockSetProgress).toHaveBeenCalledWith(15);
      expect(mockSetProgress).toHaveBeenCalledWith(30);
      expect(apiServiceMock.uploadResume).toHaveBeenCalledWith(mockFile);
    });

    it('should handle empty file', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const emptyFile = createMockFile('empty.pdf', 'application/pdf', 0);

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          emptyFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Upload Error: Invalid or empty file']);
    });

    it('should handle API error response', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock API error
      apiServiceMock.uploadResume.mockResolvedValueOnce({
        error: 'Server error',
        data: undefined
      });

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Upload Error: Server error']);
    });

    it('should handle missing content and show warning', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock response with empty content
      apiServiceMock.uploadResume.mockResolvedValueOnce({
        data: {
          id: 'upload-123',
          filename: 'resume.pdf',
          content: ''
        }
      });

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockShowContentWarning).toHaveBeenCalled();
    });

    it('should handle whitespace-only content', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock response with whitespace-only content
      apiServiceMock.uploadResume.mockResolvedValueOnce({
        data: {
          id: 'upload-123',
          filename: 'resume.pdf',
          content: '   \n\t  '
        }
      });

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockShowContentWarning).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock network error
      apiServiceMock.uploadResume.mockRejectedValueOnce(new Error('Network error'));

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Upload Error: Network error']);
    });

    it('should handle non-Error exceptions', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock string error
      apiServiceMock.uploadResume.mockRejectedValueOnce('String error');

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Upload Error: String error']);
    });

    it('should handle missing data in successful response', async () => {
      const { result } = renderHook(() => useResumeFileProcessor());
      const mockFile = createMockFile('resume.pdf', 'application/pdf', 1024);

      // Mock response without data
      apiServiceMock.uploadResume.mockResolvedValueOnce({
        data: undefined
      });

      let extractedContent: string | null = null;

      await act(async () => {
        extractedContent = await result.current.processResumeFile(
          mockFile,
          mockSetProgressText,
          mockSetProgress,
          apiErrors,
          mockSetApiErrors,
          mockShowContentWarning
        );
      });

      expect(extractedContent).toBeNull();
      expect(mockSetApiErrors).toHaveBeenCalledWith(['Upload Error: Failed to upload resume: No data returned']);
    });
  });
});