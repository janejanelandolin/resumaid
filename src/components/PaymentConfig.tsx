
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

interface PaymentConfigProps {
  onClose: () => void;
}

type PaymentMethod = 'card' | 'apple' | 'google';

interface PaymentConfig {
  apiKey: string;
  supportedMethods: PaymentMethod[];
  processingFee: number;
  taxRate: number;
  testMode: boolean;
}

const PaymentConfig: React.FC<PaymentConfigProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PaymentConfig>({
    apiKey: '',
    supportedMethods: ['card'],
    processingFee: 0,
    taxRate: 0,
    testMode: true
  });
  
  const handleMethodToggle = (method: PaymentMethod) => {
    const newMethods = config.supportedMethods.includes(method)
      ? config.supportedMethods.filter(m => m !== method)
      : [...config.supportedMethods, method];
    
    setConfig({
      ...config,
      supportedMethods: newMethods
    });
  };

  const handleSave = () => {
    // Save config to localStorage for now
    localStorage.setItem('paymentConfig', JSON.stringify(config));
    toast({
      title: "Configuration Updated",
      description: "Payment settings have been saved successfully.",
    });
    onClose();
  };

  const handleReset = () => {
    const defaultConfig: PaymentConfig = {
      apiKey: '',
      supportedMethods: ['card'],
      processingFee: 0,
      taxRate: 0,
      testMode: true
    };
    setConfig(defaultConfig);
    toast({
      title: "Configuration Reset",
      description: "Payment settings have been reset to defaults.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Payment Configuration
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input 
            id="apiKey" 
            value={config.apiKey} 
            onChange={(e) => setConfig({...config, apiKey: e.target.value})}
            placeholder="Enter your payment gateway API key"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Supported Payment Methods</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="method-card"
                checked={config.supportedMethods.includes('card')}
                onCheckedChange={() => handleMethodToggle('card')}
              />
              <Label htmlFor="method-card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="method-apple"
                checked={config.supportedMethods.includes('apple')}
                onCheckedChange={() => handleMethodToggle('apple')}
              />
              <Label htmlFor="method-apple">Apple Pay</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="method-google"
                checked={config.supportedMethods.includes('google')}
                onCheckedChange={() => handleMethodToggle('google')}
              />
              <Label htmlFor="method-google">Google Pay</Label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="processingFee">Processing Fee ($)</Label>
            <Input 
              id="processingFee" 
              type="number"
              min="0"
              step="0.01"
              value={config.processingFee} 
              onChange={(e) => setConfig({...config, processingFee: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input 
              id="taxRate" 
              type="number"
              min="0"
              step="0.1"
              value={config.taxRate * 100} 
              onChange={(e) => setConfig({...config, taxRate: (parseFloat(e.target.value) || 0) / 100})}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="testMode"
            checked={config.testMode}
            onCheckedChange={(checked) => setConfig({...config, testMode: !!checked})}
          />
          <Label htmlFor="testMode">Test Mode</Label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfig;
