
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, HelpCircle, Mail, Info } from 'lucide-react';

const UnauthenticatedNav = () => {
  const location = useLocation();

  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`} 
          to="/"
        >
          <span className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </span>
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/about' ? 'text-primary' : ''}`} 
          to="/about"
        >
          <span className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            About Us
          </span>
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/help' ? 'text-primary' : ''}`} 
          to="/help"
        >
          <span className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </span>
        </Link>
        <Link 
          className={`text-sm font-medium hover:text-primary/80 transition-colors ${location.pathname === '/contact' ? 'text-primary' : ''}`} 
          to="/contact"
        >
          <span className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Contact
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {location.pathname === '/login' ? (
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default UnauthenticatedNav;
