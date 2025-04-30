/**
 * Utility functions for normalizing resume data structures
 */
import { ResumeJson } from '@/types/resume';

/**
 * Normalizes the skills data structure in a resume
 * - Converts string skills to proper array format
 * - Ensures skills is always an array
 */
export const normalizeSkills = (resumeData: ResumeJson | null): ResumeJson | null => {
  if (!resumeData) return resumeData;
  
  // If skills is a string, convert it to an array with that string as the only element
  if (typeof resumeData.skills === 'string') {
    return {
      ...resumeData,
      skills: [{ name: resumeData.skills, keywords: [] }]
    };
  }
  
  // If skills is not an array, make it an empty array
  if (!Array.isArray(resumeData.skills)) {
    return {
      ...resumeData,
      skills: []
    };
  }
  
  return resumeData;
};

/**
 * Formats job posting as a simple string for API requests
 */
export const formatJobPostingAsText = (jobPosting: any): string => {
  if (!jobPosting) {
    throw new Error("No job posting available");
  }
  
  // If it's user-provided or has a description, use it directly
  if ((jobPosting.userProvided && jobPosting.description) || jobPosting.description) {
    return jobPosting.description;
  }
  
  // Otherwise construct a string from parts
  let jobPostingText = jobPosting.title || '';
  
  if (jobPosting.requirements && jobPosting.requirements.length > 0) {
    jobPostingText += `\n\nRequirements:\n${jobPosting.requirements.join('\n')}`;
  }
  
  if (jobPosting.skills && jobPosting.skills.length > 0) {
    jobPostingText += `\n\nSkills:\n${jobPosting.skills.join('\n')}`;
  }
  
  return jobPostingText;
};
