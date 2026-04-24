
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CheckCircle2 } from 'lucide-react';
import { useResumeContext } from '@/contexts/ResumeContext';

const ImprovementSuggestions: React.FC = () => {
  const { tailoredResumeJson } = useResumeContext();

  const changes = tailoredResumeJson?.changes || [];

  if (!changes.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Changes Made to Your Resume
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {changes.map((change, index) => (
          <AccordionItem
            key={`change-${index}`}
            value={`change-${index}`}
            className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
              <div className="flex items-center text-left">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                Change {index + 1}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 py-3 bg-white/80">
              <div className="border-l-2 border-green-300 pl-3 text-gray-700">
                {change}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ImprovementSuggestions;
