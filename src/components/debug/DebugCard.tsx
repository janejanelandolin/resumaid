
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DebugCardProps {
  title: string;
  description: string;
  data: any;
  isAvailable: boolean;
  availableText?: string;
  notAvailableText?: string;
  renderContent?: (data: any) => React.ReactNode;
}

const DebugCard: React.FC<DebugCardProps> = ({
  title,
  description,
  data,
  isAvailable,
  availableText = "Available",
  notAvailableText = "Not Available",
  renderContent
}) => {
  // Format JSON for display with proper indentation
  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error formatting data';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant={isAvailable ? "default" : "outline"}>
            {isAvailable ? availableText : notAvailableText}
          </Badge>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <pre className="text-xs font-mono whitespace-pre">
            {renderContent 
              ? renderContent(data)
              : (isAvailable 
                  ? formatJSON(data) 
                  : notAvailableText)
            }
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DebugCard;
