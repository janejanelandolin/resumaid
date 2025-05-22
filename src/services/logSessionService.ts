
import { ResumeJson, ScoreResponse } from '@/types/resume';

/**
 * Interface for session log data
 */
export interface SessionLogData {
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
  recommendation?: number; // New field for feedback score
  feedback?: string; // New field for feedback comments
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
    data.optimizedQualification,
    data.recommendation !== undefined ? data.recommendation : '',
    data.feedback || ''
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
 * Save session log entry to localStorage
 */
const saveToLocalStorage = (logData: SessionLogData): void => {
  try {
    // Get existing logs
    const existingLogsStr = localStorage.getItem('sessionLogs');
    const existingLogs: SessionLogData[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];
    
    // Add new log
    existingLogs.push(logData);
    
    // Save back to localStorage
    localStorage.setItem('sessionLogs', JSON.stringify(existingLogs));
  } catch (error) {
    console.error('Failed to save session log to localStorage:', error);
  }
};

/**
 * Save feedback to localStorage by updating the most recent log entry
 */
export const saveFeedbackToLocalStorage = (recommendation: number, feedback: string): void => {
  try {
    // Get existing logs
    const existingLogsStr = localStorage.getItem('sessionLogs');
    if (!existingLogsStr) {
      // If no logs exist, create a new minimal entry
      const now = new Date();
      const newLog: SessionLogData = {
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        jobTitle: 'unknown',
        name: 'unknown',
        email: 'unknown',
        phone: 'unknown',
        location: 'unknown',
        ipAddress: 'unknown',
        unoptimizedScore: 0,
        unoptimizedQualification: 'unknown',
        optimizedScore: 0,
        optimizedQualification: 'unknown',
        recommendation,
        feedback
      };
      localStorage.setItem('sessionLogs', JSON.stringify([newLog]));
      return;
    }
    
    const existingLogs: SessionLogData[] = JSON.parse(existingLogsStr);
    
    if (existingLogs.length > 0) {
      // Update the most recent log
      const lastLog = existingLogs[existingLogs.length - 1];
      lastLog.recommendation = recommendation;
      lastLog.feedback = feedback;
      
      // Save back to localStorage
      localStorage.setItem('sessionLogs', JSON.stringify(existingLogs));
    }
  } catch (error) {
    console.error('Failed to save feedback to localStorage:', error);
  }
};

/**
 * Log session data to localStorage only (no download)
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
    
    // Format the log entry for debugging
    const logEntry = formatLogEntry(logData);
    console.log('Session data logged:', logEntry);
    
    // Save to localStorage for admin access
    saveToLocalStorage(logData);
    
    // No longer automatically downloading the file
  } catch (error) {
    console.error('Failed to log session data:', error);
  }
};

/**
 * Download all session logs as a single file
 */
export const downloadAllSessionLogs = (): void => {
  try {
    const storedLogs = localStorage.getItem('sessionLogs');
    if (!storedLogs) {
      console.log('No session logs found');
      return;
    }

    const logs: SessionLogData[] = JSON.parse(storedLogs);
    
    // Create header row
    const headers = [
      'Date', 'Time', 'Job Title', 'Name', 'Email', 
      'Phone', 'Location', 'IP Address', 
      'Unoptimized Score', 'Unoptimized Qualification',
      'Optimized Score', 'Optimized Qualification',
      'Recommendation', 'Feedback'
    ].join('\t');
    
    // Create content with header and log entries
    const content = [
      headers,
      ...logs.map(log => formatLogEntry(log))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'AllSessionsLog.txt';
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Failed to download all session logs:', error);
  }
};
