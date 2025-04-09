
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { API_BASE_URL } from '@/services/api/utils';

interface ApiDebugHelperProps {
  apiEndpoint?: string;
  error?: string;
}

const ApiDebugHelper: React.FC<ApiDebugHelperProps> = ({ 
  apiEndpoint = API_BASE_URL,
  error 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    status?: number;
    time?: number;
  } | null>(null);

  const testApiEndpoint = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    const startTime = Date.now();
    try {
      // Test a simple GET request to the API base URL
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: 'API endpoint is accessible',
          status: response.status,
          time: responseTime
        });
      } else {
        setTestResult({
          success: false,
          message: `API returned error status: ${response.status} ${response.statusText}`,
          status: response.status,
          time: responseTime
        });
      }
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      setTestResult({
        success: false,
        message: `Failed to connect to API: ${error instanceof Error ? error.message : String(error)}`,
        time: responseTime
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!error) return null;

  return (
    <div className="mt-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isOpen ? 'Hide' : 'Show'} Troubleshooting Options
          </Button>
        </AlertDescription>
      </Alert>
      
      {isOpen && (
        <div className="mt-2 p-4 border rounded-md bg-slate-50">
          <h3 className="text-sm font-medium mb-2">API Troubleshooting</h3>
          
          <div className="space-y-2 text-sm">
            <p>API Endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded">{apiEndpoint}</code></p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testApiEndpoint}
              disabled={isTesting}
            >
              {isTesting ? 'Testing...' : 'Test API Connection'}
            </Button>
            
            {testResult && (
              <div className={`mt-2 p-2 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-medium">{testResult.success ? 'Success' : 'Failed'}</p>
                <p>{testResult.message}</p>
                {testResult.status && <p>Status: {testResult.status}</p>}
                {testResult.time && <p>Response time: {testResult.time}ms</p>}
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium mb-1">Troubleshooting Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Check if the API is accessible from your network</li>
                <li>Verify that the API endpoint URL is correct</li>
                <li>Check if the request parameters and format are correct</li>
                <li>Try with a smaller resume file or shorter job description</li>
                <li>Check browser console for more detailed error messages</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugHelper;
