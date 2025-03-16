
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

// Transaction interface for payment results
export interface PaymentTransaction {
  success: boolean;
  transactionId: string;
  amount: number;
  email: string;
  date: string;
  method: PaymentMethod;
  last4?: string;
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

// Transaction history - in a real app, this would be stored in a database
const transactions: PaymentTransaction[] = [];

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

// Simulated payment gateway API
class PaymentGateway {
  private apiKey: string;
  private testMode: boolean;

  constructor(apiKey: string, testMode: boolean) {
    this.apiKey = apiKey;
    this.testMode = testMode;
  }

  // Validate credit card using Luhn algorithm
  private validateCard(cardNumber: string): boolean {
    // Remove all non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let double = false;
    
    // Start from the right
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      double = !double;
    }
    
    return sum % 10 === 0;
  }

  // Basic expiry date validation (MM/YY format)
  private validateExpiry(expiry: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) {
      return false;
    }
    
    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr);
    const year = parseInt('20' + yearStr);
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    return year > currentYear || (year === currentYear && month >= currentMonth);
  }

  // Charge a payment method
  async charge(params: {
    amount: number;
    currency: string;
    email: string;
    method: PaymentMethod;
    cardDetails?: {
      number: string;
      expiry: string;
      cvc: string;
    };
  }): Promise<PaymentTransaction> {
    console.log(`Processing payment via gateway: ${params.amount} ${params.currency} via ${params.method}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!this.apiKey) {
      throw new Error('Invalid API key');
    }
    
    // In test mode, we'll accept any payment but still validate card details if provided
    if (params.method === 'card' && params.cardDetails) {
      const { number, expiry, cvc } = params.cardDetails;
      
      // Validation in test mode is optional but provides a more realistic experience
      if (!this.testMode) {
        if (!this.validateCard(number)) {
          throw new Error('Invalid card number');
        }
        
        if (!this.validateExpiry(expiry)) {
          throw new Error('Card expired or invalid expiry date');
        }
        
        if (!/^\d{3,4}$/.test(cvc)) {
          throw new Error('Invalid CVC code');
        }
      }
    }
    
    // In a real gateway, different logic would apply for each payment method
    let success = true;
    if (!this.testMode) {
      // Simulate occasional failures in production mode
      success = Math.random() > 0.1;
    }
    
    if (!success) {
      throw new Error('Payment processing failed');
    }
    
    // Create transaction record
    const transaction: PaymentTransaction = {
      success: true,
      transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
      amount: params.amount,
      email: params.email,
      method: params.method,
      date: new Date().toISOString(),
      // If it's a card payment, add the last 4 digits
      ...(params.method === 'card' && params.cardDetails 
        ? { last4: params.cardDetails.number.replace(/\D/g, '').slice(-4) } 
        : {})
    };
    
    return transaction;
  }
}

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
  
  // Get transaction history
  getTransactions: () => transactions,
  
  // Calculate total price with fees and taxes
  calculateTotal: (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 0;
    
    const basePrice = plan.price;
    const fee = paymentConfig.processingFee;
    const tax = basePrice * paymentConfig.taxRate;
    return basePrice + fee + tax;
  },
  
  // Process a payment
  processPayment: async (
    planId: string, 
    email: string, 
    paymentMethod: PaymentMethod, 
    cardDetails?: { 
      cardNumber: string, 
      expiry: string, 
      cvc: string 
    }
  ) => {
    // Find the selected plan
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }
    
    // Calculate total with fees and taxes
    const total = paymentService.calculateTotal(planId);
    
    // Initialize payment gateway with current config
    const gateway = new PaymentGateway(paymentConfig.apiKey, paymentConfig.testMode);
    
    try {
      // Process the payment through the gateway
      const transaction = await gateway.charge({
        amount: total,
        currency: 'USD',
        email,
        method: paymentMethod,
        ...(paymentMethod === 'card' && cardDetails ? {
          cardDetails: {
            number: cardDetails.cardNumber,
            expiry: cardDetails.expiry,
            cvc: cardDetails.cvc
          }
        } : {})
      });
      
      // Store transaction in history
      transactions.push(transaction);
      
      return transaction;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
};
