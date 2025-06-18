
import { useState, useEffect } from 'react';

export const usePaymentStatus = () => {
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    // Check if payment was already completed (stored in localStorage)
    const paymentStatus = localStorage.getItem('stripe-payment-completed');
    if (paymentStatus === 'true') {
      setHasPaid(true);
    }

    // Listen for payment success events
    const handlePaymentSuccess = () => {
      console.log('Payment success detected, updating status');
      setHasPaid(true);
      localStorage.setItem('stripe-payment-completed', 'true');
    };

    window.addEventListener('stripe-payment-success', handlePaymentSuccess);

    return () => {
      window.removeEventListener('stripe-payment-success', handlePaymentSuccess);
    };
  }, []);

  const resetPaymentStatus = () => {
    setHasPaid(false);
    localStorage.removeItem('stripe-payment-completed');
  };

  return { hasPaid, resetPaymentStatus };
};
