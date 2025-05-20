
import React from 'react';
import { Strikethrough, Highlighter } from 'lucide-react';

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
    return <p className="text-sm bg-indigo-50 p-2 rounded">{optimizedSummary}</p>;
  }
  
  if (!optimizedSummary) {
    return <p className="text-sm bg-indigo-50 p-2 rounded">{originalSummary}</p>;
  }

  // If they're identical, just show one
  if (originalSummary === optimizedSummary) {
    return (
      <>
        <p className="text-sm bg-indigo-50 p-2 rounded">{originalSummary}</p>
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
  const decoratedSummary = optimizedSummary.split(/\s+/).map(word => {
    if (addedWords.includes(word)) {
      return <span key={Math.random()} className="bg-[#FEF7CD] px-1 rounded mx-0.5" title="Added text">
        <Highlighter className="inline h-3 w-3 mr-0.5" />
        {word}
      </span>;
    }
    return <span key={Math.random()} className="mx-0.5">{word}</span>;
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-1">
          <h4 className="text-xs font-medium text-gray-500">Original Summary</h4>
        </div>
        <p className="text-sm bg-gray-50 p-2 rounded border-l-2 border-gray-300">
          {originalSummary.split(/\s+/).map(word => {
            if (removedWords.includes(word)) {
              return <span key={Math.random()} className="line-through text-gray-400 mx-0.5" title="Removed text">
                <Strikethrough className="inline h-3 w-3 mr-0.5" />
                {word}
              </span>;
            }
            return <span key={Math.random()} className="mx-0.5">{word}</span>;
          })}
        </p>
      </div>
      
      <div>
        <div className="flex items-center mb-1">
          <h4 className="text-xs font-medium text-green-600">Optimized Summary</h4>
        </div>
        <p className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-400">
          {decoratedSummary}
        </p>
      </div>
    </div>
  );
};

export default SummaryComparison;
