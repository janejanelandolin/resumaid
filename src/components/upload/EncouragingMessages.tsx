
import React from 'react';

interface EncouragingMessagesProps {
  progress: number;
}

const EncouragingMessages: React.FC<EncouragingMessagesProps> = ({ progress }) => {
  const getMessage = () => {
    if (progress < 5) {
      return "Initiating resume optimization...";
    } else if (progress < 10) {
      return "Starting the optimization process...";
    } else if (progress < 15) {
      return "Setting up document analyzers...";
    } else if (progress < 20) {
      return "Analyzing your resume format...";
    } else if (progress < 25) {
      return "Parsing document structure...";
    } else if (progress < 30) {
      return "Extracting key information...";
    } else if (progress < 35) {
      return "Analyzing your work history...";
    } else if (progress < 40) {
      return "Identifying your skills and experiences...";
    } else if (progress < 45) {
      return "Processing educational background...";
    } else if (progress < 50) {
      return "Comparing with job requirements...";
    } else if (progress < 55) {
      return "Analyzing industry keywords...";
    } else if (progress < 60) {
      return "Finding keyword opportunities...";
    } else if (progress < 65) {
      return "Evaluating content relevance...";
    } else if (progress < 70) {
      return "Checking ATS compatibility...";
    } else if (progress < 75) {
      return "Identifying improvement opportunities...";
    } else if (progress < 80) {
      return "Tailoring content to job specifications...";
    } else if (progress < 85) {
      return "Optimizing for ATS readability...";
    } else if (progress < 90) {
      return "Refining professional language...";
    } else if (progress < 95) {
      return "Finalizing improvements...";
    } else if (progress < 99) {
      return "Almost there! Preparing your results...";
    } else {
      return "Ready! Your optimized resume awaits!";
    }
  };

  return (
    <span className="text-indigo-700 font-medium">{getMessage()}</span>
  );
};

export default EncouragingMessages;
