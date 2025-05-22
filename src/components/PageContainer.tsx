
import React, { ReactNode } from 'react';
import AdminFooter from './AdminFooter';

interface PageContainerProps {
  children: ReactNode;
  centerX?: boolean; // Center horizontally
  centerY?: boolean; // Center vertically
  className?: string; // Additional classes
  showFooter?: boolean; // Whether to show the footer
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  centerX = true, 
  centerY = false, 
  className = '',
  showFooter = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className={`container mx-auto px-4 py-8 flex-1 ${
          centerX ? 'flex justify-center' : ''
        } ${
          centerY ? 'items-center' : ''
        } ${className}`}
      >
        <div className={`w-full ${centerX ? 'max-w-6xl' : ''}`}>
          {children}
        </div>
      </div>
      {showFooter && <AdminFooter />}
    </div>
  );
};

export default PageContainer;
