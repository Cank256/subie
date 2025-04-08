import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoginService } from '@/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setError('Invalid confirmation link');
        setIsLoading(false);
        return;
      }

      try {
        await LoginService.confirmEmail({ token });
        setIsConfirmed(true);
        toast({
          title: 'Email confirmed',
          description: 'Your email has been successfully confirmed. You can now log in.',
        });
      } catch (err) {
        console.error('Error confirming email:', err);
        setError('Failed to confirm email. The link may be expired or invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [token, toast]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Email Confirmation</h1>
              <p className="text-muted-foreground mt-2">
                {isLoading ? 'Confirming your email...' : 'Email confirmation status'}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Please wait while we confirm your email...</p>
                </div>
              ) : isConfirmed ? (
                <Alert className="mb-6">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your email has been successfully confirmed. You can now log in to your account.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                {isConfirmed ? 'Go to Login' : 'Back to Login'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmEmail; 