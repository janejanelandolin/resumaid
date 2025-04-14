import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Sparkle, FileCheck, RefreshCcw } from 'lucide-react';
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
      
      <h3 className="font-semibold mb-4 flex items-center">
        <FileCheck className="h-5 w-5 text-indigo-500 mr-2" />
        <span className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
          Suggested Improvements:
        </span>
      </h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value="compatibility"
          className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
        >
          <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
            <div className="flex items-center">
              <Sparkle className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
              Compatibility
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm px-4 py-3 bg-white/80">
            <div className="space-y-3">
              {feedback.score_reason && (
                <p className="text-indigo-700">{feedback.score_reason}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
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
        
        {feedback.suggested_edits.map((edit, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
              <div className="flex items-center">
                <Sparkle className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
                Suggested Edit {index + 1}: {edit.section || edit.edit_reason || `Improvement #${index + 1}`}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 py-3 bg-white/80">
              {edit.resume_line_old && edit.resume_line_new ? (
                <div className="space-y-3">
                  {edit.edit_reason && (
                    <p className="text-indigo-700 font-medium">{edit.edit_reason}</p>
                  )}
                  <div className="space-y-2">
                    <div className="bg-red-50 p-3 rounded border border-red-100 relative">
                      <span className="absolute -top-2 left-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-sm">
                        Original
                      </span>
                      <p className="mt-1 text-gray-700">{edit.resume_line_old}</p>
                    </div>
                    <div className="flex justify-center">
                      <RefreshCcw className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-100 relative">
                      <span className="absolute -top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-sm">
                        Optimized
                      </span>
                      <p className="mt-1 text-gray-700">{edit.resume_line_new}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-l-2 border-indigo-300 pl-3">
                  {edit.suggestion || "Optimize this section of your resume."}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ImprovementSuggestions;
