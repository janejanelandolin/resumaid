
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveFeedbackToLocalStorage } from '@/services/logSessionService';
import { MessageSquare } from 'lucide-react';

interface FeedbackDialogProps {
  variant?: 'primary' | 'outline';
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ variant = 'primary' }) => {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (score === null) {
      toast({
        title: "Please select a score",
        description: "Please select how likely you are to recommend ResumAID.",
        variant: "destructive",
      });
      return;
    }

    // Save feedback to localStorage
    saveFeedbackToLocalStorage(score, comment);

    // Show success toast
    toast({
      title: "Thank you for your feedback",
      description: "Your feedback has been recorded.",
    });

    // Close dialog
    setOpen(false);

    // Reset form
    setScore(null);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant === 'outline' ? 'outline' : 'default'}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Leave Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve ResumAID by sharing your experience with us.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">
              How likely are you to recommend ResumAID.app to a friend?
            </label>
            <div className="flex flex-col space-y-3">
              <RadioGroup value={score?.toString()} onValueChange={(value) => setScore(parseInt(value))}>
                <div className="flex justify-between px-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div key={num} className="flex flex-col items-center gap-1">
                      <RadioGroupItem value={num.toString()} id={`r${num}`} className="cursor-pointer" />
                      <label htmlFor={`r${num}`} className="text-sm cursor-pointer">
                        {num}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex justify-between px-1 text-xs text-muted-foreground">
                <span>Not likely at all</span>
                <span>Very likely</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="font-medium text-sm">
              Any other feedback or suggestions?
            </label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
