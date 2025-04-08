import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileMenu from '../ProfileMenu';
import useAuth from '@/hooks/useAuth';

interface AuthenticatedNavProps {
  onAddSubscription?: () => void;
  onToggleSearch: () => void;
}

const AuthenticatedNav = ({ 
  onAddSubscription, 
  onToggleSearch
}: AuthenticatedNavProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';
  const { user } = useAuth();

  // Ensure user is loaded before showing components that depend on it
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`} 
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/subscriptions' ? 'text-primary' : ''}`} 
          to="/subscriptions"
        >
          Subscriptions
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/billing' ? 'text-primary' : ''}`} 
          to="/billing"
        >
          Billing
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/help' ? 'text-primary' : ''}`} 
          to="/help"
        >
          Help
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isHomePage && onAddSubscription && (
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            onClick={onAddSubscription}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        
        <NotificationsDropdown />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="hidden md:flex"
          onClick={onToggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <ProfileMenu />
      </div>
    </>
  );
};

export default AuthenticatedNav;
