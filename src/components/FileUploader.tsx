
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        onFileUpload(uploadedFile);
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

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer min-h-[200px] flex flex-col items-center justify-center ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload 
        className={`mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} 
        size={36} 
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
          <p className="mt-4 text-xs text-gray-400">
            Or click to browse your files
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
