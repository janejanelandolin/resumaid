
// Payment configuration types
export interface PaymentConfig {
  apiKey: string;
  supportedMethods: PaymentMethod[];
  processingFee: number;
  taxRate: number;
  testMode: boolean;
}

export type PaymentMethod = 'card' | 'apple' | 'google';

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  savings?: string;
}

// Default configuration
const defaultConfig: PaymentConfig = {
  apiKey: 'pk_test_demo123456789',
  supportedMethods: ['card', 'apple', 'google'],
  processingFee: 0.30,
  taxRate: 0.0,
  testMode: true,
};

// In a real app, this would be fetched from an API or environment variables
let paymentConfig: PaymentConfig = { ...defaultConfig };

export const plans: PaymentPlan[] = [
  { 
    id: 'single', 
    name: 'Single Resume', 
    price: 5.99, 
    description: 'Optimize one resume' 
  },
  { 
    id: 'bundle', 
    name: 'Resume Bundle', 
    price: 34.99, 
    description: 'Optimize up to 10 resumes', 
    savings: 'Save 42%' 
  }
];

// Payment service
export const paymentService = {
  // Get the payment configuration
  getConfig: () => paymentConfig,
  
  // Update the payment configuration
  updateConfig: (newConfig: Partial<PaymentConfig>) => {
    paymentConfig = { ...paymentConfig, ...newConfig };
    return paymentConfig;
  },
  
  // Reset to default configuration
  resetConfig: () => {
    paymentConfig = { ...defaultConfig };
    return paymentConfig;
  },
  
  // Get plans
  getPlans: () => plans,
  
  // Process a payment
  processPayment: async (planId: string, email: string, paymentMethod: PaymentMethod, cardDetails?: any) => {
    console.log(`Processing payment for plan: ${planId}, email: ${email}, method: ${paymentMethod}`);
    
    // Find the selected plan
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }
    
    // In a real app, this would call a payment gateway API
    return new Promise((resolve, reject) => {
      if (paymentConfig.testMode) {
        // In test mode, always succeed after a delay
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
            amount: plan.price,
            email,
            date: new Date().toISOString(),
          });
        }, 1500);
      } else {
        // In production mode, this would integrate with a real payment gateway
        // For now, we'll simulate a successful payment
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate
            resolve({
              success: true,
              transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
              amount: plan.price,
              email,
              date: new Date().toISOString(),
            });
          } else {
            reject(new Error('Payment processing failed. Please try again.'));
          }
        }, 1500);
      }
    });
  }
};
