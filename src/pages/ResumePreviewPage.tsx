
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumePreviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTemplates, getOptimizedResume, jobTitle } = useResumeContext();
  
  // Redirect if no templates selected
  React.useEffect(() => {
    if (selectedTemplates.length === 0) {
      navigate('/templates');
    }
  }, [selectedTemplates, navigate]);
  
  const optimizedResume = getOptimizedResume();
  const selectedTemplate = selectedTemplates.length > 0 ? selectedTemplates[0] : null;

  if (!optimizedResume) {
    return (
      <PageContainer>
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">No resume data available</h2>
            <p className="text-muted-foreground mt-2">
              Please go back and complete the previous steps
            </p>
            <Button className="mt-4" onClick={() => navigate('/templates')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/templates')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Resume Preview</h1>
              <p className="text-muted-foreground">
                Review your optimized resume
                {selectedTemplate && ` with the ${selectedTemplate.name} template`}
              </p>
            </div>
          </div>
        </div>
        
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{optimizedResume.basics.name}</h2>
              <div className="text-right">
                <p className="text-gray-700">{optimizedResume.basics.email}</p>
                <p className="text-gray-700">{optimizedResume.basics.phone}</p>
                {optimizedResume.basics.url && (
                  <p className="text-gray-700">{optimizedResume.basics.url}</p>
                )}
              </div>
            </div>
            
            {optimizedResume.basics.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Summary</h3>
                <p className="text-gray-700">{optimizedResume.basics.summary}</p>
              </div>
            )}
            
            {optimizedResume.work && optimizedResume.work.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Experience</h3>
                {optimizedResume.work.map((work, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{work.position}</h4>
                      <p className="text-sm text-gray-600">
                        {work.startDate && work.startDate.substring(0, 7)} - 
                        {work.endDate ? work.endDate.substring(0, 7) : 'Present'}
                      </p>
                    </div>
                    <p className="text-gray-800">{work.name}</p>
                    <p className="text-gray-700 my-1">{work.summary}</p>
                    {work.highlights && work.highlights.length > 0 && (
                      <ul className="list-disc list-inside">
                        {work.highlights.map((highlight, i) => (
                          <li key={i} className="text-gray-700 text-sm">{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {optimizedResume.education && optimizedResume.education.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Education</h3>
                {optimizedResume.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{edu.institution}</h4>
                      <p className="text-sm text-gray-600">
                        {edu.startDate && edu.startDate.substring(0, 7)} - 
                        {edu.endDate ? edu.endDate.substring(0, 7) : 'Present'}
                      </p>
                    </div>
                    <p className="text-gray-800">{edu.studyType} in {edu.area}</p>
                  </div>
                ))}
              </div>
            )}
            
            {optimizedResume.skills && optimizedResume.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {optimizedResume.skills.map((skill, index) => (
                    <div key={index} className="mb-2">
                      <h4 className="font-medium">{skill.name}: </h4>
                      <span className="text-gray-700">{skill.keywords.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display additional sections if available in the resume data */}
            {optimizedResume.projects && optimizedResume.projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Projects</h3>
                {optimizedResume.projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-600">
                        {project.startDate && project.startDate.substring(0, 7)} - 
                        {project.endDate ? project.endDate.substring(0, 7) : 'Present'}
                      </p>
                    </div>
                    <p className="text-gray-700 my-1">{project.description}</p>
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="list-disc list-inside">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="text-gray-700 text-sm">{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {selectedTemplate && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <p className="text-sm text-center text-muted-foreground mb-2">
              Resume will be formatted using the {selectedTemplate.name} template
            </p>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={() => navigate('/download')} className="w-full sm:w-auto">
            Proceed to Download
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResumePreviewPage;
