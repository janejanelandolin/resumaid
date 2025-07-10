
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminPasswordDialogProps {
  onAuthenticated: () => void;
}

const AdminPasswordDialog: React.FC<AdminPasswordDialogProps> = ({ onAuthenticated }) => {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user is already authenticated as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase.rpc('is_admin');
        if (data) {
          setOpen(false);
          onAuthenticated();
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [user, onAuthenticated]);

  const handleCheckAdmin = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in first to access admin features",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setOpen(false);
        onAuthenticated();
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin panel",
        });
      } else {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Failed to verify admin status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <Shield className="h-5 w-5" />
            Admin Access Required
          </DialogTitle>
          <DialogDescription>
            {user ? 
              "Checking your admin privileges..." : 
              "Please sign in with an admin account to access this page"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!user ? (
            <div className="flex items-center gap-2 p-4 border border-orange-200 bg-orange-50 rounded-md">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-700">
                You must be signed in to access admin features. Please close this dialog and sign in first.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Click below to verify your admin privileges
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            onClick={handleCheckAdmin}
            disabled={!user || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              "Verify Admin Access"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordDialog;
