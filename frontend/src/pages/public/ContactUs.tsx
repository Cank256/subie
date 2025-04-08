
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "We've received your message and will respond soon!",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions, feedback, or need assistance? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="How can we help you?" 
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Please describe your issue or question in detail..." 
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:support@subie.com" className="hover:underline">
                        support@subie.com
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      For general inquiries and support
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="tel:+15551234567" className="hover:underline">
                        +1 (555) 123-4567
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monday-Friday, 9AM-5PM PT
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Subscription Avenue<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday-Friday: 9AM-5PM PT<br />
                      Saturday-Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">How do I cancel a subscription?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can cancel a subscription from your dashboard by selecting the subscription and clicking the "Cancel" button.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">How do I update my payment method?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to "Billing" in your account settings to update your payment methods.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Can I export my subscription data?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Yes, you can export your data in CSV format from the "Settings" page.
                  </p>
                </div>
                
                <Button variant="link" className="px-0 text-primary" onClick={() => window.location.href = '/help'}>
                  View all FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
