
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
import { Sparkle, ArrowRight, CheckCircle2, FileCheck, RefreshCcw } from 'lucide-react';

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

  // Get the similarity score from either the new or old data structure
  const atsSimilarity = atsFeedback.similarity || atsFeedback.JobPostingFulltext_ResumeFulltext_similarity || 0;
  
  // Calculate the improvement percentage
  const improvement = feedback.similarity - atsSimilarity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pt-6">
      <PageContainer className="py-6 justify-start">
        <div className="w-full space-y-6 relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 text-purple-300 animate-pulse">
            <Sparkle size={24} />
          </div>
          <div className="absolute top-32 -left-8 text-blue-400 animate-spin-slow">
            <Sparkle size={16} />
          </div>
          <div className="absolute top-56 -right-6 text-yellow-400 animate-bounce">
            <Sparkle size={20} />
          </div>
          
          <div className="space-y-2 text-center relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-sm text-muted-foreground">
              For: <span className="font-medium text-primary">{jobTitle}</span>
            </p>
            {feedback.qualification && (
              <div className="mt-2 inline-flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-green-800">
                  Status: {feedback.qualification}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-bl-full"></div>
            <TypewriterText
              text={feedback.score_reason}
              className="text-sm relative z-10"
            />
          </div>

          <div className="flex flex-col items-center justify-center py-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-lg -z-10"></div>
            
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Compatibility Score
              </h2>
            </div>
            
            <div className="flex justify-center items-center space-x-4 py-4">
              <AnimatedDial 
                score={atsSimilarity * 100} 
                max={100} 
                color="text-orange-500" 
                label="Without optimization" 
              />
              <div className="flex flex-col items-center justify-center">
                <ArrowRight className="h-8 w-8 text-indigo-400 animate-pulse" />
                <div className="mt-2 py-1 px-3 bg-green-100 rounded-full">
                  <span className="text-xs font-bold text-green-700 flex items-center">
                    <span>+{(improvement * 100).toFixed(0)}%</span>
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </div>
              <AnimatedDial 
                score={feedback.similarity * 100} 
                max={100} 
                color="text-indigo-600" 
                label="With optimization" 
              />
            </div>
            
            <div className="text-center py-2 px-4 bg-indigo-100/50 rounded-full border border-indigo-200/50 shadow-inner mt-2">
              <p className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Optimize your resume to stand out!
              </p>
            </div>
          </div>

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
              {feedback.suggested_edits.map((edit, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-indigo-100 mb-2 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-sm font-medium px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                    <div className="flex items-center">
                      <Sparkle className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
                      {edit.section || edit.edit_reason || `Improvement #${index + 1}`}
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

          <Button 
            onClick={handleContinue} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Download Optimized Resume!
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>Your optimized resume will be ready after the next step</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default AnalysisPage;
