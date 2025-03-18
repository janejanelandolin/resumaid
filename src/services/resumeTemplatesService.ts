
import { ResumeTemplate } from '../contexts/ResumeContext';

// Sample template data - in a real app this would come from an API
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    thumbnail: '/placeholder.svg',
    description: 'Clean, professional layout ideal for corporate environments'
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: '/placeholder.svg',
    description: 'Bold design for creative industries and roles'
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '/placeholder.svg',
    description: 'Contemporary layout with a balanced design'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    thumbnail: '/placeholder.svg',
    description: 'Simple, elegant design focused on content'
  },
  {
    id: 'executive',
    name: 'Executive',
    thumbnail: '/placeholder.svg',
    description: 'Sophisticated design for senior positions'
  },
  {
    id: 'technical',
    name: 'Technical',
    thumbnail: '/placeholder.svg',
    description: 'Optimized for technical roles with skills emphasis'
  },
  {
    id: 'academic',
    name: 'Academic',
    thumbnail: '/placeholder.svg',
    description: 'Format for academic, research, and educational positions'
  }
];

// Mock function to simulate downloading a template
export const downloadTemplate = async (templateId: string, jobTitle: string, resumeContent: string): Promise<boolean> => {
  console.log(`Downloading template ${templateId} for job: ${jobTitle}`);
  
  // In a real implementation, this would call an API to generate the DOCX
  // For now, we'll just simulate a download with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Template ${templateId} downloaded successfully`);
      resolve(true);
    }, 1500);
  });
};

// Mock function to download multiple templates at once
export const downloadSelectedTemplates = async (
  selectedTemplates: ResumeTemplate[], 
  jobTitle: string, 
  resumeContent: string
): Promise<boolean> => {
  console.log(`Downloading ${selectedTemplates.length} templates`);
  
  try {
    // In a real implementation, this would batch download or create a zip
    for (const template of selectedTemplates) {
      await downloadTemplate(template.id, jobTitle, resumeContent);
    }
    return true;
  } catch (error) {
    console.error('Error downloading templates:', error);
    return false;
  }
};
