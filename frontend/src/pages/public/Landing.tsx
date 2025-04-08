
import { Link } from 'react-router-dom';
import { ChevronRight, Check, ArrowRight, BarChart3, Calendar, Bell, CreditCard, Shield, Gift } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Take Control of Your <span className="text-primary">Subscriptions</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Subie helps you track, manage, and optimize all your subscription services in one place. Never miss a payment or overpay for unused services again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    Log In
                  </Link>
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground pt-2">
                <Check className="mr-2 h-4 w-4 text-primary" />
                No credit card required
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
                alt="Person managing subscriptions" 
                className="rounded-xl shadow-2xl relative z-10 mx-auto" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Subscriptions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Subie gives you powerful tools to track, analyze, and optimize your subscription spending
          </p>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Spending Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Get visual breakdowns of your subscription spending by category, service, and time period.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Payment Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Never miss a payment with automatic tracking of all your subscription billing dates.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Reminders</h3>
              <p className="text-muted-foreground mb-4">
                Get timely notifications before renewals so you can decide whether to keep or cancel services.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Currency Support</h3>
              <p className="text-muted-foreground mb-4">
                Track subscriptions in multiple currencies with automatic conversion to your preferred currency.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Data</h3>
              <p className="text-muted-foreground mb-4">
                Your subscription and payment information is always encrypted and protected with bank-level security.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Savings Recommendations</h3>
              <p className="text-muted-foreground mb-4">
                Get personalized suggestions to optimize your subscriptions and reduce unnecessary spending.
              </p>
              <Link to="/signup" className="text-primary flex items-center text-sm font-medium hover:underline">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are saving money and taking control of their subscriptions with Subie
          </p>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Subie helped me discover I was spending over $200 monthly on services I barely used. I've now optimized my subscriptions and saved 30% on monthly expenses."
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">SJ</span>
                </div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Financial Advisor</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a financial advisor, I recommend Subie to all my clients. It's the easiest way to gain visibility into recurring expenses and take control of your financial health."
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">MT</span>
                </div>
                <div>
                  <h4 className="font-medium">Michael Thompson</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The interface is clean and intuitive. I've tried several subscription trackers, and Subie is by far the best. The reminder system has saved me from unwanted charges multiple times."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl bg-primary/5 border border-primary/20 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who are saving money and taking control of their subscriptions with Subie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started For Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">
                Log In
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            No credit card required. Free plan includes up to 10 subscriptions.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/responsible-spending" className="text-muted-foreground hover:text-foreground transition-colors">
                    Responsible Spending
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect With Us</h4>
              <div className="flex items-center space-x-4 mb-4">
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Subie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
