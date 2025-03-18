
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import EditSuggestion from '@/components/resume/EditSuggestion';

const EditResumePage = () => {
  const navigate = useNavigate();
  const { 
    feedback, 
    uploadData, 
    editDecisions, 
    addEditDecision,
    parseResumeContent 
  } = useResumeContext();
  
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  
  // Parse resume content when page loads if not already parsed
  useEffect(() => {
    if (uploadData?.content && feedback) {
      parseResumeContent(uploadData.content);
    } else if (!feedback) {
      // Redirect if there's no feedback
      navigate('/analysis');
    }
  }, [uploadData, feedback, parseResumeContent, navigate]);

  // Get suggested edits from feedback
  const suggestedEdits = feedback?.suggested_edits || [];
  
  // Check if there are any suggested edits
  if (suggestedEdits.length === 0) {
    return (
      <PageContainer>
        <div className="w-full max-w-3xl mx-auto space-y-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/templates')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <h1 className="text-2xl font-bold">Edit Resume</h1>
          </div>
          
          <div className="p-8 bg-white rounded-xl shadow text-center">
            <p className="text-lg text-gray-600">
              No suggested edits available for your resume.
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={() => navigate('/templates')}
            >
              Continue to Templates
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  // Handle accepting an edit
  const handleAccept = () => {
    addEditDecision({
      editIndex: currentEditIndex,
      accepted: true
    });
    
    toast({
      title: "Edit Accepted",
      description: "This change will be applied to your optimized resume.",
      duration: 3000,
    });
    
    // Move to next edit if available
    if (currentEditIndex < suggestedEdits.length - 1) {
      setCurrentEditIndex(currentEditIndex + 1);
    }
  };
  
  // Handle rejecting an edit
  const handleReject = () => {
    addEditDecision({
      editIndex: currentEditIndex,
      accepted: false
    });
    
    toast({
      title: "Edit Rejected",
      description: "This change will not be applied to your resume.",
      duration: 3000,
    });
    
    // Move to next edit if available
    if (currentEditIndex < suggestedEdits.length - 1) {
      setCurrentEditIndex(currentEditIndex + 1);
    }
  };
  
  // Move to previous edit
  const handlePrevious = () => {
    if (currentEditIndex > 0) {
      setCurrentEditIndex(currentEditIndex - 1);
    }
  };
  
  // Move to next edit
  const handleNext = () => {
    if (currentEditIndex < suggestedEdits.length - 1) {
      setCurrentEditIndex(currentEditIndex + 1);
    }
  };
  
  // Complete editing and proceed to templates
  const handleComplete = () => {
    toast({
      title: "Resume Updates Saved",
      description: "Your optimized resume is ready for download.",
      duration: 3000,
    });
    navigate('/templates');
  };
  
  // Get the current decision for this edit
  const currentDecision = editDecisions.find(d => d.editIndex === currentEditIndex);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pt-6">
      <PageContainer>
        <div className="w-full max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <Button variant="ghost" onClick={() => navigate('/templates')} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <h1 className="text-2xl font-bold">Edit Resume</h1>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium">
                Edit {currentEditIndex + 1} of {suggestedEdits.length}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">
                Suggested Edit: {suggestedEdits[currentEditIndex].section || `Edit ${currentEditIndex + 1}`}
              </h2>
            </div>
            
            <div className="p-6">
              <EditSuggestion 
                edit={suggestedEdits[currentEditIndex]} 
                decision={currentDecision}
              />
            </div>
            
            <div className="p-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentEditIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNext}
                  disabled={currentEditIndex === suggestedEdits.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                {currentDecision?.accepted === undefined && (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={handleReject}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleAccept}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  </>
                )}
                {currentDecision?.accepted === true && (
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Undo Accept
                  </Button>
                )}
                {currentDecision?.accepted === false && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAccept}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Undo Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleComplete}
            >
              <Save className="h-4 w-4 mr-2" />
              Save and Continue
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            All decisions will be saved automatically. You can always come back to make changes.
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default EditResumePage;
