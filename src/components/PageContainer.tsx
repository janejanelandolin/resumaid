
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto ${className}`}>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
