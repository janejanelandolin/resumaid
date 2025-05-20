
import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';

interface WorkExperience {
  company?: string;
  name?: string;
  position: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

interface ExperienceComparisonProps {
  originalExperience?: WorkExperience[];
  optimizedExperience?: WorkExperience[];
}

const ExperienceComparison: React.FC<ExperienceComparisonProps> = ({ 
  originalExperience, 
  optimizedExperience 
}) => {
  if (!originalExperience?.length && !optimizedExperience?.length) {
    return <p className="text-muted-foreground italic">No experience available</p>;
  }

  // If only one experience list exists, just display it
  if (!originalExperience?.length) {
    return (
      <div className="text-sm bg-indigo-50 p-2 rounded break-words">
        {optimizedExperience?.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="font-medium">{exp.position} at {exp.company || exp.name}</div>
            <div className="text-xs text-muted-foreground mb-1">
              {exp.startDate} - {exp.endDate || 'Present'}
            </div>
            {exp.summary && <div className="mb-1">{exp.summary}</div>}
            {exp.highlights?.length ? (
              <ul className="list-disc list-inside">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-xs">{highlight}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  
  if (!optimizedExperience?.length) {
    return (
      <div className="text-sm bg-indigo-50 p-2 rounded break-words">
        {originalExperience?.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="font-medium">{exp.position} at {exp.company || exp.name}</div>
            <div className="text-xs text-muted-foreground mb-1">
              {exp.startDate} - {exp.endDate || 'Present'}
            </div>
            {exp.summary && <div className="mb-1">{exp.summary}</div>}
            {exp.highlights?.length ? (
              <ul className="list-disc list-inside">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-xs">{highlight}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  // Check if experiences are identical
  const areExperiencesIdentical = JSON.stringify(originalExperience) === JSON.stringify(optimizedExperience);
  if (areExperiencesIdentical) {
    return (
      <>
        <div className="text-sm bg-indigo-50 p-2 rounded break-words">
          {originalExperience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="font-medium">{exp.position} at {exp.company || exp.name}</div>
              <div className="text-xs text-muted-foreground mb-1">
                {exp.startDate} - {exp.endDate || 'Present'}
              </div>
              {exp.summary && <div className="mb-1">{exp.summary}</div>}
              {exp.highlights?.length ? (
                <ul className="list-disc list-inside">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs">{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 italic">
          (No changes were made to the experience)
        </p>
      </>
    );
  }

  // Helper function to compare experiences
  const findMatchingExperience = (exp: WorkExperience, experienceList: WorkExperience[]) => {
    return experienceList.find(e => 
      (e.company === exp.company || e.name === exp.name) && 
      e.position === exp.position
    );
  };

  // Find removed and added experiences
  const removedExperiences = originalExperience.filter(
    origExp => !findMatchingExperience(origExp, optimizedExperience)
  );
  
  const addedExperiences = optimizedExperience.filter(
    optExp => !findMatchingExperience(optExp, originalExperience)
  );

  // Helper function to compare highlights
  const findModifiedHighlights = (exp1: WorkExperience, exp2: WorkExperience) => {
    if (!exp1.highlights || !exp2.highlights) return { added: [], removed: [] };
    
    const added = exp2.highlights.filter(h => !exp1.highlights?.includes(h));
    const removed = exp1.highlights.filter(h => !exp2.highlights?.includes(h));
    
    return { added, removed };
  };

  return (
    <Accordion type="single" collapsible defaultValue="experience" className="w-full">
      <AccordionItem value="experience" className="border-none">
        <AccordionTrigger className="py-2 text-indigo-600 hover:text-indigo-800 hover:no-underline">
          Compare Experience
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 border rounded-md p-4 bg-white shadow-sm mt-2">
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="flex items-center mb-1">
                <h4 className="text-xs font-medium text-gray-500">Original Experience</h4>
              </div>
              <div className="text-sm p-2 rounded border-l-2 border-gray-300 break-words">
                {originalExperience.map((exp, index) => {
                  const isRemoved = removedExperiences.some(e => e === exp);
                  const matchingExp = findMatchingExperience(exp, optimizedExperience);
                  const { removed: removedHighlights } = matchingExp ? 
                    findModifiedHighlights(exp, matchingExp) : { removed: [] };
                  
                  return (
                    <div key={index} className={`mb-3 ${isRemoved ? 'text-gray-400' : ''}`}>
                      <div className={`font-medium ${isRemoved ? 'line-through' : ''}`}>
                        {exp.position} at {exp.company || exp.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                      {exp.summary && (
                        <div className={`mb-1 ${isRemoved ? 'line-through' : ''}`}>
                          {exp.summary}
                        </div>
                      )}
                      {exp.highlights?.length ? (
                        <ul className="list-disc list-inside">
                          {exp.highlights.map((highlight, idx) => (
                            <li 
                              key={idx} 
                              className={`text-xs ${isRemoved || removedHighlights.includes(highlight) ? 'line-through text-gray-400' : ''}`}
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend for deletions under Original Experience */}
              <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block line-through text-gray-400 mr-2">abc</span>
                  Strikethroughs indicate removed content
                </p>
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-green-50">
              <div className="flex items-center mb-1">
                <h4 className="text-xs font-medium text-green-600">Optimized Experience</h4>
              </div>
              <div className="text-sm p-2 rounded border-l-2 border-green-400 break-words">
                {optimizedExperience.map((exp, index) => {
                  const isAdded = addedExperiences.some(e => e === exp);
                  const matchingExp = findMatchingExperience(exp, originalExperience);
                  const { added: addedHighlights } = matchingExp ? 
                    findModifiedHighlights(matchingExp, exp) : { added: [] };
                  
                  return (
                    <div key={index} className="mb-3">
                      <div className={isAdded ? "font-medium bg-[#FEF7CD] px-1 rounded" : "font-medium"}>
                        {exp.position} at {exp.company || exp.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                      {exp.summary && (
                        <div className={isAdded ? "mb-1 bg-[#FEF7CD] px-1 rounded" : "mb-1"}>
                          {exp.summary}
                        </div>
                      )}
                      {exp.highlights?.length ? (
                        <ul className="list-disc list-inside">
                          {exp.highlights.map((highlight, idx) => (
                            <li 
                              key={idx} 
                              className={`text-xs ${addedHighlights.includes(highlight) ? 'bg-[#FEF7CD] px-1 rounded' : ''}`}
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend for additions under Optimized Experience */}
              <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-3 h-3 bg-[#FEF7CD] rounded mr-2"></span>
                  Highlights indicate added or modified content
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExperienceComparison;
