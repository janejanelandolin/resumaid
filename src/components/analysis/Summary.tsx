
import { Sparkle } from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';

const Summary: React.FC = () => {
  const { jobTitle, uploadData } = useResumeContext();
  
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
      
      <div className="relative z-10 space-y-3">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-medium text-indigo-500">Resume</span>
          <span className="font-medium">{uploadData?.filename || 'Resume'}</span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-medium text-indigo-500">Job Position</span>
          <span className="font-medium">{jobTitle || 'Not specified'}</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
