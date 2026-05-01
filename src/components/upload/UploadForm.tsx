import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const UploadForm = () => {
  const navigate = useNavigate();
  const { rawResumeFile, rawResumeText, setRawResumeFile, setRawResumeText } =
    useResumeContext();

  const handleFileUpload = (file: File) => {
    setRawResumeFile(file);
    setRawResumeText('');
  };

  const handleTextInput = (text: string) => {
    setRawResumeText(text);
    setRawResumeFile(null);
  };

  const hasInput = !!rawResumeFile || rawResumeText.trim().length > 0;

  const handleContinue = () => {
    if (hasInput) navigate('/processing');
  };

  return (
    <div className="space-y-6 py-4">
      <FileUploader
        onFileUpload={handleFileUpload}
        onTextInput={handleTextInput}
      />

      <Button
        onClick={handleContinue}
        disabled={!hasInput}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-40"
        size="lg"
      >
        <span className="flex items-center gap-2">
          Analyse my resume
          <Rocket size={16} />
        </span>
      </Button>

      {!hasInput && (
        <p className="text-center text-xs text-gray-400">
          Upload a file or paste your resume text to continue
        </p>
      )}
    </div>
  );
};

export default UploadForm;
