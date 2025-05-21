
import React from 'react';

interface EncouragingMessagesProps {
  progress: number;
}

const EncouragingMessages: React.FC<EncouragingMessagesProps> = ({ progress }) => {
  const getMessage = () => {
    if (progress < 5) {
      return "Initiating resume optimization...";
    } else if (progress < 8) {
      return "Setting up document analysis environment...";
    } else if (progress < 12) {
      return "Preparing resume for processing...";
    } else if (progress < 16) {
      return "Parsing resume text content...";
    } else if (progress < 20) {
      return "Extracting your professional experience...";
    } else if (progress < 24) {
      return "Identifying your skills and qualifications...";
    } else if (progress < 28) {
      return "Analyzing educational background...";
    } else if (progress < 32) {
      return "Examining document structure and format...";
    } else if (progress < 36) {
      return "Converting resume to structured format...";
    } else if (progress < 40) {
      return "Preparing job requirements analysis...";
    } else if (progress < 44) {
      return "Establishing baseline for comparison...";
    } else if (progress < 48) {
      return "Analyzing industry keywords in your resume...";
    } else if (progress < 52) {
      return "Cross-referencing with job requirements...";
    } else if (progress < 56) {
      return "Evaluating experience relevance...";
    } else if (progress < 60) {
      return "Scoring your original resume...";
    } else if (progress < 64) {
      return "Analyzing qualification alignment with position...";
    } else if (progress < 68) {
      return "Identifying keyword opportunities...";
    } else if (progress < 72) {
      return "Generating improvement suggestions...";
    } else if (progress < 76) {
      return "Creating optimized resume version...";
    } else if (progress < 80) {
      return "Enhancing professional language...";
    } else if (progress < 84) {
      return "Tailoring resume to match job requirements...";
    } else if (progress < 88) {
      return "Scoring optimized resume version...";
    } else if (progress < 92) {
      return "Comparing before and after improvements...";
    } else if (progress < 96) {
      return "Finalizing analysis results...";
    } else if (progress < 99) {
      return "Preparing your personalized report...";
    } else {
      return "Ready! Your optimized resume awaits!";
    }
  };

  return (
    <span className="text-indigo-700 font-medium">{getMessage()}</span>
  );
};

export default EncouragingMessages;
