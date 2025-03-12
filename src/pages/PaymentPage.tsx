
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toast';
import PageContainer from '@/components/PageContainer';
import { CheckCircle, CreditCard, AppleIcon, Paypal } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle } = useResumeContext();
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const plans = [
    { id: 'single', name: 'Single Resume', price: '$5.99', description: 'Optimize one resume' },
    { id: 'bundle', name: 'Resume Bundle', price: '$34.99', description: 'Optimize up to 10 resumes', savings: 'Save 42%' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your optimized resume is ready!",
      });
      navigate('/success');
    }, 1500);
  };

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
          <p className="text-sm text-muted-foreground">
            Get your optimized resume for <span className="font-medium">{jobTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <RadioGroup 
              value={selectedPlan} 
              onValueChange={setSelectedPlan}
              className="gap-3"
            >
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`relative flex items-center rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={plan.id} 
                      className="block text-sm font-medium"
                    >
                      {plan.name}
                    </Label>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-bold">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {plan.description}
                      </span>
                    </div>
                    {plan.savings && (
                      <span className="text-xs font-medium text-green-600 mt-1 block">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  {selectedPlan === plan.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="h-14 flex flex-col items-center justify-center"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                  className="h-14 flex flex-col items-center justify-center"
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <Paypal className="h-5 w-5 mb-1" />
                  <span className="text-xs">PayPal</span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'apple' ? 'default' : 'outline'}
                  className="h-14 flex flex-col items-center justify-center"
                  onClick={() => setPaymentMethod('apple')}
                >
                  <AppleIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Apple</span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'google' ? 'default' : 'outline'}
                  className="h-14 flex flex-col items-center justify-center"
                  onClick={() => setPaymentMethod('google')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="mb-1"
                  >
                    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                    <path fill="currentColor" d="M15.5 8.5h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1zm-7 2h7v2h-7z" />
                  </svg>
                  <span className="text-xs">Google</span>
                </Button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="123" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${selectedPlan === 'single' ? '$5.99' : '$34.99'}`}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Your information is secure and encrypted</p>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default PaymentPage;
