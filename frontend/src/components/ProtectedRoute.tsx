
import { Navigate } from 'react-router-dom';
import useAuth  from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { applyTheme } from '@/utils/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Load user preferences when the user is authenticated
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user && !isLoading) {
        if (user.preferences) {
          // Apply the user's theme preference
          applyTheme(user.preferences?.theme || 'system');
        } else {
          // Apply a default theme if user preferences are not set
          applyTheme('system');
        }
      }
    };

    loadUserPreferences();
  }, [user, isLoading]);

  // Show improved loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
