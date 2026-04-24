import { ResumeJson } from '@/types/resume';
import { logApiCall, ApiResponse } from './utils';

export const downloadResumeAsDocx = async (resumeJson: ResumeJson, jobTitle: string): Promise<ApiResponse<Blob>> => {
  console.log('Downloading resume as DOCX (via edge proxy)');

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: 'API error: Supabase configuration is missing' };
    }

    logApiCall('downloadResumeAsDocx (request)', {
      resumeBasics: resumeJson.basics ? {
        name: resumeJson.basics.name,
        hasEmail: !!resumeJson.basics.email,
        hasPhone: !!resumeJson.basics.phone,
        hasSummary: !!resumeJson.basics.summary,
      } : 'Missing basics',
      workExperience: resumeJson.work ? `${resumeJson.work.length} entries` : 'No work entries',
      endpoint: 'edge:download-docx',
    }, 'Fetching raw DOCX from download-docx edge function');

    const response = await fetch(`${supabaseUrl}/functions/v1/download-docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(resumeJson),
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const errorPayload = await response.json().catch(() => null);
      const message = `API error: ${errorPayload?.error || `Request failed with status ${response.status}`}${errorPayload?.details ? ` - ${errorPayload.details}` : ''}`;
      console.error('DOCX download failed:', errorPayload);
      logApiCall('downloadResumeAsDocx (response)', { error: errorPayload, status: response.status }, null, message);
      return { error: message };
    }

    if (!response.ok) {
      const message = `API error: Request failed with status ${response.status}`;
      console.error('DOCX download failed:', message);
      logApiCall('downloadResumeAsDocx (response)', { status: response.status }, null, message);
      return { error: message };
    }

    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    logApiCall('downloadResumeAsDocx (response)', {
      contentType: blob.type,
      size: `${Math.round(blob.size / 1024)}KB`,
    }, 'Successfully received DOCX file');

    return { data: blob };
  } catch (error) {
    console.error('Failed to download resume as DOCX:', error);
    logApiCall('downloadResumeAsDocx (error)', {}, null, error);
    return {
      error: `API error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

