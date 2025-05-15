
import { useState, useEffect } from 'react';

interface AppVersionState {
  freeVersion: boolean;
  debugMode: boolean;
}

export const useAppVersion = () => {
  const [appVersion, setAppVersion] = useState<AppVersionState>({
    freeVersion: true,
    debugMode: false
  });

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('adminConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setAppVersion({
          freeVersion: config.freeVersion ?? true,
          debugMode: config.debugMode ?? false
        });
      } catch (e) {
        console.error('Failed to parse admin config:', e);
      }
    }
  }, []);

  // Check if features are enabled based on app version
  const isFeatureEnabled = (feature: 'payment' | 'templates' | 'download' | 'analytics' | string): boolean => {
    // List of premium features that are disabled in free version
    const premiumFeatures = ['payment', 'templates', 'download', 'analytics'];
    
    // If we're in paid version, all features are enabled
    if (!appVersion.freeVersion) {
      return true;
    }
    
    // If in free version, only non-premium features are enabled
    return !premiumFeatures.includes(feature);
  };

  return {
    isFreeVersion: appVersion.freeVersion,
    isDebugMode: appVersion.debugMode,
    isFeatureEnabled
  };
};

export default useAppVersion;
