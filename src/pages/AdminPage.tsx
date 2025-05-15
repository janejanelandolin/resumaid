
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Bug, Database, FileText, Settings, Wrench, Info } from 'lucide-react';
import ApiDebugHelper from '@/components/debug/ApiDebugHelper';
import ApiInputsTab from '@/components/debug/ApiInputsTab';
import ApiOutputsTab from '@/components/debug/ApiOutputsTab';
import ApiEndpointInfo from '@/components/debug/ApiEndpointInfo';
import { useResumeContext } from '@/contexts/ResumeContext';
import { API_BASE_URL } from '@/services/api/utils';

interface AdminConfigState {
  freeVersion: boolean;
  debugMode: boolean;
  apiBaseUrl: string;
  maxUploadSize: number;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { 
    jobPosting, 
    uploadData, 
    feedback,
    resumeJson,
    tailoredResumeJson,
    originalScore,
    tailoredScore,
    apiErrors
  } = useResumeContext();

  // Get config from localStorage or use defaults
  const getInitialConfig = (): AdminConfigState => {
    const savedConfig = localStorage.getItem('adminConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    return {
      freeVersion: true,
      debugMode: false,
      apiBaseUrl: API_BASE_URL,
      maxUploadSize: 5
    };
  };

  const [config, setConfig] = useState<AdminConfigState>(getInitialConfig());
  const [activeTab, setActiveTab] = useState('configuration');
  
  // Update configuration and save to localStorage
  const updateConfig = (updates: Partial<AdminConfigState>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem('adminConfig', JSON.stringify(newConfig));
  };

  // Helper to check if an object has data
  const hasData = (obj: any) => obj && Object.keys(obj).length > 0;
  
  // Format JSON for display with proper indentation
  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error formatting data';
    }
  };

  // Prepare API input previews for ATS and Feedback calls
  const getATSApiInput = () => {
    if (!jobPosting || !uploadData?.content) return "Job posting or resume not available";
    
    // Create a preview of what's sent to the API with query parameters
    const apiInput = {
      parameters: {
        resume: uploadData.content.substring(0, 200) + '...',
        job_posting: jobPosting
      },
      method: 'POST'
    };
    
    return formatJSON(apiInput);
  };

  const getFeedbackApiInput = () => {
    if (!jobPosting || !uploadData?.content) return "Job posting or resume not available";
    
    // Create a preview of what's sent to the API with query parameters
    const apiInput = {
      parameters: {
        resume: uploadData.content.substring(0, 200) + '...',
        job_posting: jobPosting
      },
      method: 'POST'
    };
    
    return formatJSON(apiInput);
  };

  const handleConfigExport = () => {
    const configBlob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-optimizer-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfigImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        updateConfig(importedConfig);
      } catch (error) {
        console.error('Failed to parse config file:', error);
      }
    };
    reader.readAsText(file);
  };

  const resetConfig = () => {
    localStorage.removeItem('adminConfig');
    setConfig({
      freeVersion: true,
      debugMode: false,
      apiBaseUrl: API_BASE_URL,
      maxUploadSize: 5
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 p-0 h-auto" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-muted-foreground text-sm">Back</span>
              </Button>
            </div>
            <h1 className="text-3xl font-bold mt-2">Admin Panel</h1>
            <p className="text-muted-foreground">Configure application settings and debug tools</p>
          </div>
          <Badge variant={config.freeVersion ? "outline" : "default"}>
            {config.freeVersion ? 'Free Version' : 'Paid Version'}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="debugging" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span>Debugging</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>API Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>Application Configuration</CardTitle>
                <CardDescription>Manage app settings and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Version Toggle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Version Control</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="free-version" 
                      checked={config.freeVersion} 
                      onCheckedChange={(checked) => updateConfig({ freeVersion: checked })}
                    />
                    <Label htmlFor="free-version">Free Version</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      {config.freeVersion ? 
                        'Limited features, no payment required' : 
                        'Full functionality with payment required'
                      }
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Debug Mode Toggle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Debug Settings</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debug-mode" 
                      checked={config.debugMode} 
                      onCheckedChange={(checked) => updateConfig({ debugMode: checked })}
                    />
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      {config.debugMode ? 
                        'Extended logs and debugging info shown' : 
                        'Regular user experience without debug info'
                      }
                    </span>
                  </div>
                </div>

                <Separator />

                {/* API Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="api-base-url">API Base URL</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="api-base-url"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={config.apiBaseUrl}
                        onChange={(e) => updateConfig({ apiBaseUrl: e.target.value })}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => updateConfig({ apiBaseUrl: API_BASE_URL })}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="max-upload-size">Max Upload Size (MB)</Label>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <input
                        id="max-upload-size"
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={config.maxUploadSize}
                        min={1}
                        max={20}
                        onChange={(e) => updateConfig({ maxUploadSize: parseInt(e.target.value) })}
                      />
                      <span className="text-sm text-muted-foreground">MB</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Config Backup/Restore */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configuration Backup</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleConfigExport} variant="outline">
                      Export Config
                    </Button>
                    <div>
                      <input
                        type="file"
                        id="import-config"
                        accept=".json"
                        className="hidden"
                        onChange={handleConfigImport}
                      />
                      <Label htmlFor="import-config" className="cursor-pointer">
                        <Button variant="outline" onClick={() => document.getElementById('import-config')?.click()}>
                          Import Config
                        </Button>
                      </Label>
                    </div>
                    <Button onClick={resetConfig} variant="outline">
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debugging">
            <Card>
              <CardHeader>
                <CardTitle>Debug Tools</CardTitle>
                <CardDescription>Troubleshoot and debug application issues</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="inputs" className="w-full">
                  <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="inputs">API Inputs</TabsTrigger>
                    <TabsTrigger value="outputs">API Outputs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="inputs" className="mt-4">
                    <ApiInputsTab 
                      jobPosting={jobPosting}
                      uploadData={uploadData}
                      getATSApiInput={getATSApiInput}
                      getFeedbackApiInput={getFeedbackApiInput}
                    />
                  </TabsContent>

                  <TabsContent value="outputs" className="mt-4">
                    <ApiOutputsTab 
                      jobPosting={jobPosting}
                      uploadData={uploadData}
                      feedback={feedback}
                      resumeJson={resumeJson}
                      tailoredResumeJson={tailoredResumeJson}
                      originalScore={originalScore}
                      tailoredScore={tailoredScore}
                      hasData={hasData}
                    />
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <ApiEndpointInfo />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">API Troubleshooting</h3>
                  <ApiDebugHelper />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>API Logs & Errors</CardTitle>
                <CardDescription>View API request/response logs and error messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* API Errors Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">API Errors</h3>
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 overflow-auto max-h-[200px]">
                      {apiErrors && apiErrors.length > 0 ? (
                        <pre className="text-xs whitespace-pre-wrap text-red-700">
                          {formatJSON(apiErrors)}
                        </pre>
                      ) : (
                        <p className="text-sm text-gray-500">No API errors recorded</p>
                      )}
                    </div>
                  </div>

                  {/* Console Logs */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Console Logs</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Recent console logs can be viewed in your browser's developer tools (F12 → Console)
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => console.log('Current Resume Context:', {
                        jobPosting,
                        uploadData,
                        resumeJson,
                        tailoredResumeJson,
                        originalScore,
                        tailoredScore,
                        apiErrors
                      })}
                    >
                      Log Resume Context
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
