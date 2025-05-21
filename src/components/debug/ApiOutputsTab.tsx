
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import types
import { JobPosting, UploadData, ResumeJson, ScoreResponse } from '@/types/resume';

interface ApiOutputsTabProps {
  jobPosting: JobPosting | null;
  uploadData: UploadData | null;
  resumeJson: ResumeJson | null;
  tailoredResumeJson: ResumeJson | null;
  originalScore: ScoreResponse | null;
  tailoredScore: ScoreResponse | null;
  hasData: (obj: any) => boolean;
}

const ApiOutputsTab: React.FC<ApiOutputsTabProps> = ({
  jobPosting,
  uploadData,
  resumeJson,
  tailoredResumeJson,
  originalScore,
  tailoredScore,
  hasData
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Response Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="job-posting">
              <AccordionTrigger className="text-sm font-medium">
                Job Posting Data
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(jobPosting, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="upload-data">
              <AccordionTrigger className="text-sm font-medium">
                Upload Data (Raw File Response)
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(uploadData, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="resume-json">
              <AccordionTrigger className="text-sm font-medium">
                Resume Schema JSON (Original)
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(resumeJson, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tailored-json">
              <AccordionTrigger className="text-sm font-medium">
                Tailored Resume JSON
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(tailoredResumeJson, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="score-response">
              <AccordionTrigger className="text-sm font-medium">
                Original Score Response
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(originalScore, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tailored-score">
              <AccordionTrigger className="text-sm font-medium">
                Tailored Score Response
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(tailoredScore, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiOutputsTab;
