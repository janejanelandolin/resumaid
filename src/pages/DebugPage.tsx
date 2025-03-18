
import React, { useState } from 'react';
import { useResumeContext } from '../contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileJson, Webhook } from 'lucide-react';

const DebugPage = () => {
  const { jobPosting, uploadData, atsFeedback, feedback } = useResumeContext();
  const [activeTab, setActiveTab] = useState('inputs');

  // Format JSON for display with proper indentation
  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error formatting data';
    }
  };

  // Helper to check if an object has data
  const hasData = (obj: any) => obj && Object.keys(obj).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">API Debug</h1>
              <p className="text-muted-foreground">Inspect API inputs and outputs</p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
          </div>

          <Tabs defaultValue="inputs" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="inputs" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                <span>API Inputs</span>
              </TabsTrigger>
              <TabsTrigger value="outputs" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                <span>API Outputs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Job Posting Input
                    <Badge variant={jobPosting ? "default" : "outline"}>
                      {jobPosting ? "Available" : "Not Available"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Data sent to the job posting API endpoint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono">
                      {jobPosting 
                        ? formatJSON(jobPosting) 
                        : "No job posting data available. Submit a job title on the home page."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Resume Input
                    <Badge variant={uploadData?.content ? "default" : "outline"}>
                      {uploadData?.content ? "Available" : "Not Available"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Resume content uploaded and sent to API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono">
                      {uploadData?.content 
                        ? uploadData.content.substring(0, 5000) + (uploadData.content.length > 5000 ? '...' : '')
                        : "No resume content available. Upload a resume on the upload page."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outputs" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    ATS Feedback Response
                    <Badge variant={hasData(atsFeedback) ? "default" : "outline"}>
                      {hasData(atsFeedback) ? "Available" : "Not Available"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Response from the ATS feedback API endpoint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono">
                      {hasData(atsFeedback) 
                        ? formatJSON(atsFeedback) 
                        : "No ATS feedback available. Process a resume to get feedback."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Optimization Feedback Response
                    <Badge variant={hasData(feedback) ? "default" : "outline"}>
                      {hasData(feedback) ? "Available" : "Not Available"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Response from the optimization feedback API endpoint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono">
                      {hasData(feedback) 
                        ? formatJSON(feedback) 
                        : "No optimization feedback available. Process a resume to get feedback."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <h3 className="font-semibold text-amber-800">API URLs</h3>
            <p className="text-sm text-amber-700 mt-1">Base URL: {import.meta.env.VITE_API_BASE_URL || "https://api-758224663478.us-west2.run.app/"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="text-xs text-amber-700">
                <p>• POST /job_posting</p>
                <p>• POST /upload</p>
              </div>
              <div className="text-xs text-amber-700">
                <p>• POST /atsfeedback</p>
                <p>• POST /feedback</p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default DebugPage;
