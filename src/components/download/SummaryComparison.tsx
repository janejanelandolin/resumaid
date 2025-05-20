
import React from 'react';

interface SummaryComparisonProps {
  originalSummary?: string;
  optimizedSummary?: string;
}

const SummaryComparison: React.FC<SummaryComparisonProps> = ({ 
  originalSummary, 
  optimizedSummary 
}) => {
  if (!originalSummary && !optimizedSummary) {
    return <p className="text-muted-foreground italic">No summary available</p>;
  }

  // If only one summary exists, just display it
  if (!originalSummary) {
    return <p className="text-sm bg-indigo-50 p-2 rounded break-words">
      {optimizedSummary}
    </p>;
  }
  
  if (!optimizedSummary) {
    return <p className="text-sm bg-indigo-50 p-2 rounded break-words">
      {originalSummary}
    </p>;
  }

  // If they're identical, just show one
  if (originalSummary === optimizedSummary) {
    return (
      <>
        <p className="text-sm bg-indigo-50 p-2 rounded break-words">{originalSummary}</p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          (No changes were made to the summary)
        </p>
      </>
    );
  }

  // Simple word-based diff (this is a simplified approach)
  const originalWords = originalSummary.split(/\s+/);
  const optimizedWords = optimizedSummary.split(/\s+/);
  
  // Find removed and added words
  const removedWords = originalWords.filter(word => !optimizedWords.includes(word));
  const addedWords = optimizedWords.filter(word => !originalWords.includes(word));

  // Create decorated HTML
  const decoratedSummary = optimizedWords.map(word => {
    if (addedWords.includes(word)) {
      return <span key={Math.random()} className="bg-[#FEF7CD] px-1 rounded mx-0.5 inline-block">
        {word}
      </span>;
    }
    return <span key={Math.random()} className="mx-0.5 inline-block">{word}</span>;
  });

  return (
    <div className="space-y-4 border rounded-md p-4 bg-white shadow-sm">
      <div className="border rounded-md p-3 bg-gray-50">
        <div className="flex items-center mb-1">
          <h4 className="text-xs font-medium text-gray-500">Original Summary</h4>
        </div>
        <p className="text-sm p-2 rounded border-l-2 border-gray-300 break-words">
          {originalWords.map(word => {
            if (removedWords.includes(word)) {
              return <span key={Math.random()} className="line-through text-gray-400 mx-0.5 inline-block">
                {word}
              </span>;
            }
            return <span key={Math.random()} className="mx-0.5 inline-block">{word}</span>;
          })}
        </p>
        
        {/* Legend for deletions under Original Summary */}
        <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
          <p className="text-xs text-gray-500 flex items-center">
            <span className="inline-block line-through text-gray-400 mr-2">abc</span>
            Strikethroughs indicate text deletions
          </p>
        </div>
      </div>
      
      <div className="border rounded-md p-3 bg-green-50">
        <div className="flex items-center mb-1">
          <h4 className="text-xs font-medium text-green-600">Optimized Summary</h4>
        </div>
        <p className="text-sm p-2 rounded border-l-2 border-green-400 break-words">
          {decoratedSummary}
        </p>
        
        {/* Legend for additions under Optimized Summary */}
        <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
          <p className="text-xs text-gray-500 flex items-center">
            <span className="inline-block w-3 h-3 bg-[#FEF7CD] rounded mr-2"></span>
            Highlights indicate text additions
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryComparison;
