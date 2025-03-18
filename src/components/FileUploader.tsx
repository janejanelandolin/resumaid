
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, ClipboardPaste } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  onTextInput?: (text: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, onTextInput }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
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
  });

  React.useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  const handleTextInputSubmit = () => {
    if (resumeText.trim() && onTextInput) {
      onTextInput(resumeText);
      // Clear file when text is submitted
      setFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-center mb-3 text-gray-700">Upload Resume File</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer min-h-[180px] flex flex-col items-center justify-center ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
            }`}
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
              </div>
            )}
          </div>
        </div>

        {/* Text Input Section */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-center mb-3 text-gray-700">Or Paste Resume Text</h3>
          <div className="border-2 rounded-lg p-6 space-y-4 min-h-[180px] flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardPaste className="text-primary" size={20} />
              <h3 className="text-sm font-medium text-gray-600">Paste your content below</h3>
            </div>
            <Textarea 
              placeholder="Paste the content of your resume here..." 
              className="min-h-[100px] flex-grow"
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
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Choose either method to submit your resume for ATS compatibility analysis</p>
      </div>
    </div>
  );
};

export default FileUploader;
