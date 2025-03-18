
import AnimatedDial from '@/components/AnimatedDial';
import { ArrowRight, CheckCircle2, Sparkle } from 'lucide-react';

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
  // Helper function to determine qualification badge color
  const getQualificationColor = (qualification: string) => {
    if (qualification === 'Qualified') return 'bg-green-100 text-green-800';
    if (qualification === 'Unqualified') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-lg -z-10"></div>
      
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
          Compatibility Score
        </h2>
      </div>
      
      <div className="flex justify-center items-center space-x-4 py-4">
        <div className="flex flex-col items-center">
          <AnimatedDial 
            score={Math.round(atsSimilarity * 100)} 
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
          <span className="text-center text-xs mt-1 text-[0.8rem] w-full">Without optimization</span>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <ArrowRight className="h-8 w-8 text-indigo-400 animate-pulse" />
          <div className="mt-2 py-1 px-3 bg-green-100 rounded-full">
            <span className="text-xs font-bold text-green-700 flex items-center">
              <span>+{Math.round(improvement * 100)}%</span>
              <CheckCircle2 className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <AnimatedDial 
            score={Math.round(feedbackSimilarity * 100)} 
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
          <span className="text-center text-xs mt-1 text-[0.8rem] w-full">With optimization</span>
        </div>
      </div>
      
      <div className="text-center py-3 px-5 mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkle className="h-5 w-5 text-indigo-400" />
          <p className="font-bold text-md bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Optimize your resume to stand out!
          </p>
          <Sparkle className="h-5 w-5 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default CompatibilityScore;
