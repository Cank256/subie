
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X} from 'lucide-react';
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthChangeEvent } from '@supabase/supabase-js';

interface NavbarProps {
  onAddSubscription?: () => void;
}

const Navbar = ({ onAddSubscription }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthStateChange = async (event: AuthChangeEvent) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        navigate('/');
      }
      if (event === 'USER_UPDATED') {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  const closeSearch = () => {
    setSearchActive(false);
  };

  // Check if user is authenticated using the AuthContext
  const isAuthenticated = !!user;
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

  // Close search when location changes
  useEffect(() => {
    closeSearch();
  }, [location]);

  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('isLoading:', isLoading);

  // If still isLoading auth state, show a simplified navbar to prevent flashing
  if (isLoading) {
    return (
      <nav className="bg-background border-b border-border py-4 sticky top-0 z-10 backdrop-blur-lg bg-opacity-80">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-primary">Subie</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background border-b border-border py-4 sticky top-0 z-10 backdrop-blur-lg bg-opacity-80">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Subie</span>
          </Link>
        </div>

        {/* Render navigation based on authentication status */}
        {isAuthenticated ? (
          <AuthenticatedNav 
            onAddSubscription={isHomePage ? onAddSubscription : undefined}
            onToggleSearch={toggleSearch}
          />
        ) : (
          <UnauthenticatedNav />
        )}

        {/* Mobile menu button - always shown */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay 
        isActive={searchActive} 
        onClose={closeSearch} 
      />

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isAuthenticated={isAuthenticated}
        onClose={toggleMenu}
        onAddSubscription={isHomePage ? onAddSubscription : undefined}
      />
    </nav>
  );
};

export default Navbar;
