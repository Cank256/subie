
import Layout from '@/components/Layout';
import { 
  CreditCard, 
  FileText, 
  Calendar, 
  Download, 
  Eye, 
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSubscriptions, formatCurrency } from '@/utils/mockData';
import { useState } from 'react';

// Mock payment methods
const paymentMethods = [
  {
    id: 'pm_1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    expMonth: 10,
    expYear: 2024,
    isDefault: false
  }
];

// Mock invoices
const invoices = [
  {
    id: 'inv_1',
    date: new Date('2023-12-10'),
    amount: 99.99,
    status: 'paid',
    items: ['Premium Plan - December 2023']
  },
  {
    id: 'inv_2',
    date: new Date('2023-11-10'),
    amount: 99.99,
    status: 'paid',
    items: ['Premium Plan - November 2023']
  },
  {
    id: 'inv_3',
    date: new Date('2023-10-10'),
    amount: 89.99,
    status: 'paid',
    items: ['Standard Plan - October 2023']
  },
  {
    id: 'inv_4',
    date: new Date('2023-09-10'),
    amount: 89.99,
    status: 'paid',
    items: ['Standard Plan - September 2023']
  }
];

const Billing = () => {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  
  // Calculate total monthly spending
  const calculateTotalMonthly = () => {
    return mockSubscriptions.reduce((total, sub) => {
      if (!sub.active) return total;
      
      let monthlyAmount = sub.amount;
      switch (sub.billingCycle) {
        case 'yearly':
          monthlyAmount = sub.amount / 12;
          break;
        case 'quarterly':
          monthlyAmount = sub.amount / 3;
          break;
        case 'weekly':
          monthlyAmount = sub.amount * 4.33; // Average weeks in a month
          break;
      }
      return total + monthlyAmount;
    }, 0);
  };

  const totalMonthly = calculateTotalMonthly();
  
  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const toggleInvoice = (id: string) => {
    if (expandedInvoice === id) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(id);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-muted-foreground mb-8">
          Manage your payment methods and view your billing history
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your current subscription plan and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-lg">Premium Plan</h3>
                    <p className="text-muted-foreground text-sm">Unlimited subscriptions tracking</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">{formatCurrency(9.99, 'USD')}</p>
                    <p className="text-muted-foreground text-sm">per month</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm">Subscriptions used</p>
                    <p className="text-sm font-medium">{mockSubscriptions.length} / Unlimited</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Billing period</p>
                    <p className="text-sm font-medium">May 10, 2023 - Jun 9, 2023</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel Plan</Button>
                <Button>Upgrade</Button>
              </CardFooter>
            </Card>
            
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`p-4 rounded-lg border ${method.isDefault ? 'border-primary bg-primary/5' : 'border-border'} relative`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {method.brand === 'visa' ? (
                            <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">VISA</div>
                          ) : (
                            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">MC</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {method.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs font-medium text-primary flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardFooter>
            </Card>
            
            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Billing History
                </CardTitle>
                <CardDescription>Your recent invoices and payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md divide-y">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="text-sm">
                      <div 
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleInvoice(invoice.id)}
                      >
                        <div className="flex items-center">
                          <div className="mr-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">Invoice #{invoice.id.split('_')[1]}</p>
                            <p className="text-muted-foreground">{formatDate(invoice.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-4">{formatCurrency(invoice.amount, 'USD')}</span>
                          {expandedInvoice === invoice.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      
                      {expandedInvoice === invoice.id && (
                        <div className="p-4 bg-muted/30">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Invoice Details</h4>
                            <div className="space-y-1">
                              {invoice.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item}</span>
                                  <span>{formatCurrency(invoice.amount, 'USD')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="mx-auto">View All Invoices</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Subscriptions</span>
                    <span className="font-medium">{mockSubscriptions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Subscriptions</span>
                    <span className="font-medium">{mockSubscriptions.filter(s => s.active).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Spending</span>
                    <span className="font-medium">{formatCurrency(totalMonthly, 'USD')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Yearly Estimate</span>
                    <span className="font-medium">{formatCurrency(totalMonthly * 12, 'USD')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">John Doe</p>
                  <p>123 Subscription Lane</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Update Address
                </Button>
              </CardFooter>
            </Card>
            
            {/* Need Help */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  If you have any questions about your billing or need assistance with your subscription, our support team is here to help.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;
