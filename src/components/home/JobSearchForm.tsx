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
import { Search, ChevronDown, ChevronUp, Rocket } from 'lucide-react';

const JobSearchForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle, setJobTitle, setJobPosting } = useResumeContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [customJobPosting, setCustomJobPosting] = useState('');

  useEffect(() => {
    setSuggestions(filterJobTitles(jobTitle));
  }, [jobTitle]);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (customJobPosting.trim()) {
        setJobPosting({
          title: jobTitle,
          description: customJobPosting,
          requirements: [],
          skills: [],
          userProvided: true
        });
        navigate('/upload');
        return;
      }
      
      const jobPostingData = await apiService.getJobPosting(jobTitle);
      setJobPosting(jobPostingData);
      navigate('/upload');
    } catch (error) {
      console.error('Error fetching job posting:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job posting information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setJobTitle(suggestion);
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="mb-4 text-center">
        <p className="text-muted-foreground font-medium">Choose how you want to submit your job posting...</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
          Option 1: Enter dream job title
        </label>
        <div className="relative">
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={handleJobTitleChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 100)}
            placeholder="Enter your dream job title"
            className="pr-8 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-purple-500" />
          
          {inputFocused && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-md shadow-lg max-h-60 overflow-auto animate-fade-in">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <Collapsible 
        open={isAdvancedOpen} 
        onOpenChange={setIsAdvancedOpen}
        className="border border-purple-100 rounded-lg"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">Option 2: Paste a job posting</span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3">
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Paste the job description for more accurate resume optimization
            </p>
            <Textarea
              placeholder="Paste the job posting description here..."
              className="min-h-[120px] text-sm border-purple-200"
              value={customJobPosting}
              onChange={(e) => setCustomJobPosting(e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300" 
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
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
