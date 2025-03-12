
import React from 'react';

interface RotatingTextProps {
  texts: string[];
  baseText?: string;
  highlightedText?: string;
  className?: string;
}

const RotatingText: React.FC<RotatingTextProps> = ({ 
  texts, 
  baseText, 
  highlightedText,
  className = ''
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      {baseText && <span>{baseText} </span>}
      <div className="inline-block relative h-8 overflow-hidden">
        <div className="animate-rotate-text">
          {texts.map((text, index) => (
            <div key={index} className="h-8">
              {highlightedText ? (
                <span className="font-bold text-gradient">{text}</span>
              ) : (
                <span>{text}</span>
              )}
            </div>
          ))}
          {/* Duplicate the first item to make the loop seamless */}
          <div className="h-8">
            {highlightedText ? (
              <span className="font-bold text-gradient">{texts[0]}</span>
            ) : (
              <span>{texts[0]}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatingText;
