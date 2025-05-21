
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EditDecision } from '@/types/resume';
import { CheckCircle, XCircle } from 'lucide-react';

interface EditSuggestionProps {
  suggestion?: string;
  originalText?: string;
  improvedText?: string;
  edit?: {
    section?: string;
    suggestion?: string;
  };
  decision?: EditDecision;
}

const EditSuggestion: React.FC<EditSuggestionProps> = ({ suggestion, originalText, improvedText, edit, decision }) => {
  // If we're passed a suggestion directly, use that, otherwise use the edit object
  const displaySuggestion = suggestion || (edit?.suggestion);
  const section = edit?.section;

  return (
    <div className="space-y-6">
      {/* Section badge */}
      {section && (
        <div className="mb-4">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            {section}
          </Badge>
        </div>
      )}

      {/* Suggestion without direct text changes */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Suggestion:</h3>
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100 text-sm">
          {displaySuggestion || "No specific text change was suggested."}
        </div>
      </div>
      
      {/* Decision status */}
      {decision && (
        <div className={`mt-4 p-3 rounded-md ${
          decision.accepted 
            ? 'bg-green-50 border border-green-100 text-green-700' 
            : 'bg-red-50 border border-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            {decision.accepted ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            <p className="text-sm font-medium">
              {decision.accepted ? 'You have accepted this edit' : 'You have rejected this edit'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSuggestion;
