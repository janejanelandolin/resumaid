
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ApiErrorDisplayProps {
  errors: string[];
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ errors }) => {
  if (!errors.length) return null;

  return (
    <div className="mb-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>API Errors Detected</AlertTitle>
        <AlertDescription>
          Some errors occurred while processing your resume. Results shown may be incomplete.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem 
          value="error-details"
          className="border border-red-100 rounded-md"
        >
          <AccordionTrigger className="text-sm px-4 py-2">
            View Error Details
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="space-y-2 text-xs">
              {errors.map((error, index) => (
                <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                  <p className="font-mono break-words whitespace-pre-wrap">{error}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ApiErrorDisplay;
