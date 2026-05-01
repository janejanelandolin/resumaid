import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SESSION_KEY = 'resumaid_one_time_paid';

export const useOneTimePayment = () => {
  const { toast } = useToast();
  const [isPaid, setIsPaid] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify a Stripe session ID and unlock download if paid
  const verifyPayment = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
      });
      if (error) throw error;
      if (data?.paid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsPaid(true);
        toast({ title: 'Payment confirmed!', description: 'Your download is ready.' });
        return true;
      }
      return false;
    } catch (err) {
      console.error('verify-payment error:', err);
      toast({
        title: 'Could not verify payment',
        description: 'Please contact support if you were charged.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [toast]);

  // On mount: detect Stripe redirect and verify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const payment = params.get('payment');

    if (payment === 'success' && sessionId) {
      verifyPayment(sessionId);
      // Clean up URL without triggering a re-render/navigation
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
    } else if (payment === 'cancelled') {
      toast({ title: 'Payment cancelled', description: 'Your resume is still saved.' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [verifyPayment, toast]);

  // Initiate a $1 Stripe hosted checkout (no login required)
  const createCheckout = useCallback(async () => {
    setIsCreatingCheckout(true);
    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          amount: 100,
          currency: 'usd',
          successUrl: `${origin}/results?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/results?payment=cancelled`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url; // full-page redirect to Stripe hosted checkout
      }
    } catch (err) {
      console.error('create-checkout error:', err);
      toast({
        title: 'Could not start payment',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  }, [toast]);

  return { isPaid, isCreatingCheckout, isVerifying, createCheckout };
};
