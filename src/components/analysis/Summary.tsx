
import { Sparkle } from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';

const Summary: React.FC = () => {
  const { jobTitle } = useResumeContext();
  
  // Hard-coded generic text about ATS improvement
  const atsImprovementText = `Your resume needs optimization to pass Applicant Tracking System (ATS) filters. We've identified several opportunities to highlight your relevant experience and add keywords that will help you get past automated screening systems and into the hands of a hiring manager.`;
  
  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-bl-full"></div>
      <div className="absolute -top-4 -right-4 text-purple-300 animate-pulse">
        <Sparkle size={24} />
      </div>
      <div className="absolute top-32 -left-8 text-blue-400 animate-spin-slow">
        <Sparkle size={16} />
      </div>
      <div className="absolute top-56 -right-6 text-yellow-400 animate-bounce">
        <Sparkle size={20} />
      </div>
      <p className="text-sm relative z-10">
        {atsImprovementText}
      </p>
    </div>
  );
};

export default Summary;
