
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EditDecision } from '@/contexts/ResumeContext';
import { ArrowUpDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface EditSuggestionProps {
  edit: {
    section?: string;
    suggestion?: string;
    edit_reason?: string;
    resume_line_old?: string;
    resume_line_new?: string;
  };
  decision?: EditDecision;
}

const EditSuggestion: React.FC<EditSuggestionProps> = ({ edit, decision }) => {
  return (
    <div className="space-y-6">
      {/* Reason for the edit */}
      {edit.edit_reason && (
        <div className="space-y-2">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-indigo-500 mr-2" />
            <h3 className="text-sm font-medium">Why this change is recommended:</h3>
          </div>
          <div className="pl-6">
            <p className="text-sm text-gray-700">{edit.edit_reason}</p>
          </div>
        </div>
      )}

      {/* Section badge */}
      {edit.section && (
        <div className="mb-4">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            {edit.section}
          </Badge>
        </div>
      )}

      {/* Original vs New text comparison */}
      {edit.resume_line_old && edit.resume_line_new ? (
        <div className="space-y-3">
          <Card className="overflow-hidden border border-red-100">
            <div className="px-4 py-2 bg-red-50 border-b border-red-100">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                <h4 className="text-sm font-medium text-red-700">Original Text</h4>
              </div>
            </div>
            <div className="p-4 text-sm">
              {edit.resume_line_old}
            </div>
          </Card>
          
          <div className="flex justify-center">
            <ArrowUpDown className="h-5 w-5 text-gray-400" />
          </div>
          
          <Card className="overflow-hidden border border-green-100">
            <div className="px-4 py-2 bg-green-50 border-b border-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="text-sm font-medium text-green-700">Suggested Text</h4>
              </div>
            </div>
            <div className="p-4 text-sm">
              {edit.resume_line_new}
            </div>
          </Card>
        </div>
      ) : (
        // For suggestions without direct text changes
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Suggestion:</h3>
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100 text-sm">
            {edit.suggestion || "No specific text change was suggested."}
          </div>
        </div>
      )}
      
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
