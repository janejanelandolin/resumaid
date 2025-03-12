
import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let startTimer: ReturnType<typeof setTimeout>;
    
    startTimer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      
      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          index++;
          timer = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
        }
      };
      
      typeNextChar();
    }, delay);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(startTimer);
    };
  }, [text, delay]);
  
  return (
    <div className={`inline-block ${className}`}>
      <span>{displayText}</span>
      {isTyping && (
        <span className="border-r-2 border-primary animate-cursor-blink">&nbsp;</span>
      )}
    </div>
  );
};

export default TypewriterText;
