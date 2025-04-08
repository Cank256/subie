
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X, Plus } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
import useAuth from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
  onAddSubscription?: () => void;
}

const MobileMenu = ({ isOpen, isAuthenticated, onClose, onAddSubscription }: MobileMenuProps) => {
  const { logout } = useAuth();
  
  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-background/90">
      <div className="flex justify-between items-center p-4 border-b">
        <Link to="/" className="text-xl font-bold" onClick={onClose}>Subie</Link>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="p-4 flex flex-col space-y-4">
        {isAuthenticated ? (
          <>
            <Link className="text-lg py-2 border-b border-border" to="/dashboard" onClick={onClose}>Dashboard</Link>
            <Link className="text-lg py-2 border-b border-border" to="/subscriptions" onClick={onClose}>Subscriptions</Link>
            <Link className="text-lg py-2 border-b border-border" to="/billing" onClick={onClose}>Billing</Link>
            <Link className="text-lg py-2 border-b border-border" to="/profile" onClick={onClose}>Profile</Link>
            <Link className="text-lg py-2 border-b border-border" to="/help" onClick={onClose}>Help</Link>
            <Link className="text-lg py-2 border-b border-border" to="/contact" onClick={onClose}>Contact</Link>
            
            {onAddSubscription && (
              <Button 
                className="mt-4 w-full"
                variant="default"
                onClick={() => {
                  onAddSubscription();
                  onClose();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            )}
            
            <Button 
              className="mt-4 w-full" 
              variant="destructive"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link className="text-lg py-2 border-b border-border" to="/" onClick={onClose}>Home</Link>
            <Link className="text-lg py-2 border-b border-border" to="/about" onClick={onClose}>About Us</Link>
            <Link className="text-lg py-2 border-b border-border" to="/contact" onClick={onClose}>Contact</Link>
            <Link className="text-lg py-2 border-b border-border" to="/help" onClick={onClose}>Help</Link>
            
            <Link to="/login" onClick={onClose}>
              <Button className="w-full mt-4">Log In</Button>
            </Link>
            <Link to="/signup" onClick={onClose}>
              <Button className="w-full mt-2" variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
