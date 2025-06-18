
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentStatus = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPayment = async (sessionId: string) => {
    if (!sessionId) return false;
    
    try {
      setIsVerifying(true);
      console.log('Verifying payment for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        return false;
      }

      if (data?.paid) {
        console.log('Payment verified successfully');
        setHasPaid(true);
        localStorage.setItem('stripe-payment-completed', 'true');
        localStorage.setItem('verified-session-id', sessionId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Check if payment was already completed
    const paymentStatus = localStorage.getItem('stripe-payment-completed');
    if (paymentStatus === 'true') {
      setHasPaid(true);
    }

    // Check URL parameters for successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus2 = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus2 === 'success' && sessionId) {
      console.log('Payment success detected from URL, verifying...');
      verifyPayment(sessionId);
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // Listen for payment success events from other components
    const handlePaymentSuccess = (event: CustomEvent) => {
      console.log('Payment success event received:', event.detail);
      const sessionId = event.detail?.sessionId || localStorage.getItem('stripe-session-id');
      if (sessionId) {
        verifyPayment(sessionId);
      }
    };

    window.addEventListener('stripe-payment-success', handlePaymentSuccess as EventListener);

    return () => {
      window.removeEventListener('stripe-payment-success', handlePaymentSuccess as EventListener);
    };
  }, []);

  const resetPaymentStatus = () => {
    setHasPaid(false);
    localStorage.removeItem('stripe-payment-completed');
    localStorage.removeItem('stripe-session-id');
    localStorage.removeItem('verified-session-id');
  };

  return { hasPaid, isVerifying, resetPaymentStatus, verifyPayment };
};
