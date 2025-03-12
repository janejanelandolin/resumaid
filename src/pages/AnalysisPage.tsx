
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import PageContainer from '@/components/PageContainer';
import TypewriterText from '@/components/TypewriterText';
import AnimatedDial from '@/components/AnimatedDial';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { jobTitle, atsFeedback, feedback } = useResumeContext();

  useEffect(() => {
    if (!atsFeedback || !feedback) {
      navigate('/upload');
    }
  }, [atsFeedback, feedback, navigate]);

  if (!atsFeedback || !feedback) {
    return null;
  }

  const handleContinue = () => {
    navigate('/payment');
  };

  return (
    <PageContainer className="py-6 justify-start">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Analysis Results</h1>
          <p className="text-sm text-muted-foreground">
            For: <span className="font-medium text-primary">{jobTitle}</span>
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <TypewriterText
            text={feedback.score_reason}
            className="text-sm"
          />
        </div>

        <div className="flex justify-center items-center space-x-4 py-4">
          <AnimatedDial 
            score={atsFeedback.similarity} 
            max={100} 
            color="text-destructive" 
            label="Without optimization" 
          />
          <div className="text-xl font-bold">→</div>
          <AnimatedDial 
            score={feedback.similarity} 
            max={100} 
            color="text-secondary" 
            label="With optimization" 
          />
        </div>

        <div className="text-center py-2">
          <p className="font-bold text-lg">
            Optimizing your resume improves your compatibility score!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {feedback.similarity - atsFeedback.similarity}% improvement with our suggestions
          </p>
        </div>

        <div className="pt-4">
          <h3 className="font-semibold mb-2">Suggested Improvements:</h3>
          <Accordion type="single" collapsible className="w-full">
            {feedback.suggested_edits.map((edit, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm font-medium">
                  {edit.section}
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  {edit.suggestion}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Button onClick={handleContinue} className="w-full">
          Download Optimized Resume!
        </Button>

        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>Your optimized resume will be ready after the next step</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default AnalysisPage;
