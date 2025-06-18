
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaymentsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentsPopup: React.FC<PaymentsPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-purple-600">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0">
          <iframe
            src="https://buy.stripe.com/test_aFafZj3NLdPKdWL3KVgbm00"
            className="w-full h-full border-0 rounded-lg"
            title="Stripe Checkout"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentsPopup;
