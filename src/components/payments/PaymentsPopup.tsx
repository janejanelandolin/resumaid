
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface PaymentsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentsPopup: React.FC<PaymentsPopupProps> = ({ isOpen, onClose }) => {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stripeUrl = "https://buy.stripe.com/test_aFafZj3NLdPKdWL3KVgbm00";

  const handleIframeLoad = () => {
    console.log('Stripe iframe loaded successfully');
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    console.error('Stripe iframe failed to load');
    setIframeError(true);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIframeError(false);
    setIsLoading(true);
    // Force iframe refresh by adding timestamp
    const iframe = document.querySelector('#stripe-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `${stripeUrl}?t=${Date.now()}`;
    }
  };

  const handleOpenInNewTab = () => {
    window.open(stripeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-purple-600">
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Secure payment processing powered by Stripe
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-gray-600">Loading payment form...</p>
              </div>
            </div>
          )}
          
          {iframeError ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Form Unavailable
                </h3>
                <p className="text-gray-600 mb-4">
                  Unable to load the payment form. This could be due to:
                </p>
                <ul className="text-sm text-gray-500 mb-6 text-left max-w-md">
                  <li>• Stripe domain restrictions</li>
                  <li>• Network connectivity issues</li>
                  <li>• Browser security settings</li>
                  <li>• Stripe account configuration</li>
                </ul>
                <div className="space-y-2">
                  <Button onClick={handleRefresh} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={handleOpenInNewTab} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              id="stripe-iframe"
              src={stripeUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Stripe Checkout"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation"
              allow="payment"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentsPopup;
