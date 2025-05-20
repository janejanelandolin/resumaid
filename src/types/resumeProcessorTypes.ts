
// Export types with the 'export type' syntax for compatibility with isolatedModules
export type ResumeProcessorState = {
  isUploading: boolean;
  uploadedFile: File | null;
  resumeText: string;
  apiErrors: string[];
  hasAttemptedUpload: boolean; // Track if an upload has been attempted
}

export type UseResumeProcessorProps = {
  setProgress: (progress: number) => void;
  setProgressText: (text: string) => void;
  showErrorDialog: () => void;
  showContentWarning: () => void;
}
