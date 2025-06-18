import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      console.log('Starting payment process...');
      console.log('Creating checkout session...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          amount: 499, // $4.99 in cents
          currency: 'usd',
          successUrl: `${window.location.origin}/success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/download?payment=cancelled`
        }
      });

      console.log('Checkout session response:', { data, error });

      if (error) {
        console.error('Checkout session error:', error);
        throw error;
      }

      if (data?.url && data?.sessionId) {
        console.log('Redirecting to checkout:', data.url);
        console.log('Session ID:', data.sessionId);
        
        // Store session ID for later verification
        localStorage.setItem('stripe-session-id', data.sessionId);
        localStorage.setItem('stripe-checkout-initiated', 'true');
        localStorage.setItem('stripe-checkout-timestamp', Date.now().toString());
        
        console.log('Stored session data:', {
          sessionId: data.sessionId,
          timestamp: Date.now()
        });
        
        // Close modal before redirect
        onClose();
        
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('Invalid response from create-checkout:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-purple-600">Complete Your Purchase</DialogTitle>
          <DialogDescription className="text-center">
            Pay to download your optimized resume as a Word document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You'll be redirected to Stripe's secure checkout page
            </p>
            
            <Button 
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating checkout...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  One Optimized Resume $4.99
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            <p>After payment, you'll be redirected back to download your resume.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
