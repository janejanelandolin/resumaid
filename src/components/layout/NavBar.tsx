import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Rocket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthButtons from '@/components/auth/AuthButtons';
import { Button } from '@/components/ui/button';

interface NavBarProps {
  /** Show the Journey link only for logged-in users (default true) */
  showJourney?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ showJourney = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 font-bold text-xl">
          <Rocket size={18} className="text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ResumAID
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showJourney && user && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 hidden sm:flex"
              onClick={() => navigate('/journey')}
            >
              <Map size={14} />
              My Journey
            </Button>
          )}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
