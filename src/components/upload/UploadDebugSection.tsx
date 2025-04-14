
import React from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const UploadDebugSection = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { 
    uploadData, 
    resumeJson,
    apiErrors
  } = useResumeContext();

  // Format JSON for display with proper indentation
  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error formatting data';
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
          <span>Debug Information (API Inputs/Outputs)</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-4">
          {/* Upload Endpoint Debug */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Upload API (/upload)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs">
                <h4 className="font-semibold mb-1">Input:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {uploadData?.filename 
                    ? `File: ${uploadData.filename}` 
                    : "No file uploaded yet"}
                </pre>
                
                <h4 className="font-semibold mt-4 mb-1">Output:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {uploadData 
                    ? formatJSON({
                        id: uploadData.id,
                        filename: uploadData.filename,
                        content_preview: uploadData.content 
                          ? uploadData.content.substring(0, 100) + '...' 
                          : 'No content'
                      }) 
                    : "No upload response yet"}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          {/* Resume Schema Endpoint Debug */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resume Schema API (/resume_schema)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs">
                <h4 className="font-semibold mb-1">Input:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {uploadData?.content 
                    ? `Text Content (first 100 chars): ${uploadData.content.substring(0, 100)}...` 
                    : "No text input yet"}
                </pre>
                
                <h4 className="font-semibold mt-4 mb-1">Output:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {resumeJson 
                    ? formatJSON(resumeJson) 
                    : "No resume schema response yet"}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          {/* API Errors */}
          {apiErrors && apiErrors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-sm text-red-600">API Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs">
                  <pre className="bg-red-50 text-red-700 p-2 rounded overflow-auto max-h-40">
                    {formatJSON(apiErrors)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default UploadDebugSection;
