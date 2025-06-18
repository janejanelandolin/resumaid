
import { useEffect } from 'react';

const StripePaymentListener = () => {
  useEffect(() => {
    console.log('StripePaymentListener mounted, checking for payment indicators...');
    
    const checkForStripeSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for various Stripe success parameters
      const sessionId = urlParams.get('session_id');
      const paymentIntent = urlParams.get('payment_intent');
      const paymentIntentStatus = urlParams.get('payment_intent_client_secret');
      const paymentStatus = urlParams.get('payment');
      
      console.log('Checking URL parameters:', {
        sessionId,
        paymentIntent,
        paymentIntentStatus,
        paymentStatus,
        fullUrl: window.location.href
      });
      
      // Check if any payment success indicator is present
      if (sessionId || paymentIntent || paymentIntentStatus) {
        console.log('Stripe payment success detected via URL parameters');
        
        // Store the session ID for potential future use
        if (sessionId) {
          localStorage.setItem('stripe-session-id', sessionId);
          console.log('Stored Stripe session ID:', sessionId);
        }
        
        // Dispatch custom event for payment success
        const successEvent = new CustomEvent('stripe-payment-success', {
          detail: { 
            sessionId: sessionId || paymentIntent,
            source: 'url_parameters'
          }
        });
        
        console.log('Dispatching stripe-payment-success event:', successEvent.detail);
        window.dispatchEvent(successEvent);
        
        // Also dispatch a verification request
        const verifyEvent = new CustomEvent('verify-payment-request', {
          detail: { 
            sessionId: sessionId || paymentIntent,
            source: 'stripe_listener'
          }
        });
        
        console.log('Dispatching verify-payment-request event:', verifyEvent.detail);
        window.dispatchEvent(verifyEvent);
      }
      
      // Also check for explicit payment success in URL
      if (paymentStatus === 'success') {
        console.log('Payment success status detected in URL');
        if (sessionId) {
          const event = new CustomEvent('verify-payment-request', {
            detail: { sessionId, source: 'payment_success_param' }
          });
          window.dispatchEvent(event);
        }
      }
    };

    // Check immediately when component mounts
    checkForStripeSuccess();

    // Also listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      console.log('Pop state event detected, rechecking payment status');
      checkForStripeSuccess();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Listen for Stripe's postMessage events from checkout
    const handleMessage = (event: MessageEvent) => {
      console.log('Received postMessage:', event);
      
      // Only accept messages from Stripe domains
      if (event.origin.includes('stripe.com') || event.origin.includes('js.stripe.com')) {
        console.log('Message from Stripe domain detected');
        
        if (event.data?.type === 'stripe_checkout_session_complete' || 
            event.data?.type === 'stripe_checkout_session_succeeded') {
          console.log('Stripe checkout session complete via postMessage');
          
          const successEvent = new CustomEvent('stripe-payment-success', {
            detail: { 
              sessionId: event.data?.sessionId,
              source: 'postmessage'
            }
          });
          window.dispatchEvent(successEvent);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);

    // Cleanup function
    return () => {
      console.log('StripePaymentListener unmounting');
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default StripePaymentListener;
