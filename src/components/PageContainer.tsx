
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto relative ${className}`}>
      {/* Decorative background elements for all pages */}
      <div className="absolute top-12 left-8 w-20 h-20 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-12 right-8 w-16 h-16 bg-indigo-300 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/3 right-4 w-10 h-10 bg-blue-200 rounded-full opacity-30 blur-md"></div>
      <div className="absolute bottom-1/4 left-4 w-12 h-12 bg-pink-200 rounded-full opacity-20 blur-lg"></div>
      
      <div className="w-full max-w-sm z-10">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
