
import { useState, useEffect } from 'react';

interface AnimatedDialProps {
  score: number;
  max: number;
  color: string;
  label: string;
}

const AnimatedDial: React.FC<AnimatedDialProps> = ({ score, max, color, label }) => {
  const [value, setValue] = useState(0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(Math.min(score, max));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score, max]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Glowing effect behind the dial */}
        <div className={`absolute inset-0 rounded-full ${color === 'text-indigo-600' ? 'bg-indigo-200' : 'bg-orange-200'} opacity-20 blur-md`}></div>
        
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className={`animate-dial-animation ${color}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-bold ${color}`}>{value}%</span>
        </div>
      </div>
      <span className={`mt-2 font-semibold ${color}`}>{label}</span>
    </div>
  );
};

export default AnimatedDial;
