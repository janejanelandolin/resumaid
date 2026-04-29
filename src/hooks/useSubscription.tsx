import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string | null;
  subscription_end?: string | null;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false, subscription_tier: null, subscription_end: null });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async () => {
    // Fetch session fresh from Supabase to avoid stale React state immediately after sign-in.
    let { data: { session: activeSession } } = await supabase.auth.getSession();
    if (!activeSession) {
      // Brief retry to allow auth state to propagate after a just-completed sign-in.
      await new Promise((r) => setTimeout(r, 400));
      ({ data: { session: activeSession } } = await supabase.auth.getSession());
    }

    if (!activeSession) {
      throw new Error('User must be logged in to subscribe');
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        headers: {
          Authorization: `Bearer ${activeSession.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    console.log('openCustomerPortal called');
    console.log('user:', user);
    console.log('session:', session);
    
    if (!user || !session) {
      throw new Error('User must be logged in to manage subscription');
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  // Check URL for subscription success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get('payment');
    
    if (paymentParam === 'success') {
      // Wait a bit then check subscription status
      setTimeout(() => {
        checkSubscription();
      }, 2000);
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return {
    subscribed: subscriptionData.subscribed,
    subscriptionTier: subscriptionData.subscription_tier,
    subscriptionEnd: subscriptionData.subscription_end,
    isLoading,
    checkSubscription,
    createSubscription,
    openCustomerPortal,
  };
};