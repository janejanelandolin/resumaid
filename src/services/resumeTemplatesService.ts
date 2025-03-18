
import { ResumeTemplate } from '../contexts/ResumeContext';

// Template data with 4 specific templates
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop',
    description: 'Clean, professional layout ideal for corporate environments'
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop',
    description: 'Bold design for creative industries and roles'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&auto=format&fit=crop',
    description: 'Simple, elegant design focused on content'
  },
  {
    id: 'technical',
    name: 'Technical',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop',
    description: 'Optimized for technical roles with skills emphasis'
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
