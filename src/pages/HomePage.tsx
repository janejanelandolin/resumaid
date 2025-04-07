
import { Sparkle, Rocket, Star } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import RotatingText from '@/components/RotatingText';
import JobSearchForm from '@/components/home/JobSearchForm';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const HomePage = () => {
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

          <JobSearchForm />
          <TestimonialsSection />
        </div>
      </PageContainer>
    </div>
  );
};

export default HomePage;
