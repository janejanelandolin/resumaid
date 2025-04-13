
import { useState } from 'react';
import { ResumeTemplate } from '../types/resume';

export const useTemplateManager = () => {
  const [selectedTemplates, setSelectedTemplates] = useState<ResumeTemplate[]>([]);

  // Template management functions
  const addTemplate = (template: ResumeTemplate) => {
    if (selectedTemplates.length < 5 && !selectedTemplates.some(t => t.id === template.id)) {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(selectedTemplates.filter(t => t.id !== templateId));
  };

  return {
    selectedTemplates,
    addTemplate,
    removeTemplate
  };
};
