
import React from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { resumeTemplates } from '@/services/resumeTemplatesService';
import TemplateCard from './TemplateCard';
import { Badge } from '@/components/ui/badge';

const TemplateGallery: React.FC = () => {
  const { selectedTemplates, addTemplate, removeTemplate } = useResumeContext();
  
  const maxTemplatesReached = selectedTemplates.length >= 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Resume Templates</h3>
          <p className="text-sm text-muted-foreground">
            Select up to 5 templates to download your optimized resume
          </p>
        </div>
        <Badge variant="outline">
          {selectedTemplates.length}/5 selected
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resumeTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplates.some(t => t.id === template.id)}
            onSelect={() => addTemplate(template)}
            onRemove={() => removeTemplate(template.id)}
            disabled={maxTemplatesReached && !selectedTemplates.some(t => t.id === template.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
