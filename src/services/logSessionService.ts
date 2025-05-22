
import { ResumeJson, ScoreResponse } from '@/types/resume';

/**
 * Interface for session log data
 */
interface SessionLogData {
  date: string;
  time: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ipAddress: string;
  unoptimizedScore: number;
  unoptimizedQualification: string;
  optimizedScore: number;
  optimizedQualification: string;
}

/**
 * Creates a tab-delimited log entry string from session data
 */
const formatLogEntry = (data: SessionLogData): string => {
  return [
    data.date,
    data.time,
    data.jobTitle,
    data.name,
    data.email,
    data.phone,
    data.location,
    data.ipAddress,
    data.unoptimizedScore,
    data.unoptimizedQualification,
    data.optimizedScore,
    data.optimizedQualification
  ].join('\t');
};

/**
 * Get IP address using a public API
 */
const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return 'unknown';
  }
};

/**
 * Extract location string from resume data
 */
const getLocationString = (resume: ResumeJson | null): string => {
  if (!resume?.basics?.location) return 'unknown';
  
  const loc = resume.basics.location;
  const parts = [
    loc.address,
    loc.city,
    loc.region,
    loc.postalCode,
    loc.countryCode
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'unknown';
};

/**
 * Log session data to SessionsLog.txt
 */
export const logSessionData = async (
  jobTitle: string,
  resumeJson: ResumeJson | null,
  originalScore: ScoreResponse | null,
  tailoredScore: ScoreResponse | null
): Promise<void> => {
  try {
    // Get current date and time
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    
    // Get IP address
    const ipAddress = await getIpAddress();
    
    // Create log data object
    const logData: SessionLogData = {
      date: dateStr,
      time: timeStr,
      jobTitle: jobTitle || 'unknown',
      name: resumeJson?.basics?.name || 'unknown',
      email: resumeJson?.basics?.email || 'unknown',
      phone: resumeJson?.basics?.phone || 'unknown',
      location: getLocationString(resumeJson),
      ipAddress,
      unoptimizedScore: originalScore?.similarity || 0,
      unoptimizedQualification: originalScore?.consensus_qualification || 'unknown',
      optimizedScore: tailoredScore?.similarity || 0,
      optimizedQualification: tailoredScore?.consensus_qualification || 'unknown'
    };
    
    // Format the log entry
    const logEntry = formatLogEntry(logData);
    
    console.log('Session data logged:', logEntry);
    
    // Since we can't directly write to a file in the browser,
    // we'll log to the console for now. In a real implementation,
    // this would call a server endpoint to save the data.
    
    // Create a downloadable version of the log entry
    const blob = new Blob([logEntry + '\n'], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a hidden link to download the file
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'SessionsLog.txt';
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Failed to log session data:', error);
  }
};
