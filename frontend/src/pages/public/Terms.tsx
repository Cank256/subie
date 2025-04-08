
import Layout from '@/components/Layout';
import { FileText, ChevronRight } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: May 1, 2023
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p>
              Welcome to Subie. Please read these Terms of Service carefully before using our service.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Subie's services, website, or applications, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access or use our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
            <p>
              Subie provides a subscription management platform that allows users to track, manage, and optimize their subscription services. Our services may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Subscription tracking and management</li>
              <li>Expense analytics and reporting</li>
              <li>Payment reminders and notifications</li>
              <li>Recommendations for subscription optimization</li>
              <li>Multi-currency support</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
            <p>
              To use certain features of our service, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to terminate accounts that violate our terms or for any other reason at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Data and Privacy</h2>
            <p>
              Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you agree to our data practices as described in our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Subscription and Payment Terms</h2>
            <p>
              Subie offers various subscription plans, including a free tier with limited features and premium plans with additional capabilities. For paid plans:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Payments are processed securely through our payment processors</li>
              <li>Subscriptions automatically renew unless canceled before the renewal date</li>
              <li>Refunds are provided in accordance with our Refund Policy</li>
              <li>Prices may change with notice provided to users</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. User Conduct</h2>
            <p>
              When using our services, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Attempt to gain unauthorized access to any part of our services</li>
              <li>Use our services to distribute malware or other harmful code</li>
              <li>Interfere with or disrupt the integrity of our services</li>
              <li>Collect user information without consent</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, and software, are owned by Subie and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works based on our services without our express permission.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              In no event shall Subie, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Your access to or use of or inability to access or use our services</li>
              <li>Any conduct or content of any third party on our services</li>
              <li>Any content obtained from our services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the "Last updated" date at the top of this page or by sending an email notification. Your continued use of our services after such changes constitutes your acceptance of the new terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="my-4">
              <strong>Email:</strong> legal@subie.com<br />
              <strong>Address:</strong> 123 Subscription Avenue, San Francisco, CA 94103, United States
            </p>
            
            <div className="mt-10 pt-6 border-t">
              <p className="font-medium">By using Subie, you acknowledge that you have read and understand these Terms of Service and agree to be bound by them.</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Need to review our privacy practices?</span>
            <a 
              href="/privacy" 
              className="flex items-center text-primary hover:underline text-sm font-medium"
            >
              Privacy Policy <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
