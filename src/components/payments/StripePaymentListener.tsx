import { useEffect } from 'react';

const StripePaymentListener = () => {
  useEffect(() => {
    const handleStripeEvents = () => {
      // Function to check for payment success indicators
      const checkForStripeSuccess = () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for various Stripe success parameters
        const sessionId = urlParams.get('session_id');
        const paymentIntent = urlParams.get('payment_intent');
        const paymentIntentStatus = urlParams.get('payment_intent_client_secret');
        
        // Check if any payment success indicator is present
        if (sessionId || paymentIntent || paymentIntentStatus) {
          console.log('Stripe payment success detected via URL parameters:', {
            sessionId,
            paymentIntent,
            paymentIntentStatus
          });
          
          // Store the session ID for potential future use
          if (sessionId) {
            localStorage.setItem('stripe-session-id', sessionId);
            console.log('Stored Stripe session ID:', sessionId);
          }
          
          // Dispatch custom event for payment success
          window.dispatchEvent(new CustomEvent('stripe-payment-success', {
            detail: { sessionId }
          }));
          
          // Clean up URL parameters to keep the URL clean
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      };

      // Check immediately when component mounts
      checkForStripeSuccess();

      // Also listen for popstate events (back/forward navigation)
      const handlePopState = () => {
        checkForStripeSuccess();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      // Listen for Stripe's postMessage events from checkout
      const handleMessage = (event: MessageEvent) => {
        // Only accept messages from Stripe domains
        if (event.origin.includes('stripe.com') || event.origin.includes('js.stripe.com')) {
          if (event.data?.type === 'stripe_checkout_session_complete' || 
              event.data?.type === 'stripe_checkout_session_succeeded') {
            console.log('Stripe checkout session complete via postMessage');
            window.dispatchEvent(new CustomEvent('stripe-payment-success', {
              detail: { sessionId: event.data?.sessionId }
            }));
          }
        }
      };
      
      window.addEventListener('message', handleMessage);

      // Cleanup function
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('message', handleMessage);
      };
    };

    const cleanup = handleStripeEvents();
    return cleanup;
  }, []);

  return null; // This component doesn't render anything
};

export default StripePaymentListener;
