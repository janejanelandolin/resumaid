import { API_BASE_URL, logApiCall, ApiResponse } from './utils';

export interface FetchedJobPosting {
  text: string;
}

export const fetchJobPostingFromUrl = async (url: string): Promise<ApiResponse<FetchedJobPosting>> => {
  try {
    const encodedUrl = encodeURIComponent(url);
    const endpoint = `${API_BASE_URL}fetch_job_posting?url=${encodedUrl}`;
    logApiCall('fetchJobPostingFromUrl (request)', { url }, null);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return { error: `Failed to fetch job posting: ${response.status} - ${responseText}` };
    }

    const data = JSON.parse(responseText) as FetchedJobPosting;
    logApiCall('fetchJobPostingFromUrl (response)', { url }, data);
    return { data };
  } catch (error) {
    console.error('fetchJobPostingFromUrl error:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
