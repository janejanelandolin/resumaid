
import { Sparkle } from 'lucide-react';

interface PageHeaderProps {
  jobTitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ jobTitle }) => {
  return (
    <div className="space-y-2 text-center relative">
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Analysis Results
      </h1>
      <p className="text-sm text-muted-foreground">
        For: <span className="font-medium text-primary">{jobTitle}</span>
      </p>
    </div>
  );
};

export default PageHeader;
