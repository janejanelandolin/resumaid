import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, FileText } from 'lucide-react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { apiService } from '@/services/api';
import { formatJobPostingAsText } from '@/hooks/resume/useResumeNormalizer';
import { useToast } from '@/hooks/use-toast';

const CoverLetterModal: React.FC = () => {
  const { tailoredResumeJson, resumeJson, jobPosting } = useResumeContext();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const resume = tailoredResumeJson ?? resumeJson;

  const handleGenerate = async () => {
    if (!resume || !jobPosting) return;
    setLoading(true);
    try {
      const jobPostingText = formatJobPostingAsText(jobPosting);
      const result = await apiService.generateCoverLetter(resume, jobPostingText);
      if (result.error || !result.data) {
        toast({
          title: 'Could not generate cover letter',
          description: result.error ?? 'Please try again.',
          variant: 'destructive',
        });
      } else {
        setLetter(result.data.cover_letter);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (val && !letter) handleGenerate();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <FileText size={15} />
          Cover Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-indigo-700">Your Cover Letter</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500">Writing your cover letter…</p>
          </div>
        )}

        {!loading && letter && (
          <div className="flex flex-col gap-3 overflow-hidden">
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-gray-500"
                onClick={handleCopy}
              >
                {copied ? (
                  <><Check size={13} /> Copied</>
                ) : (
                  <><Copy size={13} /> Copy</>
                )}
              </Button>
            </div>
            <div className="overflow-y-auto rounded-lg bg-gray-50 border border-gray-200 p-5">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {letter}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-start gap-1.5 text-gray-500"
              onClick={handleGenerate}
            >
              <Loader2 size={12} />
              Regenerate
            </Button>
          </div>
        )}

        {!loading && !letter && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Something went wrong. <button className="underline" onClick={handleGenerate}>Try again</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterModal;
