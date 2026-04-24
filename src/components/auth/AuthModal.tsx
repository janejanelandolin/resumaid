
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

type AuthModalProps = {
  trigger: React.ReactNode;
  onSuccess?: () => void;
};

type View = 'tabs' | 'forgot';

const AuthModal = ({ trigger, onSuccess }: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('tabs');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setView('tabs');
      setEmail('');
      setPassword('');
      setResetEmail('');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'An error occurred during sign in', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error, user } = await signUp(email, password);
      if (error) {
        toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
        return;
      }
      toast({
        title: 'Welcome to ResumAID!',
        description: user ? 'Your account has been created.' : 'Please check your email to confirm your account.',
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'An error occurred during sign up', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        toast({ title: 'Reset failed', description: error.message, variant: 'destructive' });
        return;
      }
      toast({
        title: 'Check your email',
        description: 'We sent a password reset link to ' + resetEmail,
      });
      setView('tabs');
      setResetEmail('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            ResumAID Account
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === 'forgot'
              ? "Enter your email and we'll send you a reset link"
              : 'Sign in or create an account to save your progress'}
          </DialogDescription>
        </DialogHeader>

        {view === 'forgot' ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground -mb-2"
              onClick={() => setView('tabs')}
            >
              <ArrowLeft size={14} /> Back to sign in
            </Button>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="flex items-center gap-2">
                  <Mail size={16} className="text-purple-500" />
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </div>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin" className="flex items-center gap-2">
                    <Mail size={16} className="text-purple-500" />
                    Email
                  </Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-signin" className="flex items-center gap-2">
                      <Lock size={16} className="text-purple-500" />
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="flex items-center gap-2">
                    <Mail size={16} className="text-purple-500" />
                    Email
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="flex items-center gap-2">
                    <Lock size={16} className="text-purple-500" />
                    Password
                  </Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
