
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterJobTitles } from '../../services/jobTitles';
import { useResumeContext } from '../../contexts/ResumeContext';
import { apiService } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, ChevronDown, ChevronUp, Rocket, Link, FileText } from 'lucide-react';

type InputMode = 'title' | 'paste' | 'url';

const JobSearchForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle, setJobTitle, setJobPosting } = useResumeContext();

  const [mode, setMode] = useState<InputMode>('title');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Option 1: title
  // Option 2: paste text
  const [customJobPosting, setCustomJobPosting] = useState('');
  // Option 3: URL
  const [jobUrl, setJobUrl] = useState('');

  useEffect(() => {
    if (jobTitle) setSuggestions(filterJobTitles(jobTitle));
  }, [jobTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ── Option 2: Paste ───────────────────────────────────────────
      if (mode === 'paste') {
        if (!customJobPosting.trim()) {
          toast({ title: 'Please paste a job posting', variant: 'destructive' });
          return;
        }
        setJobPosting({
          title: jobTitle || 'Job Posting',
          description: customJobPosting,
          requirements: [],
          skills: [],
          userProvided: true,
        });
        navigate('/upload');
        return;
      }

      // ── Option 3: URL ─────────────────────────────────────────────
      if (mode === 'url') {
        if (!jobUrl.trim()) {
          toast({ title: 'Please enter a job posting URL', variant: 'destructive' });
          return;
        }
        toast({ title: 'Fetching job posting…', description: jobUrl });
        const result = await apiService.fetchJobPostingFromUrl(jobUrl);
        if (result.error || !result.data?.text) {
          toast({
            title: 'Could not read that URL',
            description:
              result.error ??
              'Try pasting the job description directly instead.',
            variant: 'destructive',
          });
          return;
        }
        setJobPosting({
          title: jobTitle || 'Job Posting',
          description: result.data.text,
          requirements: [],
          skills: [],
          userProvided: true,
        });
        navigate('/upload');
        return;
      }

      // ── Option 1: Title ───────────────────────────────────────────
      if (!jobTitle.trim()) {
        toast({ title: 'Please enter a job title', variant: 'destructive' });
        return;
      }
      const jobPostingData = await apiService.getJobPosting(jobTitle);
      setJobPosting(jobPostingData);
      navigate('/upload');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Could not fetch the job posting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const Tab = ({
    id,
    icon: Icon,
    label,
  }: {
    id: InputMode;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
        mode === id
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100"
    >
      {/* Mode tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
        <Tab id="title" icon={Search} label="Job Title" />
        <Tab id="url" icon={Link} label="Job Link" />
        <Tab id="paste" icon={FileText} label="Job Posting" />
      </div>

      {/* ── Option 1: Title ── */}
      {mode === 'title' && (
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Enter your dream job title
          </label>
          <div className="relative">
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 100)}
              placeholder="e.g. Senior Product Manager"
              className="pr-8 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-purple-400" />
            {inputFocused && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-fade-in">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                    onClick={() => {
                      setJobTitle(s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-gray-400">
            We'll generate a job description automatically using AI.
          </p>
        </div>
      )}

      {/* ── Option 2: Paste ── */}
      {mode === 'paste' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Paste the full job posting
          </label>
          <Textarea
            placeholder="Copy the entire job posting from LinkedIn, Indeed, or the company website and paste it here…"
            className="min-h-[160px] text-sm border-purple-200"
            value={customJobPosting}
            onChange={e => setCustomJobPosting(e.target.value)}
          />
        </div>
      )}

      {/* ── Option 3: URL ── */}
      {mode === 'url' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Job posting URL
          </label>
          <Input
            value={jobUrl}
            onChange={e => setJobUrl(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/view/…"
            className="border-purple-200 focus:border-purple-400"
          />
          <div className="space-y-2">
            <label htmlFor="jobTitleUrl" className="text-xs text-gray-500">
              Optional: add a job title for your records
            </label>
            <Input
              id="jobTitleUrl"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Product Manager"
              className="border-purple-100 text-sm"
            />
          </div>
          <p className="text-xs text-gray-400">
            Works best with LinkedIn, Indeed, Greenhouse, and most company career pages.
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mode === 'url' ? 'Fetching job posting…' : 'Processing…'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Let's go
            <Rocket size={16} />
          </span>
        )}
      </Button>
    </form>
  );
};

export default JobSearchForm;
