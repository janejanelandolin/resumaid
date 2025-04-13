
import { useState } from 'react';
import { EditDecision } from '../types/resume';

export const useEditDecisions = () => {
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);

  // Edit decision management
  const addEditDecision = (decision: EditDecision) => {
    // If a decision for this edit already exists, replace it
    const existingIndex = editDecisions.findIndex(d => d.editIndex === decision.editIndex);
    
    if (existingIndex >= 0) {
      const newDecisions = [...editDecisions];
      newDecisions[existingIndex] = decision;
      setEditDecisions(newDecisions);
    } else {
      setEditDecisions([...editDecisions, decision]);
    }
  };

  return {
    editDecisions,
    addEditDecision
  };
};
