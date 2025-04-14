
import { JobPosting, UploadData, Feedback } from '../../types/resume';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bridgeworks-api-758224663478.us-central1.run.app/";

// Helper function to log API inputs and outputs
export const logApiCall = (endpoint: string, input: any, output: any, error?: any) => {
  console.log(`===== API CALL: ${endpoint} =====`);
  console.log('INPUT:', input);
  console.log('OUTPUT:', output);
  if (error) {
    console.error('ERROR:', error);
  }
  console.log('=============================');
};

// Type definitions for API responses
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
