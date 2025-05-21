
import React from 'react';

interface EncouragingMessagesProps {
  progress: number;
}

const EncouragingMessages: React.FC<EncouragingMessagesProps> = ({ progress }) => {
  const getMessage = () => {
    if (progress < 20) {
      return "Starting the optimization process...";
    } else if (progress < 40) {
      return "Analyzing your resume structure...";
    } else if (progress < 60) {
      return "Identifying keyword opportunities...";
    } else if (progress < 80) {
      return "Tailoring content to job requirements...";
    } else if (progress < 98) {
      return "Almost there! Finalizing improvements...";
    } else {
      return "Ready! Your optimized resume awaits!";
    }
  };

  return (
    <span className="text-indigo-700 font-medium">{getMessage()}</span>
  );
};

export default EncouragingMessages;
