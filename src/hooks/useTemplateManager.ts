
import { useState } from 'react';
import { ResumeTemplate } from '../types/resume';

export const useTemplateManager = () => {
  const [selectedTemplates, setSelectedTemplates] = useState<ResumeTemplate[]>([]);

  const addTemplate = (template: ResumeTemplate) => {
    setSelectedTemplates(prev => {
      // Check if template is already selected
      if (prev.some(t => t.id === template.id)) {
        return prev;
      }
      return [...prev, template];
    });
  };

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const resetTemplates = () => {
    setSelectedTemplates([]);
  };

  return {
    selectedTemplates,
    addTemplate,
    removeTemplate,
    resetTemplates
  };
};
