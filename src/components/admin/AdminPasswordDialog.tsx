
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface AdminPasswordDialogProps {
  onAuthenticated: () => void;
}

const ADMIN_PASSWORD = "AdminPass123!";

const AdminPasswordDialog: React.FC<AdminPasswordDialogProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setOpen(false);
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
      
      // Close dialog and notify parent component
      setOpen(false);
      onAuthenticated();
      
      // Show success toast
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin panel",
      });
    } else {
      // Show error
      setError(true);
      
      // Show error toast
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (newOpen === false) {
        // If user tries to close dialog without authenticating, redirect them
        window.location.href = '/';
      }
      setOpen(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Authentication Required
          </DialogTitle>
          <DialogDescription>
            Please enter the admin password to access this page
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={error ? "border-red-500" : ""}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {error && (
              <p className="text-sm text-red-500">Incorrect password</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordDialog;
