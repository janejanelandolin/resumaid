
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/PageContainer';
import { CheckCircle, CreditCard, Apple as AppleIcon, Settings } from 'lucide-react';
import { paymentService, PaymentMethod, plans } from '@/services/paymentService';
import PaymentConfig from '@/components/PaymentConfig';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobTitle } = useResumeContext();
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // Add validation for card details if card payment method is selected
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        toast({
          title: "Error",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Process payment using our payment service
      const paymentResult = await paymentService.processPayment(
        selectedPlan,
        email,
        paymentMethod,
        paymentMethod === 'card' ? { cardNumber, expiry, cvc } : undefined
      );
      
      toast({
        title: "Payment Successful",
        description: "Your optimized resume is ready!",
      });
      
      navigate('/success');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred processing your payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const config = paymentService.getConfig();
  const availablePlans = paymentService.getPlans();

  const calculateTotal = () => {
    const plan = availablePlans.find(p => p.id === selectedPlan);
    if (!plan) return '$0.00';
    
    const basePrice = plan.price;
    const fee = config.processingFee;
    const tax = basePrice * config.taxRate;
    const total = basePrice + fee + tax;
    
    return `$${total.toFixed(2)}`;
  };

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {showConfig ? (
          <PaymentConfig onClose={() => setShowConfig(false)} />
        ) : (
          <>
            <div className="space-y-2 text-center relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowConfig(true)}
                title="Payment Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
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
                  {availablePlans.map(plan => (
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
                          <span className="text-lg font-bold">${plan.price.toFixed(2)}</span>
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
                  <div className="grid grid-cols-3 gap-2">
                    {config.supportedMethods.includes('card') && (
                      <Button
                        type="button"
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        className="h-14 flex flex-col items-center justify-center"
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">Card</span>
                      </Button>
                    )}
                    
                    {config.supportedMethods.includes('apple') && (
                      <Button
                        type="button"
                        variant={paymentMethod === 'apple' ? 'default' : 'outline'}
                        className="h-14 flex flex-col items-center justify-center"
                        onClick={() => setPaymentMethod('apple')}
                      >
                        <AppleIcon className="h-5 w-5 mb-1" />
                        <span className="text-xs">Apple</span>
                      </Button>
                    )}
                    
                    {config.supportedMethods.includes('google') && (
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
                    )}
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-md p-4 mt-6">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>${availablePlans.find(p => p.id === selectedPlan)?.price.toFixed(2) || '0.00'}</span>
                    </div>
                    {config.processingFee > 0 && (
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span>${config.processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {config.taxRate > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${(availablePlans.find(p => p.id === selectedPlan)?.price || 0 * config.taxRate).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ${calculateTotal()}`}
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>Your information is secure and encrypted</p>
                {config.testMode && (
                  <p className="mt-1 text-amber-600">Test mode is enabled. No real payments will be processed.</p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default PaymentPage;
