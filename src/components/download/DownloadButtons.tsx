
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Loader2, CreditCard, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { ResumeJson } from '@/types/resume';
import { useSubscription } from '@/hooks/useSubscription';
import { useOneTimePayment } from '@/hooks/useOneTimePayment';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

interface DownloadButtonsProps {
  resume: ResumeJson;
  jobTitle: string | undefined;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ resume, jobTitle }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscribed, createSubscription, isLoading: subLoading } = useSubscription();
  const { isPaid, isCreatingCheckout, isVerifying, createCheckout } = useOneTimePayment();
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDownload = subscribed || isPaid;

  const handleActualDownload = async () => {
    if (!resume) return;
    try {
      setIsDownloadingDocx(true);
      setError(null);
      const formattedTitle = jobTitle ? jobTitle.replace(/\s+/g, '-').toLowerCase() : 'my-resume';
      const response = await apiService.downloadResumeAsDocx(resume, jobTitle || '');
      if (response.error) throw new Error(response.error);
      if (response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimised-resume-${formattedTitle}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast({ title: 'Downloaded!', description: 'Your optimised resume is ready.' });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      toast({ title: 'Download failed', description: msg, variant: 'destructive' });
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await createSubscription();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Subscription error', description: msg, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-purple-100 shadow-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-purple-700 text-lg">Download your optimised resume</CardTitle>
        <CardDescription>Get your tailored resume in Word format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* ── Subscribed OR paid for this session ── */}
        {canDownload && (
          <>
            {subscribed && (
              <p className="text-xs text-center text-emerald-600 font-medium">
                ✓ Premium member — unlimited downloads
              </p>
            )}
            {!subscribed && isPaid && (
              <p className="text-xs text-center text-indigo-600 font-medium">
                ✓ Payment confirmed — your download is unlocked
              </p>
            )}
            <Button
              onClick={handleActualDownload}
              disabled={isDownloadingDocx || isVerifying}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isDownloadingDocx ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing document…</>
              ) : (
                <><FileDown className="mr-2 h-4 w-4" /> Download in Word (.docx)</>
              )}
            </Button>
          </>
        )}

        {/* ── Not paid ── */}
        {!canDownload && (
          <>
            {/* $1.99 one-time option */}
            <Button
              onClick={createCheckout}
              disabled={isCreatingCheckout || isVerifying}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isCreatingCheckout || isVerifying ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isVerifying ? 'Confirming payment…' : 'Redirecting to checkout…'}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Download this resume — $1.99</>
              )}
            </Button>
            <p className="text-xs text-center text-gray-400">No account required · one resume</p>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Subscription option */}
            {!user ? (
              <AuthModal
                onSuccess={handleSubscribe}
                trigger={
                  <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={subLoading}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe for $14.99/month
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={handleSubscribe}
                disabled={subLoading}
              >
                {subLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting subscription…</>
                  : <><CreditCard className="mr-2 h-4 w-4" /> Subscribe for $14.99/month</>
                }
              </Button>
            )}
            <p className="text-xs text-center text-gray-400">
              Unlimited resumes · Cover letters · Career Journey tracker
            </p>
          </>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <p className="font-medium">Download failed</p>
            <p className="mt-0.5 text-xs">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadButtons;
