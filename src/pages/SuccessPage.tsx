
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/PageContainer';
import RotatingText from '@/components/RotatingText';
import { Download } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { jobTitle, resetData } = useResumeContext();

  // Create confetti elements
  const createConfetti = () => {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Colors for confetti
    const colors = ['#1a365d', '#2d9868', '#7c3aed', '#e11d48', '#f59e0b'];
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;
      
      confetti.classList.add('absolute');
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${-20 - Math.random() * 100}px`;
      confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Add animation with random delay
      confetti.style.animation = `confetti ${1 + Math.random() * 4}s ${Math.random() * 2}s ease-in forwards`;
      
      confettiContainer.appendChild(confetti);
    }
  };

  useEffect(() => {
    createConfetti();
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
      
      <div className="w-full space-y-8 text-center relative z-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Congratulations!</h1>
          <p className="text-xl font-semibold">
            Your resume is{' '}
            <RotatingText 
              texts={["OPTIMIZED", "ENHANCED", "BOOSTED", "MAXIMIZED"]}
              className="inline"
              highlightedText
            />
          </p>
        </div>

        <div className="py-6">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Download className="h-16 w-16 text-primary animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={handleDownload} className="w-full">
            Download Your Resume
          </Button>
          
          <Button 
            onClick={handleTryAnother} 
            variant="outline"
            className="w-full"
          >
            Try another role!
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Your resume is now optimized for <span className="font-medium">{jobTitle}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You can access this download from your email as well
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default SuccessPage;
