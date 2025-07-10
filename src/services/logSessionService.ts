
import { ResumeJson, ScoreResponse } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for session log data
 */
export interface SessionLogData {
  id?: string;
  user_id?: string;
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
  recommendation?: number;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
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
 * Save session log entry to database
 */
const saveToDatabase = async (logData: SessionLogData): Promise<string | null> => {
  try {
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('session_logs')
      .insert({
        user_id: user?.id || null,
        date: logData.date,
        time: logData.time,
        job_title: logData.jobTitle,
        name: logData.name,
        email: logData.email,
        phone: logData.phone,
        location: logData.location,
        ip_address: logData.ipAddress,
        unoptimized_score: logData.unoptimizedScore,
        unoptimized_qualification: logData.unoptimizedQualification,
        optimized_score: logData.optimizedScore,
        optimized_qualification: logData.optimizedQualification,
        recommendation: logData.recommendation,
        feedback: logData.feedback
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to save session log to database:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Failed to save session log to database:', error);
    return null;
  }
};

/**
 * Save feedback to database by updating the most recent log entry
 */
export const saveFeedbackToDatabase = async (recommendation: number, feedback: string): Promise<void> => {
  try {
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    // Find the most recent session log for this user or session
    const { data: recentLog, error: fetchError } = await supabase
      .from('session_logs')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !recentLog) {
      console.error('No recent session log found to update with feedback');
      return;
    }

    // Update the most recent log with feedback
    const { error: updateError } = await supabase
      .from('session_logs')
      .update({
        recommendation,
        feedback
      })
      .eq('id', recentLog.id);

    if (updateError) {
      console.error('Failed to save feedback to database:', updateError);
    } else {
      console.log('Feedback saved to database successfully');
    }
  } catch (error) {
    console.error('Failed to save feedback to database:', error);
  }
};

/**
 * Log analysis attempt when processing starts (captures all attempts)
 */
export const logAnalysisAttempt = async (
  jobTitle: string,
  resumeJson: ResumeJson | null
): Promise<void> => {
  try {
    // Get current date and time
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    
    // Get IP address
    const ipAddress = await getIpAddress();
    
    // Create log data object for analysis attempt
    const logData: SessionLogData = {
      date: dateStr,
      time: timeStr,
      jobTitle: jobTitle || 'unknown',
      name: resumeJson?.basics?.name || 'unknown',
      email: resumeJson?.basics?.email || 'unknown',
      phone: resumeJson?.basics?.phone || 'unknown',
      location: getLocationString(resumeJson),
      ipAddress,
      unoptimizedScore: 0, // Will be updated if analysis completes
      unoptimizedQualification: 'Analysis started',
      optimizedScore: 0, // Will be updated if analysis completes
      optimizedQualification: 'Analysis in progress'
    };
    
    // Format the log entry for debugging
    const logEntry = formatLogEntry(logData);
    console.log('Analysis attempt logged:', logEntry);
    
    // Save to database
    await saveToDatabase(logData);
    
  } catch (error) {
    console.error('Failed to log analysis attempt:', error);
  }
};

/**
 * Update the most recent log entry with completion data
 */
export const updateSessionCompletion = async (
  originalScore: ScoreResponse | null,
  tailoredScore: ScoreResponse | null
): Promise<void> => {
  try {
    // Find the most recent session log
    const { data: recentLog, error: fetchError } = await supabase
      .from('session_logs')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !recentLog) {
      console.error('No recent session log found to update with completion data');
      return;
    }

    // Update the most recent log entry with completion data
    const { error: updateError } = await supabase
      .from('session_logs')
      .update({
        unoptimized_score: originalScore?.similarity || 0,
        unoptimized_qualification: originalScore?.consensus_qualification || 'Analysis failed',
        optimized_score: tailoredScore?.similarity || 0,
        optimized_qualification: tailoredScore?.consensus_qualification || 'Analysis failed'
      })
      .eq('id', recentLog.id);

    if (updateError) {
      console.error('Failed to update session completion:', updateError);
    } else {
      console.log('Session completion updated in database');
    }
  } catch (error) {
    console.error('Failed to update session completion:', error);
  }
};

/**
 * Log session data to database - DEPRECATED
 * Use logAnalysisAttempt + updateSessionCompletion instead
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
    
    // Save to database
    await saveToDatabase(logData);
    
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
      'Phone', 'Address', 'IP Address', 
      'Original Score', 'Original Qualification',
      'Optimized Score', 'Optimized Qualification',
      'Promoter Score', 'Feedback Text'
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
