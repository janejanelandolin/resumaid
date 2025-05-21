
import React from 'react';
import AnimatedDial from '@/components/AnimatedDial';
import { ArrowRight, CheckCircle2, Sparkle } from 'lucide-react';
import useAppVersion from '@/hooks/useAppVersion';

interface CompatibilityScoreProps {
  atsSimilarity: number;
  feedbackSimilarity: number;
  improvement: number;
  atsQualification?: string;
  feedbackQualification?: string;
}

const CompatibilityScore: React.FC<CompatibilityScoreProps> = ({
  atsSimilarity,
  feedbackSimilarity,
  improvement,
  atsQualification,
  feedbackQualification
}) => {
  const { isFreeVersion } = useAppVersion();
  
  // Helper function to determine qualification badge color
  const getQualificationColor = (qualification: string) => {
    if (!qualification || qualification === 'Not Available') return 'bg-gray-100 text-gray-800';
    
    // Updated color logic based on qualification text
    if (qualification.toLowerCase().includes('irrelevant')) return 'bg-red-100 text-red-800';
    if (qualification.toLowerCase().includes('qualified')) {
      // Check for underqualified or overqualified (yellow)
      if (qualification.toLowerCase().includes('under') || 
          qualification.toLowerCase().includes('over')) {
        return 'bg-yellow-100 text-yellow-800';
      }
      // Regular qualified (green)
      return 'bg-green-100 text-green-800';
    }
    
    // Default to yellow for all other cases
    return 'bg-yellow-100 text-yellow-800';
  };

  // Ensure that similarity values are treated as percentages
  // Convert decimal values (0-1) to percentages (0-100)
  const normalizedAtsSimilarity = atsSimilarity <= 1 ? atsSimilarity * 100 : atsSimilarity;
  const normalizedFeedbackSimilarity = feedbackSimilarity <= 1 ? feedbackSimilarity * 100 : feedbackSimilarity;
  
  // Also normalize improvement - if it's already in percentage form (e.g., 0.18) convert it
  const normalizedImprovement = improvement <= 1 ? improvement * 100 : improvement;

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-lg -z-10"></div>
      
      <div className="flex justify-center items-center space-x-4 py-4">
        <div className="flex flex-col items-center">
          <AnimatedDial 
            score={Math.round(normalizedAtsSimilarity)} 
            max={100} 
            color="text-orange-500" 
            label="Without optimization" 
          />
          {atsQualification && (
            <div className={`mt-2 px-3 py-1 rounded-full ${getQualificationColor(atsQualification)}`}>
              <span className="text-xs font-semibold">
                {atsQualification}
              </span>
            </div>
          )}
          <span className="text-center text-xs mt-1 text-[0.8rem] w-full text-orange-500">Without optimization</span>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <ArrowRight className="h-8 w-8 text-indigo-400 animate-pulse" />
          <div className="mt-2 py-1 px-3 bg-green-100 rounded-full">
            <span className="text-xs font-bold text-green-700 flex items-center">
              <span>+{Math.round(normalizedImprovement)}%</span>
              <CheckCircle2 className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <AnimatedDial 
            score={Math.round(normalizedFeedbackSimilarity)} 
            max={100} 
            color="text-indigo-600" 
            label="With optimization" 
          />
          {feedbackQualification && (
            <div className={`mt-2 px-3 py-1 rounded-full ${getQualificationColor(feedbackQualification)}`}>
              <span className="text-xs font-semibold">
                {feedbackQualification}
              </span>
            </div>
          )}
          <span className="text-center text-xs mt-1 text-[0.8rem] w-full text-indigo-600">With optimization</span>
        </div>
      </div>
      
      <div className="text-center py-3 px-5 mt-4 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-xl">
        <div className="flex items-center justify-center gap-2">
          <Sparkle className="h-5 w-5 text-indigo-400" />
          <p className="font-bold text-md bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isFreeVersion 
              ? 'Job Compatibility Scores' 
              : 'Job Compatibility Scores'}
          </p>
          <Sparkle className="h-5 w-5 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default CompatibilityScore;
