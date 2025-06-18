import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentLink }) => {
  const handlePayment = () => {
    // Open Stripe payment link in a new tab
    window.open(paymentLink, '_blank');
    // Keep modal open so user can return after payment
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-purple-600">Complete Your Purchase</DialogTitle>
          <DialogDescription className="text-center">
            Pay to download your optimized resume as a Word document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You'll be redirected to Stripe's secure checkout page
            </p>
            
            <Button 
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              One Optimized Resume $4.99
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            <p>After payment, return to this page and your download will begin automatically.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
