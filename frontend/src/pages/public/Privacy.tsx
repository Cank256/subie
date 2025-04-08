
import Layout from '@/components/Layout';
import { Shield, ChevronRight } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: May 1, 2023
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p>
              At Subie, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our subscription management platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Create an account or profile</li>
              <li>Use our services</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our support team</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Automatically Collected Information</h3>
            <p>
              When you access or use our services, we may automatically collect device information, usage data, location data, and use cookies and similar tracking technologies.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide and improve our services, process transactions, communicate with you, personalize your experience, and comply with legal obligations.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your personal information. Please contact us to exercise these rights.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Information</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@subie.com.
            </p>
          </div>
          
          <div className="mt-12 flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Need to review our terms?</span>
            <a 
              href="/terms" 
              className="flex items-center text-primary hover:underline text-sm font-medium"
            >
              Terms of Service <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
