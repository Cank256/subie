
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Home, 
  Users, 
  User, 
  HelpCircle, 
  AlertTriangle, 
  FileText, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Sitemap = () => {
  const siteLinks = [
    {
      title: "Main Pages",
      icon: <Home className="h-5 w-5" />,
      links: [
        { name: "Home", url: "/" },
        { name: "Dashboard", url: "/dashboard" },
        { name: "Subscriptions", url: "/subscriptions" },
        { name: "Billing", url: "/billing" },
      ]
    },
    {
      title: "Account",
      icon: <User className="h-5 w-5" />,
      links: [
        { name: "Profile", url: "/profile" },
        { name: "Preferences", url: "/preferences" },
        { name: "Notifications", url: "/notifications" },
        { name: "Login", url: "/login" },
        { name: "Sign Up", url: "/signup" },
      ]
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Contact Us", url: "/contact" },
        { name: "FAQ", url: "/help#faq" },
      ]
    },
    {
      title: "Company",
      icon: <Users className="h-5 w-5" />,
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Press", url: "/press" },
      ]
    },
    {
      title: "Legal",
      icon: <FileText className="h-5 w-5" />,
      links: [
        { name: "Terms of Service", url: "/terms" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Responsible Spending", url: "/responsible-spending" },
        { name: "Cookie Policy", url: "/cookies" },
      ]
    },
    {
      title: "Features",
      icon: <BarChart3 className="h-5 w-5" />,
      links: [
        { name: "Analytics", url: "/analytics" },
        { name: "Reminders", url: "/reminders" },
        { name: "Categories", url: "/categories" },
        { name: "Reports", url: "/reports" },
      ]
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-muted-foreground">
            Explore all sections and pages of the Subie platform to find the information you need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {siteLinks.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <div className="mr-2 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.url}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronRight className="mr-2 h-4 w-4" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 max-w-lg mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Looking for something specific?
              </CardTitle>
              <CardDescription>
                Use our search function to quickly find what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search pages..." 
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;
