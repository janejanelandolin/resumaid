
import { ResumeJson, ScoreResponse } from '@/types/resume';
import { SessionLogData } from '@/services/logs/sessionLogTypes';
import { getIpAddress, getCurrentDateTime, extractResumeData } from '@/services/logs/logSessionUtils';
import { saveToLocalStorage, updateLastLogWithFeedback } from '@/services/logs/sessionLogStorage';
import { downloadAllSessionLogs } from '@/services/logs/sessionLogDownloader';

/**
 * Save feedback to localStorage by updating the most recent log entry
 */
export const saveFeedbackToLocalStorage = (recommendation: number, feedback: string): void => {
  updateLastLogWithFeedback(recommendation, feedback);
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
    const { dateStr, timeStr } = getCurrentDateTime();
    
    // Get IP address
    const ipAddress = await getIpAddress();
    
    // Extract resume data
    const resumeData = extractResumeData(resumeJson);
    
    // Create log data object
    const logData: SessionLogData = {
      date: dateStr,
      time: timeStr,
      jobTitle: jobTitle || 'unknown',
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      location: resumeData.location,
      ipAddress,
      unoptimizedScore: originalScore?.similarity || 0,
      unoptimizedQualification: originalScore?.consensus_qualification || 'unknown',
      optimizedScore: tailoredScore?.similarity || 0,
      optimizedQualification: tailoredScore?.consensus_qualification || 'unknown'
    };
    
    // Save to localStorage for admin access
    saveToLocalStorage(logData);
    
    console.log('Session data logged successfully');
  } catch (error) {
    console.error('Failed to log session data:', error);
  }
};

// Re-export the downloadAllSessionLogs function
export { downloadAllSessionLogs };
