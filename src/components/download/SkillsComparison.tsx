
import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';

interface Skill {
  name: string;
  keywords?: string[];
}

interface SkillsComparisonProps {
  originalSkills?: Skill[];
  optimizedSkills?: Skill[];
}

const SkillsComparison: React.FC<SkillsComparisonProps> = ({ 
  originalSkills, 
  optimizedSkills 
}) => {
  if (!originalSkills?.length && !optimizedSkills?.length) {
    return <p className="text-muted-foreground italic">No skills available</p>;
  }

  // If only one skills list exists, just display it
  if (!originalSkills?.length) {
    return (
      <div className="text-sm bg-indigo-50 p-2 rounded break-words">
        {optimizedSkills?.map((skill, index) => (
          <div key={index} className="mb-1">
            <strong>{skill.name}</strong>
            {skill.keywords?.length ? (
              <span className="ml-2">{skill.keywords.join(', ')}</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  
  if (!optimizedSkills?.length) {
    return (
      <div className="text-sm bg-indigo-50 p-2 rounded break-words">
        {originalSkills?.map((skill, index) => (
          <div key={index} className="mb-1">
            <strong>{skill.name}</strong>
            {skill.keywords?.length ? (
              <span className="ml-2">{skill.keywords.join(', ')}</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  // Check if skills are identical
  const areSkillsIdentical = JSON.stringify(originalSkills) === JSON.stringify(optimizedSkills);
  if (areSkillsIdentical) {
    return (
      <>
        <div className="text-sm bg-indigo-50 p-2 rounded break-words">
          {originalSkills.map((skill, index) => (
            <div key={index} className="mb-1">
              <strong>{skill.name}</strong>
              {skill.keywords?.length ? (
                <span className="ml-2">{skill.keywords.join(', ')}</span>
              ) : null}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 italic">
          (No changes were made to the skills)
        </p>
      </>
    );
  }

  // Find removed and added skills
  const removedSkills = originalSkills.filter(
    origSkill => !optimizedSkills.some(
      optSkill => optSkill.name === origSkill.name && 
        JSON.stringify(optSkill.keywords) === JSON.stringify(origSkill.keywords)
    )
  );
  
  const addedSkills = optimizedSkills.filter(
    optSkill => !originalSkills.some(
      origSkill => origSkill.name === optSkill.name && 
        JSON.stringify(origSkill.keywords) === JSON.stringify(optSkill.keywords)
    )
  );

  return (
    <Accordion type="single" collapsible defaultValue="skills" className="w-full">
      <AccordionItem value="skills" className="border-none">
        <AccordionTrigger className="py-2 text-indigo-600 hover:text-indigo-800 hover:no-underline">
          Compare Skills
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 border rounded-md p-4 bg-white shadow-sm mt-2">
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="flex items-center mb-1">
                <h4 className="text-xs font-medium text-gray-500">Original Skills</h4>
              </div>
              <div className="text-sm p-2 rounded border-l-2 border-gray-300 break-words">
                {originalSkills.map((skill, index) => {
                  const isRemoved = removedSkills.some(s => s.name === skill.name);
                  return (
                    <div key={index} className={`mb-1 ${isRemoved ? 'line-through text-gray-400' : ''}`}>
                      <strong>{skill.name}</strong>
                      {skill.keywords?.length ? (
                        <span className="ml-2">{skill.keywords.join(', ')}</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend for deletions under Original Skills */}
              <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block line-through text-gray-400 mr-2">abc</span>
                  Strikethroughs indicate removed skills
                </p>
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-green-50">
              <div className="flex items-center mb-1">
                <h4 className="text-xs font-medium text-green-600">Optimized Skills</h4>
              </div>
              <div className="text-sm p-2 rounded border-l-2 border-green-400 break-words">
                {optimizedSkills.map((skill, index) => {
                  const isAdded = addedSkills.some(s => s.name === skill.name);
                  return (
                    <div key={index} className="mb-1">
                      <strong className={isAdded ? "bg-[#FEF7CD] px-1 rounded" : ""}>
                        {skill.name}
                      </strong>
                      {skill.keywords?.length ? (
                        <span className="ml-2">
                          {skill.keywords.map((keyword, kidx) => {
                            const wasSkillEdited = removedSkills.some(s => s.name === skill.name);
                            const wasKeywordAdded = wasSkillEdited || 
                              !originalSkills.some(s => 
                                s.name === skill.name && 
                                s.keywords?.includes(keyword)
                              );
                            
                            return (
                              <span 
                                key={kidx} 
                                className={wasKeywordAdded ? "bg-[#FEF7CD] px-1 rounded mx-0.5" : "mx-0.5"}
                              >
                                {keyword}{kidx < skill.keywords!.length - 1 ? ',' : ''}
                              </span>
                            );
                          })}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend for additions under Optimized Skills */}
              <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-3 h-3 bg-[#FEF7CD] rounded mr-2"></span>
                  Highlights indicate added or modified skills
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SkillsComparison;
