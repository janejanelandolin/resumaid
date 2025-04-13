
export interface ResumeProcessorState {
  isUploading: boolean;
  uploadedFile: File | null;
  resumeText: string;
  apiErrors: string[];
}

export interface UseResumeProcessorProps {
  setProgress: (progress: number) => void;
  setProgressText: (text: string) => void;
  showErrorDialog: () => void;
  showContentWarning: () => void;
}
