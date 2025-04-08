
import Layout from '@/components/Layout';
import { 
  AlertTriangle, 
  DollarSign, 
  LineChart, 
  Users, 
  BellRing, 
  Calculator, 
  Calendar, 
  List, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResponsibleSpending = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Responsible Spending</h1>
          <p className="text-muted-foreground text-lg">
            At Subie, we're committed to helping you manage your subscriptions responsibly. 
            Here are some guidelines and tools to help you avoid subscription overload and maintain financial health.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1: Understanding Subscription Fatigue */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Understanding Subscription Fatigue
            </h2>
            <p className="text-muted-foreground mb-6">
              "Subscription fatigue" happens when you're overwhelmed by too many subscription services, 
              leading to overspending and underutilization. Here's how to recognize the signs:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warning Signs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    You don't remember all the services you're subscribed to
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    You regularly see charges for services you don't use
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Your monthly subscription costs exceed 10% of your discretionary spending
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    You feel anxious about your recurring payments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    Financial strain and budget disruption
                  </p>
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    Stress and anxiety about money
                  </p>
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    Wasted resources on unused services
                  </p>
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    Difficulty saving for important financial goals
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Section 2: Best Practices */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Best Practices for Subscription Management
            </h2>
            <p className="text-muted-foreground mb-6">
              Follow these guidelines to maintain a healthy relationship with your subscription services:
            </p>
            
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-primary" />
                  Set a Subscription Budget
                </h3>
                <p className="text-muted-foreground mb-2">
                  Determine a realistic monthly budget for all your subscription services. Financial experts recommend keeping subscriptions below 5-10% of your monthly income.
                </p>
                <Button variant="link" className="text-primary p-0">
                  Use our Budget Calculator
                </Button>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Regular Subscription Audits
                </h3>
                <p className="text-muted-foreground mb-2">
                  Schedule quarterly reviews of all your active subscriptions. Ask yourself if you're getting value from each service relative to its cost.
                </p>
                <Button variant="link" className="text-primary p-0">
                  Schedule Your Next Audit
                </Button>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <List className="mr-2 h-5 w-5 text-primary" />
                  Prioritize Your Subscriptions
                </h3>
                <p className="text-muted-foreground">
                  Categorize your subscriptions as "essential," "valuable," and "nice-to-have." When you need to cut back, start with the "nice-to-have" category.
                </p>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-primary" />
                  Leverage Free Tiers and Trials Responsibly
                </h3>
                <p className="text-muted-foreground">
                  Take advantage of free tiers and trials, but set calendar reminders to decide whether to continue with paid plans before the trial ends.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 3: How Subie Helps */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              How Subie Helps You Spend Responsibly
            </h2>
            <p className="text-muted-foreground mb-6">
              We've built tools specifically designed to promote healthy subscription habits:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="mr-2 h-5 w-5 text-primary" />
                    Smart Reminders
                  </CardTitle>
                  <CardDescription>
                    Notifications before subscription renewals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Subie sends you timely reminders before any subscription renews, giving you time to decide if you want to continue the service.
                  </p>
                  <Button variant="link" className="text-primary p-0 mt-2 flex items-center">
                    Set Up Reminders <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Shared Subscriptions
                  </CardTitle>
                  <CardDescription>
                    Save money by sharing with family or friends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Identify opportunities to share subscription costs with family members or friends for services that offer multi-user plans.
                  </p>
                  <Button variant="link" className="text-primary p-0 mt-2 flex items-center">
                    Explore Sharing Options <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Resources Section */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <p className="text-muted-foreground mb-6">
              Looking for more guidance on financial wellness and responsible spending? 
              Check out these valuable resources:
            </p>
            
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Guide: Creating a Personal Subscription Budget
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Worksheet: Evaluating Subscription Value
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Article: The Psychology of Subscription Spending
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Calculator: Subscription Savings Potential
                </a>
              </li>
            </ul>
          </section>
          
          {/* Help Section */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you're struggling with subscription management or need personalized advice,
              our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/help">Visit Help Center</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ResponsibleSpending;
