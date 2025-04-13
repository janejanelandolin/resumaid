
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, ClipboardPaste, ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  onTextInput?: (text: string) => void;
  jobPosting?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  onTextInput,
  jobPosting = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isResumeTextOpen, setIsResumeTextOpen] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFileUploadError(null);
        const uploadedFile = acceptedFiles[0];
        console.log(`File selected: ${uploadedFile.name} (${uploadedFile.type}), size: ${uploadedFile.size} bytes`);
        
        // Verify file is valid
        if (uploadedFile.size === 0) {
          setFileUploadError('Error: File is empty');
          return;
        }
        
        setFile(uploadedFile);
        onFileUpload(uploadedFile);
        // Clear text input when file is uploaded
        setResumeText('');
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message || 'Invalid file type';
      setFileUploadError(`Error: ${error}`);
    }
  });

  React.useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  const handleTextInputSubmit = () => {
    if (resumeText.trim() && onTextInput) {
      onTextInput(resumeText);
      // Clear file when text is submitted
      setFile(null);
      setFileUploadError(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="space-y-2">
        <h3 className="text-md font-medium text-center mb-3 text-gray-700">Upload Resume File</h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center h-full min-h-[300px] ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          } ${fileUploadError ? 'border-red-300' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload 
            className={`mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} 
            size={28} 
          />
          
          {file ? (
            <div className="animate-fade-in">
              <p className="text-sm font-medium text-primary mb-1">File selected:</p>
              <p className="text-sm text-gray-600">{file.name}</p>
              <p className="text-xs text-gray-500 mt-2">
                Click or drag to replace the file
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOCX, TXT
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Or click to browse your files
              </p>
              
              {fileUploadError && (
                <p className="mt-2 text-sm text-red-500">
                  {fileUploadError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resume Text Input as Collapsible */}
      <Collapsible 
        open={isResumeTextOpen} 
        onOpenChange={setIsResumeTextOpen}
        className="border rounded-lg"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="h-5 w-5 text-primary" />
            <span>Paste Resume Text</span>
          </div>
          {isResumeTextOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-2">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Paste your resume content directly if you don't have a file to upload.
            </p>
            <Textarea 
              placeholder="Paste the content of your resume here..." 
              className="min-h-[150px]"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <Button 
              onClick={handleTextInputSubmit}
              className="w-full"
              disabled={!resumeText.trim()}
              variant="outline"
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Use This Text
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="text-center text-sm text-gray-500">
        <p>Choose upload method or paste text to submit your resume for ATS compatibility analysis</p>
      </div>
    </div>
  );
};

export default FileUploader;
