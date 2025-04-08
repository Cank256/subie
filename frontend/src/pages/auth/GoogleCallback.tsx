import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { setOpenAPIToken } from "@/client/core/OpenAPI";
import { Loader2 } from 'lucide-react';
import { UsersService } from '@/client/sdk.gen';
import useAuth from '@/hooks/useAuth';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { logUserSession } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access token from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        
        if (!accessToken) {
          throw new Error('No access token found in the URL');
        }
        
        // Store the token in localStorage
        localStorage.setItem('subie-token', accessToken);
        
        // Set the token for API requests
        setOpenAPIToken(accessToken);

        const userData = await UsersService.readUserProfile();
    
        if (userData && userData.id) {
          await logUserSession(userData.id);
        }

        navigate("/dashboard");

        toast({
          title: "Logged in successfully",
          description: "You are succesfully logged in.",
        })
        
      } catch (err) {
        console.error('Error handling Google callback:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Failed to complete Google login. Please try again.",
        });
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    
    handleCallback();
  }, [navigate, toast, logUserSession]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-destructive mb-4">Error: {error}</div>
        <p className="text-muted-foreground">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Completing Google login...</p>
    </div>
  );
};

export default GoogleCallback; 