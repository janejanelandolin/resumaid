
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PayPopupPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/download')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Download
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-600">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Pay to download your optimized resume as a Word document</p>
        </div>
        
        <div className="text-center">
          <div 
            dangerouslySetInnerHTML={{
              __html: `
                <script async src="https://js.stripe.com/v3/buy-button.js"></script>
                <stripe-buy-button
                  buy-button-id="buy_btn_1RbQMwQOfmy5vWZJTsFkcxKA"
                  publishable-key="pk_test_51RbPMLQOfmy5vWZJAHdDadRVDL0dYOA7J6QuvvPX8nONpeOn7Dw9ZTDItMGhs1qloBVHUNmGruxGLKqdlZNNBEpg00TAYRO9Sg"
                >
                </stripe-buy-button>
              `
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default PayPopupPage;
