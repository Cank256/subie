
import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Search, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Video, 
  MessageSquare, 
  ChevronRight, 
  Mail, 
  CreditCard, 
  User,
  PlusCircle,
  MinusCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type FAQItem = {
  question: string;
  answer: string;
};

type CategoryItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  const helpCategories: CategoryItem[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Learn the basics of Subie and how to set up your account'
    },
    {
      id: 'subscriptions',
      title: 'Managing Subscriptions',
      icon: <FileText className="h-5 w-5" />,
      description: 'Add, edit, and track your subscription services'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Understand billing cycles and payment options'
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: <User className="h-5 w-5" />,
      description: 'Manage your profile, security, and notifications'
    },
    {
      id: 'tutorials',
      title: 'Video Tutorials',
      icon: <Video className="h-5 w-5" />,
      description: 'Watch step-by-step guides to using Subie'
    },
    {
      id: 'contact',
      title: 'Contact Support',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Get in touch with our support team'
    }
  ];
  
  const popularFAQs: FAQItem[] = [
    {
      question: 'How do I add a new subscription?',
      answer: 'To add a new subscription, click on the "+ Add Subscription" button on your dashboard. Fill in the subscription details like name, amount, and billing cycle, then click "Add Subscription" to save it to your account.'
    },
    {
      question: 'Can I track different billing cycles?',
      answer: 'Yes, Subie supports different billing cycles including weekly, monthly, quarterly, and yearly subscriptions. When adding or editing a subscription, simply select the appropriate billing cycle from the dropdown menu.'
    },
    {
      question: 'How do I set up payment reminders?',
      answer: 'Payment reminders are automatically set up for all your active subscriptions. You can customize your notification preferences in your profile settings under the "Notifications" tab to receive reminders via email, push notifications, or SMS.'
    },
    {
      question: 'How do I cancel my Subie subscription?',
      answer: 'To cancel your Subie subscription, go to "Billing" in your account settings, and click on "Cancel Plan". Follow the prompts to complete the cancellation process. Note that you can still access your account until the end of your current billing period.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we take security very seriously. All payment information is encrypted using industry-standard protocols. We do not store your full credit card details on our servers. Instead, we use a secure tokenization system through our payment processor.'
    },
    {
      question: 'Can I export my subscription data?',
      answer: 'Yes, you can export your subscription data in CSV format. Go to your account settings, navigate to the "Data & Privacy" section, and click on "Export Data". You\'ll receive a file containing all your subscription information.'
    }
  ];
  
  const toggleFAQ = (question: string) => {
    if (expandedFAQ === question) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(question);
    }
  };
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery 
    ? popularFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularFAQs;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions and learn how to get the most out of Subie
          </p>
          
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, and more..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {helpCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {category.icon}
                  </div>
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="group w-full justify-between">
                  Browse Articles
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Frequently Asked Questions
          </h2>
          
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left bg-card hover:bg-muted/50 transition-colors"
                    onClick={() => toggleFAQ(faq.question)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFAQ === faq.question ? (
                      <MinusCircle className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <PlusCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  {expandedFAQ === faq.question && (
                    <div className="p-4 bg-muted/30 border-t">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No results found for "{searchQuery}". Try a different search term or browse our help categories.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
        
        {/* Still Need Help */}
        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-lg p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => window.location.href = '/contact'}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button 
              className="flex items-center"
              onClick={() => window.location.href = 'mailto:support@subie.com'}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Us
            </Button>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="mt-16 mb-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start text-muted-foreground hover:text-foreground">
              Getting Started Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start text-muted-foreground hover:text-foreground">
              Subscription Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start text-muted-foreground hover:text-foreground">
              Billing & Payments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
