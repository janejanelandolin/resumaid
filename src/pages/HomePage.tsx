import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { filterJobTitles } from '../services/jobTitles';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/PageContainer';
import RotatingText from '@/components/RotatingText';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Sparkle, Rocket, Star, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle, setJobTitle, setJobPosting, jobPosting } = useResumeContext();
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
      // If custom job posting is provided, use it instead of fetching
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
      
      // Otherwise fetch job posting as usual
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

  // Testimonials data
  const testimonials = [
    { name: "Sarah J.", role: "Marketing Specialist", text: "ResumAI helped me land my dream job after 3 months of searching!" },
    { name: "Michael T.", role: "Software Engineer", text: "My interview callbacks increased by 300% after using ResumAI." },
    { name: "Jessica L.", role: "Project Manager", text: "The optimization suggestions were spot-on! Highly recommend!" },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen">
      <PageContainer className="justify-start pt-8">
        <div className="w-full space-y-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 text-purple-300 animate-pulse">
            <Sparkle size={24} />
          </div>
          <div className="absolute top-32 -left-8 text-blue-400 animate-spin-slow">
            <Star size={16} />
          </div>
          <div className="absolute top-56 -right-6 text-yellow-400 animate-bounce">
            <Star size={20} />
          </div>
          
          <div className="space-y-2 text-center relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-300 rounded-full filter blur-3xl opacity-20"></div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 relative">
              ResumAID
              <span className="absolute -top-4 -right-4 text-purple-600">
                <Rocket size={20} className="animate-fade-in" />
              </span>
            </h1>
            <p className="text-muted-foreground">
              <RotatingText 
                texts={["OPTIMIZE", "Optimize your RESUME", "Optimize your resume for your DREAM JOB"]}
                className="text-base font-medium"
                highlightedText="true"
              />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Sparkle size={16} className="text-purple-500" />
                Dream job title
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
            
            {/* Advanced: Custom Job Posting Collapsible */}
            <Collapsible 
              open={isAdvancedOpen} 
              onOpenChange={setIsAdvancedOpen}
              className="border border-purple-100 rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Advanced: Paste Job Posting</span>
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

          <div className="mt-12 pt-8 border-t border-purple-100">
            <div className="text-center space-y-6">
              <div className="relative h-24 overflow-hidden bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-inner">
                <div className="absolute w-full animate-rotate-testimonials">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="py-2">
                      <p className="text-sm italic text-gray-600">"{testimonial.text}"</p>
                      <p className="text-xs font-medium mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        {testimonial.name}, {testimonial.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-primary">
                  Join 10,000+ professionals who optimized their resumes with ResumAI
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-purple-100">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-primary">97%</p>
                    <p className="text-xs text-gray-600">Improved Scores</p>
                  </div>
                  <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-purple-100">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-primary">75%</p>
                    <p className="text-xs text-gray-600">More Interviews</p>
                  </div>
                  <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-purple-100">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-primary">14K+</p>
                    <p className="text-xs text-gray-600">Resumes Optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default HomePage;
