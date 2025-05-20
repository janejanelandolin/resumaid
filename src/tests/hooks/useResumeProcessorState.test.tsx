
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useResumeProcessorState } from '@/hooks/resume/useResumeProcessorState';
import { createMockFile } from '../mocks/resumeTestMocks';

describe('useResumeProcessorState', () => {
  const mockSetGlobalApiErrors = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state is set correctly', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    expect(result.current.state).toEqual({
      isUploading: false,
      uploadedFile: null,
      resumeText: '',
      apiErrors: [],
    });
  });

  test('handleFileUpload sets file and clears text and errors', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    const mockFile = createMockFile();
    
    act(() => {
      result.current.handleFileUpload(mockFile);
    });
    
    expect(result.current.state.uploadedFile).toBe(mockFile);
    expect(result.current.state.resumeText).toBe('');
    expect(result.current.state.apiErrors).toEqual([]);
    expect(mockSetGlobalApiErrors).toHaveBeenCalledWith([]);
  });

  test('handleTextInput sets text and clears file and errors', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    act(() => {
      result.current.handleTextInput('test resume text');
    });
    
    expect(result.current.state.resumeText).toBe('test resume text');
    expect(result.current.state.uploadedFile).toBe(null);
    expect(result.current.state.apiErrors).toEqual([]);
    expect(mockSetGlobalApiErrors).toHaveBeenCalledWith([]);
  });

  test('setApiErrors updates state and global errors', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    const testErrors = ['Error 1', 'Error 2'];
    
    act(() => {
      result.current.setApiErrors(testErrors);
    });
    
    expect(result.current.state.apiErrors).toEqual(testErrors);
    expect(mockSetGlobalApiErrors).toHaveBeenCalledWith(testErrors);
  });

  test('setUploading updates isUploading state', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    act(() => {
      result.current.setUploading(true);
    });
    
    expect(result.current.state.isUploading).toBe(true);
    
    act(() => {
      result.current.setUploading(false);
    });
    
    expect(result.current.state.isUploading).toBe(false);
  });

  test('createTextFile creates a File object from text', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    const text = 'Sample resume text';
    const file = result.current.createTextFile(text);
    
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('resume.txt');
    expect(file.type).toBe('text/plain');
  });

  test('reset returns the state to initial values', () => {
    const { result } = renderHook(() => useResumeProcessorState(mockSetGlobalApiErrors));
    
    // First set some values
    const mockFile = createMockFile();
    
    act(() => {
      result.current.handleFileUpload(mockFile);
      result.current.setUploading(true);
    });
    
    // Verify values were set
    expect(result.current.state.uploadedFile).toBe(mockFile);
    expect(result.current.state.isUploading).toBe(true);
    
    // Reset the state
    act(() => {
      result.current.reset();
    });
    
    // Verify state was reset
    expect(result.current.state).toEqual({
      isUploading: false,
      uploadedFile: null,
      resumeText: '',
      apiErrors: [],
    });
  });
});
