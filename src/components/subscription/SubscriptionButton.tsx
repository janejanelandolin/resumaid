import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Crown, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/AuthModal';

export const SubscriptionButton = () => {
  const { user } = useAuth();
  const { subscribed, subscriptionEnd, isLoading, createSubscription, openCustomerPortal } = useSubscription();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to our premium service.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSubscription();
    } catch (error) {
      console.error("Subscription error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Subscription Error",
        description: `Failed to create subscription: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Portal Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  

  if (subscribed) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-primary">
            <Crown className="h-5 w-5" />
            Premium Member
          </CardTitle>
          <CardDescription>
            You have unlimited access to all features
            {subscriptionEnd && (
              <div className="text-sm text-muted-foreground mt-1">
                Renews: {new Date(subscriptionEnd).toLocaleDateString()}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-primary">Upgrade to Premium</CardTitle>
        <CardDescription>
          Get unlimited resume optimizations and downloads for just $14.99/month
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          <div>✅ Unlimited resume optimizations</div>
          <div>✅ Unlimited downloads</div>
          <div>✅ Priority support</div>
        </div>
        {!user ? (
          <AuthModal 
            trigger={
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Sign in to Subscribe
              </Button>
            }
          />
        ) : (
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe for $14.99/month
          </Button>
        )}
      </CardContent>
    </Card>
  );
};