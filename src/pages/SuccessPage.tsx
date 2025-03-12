
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';
import RotatingText from '@/components/RotatingText';
import { Download, Sparkle, Star, Trophy, PartyPopper, Rocket } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { jobTitle, resetData } = useResumeContext();

  // Create confetti elements
  const createConfetti = () => {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Colors for confetti - enhanced color palette
    const colors = ['#7c3aed', '#e11d48', '#f59e0b', '#2d9868', '#1a365d', '#ec4899', '#8b5cf6', '#06b6d4'];
    
    // Create confetti pieces - increased quantity for more visual impact
    for (let i = 0; i < 200; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 12 + 5;
      
      confetti.classList.add('absolute');
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${-20 - Math.random() * 100}px`;
      confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
      confetti.style.borderRadius = Math.random() > 0.7 ? '50%' : Math.random() > 0.5 ? '0' : '4px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Add animation with random delay and duration
      confetti.style.animation = `confetti ${1 + Math.random() * 4}s ${Math.random() * 3}s ease-in forwards`;
      
      confettiContainer.appendChild(confetti);
    }
  };

  // Create floating stars
  const createStars = () => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Create star elements
    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 12 + 20;
      const duration = 3 + Math.random() * 5;
      
      star.classList.add('absolute', 'text-primary');
      star.style.fontSize = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = '0';
      star.style.animation = `star-fade ${duration}s ${Math.random() * 5}s infinite ease-in-out`;
      star.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
      
      starsContainer.appendChild(star);
    }
  };

  useEffect(() => {
    createConfetti();
    createStars();

    // Add keyframes for star animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes star-fade {
        0% { opacity: 0; transform: translateY(0) scale(0.5); }
        50% { opacity: 1; transform: translateY(-20px) scale(1); }
        100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDownload = () => {
    // In a real app, this would download the optimized resume
    // Create a fake download link for the demo
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,This is your optimized resume for ' + jobTitle;
    link.download = `${jobTitle.replace(/\s+/g, '_')}_Optimized_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTryAnother = () => {
    resetData();
    navigate('/');
  };

  return (
    <PageContainer>
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      <div id="stars-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <div className="w-full space-y-8 text-center relative z-10">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Trophy className="text-yellow-400 h-10 w-10 mb-2 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Congratulations!
          </h1>
          <p className="text-xl font-semibold">
            Your resume is{' '}
            <RotatingText 
              texts={["OPTIMIZED", "ENHANCED", "BOOSTED", "MAXIMIZED"]}
              className="inline"
              highlightedText="true"
            />
          </p>
        </div>

        <div className="py-6 relative">
          {/* Decorative elements around the download icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 pointer-events-none">
            <div className="animate-spin-slow">
              <PartyPopper className="h-24 w-24 text-accent" />
            </div>
          </div>
          
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
            <Download className="h-16 w-16 text-primary animate-bounce z-10" />
            
            {/* Sparkles around the icon */}
            <div className="absolute top-2 right-4 animate-pulse">
              <Sparkle className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="absolute bottom-4 left-4 animate-pulse delay-300">
              <Sparkle className="h-3 w-3 text-purple-400" />
            </div>
            <div className="absolute top-1/2 right-2 animate-pulse delay-700">
              <Sparkle className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4 relative">
          <Button 
            onClick={handleDownload} 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg"
          >
            Download Your Resume
          </Button>
          
          <Button 
            onClick={handleTryAnother} 
            variant="outline"
            className="w-full group relative overflow-hidden"
          >
            <span className="relative z-10">Try another role!</span>
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-primary/10 to-accent/10 transition-all duration-300 group-hover:w-full"></div>
            <Rocket className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Your resume is now optimized for{' '}
            <span className="font-medium bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              {jobTitle}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You can access this download from your email as well
          </p>
          
          <div className="flex justify-center space-x-1 mt-6">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SuccessPage;
