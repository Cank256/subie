import { Link } from 'react-router-dom';
import { ChevronRight, PiggyBank, Heart, Shield, TrendingUp, BarChart3, Hand } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';

const AboutUs = () => {
  return (
    <Layout>
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Our Mission for <span className="text-primary">Financial Well-being</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              At Subie, we're committed to helping individuals take control of their finances 
              through better subscription management, promoting financial literacy, and 
              encouraging responsible spending habits.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Subie was founded in 2023 by a team of financial experts and technology enthusiasts who recognized a growing problem: the overwhelming number of subscription services that people were unknowingly paying for but not using.
              </p>
              <p className="text-muted-foreground mb-4">
                With the average person spending over $240 monthly on subscriptions, and nearly 12% of those going unused, we saw an opportunity to help people reclaim control of their spending and make more informed financial decisions.
              </p>
              <p className="text-muted-foreground">
                Our platform was designed from the ground up with a focus on transparency, simplicity, and empowerment—giving users the tools they need to understand their subscription spending and make conscious choices about where their money goes.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80" 
                alt="Team collaborating on financial solutions" 
                className="rounded-xl shadow-2xl relative z-10" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <PiggyBank className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Financial Empowerment</h3>
              <p className="text-muted-foreground">
                We believe everyone deserves to feel confident and in control of their finances. We provide tools and insights that empower users to make informed decisions.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sustainable Spending</h3>
              <p className="text-muted-foreground">
                We promote mindful consumption and help users build sustainable spending habits that align with their financial goals and priorities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency in financial matters. Our platform makes hidden costs visible and helps users understand exactly where their money is going.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Security & Privacy</h3>
              <p className="text-muted-foreground">
                We're committed to protecting our users' financial data with the highest standards of security while respecting their privacy at all times.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">User-Centered Design</h3>
              <p className="text-muted-foreground">
                Our platform is designed with users in mind, making financial management accessible and even enjoyable for everyone, regardless of their financial literacy.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Hand className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Social Responsibility</h3>
              <p className="text-muted-foreground">
                We're committed to promoting financial literacy and responsible spending practices that benefit individuals, families, and the broader community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Impact Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">$14.2M</h3>
              <p className="text-muted-foreground">Saved by our users on unnecessary subscriptions</p>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">65,000+</h3>
              <p className="text-muted-foreground">Users taking control of their subscription spending</p>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">28%</h3>
              <p className="text-muted-foreground">Average reduction in monthly subscription costs</p>
            </div>
          </div>
          
          <div className="bg-muted rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-3/4 mb-8 md:mb-0 md:pr-12">
                <h3 className="text-2xl font-bold mb-4">Financial Education Initiative</h3>
                <p className="text-muted-foreground mb-4">
                  Beyond our subscription management platform, we're committed to promoting financial literacy through our blog, webinars, and community workshops.
                </p>
                <p className="text-muted-foreground">
                  Our resources cover topics from budgeting basics to advanced subscription optimization strategies, helping people of all ages and backgrounds improve their financial well-being.
                </p>
              </div>
              <div className="md:w-1/4 flex justify-center">
                <Link to="/responsible-spending">
                  <Button size="lg" variant="outline" className="whitespace-nowrap">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're on a mission to help everyone achieve financial clarity and confidence. 
            Start your journey to better subscription management and financial wellness today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started For Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer - reusing existing footer structure */}
    </div>
    </Layout>
  );
};

export default AboutUs;
