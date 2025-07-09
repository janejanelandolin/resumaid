
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Crown } from 'lucide-react';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { subscribed, openCustomerPortal } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Portal Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white">
          <User size={16} className="text-purple-500" />
          <span className="hidden md:inline-block">{user.email?.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem className="text-sm text-gray-600">
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {subscribed && (
          <DropdownMenuItem asChild>
            <button 
              className="w-full flex items-center gap-2 text-primary cursor-pointer" 
              onClick={handleManageSubscription}
            >
              <Crown size={16} />
              <span>Manage Subscription</span>
            </button>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button 
            className="w-full flex items-center gap-2 text-red-500 cursor-pointer" 
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut size={16} />
            <span>
              {isLoading ? 'Signing out...' : 'Sign out'}
            </span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
