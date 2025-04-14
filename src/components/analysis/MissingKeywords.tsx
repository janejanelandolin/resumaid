
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { KeyRound } from 'lucide-react';
import { ScoreResponse } from '@/types/resume';

interface MissingKeywordsProps {
  scoreResponse: ScoreResponse;
}

const MissingKeywords: React.FC<MissingKeywordsProps> = ({ scoreResponse }) => {
  // Get missing keywords from the score response
  const missingKeywords = scoreResponse.missing_keywords || [];
  
  // If there are no missing keywords, show a success message
  if (!missingKeywords.length) {
    return null;
  }

  return (
    <div className="pt-4 relative">
      <div className="absolute -left-3 -top-3 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value="missing-keywords"
          className="border border-orange-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
        >
          <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-all">
            <div className="flex items-center">
              <KeyRound className="h-4 w-4 text-orange-500 mr-2 shrink-0" />
              Missing Keywords
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm px-4 py-3 bg-white/80">
            <div className="space-y-3">
              <p className="text-gray-700 mb-2">
                The job description contains these important keywords that are missing from your resume:
              </p>
              
              <ul className="list-disc pl-5 space-y-1.5">
                {missingKeywords.map((keyword, index) => (
                  <li key={index} className="text-orange-700">
                    {keyword}
                  </li>
                ))}
              </ul>
              
              <p className="text-sm text-gray-600 mt-3 italic">
                Consider adding these keywords to your resume to improve your match score.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MissingKeywords;
