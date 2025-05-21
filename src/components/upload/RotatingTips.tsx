
import React, { useState, useEffect } from 'react';
import RotatingText from '@/components/RotatingText';

interface RotatingTipsProps {
  isShowing: boolean;
}

const RotatingTips: React.FC<RotatingTipsProps> = ({ isShowing }) => {
  const tips = [
    "Use industry keywords to pass ATS filters",
    "Quantify your achievements with numbers",
    "Tailor your resume to each job application",
    "Keep your formatting consistent and clean",
    "Highlight relevant skills for the position",
    "Use action verbs to describe your experience",
    "Remove irrelevant experience for clarity",
    "Include a concise professional summary"
  ];

  if (!isShowing) return null;

  return (
    <div className="mb-4 text-sm text-indigo-700 flex items-center">
      <div className="mr-2 p-1 bg-indigo-100 rounded-full">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
      </div>
      <span className="font-medium mr-1">TIP:</span>
      <RotatingText 
        texts={tips} 
        className="text-indigo-600 italic" 
      />
    </div>
  );
};

export default RotatingTips;
