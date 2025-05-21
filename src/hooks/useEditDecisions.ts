
import { useState } from 'react';
import { EditDecision } from '../types/resume';

export const useEditDecisions = () => {
  const [editDecisions, setEditDecisions] = useState<EditDecision[]>([]);

  const addEditDecision = (decision: EditDecision) => {
    setEditDecisions(prev => {
      // Check if decision with the same ID already exists
      const existingIndex = prev.findIndex(d => d.id === decision.id);
      
      if (existingIndex >= 0) {
        // Replace the existing decision
        const newDecisions = [...prev];
        newDecisions[existingIndex] = decision;
        return newDecisions;
      }
      
      // Add new decision
      return [...prev, decision];
    });
  };

  const resetEditDecisions = () => {
    setEditDecisions([]);
  };

  return {
    editDecisions,
    addEditDecision,
    resetEditDecisions
  };
};
