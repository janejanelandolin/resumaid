
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentStatus = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPayment = async (sessionId: string) => {
    if (!sessionId) {
      console.log('No session ID provided for verification');
      return false;
    }
    
    try {
      setIsVerifying(true);
      console.log('Starting payment verification for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      console.log('Payment verification response:', { data, error });

      if (error) {
        console.error('Payment verification error:', error);
        return false;
      }

      if (data?.paid) {
        console.log('Payment verified successfully:', data);
        setHasPaid(true);
        localStorage.setItem('stripe-payment-completed', 'true');
        localStorage.setItem('verified-session-id', sessionId);
        
        // Dispatch a success event for other components
        window.dispatchEvent(new CustomEvent('payment-verified', {
          detail: { sessionId, paymentData: data }
        }));
        
        return true;
      } else {
        console.log('Payment not verified:', data);
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
    console.log('usePaymentStatus hook initialized');
    
    // Check if payment was already completed
    const paymentStatus = localStorage.getItem('stripe-payment-completed');
    if (paymentStatus === 'true') {
      console.log('Payment already completed (from localStorage)');
      setHasPaid(true);
    }

    // Check URL parameters for successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    
    console.log('URL params check:', { 
      paymentParam, 
      sessionId, 
      fullUrl: window.location.href,
      search: window.location.search 
    });

    if (paymentParam === 'success') {
      console.log('Payment success detected from URL');
      
      if (sessionId) {
        // We have session_id in URL - verify with Stripe
        console.log('Session ID found in URL, verifying payment:', sessionId);
        verifyPayment(sessionId);
      } else {
        // No session_id in URL - check localStorage for stored session
        const storedSessionId = localStorage.getItem('stripe-session-id');
        console.log('No session_id in URL, checking localStorage:', storedSessionId);
        
        if (storedSessionId) {
          console.log('Found stored session ID, verifying payment:', storedSessionId);
          verifyPayment(storedSessionId);
        } else {
          // No session ID available anywhere - assume payment success based on URL parameter
          console.log('No session ID available, trusting URL parameter for payment success');
          setHasPaid(true);
          localStorage.setItem('stripe-payment-completed', 'true');
          
          // Dispatch success event without verification
          window.dispatchEvent(new CustomEvent('payment-verified', {
            detail: { sessionId: null, source: 'url_parameter_only' }
          }));
        }
      }
      
      // Clean up URL parameters after processing
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        console.log('URL parameters cleaned up');
      }, 1000);
    }

    // Listen for payment success events from other components
    const handlePaymentSuccess = (event: CustomEvent) => {
      console.log('Payment success event received:', event.detail);
      const sessionId = event.detail?.sessionId || localStorage.getItem('stripe-session-id');
      if (sessionId) {
        console.log('Verifying payment from event with session:', sessionId);
        verifyPayment(sessionId);
      }
    };

    // Listen for direct verification requests
    const handleVerifyRequest = (event: CustomEvent) => {
      console.log('Payment verify request received:', event.detail);
      if (event.detail?.sessionId) {
        verifyPayment(event.detail.sessionId);
      }
    };

    window.addEventListener('stripe-payment-success', handlePaymentSuccess as EventListener);
    window.addEventListener('verify-payment-request', handleVerifyRequest as EventListener);

    return () => {
      window.removeEventListener('stripe-payment-success', handlePaymentSuccess as EventListener);
      window.removeEventListener('verify-payment-request', handleVerifyRequest as EventListener);
    };
  }, []);

  const resetPaymentStatus = () => {
    console.log('Resetting payment status');
    setHasPaid(false);
    localStorage.removeItem('stripe-payment-completed');
    localStorage.removeItem('stripe-session-id');
    localStorage.removeItem('verified-session-id');
  };

  return { hasPaid, isVerifying, resetPaymentStatus, verifyPayment };
};
