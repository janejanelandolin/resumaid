
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Sparkle, FileCheck } from 'lucide-react';
import { Feedback, useResumeContext } from '@/contexts/ResumeContext';

interface ImprovementSuggestionsProps {
  feedback: Feedback;
}

const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ feedback }) => {
  const { tailoredResumeJson } = useResumeContext();
  
  // Get rationale from the API response or use an empty array as fallback
  const rationaleItems = tailoredResumeJson?.rationale || [];
  
  return (
    <div className="pt-4 relative">
      <div className="absolute -left-3 -top-3 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -right-3 -bottom-3 w-8 h-8 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
      
      <Accordion type="single" collapsible className="w-full">
        {/* Display rationale items as improvement suggestions */}
        {rationaleItems.map((rationale, index) => (
          <AccordionItem 
            key={`rationale-${index}`} 
            value={`rationale-${index}`}
            className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
              <div className="flex items-center">
                <Sparkle className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
                Suggested Improvement {index + 1}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 py-3 bg-white/80">
              <div className="border-l-2 border-indigo-300 pl-3">
                {rationale}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        
        {/* Display format issues if available */}
        {feedback.format_issues && feedback.format_issues.length > 0 && (
          <AccordionItem 
            value="format-issues"
            className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
              <div className="flex items-center">
                <Sparkle className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
                Format Issues
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 py-3 bg-white/80">
              <ul className="list-disc pl-5 space-y-1.5">
                {feedback.format_issues.map((issue, i) => (
                  <li key={i} className="text-orange-700">
                    {issue}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ImprovementSuggestions;
