
import { useState } from 'react';
import Navbar from './Navbar';
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Heart, 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onAddSubscription?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onAddSubscription }) => {
  const [year] = useState(new Date().getFullYear());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header>
        <Navbar onAddSubscription={onAddSubscription} />
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-background border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Subie</h3>
              <p className="text-muted-foreground text-sm">
                Simplify your subscription management and take control of your recurring expenses.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/responsible-spending" className="text-muted-foreground hover:text-foreground transition-colors">
                    Responsible Spending
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect With Us</h4>
              <div className="flex items-center space-x-4 mb-4">
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                &copy; {year} Subie. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
