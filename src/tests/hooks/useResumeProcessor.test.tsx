
import { renderHook, act } from '@testing-library/react-hooks';
import { useResumeProcessor } from '@/hooks/useResumeProcessor';
import { mockJobPosting, createMockFile } from '../mocks/resumeTestMocks';
import { apiServiceMock } from '../mocks/apiServiceMock';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

jest.mock('@/contexts/ResumeContext', () => ({
  useResumeContext: () => ({
    jobPosting: mockJobPosting,
    setUploadData: jest.fn(),
    setApiErrors: jest.fn(),
    setJobPosting: jest.fn()
  })
}));

jest.mock('@/services/api', () => ({
  apiService: apiServiceMock
}));

// Mock sub-hooks that we're already testing separately
jest.mock('@/hooks/resume/useResumeProcessorState', () => ({
  useResumeProcessorState: () => ({
    state: {
      isUploading: false,
      uploadedFile: createMockFile(),
      resumeText: '',
      apiErrors: []
    },
    setApiErrors: jest.fn(),
    handleFileUpload: jest.fn(),
    handleTextInput: jest.fn(),
    setUploading: jest.fn(),
    createTextFile: jest.fn()
  })
}));

jest.mock('@/hooks/resume/useJobPostingHandler', () => ({
  useJobPostingHandler: () => ({
    handleJobPostingInput: jest.fn()
  })
}));

jest.mock('@/hooks/resume/useResumeApiProcessor', () => ({
  useResumeApiProcessor: () => ({
    processResumeContent: jest.fn().mockResolvedValue(true),
    tailoringRationale: []
  })
}));

describe('useResumeProcessor', () => {
  const mockProps = {
    setProgress: jest.fn(),
    setProgressText: jest.fn(),
    showErrorDialog: jest.fn(),
    showContentWarning: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementation
    Storage.prototype.setItem = jest.fn();
  });

  test('useResumeProcessor returns expected properties', () => {
    const { result } = renderHook(() => useResumeProcessor(mockProps));
    
    expect(result.current).toHaveProperty('state');
    expect(result.current).toHaveProperty('handleFileUpload');
    expect(result.current).toHaveProperty('handleTextInput');
    expect(result.current).toHaveProperty('handleJobPostingInput');
    expect(result.current).toHaveProperty('processResume');
  });

  test('processResume function initiates resume processing flow', async () => {
    const { result } = renderHook(() => useResumeProcessor(mockProps));
    
    await act(async () => {
      await result.current.processResume();
    });
    
    // Check that progress updates were made
    expect(mockProps.setProgress).toHaveBeenCalledWith(0);
    expect(mockProps.setProgressText).toHaveBeenCalledWith('Processing resume...');
    
    // Check that sessionStorage was updated
    expect(sessionStorage.setItem).toHaveBeenCalledWith('resumeUploaded', 'true');
  });
});
