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
  rationale?: string[];
}

const CompatibilityScore: React.FC<CompatibilityScoreProps> = ({
  atsSimilarity,
  feedbackSimilarity,
  improvement,
  atsQualification,
  feedbackQualification,
  rationale,
}) => {
  const { isFreeVersion } = useAppVersion();
  
  // Apply custom scoring formula: (score + 1.2) / 2 * 100
  const normalizedAtsSimilarity = ((atsSimilarity + 1.2) / 2) * 100;
  const normalizedFeedbackSimilarity = ((feedbackSimilarity + 1.2) / 2) * 100;
  
  // Calculate improvement based on normalized percentages
  const normalizedImprovement = normalizedFeedbackSimilarity - normalizedAtsSimilarity;

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-lg -z-10"></div>
      
      <div className="text-center py-3 px-5 mb-4 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-xl">
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
      
      <div className="flex justify-center items-center space-x-4 py-4">
        <div className="flex flex-col items-center">
          <AnimatedDial 
            score={Math.round(normalizedAtsSimilarity)} 
            max={100} 
            color="text-orange-500" 
            label="Without optimization" 
          />
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
          <span className="text-center text-xs mt-1 text-[0.8rem] w-full text-indigo-600">With optimization</span>
        </div>
      </div>

      {rationale && rationale.length > 0 && (
        <div className="w-full px-4 mt-4">
          <h3 className="font-medium text-sm text-indigo-600 mb-2">Optimization Rationale</h3>
          <ul className="text-sm bg-indigo-50 p-3 rounded border-l-2 border-indigo-400 list-disc pl-6 space-y-1">
            {rationale.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompatibilityScore;
