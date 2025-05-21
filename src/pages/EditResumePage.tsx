
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import EditSuggestion from '@/components/resume/EditSuggestion';
import PageContainer from '@/components/PageContainer';

const EditResumePage = () => {
  const navigate = useNavigate();
  const { 
    jobTitle,
    jobPosting,
    resumeJson,
    tailoredResumeJson
  } = useResumeContext();

  // Check if we have the required data
  const hasData = resumeJson && tailoredResumeJson && jobPosting;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Choose Resume Edits</h1>
            <Button onClick={() => navigate('/templates')} variant="outline">
              Skip to Template Selection
            </Button>
          </div>
          
          {!hasData ? (
            <div className="text-center py-10">
              <p>No resume data available. Please upload your resume first.</p>
              <Button 
                onClick={() => navigate('/')} 
                className="mt-4"
              >
                Start over
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-4">Job Position: {jobTitle}</h2>
                <p className="text-gray-600">Choose which suggestions you want to apply to your resume</p>
              </div>
              
              <div className="space-y-4">
                {tailoredResumeJson?.rationale?.map((rationale, index) => (
                  <EditSuggestion 
                    key={index}
                    index={index}
                    suggestion={rationale}
                    originalText=""
                    improvedText=""
                  />
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => navigate('/templates')}>
                  Continue to Templates
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default EditResumePage;
