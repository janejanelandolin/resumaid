import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { filterJobTitles } from '../services/jobTitles';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/PageContainer';
import RotatingText from '@/components/RotatingText';
import { Search } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle, setJobTitle, setJobPosting } = useResumeContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <PageContainer className="justify-start pt-8">
      <div className="w-full space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">ResumAI</h1>
          <p className="text-muted-foreground">
            <RotatingText 
              texts={["OPTIMIZE", "Optimize your RESUME", "Optimize your resume for your DREAM JOB"]}
              className="text-base font-medium"
              highlightedText="true"
            />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-medium">
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
                className="pr-8"
              />
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              
              {inputFocused && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto animate-fade-in">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Let's go"}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t">
          <div className="text-center space-y-6">
            <div className="relative h-24 overflow-hidden">
              <div className="absolute w-full animate-rotate-testimonials">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="py-2">
                    <p className="text-sm italic">"{testimonial.text}"</p>
                    <p className="text-xs font-medium mt-1 text-primary">
                      {testimonial.name}, {testimonial.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-sm font-semibold text-gradient">
                Join 10,000+ professionals who optimized their resumes with ResumAI
              </p>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold">97%</p>
                  <p className="text-xs text-muted-foreground">Improved Scores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-xs text-muted-foreground">More Interviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">14K+</p>
                  <p className="text-xs text-muted-foreground">Resumes Optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
