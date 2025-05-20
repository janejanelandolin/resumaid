
export interface ResumeProcessorState {
  isUploading: boolean;
  uploadedFile: File | null;
  resumeText: string;
  apiErrors: string[];
  hasAttemptedUpload: boolean; // Track if an upload has been attempted
}

export interface UseResumeProcessorProps {
  setProgress: (progress: number) => void;
  setProgressText: (text: string) => void;
  showErrorDialog: () => void;
  showContentWarning: () => void;
}
