
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { ResumeTemplate } from '@/contexts/ResumeContext';

interface TemplateCardProps {
  template: ResumeTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  isSelected, 
  onSelect, 
  onRemove,
  disabled = false
}) => {
  return (
    <Card className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="aspect-[3/4] relative bg-muted">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-base">{template.name}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0">
        {isSelected ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={onRemove}
          >
            <Check className="mr-2 h-4 w-4" /> Selected
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={onSelect}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" /> Select
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
