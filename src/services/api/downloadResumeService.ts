import { ResumeJson } from '@/types/resume';
import { logApiCall, ApiResponse } from './utils';
import { supabase } from '@/integrations/supabase/client';

export const downloadResumeAsDocx = async (resumeJson: ResumeJson, jobTitle: string): Promise<ApiResponse<Blob>> => {
  console.log('Downloading resume as DOCX (via edge proxy)');

  try {
    logApiCall('downloadResumeAsDocx (request)', {
      resumeBasics: resumeJson.basics ? {
        name: resumeJson.basics.name,
        hasEmail: !!resumeJson.basics.email,
        hasPhone: !!resumeJson.basics.phone,
        hasSummary: !!resumeJson.basics.summary,
      } : 'Missing basics',
      workExperience: resumeJson.work ? `${resumeJson.work.length} entries` : 'No work entries',
      endpoint: 'edge:download-docx',
    }, 'Invoking download-docx edge function');

    // Invoke the edge proxy. We need the raw binary blob, not auto-parsed JSON.
    const { data, error } = await supabase.functions.invoke('download-docx', {
      body: resumeJson,
    });

    if (error) {
      const message = `API error: ${error.message || 'Failed to invoke download-docx'}`;
      console.error('DOCX download failed:', error);
      logApiCall('downloadResumeAsDocx (response)', { error }, null, message);
      return { error: message };
    }

    // The supabase-js client returns a Blob when the response content-type is binary.
    let blob: Blob;
    if (data instanceof Blob) {
      blob = data;
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data]);
    } else if (data && typeof data === 'object' && 'error' in data) {
      const message = `API error: ${(data as any).error}${(data as any).details ? ` - ${(data as any).details}` : ''}`;
      console.error('DOCX upstream error:', data);
      return { error: message };
    } else {
      // Fallback: stringify whatever came back
      blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)]);
    }

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

