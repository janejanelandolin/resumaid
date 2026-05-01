import { ResumeJson } from '../../types/resume';
import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export interface CoverLetterResponse {
  cover_letter: string;
}

export const generateCoverLetter = async (
  resumeJson: ResumeJson,
  jobPostingText: string
): Promise<ApiResponse<CoverLetterResponse>> => {
  try {
    const encodedJobPosting = encodeURIComponent(jobPostingText);
    const url = `${API_BASE_URL}cover_letter?job_posting=${encodedJobPosting}`;
    logApiCall('generateCoverLetter (request)', { jobPostingLength: jobPostingText.length }, null);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(resumeJson),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return { error: `Cover letter error: ${response.status} - ${responseText}` };
    }

    const data = JSON.parse(responseText) as CoverLetterResponse;
    logApiCall('generateCoverLetter (response)', {}, data);
    return { data };
  } catch (error) {
    console.error('generateCoverLetter error:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
