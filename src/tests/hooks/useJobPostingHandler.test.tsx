
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useJobPostingHandler } from '@/hooks/resume/useJobPostingHandler';
import { mockJobPosting } from '../mocks/resumeTestMocks';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('useJobPostingHandler', () => {
  const mockSetJobPosting = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleJobPostingInput updates job posting with text input', () => {
    const { result } = renderHook(() => 
      useJobPostingHandler(mockJobPosting, mockSetJobPosting)
    );
    
    const testText = 'New job description';
    
    act(() => {
      result.current.handleJobPostingInput(testText);
    });
    
    expect(mockSetJobPosting).toHaveBeenCalledWith({
      ...mockJobPosting,
      description: testText,
      userProvided: true
    });
  });

  test('handleJobPostingInput does nothing with empty text', () => {
    const { result } = renderHook(() => 
      useJobPostingHandler(mockJobPosting, mockSetJobPosting)
    );
    
    act(() => {
      result.current.handleJobPostingInput('  ');
    });
    
    expect(mockSetJobPosting).not.toHaveBeenCalled();
  });

  test('handleJobPostingInput does nothing with null job posting', () => {
    const { result } = renderHook(() => 
      useJobPostingHandler(null, mockSetJobPosting)
    );
    
    act(() => {
      result.current.handleJobPostingInput('Test job posting');
    });
    
    expect(mockSetJobPosting).not.toHaveBeenCalled();
  });
});
