
import { useEffect } from 'react';

const StripePaymentListener = () => {
  useEffect(() => {
    const handleStripeEvents = () => {
      // Listen for Stripe buy button events
      const checkForStripeSuccess = () => {
        // Check URL parameters for success indicators
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntent = urlParams.get('payment_intent');
        const paymentIntentStatus = urlParams.get('payment_intent_client_secret');
        
        if (paymentIntent && paymentIntentStatus) {
          console.log('Stripe payment detected via URL parameters');
          // Dispatch custom event for payment success
          window.dispatchEvent(new CustomEvent('stripe-payment-success'));
          
          // Clean up URL parameters
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      };

      // Check immediately
      checkForStripeSuccess();

      // Also listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', checkForStripeSuccess);
      
      // Listen for Stripe's built-in events if available
      window.addEventListener('message', (event) => {
        if (event.origin === 'https://js.stripe.com' && event.data?.type === 'stripe_checkout_session_complete') {
          console.log('Stripe checkout session complete');
          window.dispatchEvent(new CustomEvent('stripe-payment-success'));
        }
      });

      return () => {
        window.removeEventListener('popstate', checkForStripeSuccess);
      };
    };

    const cleanup = handleStripeEvents();
    return cleanup;
  }, []);

  return null; // This component doesn't render anything
};

export default StripePaymentListener;
