
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const AuthButtons = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <AuthModal 
      trigger={
        <Button variant="outline" size="sm" className="gap-2 bg-white">
          <LogIn size={16} className="text-purple-500" />
          <span>Sign In</span>
        </Button>
      } 
    />
  );
};

export default AuthButtons;
