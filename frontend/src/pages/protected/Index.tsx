import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Dialog } from "@/components/ui/dialog";
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import AddSubscriptionModal from '@/components/subscription/AddSubscriptionModal';
import UpcomingPayments from '@/components/UpcomingPayments';
import ExpenseChart from '@/components/ExpenseChart';
import { Subscription } from '@/types/subscription';
import { calculateTotalMonthly, formatCurrency, getUpcomingPayments } from '@/utils/mockData';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, CreditCard, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';

const Index = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchSubscriptions = useCallback(async () => {
    try {
      // console.log("Fetching subscriptions for user:", user?.id);
      setLoading(true);
      
      if (!user?.id) {
        console.log("No user ID available, skipping fetch");
        setLoading(false);
        return;
      }

      const storedSubs = localStorage.getItem(`subscriptions`);

      // Try getting the subscriptions for the localStorage
      if(storedSubs) {
        const parsedSubscriptions = JSON.parse(storedSubs);
        // Convert date strings back to Date objects
        const formattedSubscriptions = formatSubscriptionData(parsedSubscriptions);
        setSubscriptions(formattedSubscriptions);
        setLoading(false);
        return;
      }

      // If not in localStorage, fetch from Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load subscriptions",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        // Store in localStorage for future use
        localStorage.setItem(`subscriptions`, JSON.stringify(data));
        
        // Format the data to match our Subscription type
        const formattedSubscriptions = formatSubscriptionData(data);
        setSubscriptions(formattedSubscriptions);
      }
    } catch (error) {
      console.error('Error in fetchSubscriptions:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  // Fetch subscriptions from Supabase when component mounts
  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [user, fetchSubscriptions]);
  
  const formatSubscriptionData = (data: Record<string, unknown>[]) => {
    // Transform data to match our Subscription type
    const formattedSubscriptions = data.map((sub: Record<string, unknown>) => ({
      ...sub,
      id: sub.id as string,
      name: sub.name as string,
      description: sub.description as string,
      amount: sub.amount as number,
      currency: sub.currency as string,
      billingCycle: sub.billing_cycle as string,
      category: sub.category as string,
      nextBillingDate: new Date(sub.next_billing_date as string),
      logo: sub.logo as string,
      color: sub.color as string,
      active: sub.active as boolean,
      autoRenew: sub.auto_renew as boolean,
      createdAt: new Date(sub.created_at as string),
      updatedAt: new Date(sub.updated_at as string),
    })) as unknown as Subscription[];

    return formattedSubscriptions;
  }
  
  const handleAddSubscription = () => {
    setCurrentSubscription(null);
    setIsAddModalOpen(true);
  };
  
  const handleEditSubscription = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setIsAddModalOpen(true);
  };
  
  const handleDeleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
      setSubscriptions(updatedSubscriptions);
      
      // Update localStorage
      if (user?.id) {
        localStorage.setItem(`subscriptions`, JSON.stringify(updatedSubscriptions));
      }
      
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed from your list",
      });
    } catch (error: unknown) {
      console.error('Error deleting subscription:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to delete subscription",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ active })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      const updatedSubscriptions = subscriptions.map(sub => 
        sub.id === id ? { ...sub, active } : sub
      );
      setSubscriptions(updatedSubscriptions);
      
      // Update localStorage
      if (user?.id) {
        localStorage.setItem(`subscriptions`, JSON.stringify(updatedSubscriptions));
      }
      
      toast({
        title: active ? "Subscription activated" : "Subscription paused",
        description: active 
          ? "The subscription has been activated" 
          : "The subscription has been paused",
      });
    } catch (error: unknown) {
      console.error('Error updating subscription:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to update subscription",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  const handleSaveSubscription = async (data: Partial<Subscription>) => {
    try {
      if (currentSubscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            name: data.name,
            description: data.description,
            amount: data.amount,
            currency: data.currency,
            billing_cycle: data.billingCycle,
            category: data.category,
            next_billing_date: data.nextBillingDate?.toISOString(),
            logo: data.logo,
            color: data.color,
            active: data.active,
            auto_renew: data.autoRenew,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSubscription.id);
        
        if (error) {
          throw error;
        }
        
        const updatedSubscriptions = subscriptions.map(sub => 
          sub.id === currentSubscription.id ? { 
            ...sub, 
            name: data.name || sub.name,
            description: data.description !== undefined ? data.description : sub.description,
            amount: data.amount || sub.amount,
            currency: data.currency || sub.currency,
            billingCycle: data.billingCycle || sub.billingCycle,
            category: data.category || sub.category,
            nextBillingDate: data.nextBillingDate || sub.nextBillingDate,
            logo: data.logo !== undefined ? data.logo : sub.logo,
            color: data.color || sub.color,
            active: data.active !== undefined ? data.active : sub.active,
            autoRenew: data.autoRenew !== undefined ? data.autoRenew : sub.autoRenew,
            updatedAt: new Date()
          } : sub
        );
        
        setSubscriptions(updatedSubscriptions);
        
        // Update localStorage
        if (user?.id) {
          localStorage.setItem(`subscriptions`, JSON.stringify(updatedSubscriptions));
        }
        
        toast({
          title: "Subscription updated",
          description: "Your changes have been saved",
        });
      } else {
        // Create new subscription
        const newSubscription = {
          user_id: user?.id,
          name: data.name || 'Untitled',
          description: data.description,
          amount: data.amount || 0,
          currency: data.currency || 'USD',
          billing_cycle: data.billingCycle || 'monthly',
          category: data.category || 'other',
          next_billing_date: data.nextBillingDate?.toISOString() || new Date().toISOString(),
          logo: data.logo,
          color: data.color,
          active: data.active !== undefined ? data.active : true,
          auto_renew: data.autoRenew !== undefined ? data.autoRenew : true,
        };
        
        const { data: insertedData, error } = await supabase
          .from('subscriptions')
          .insert(newSubscription)
          .select();
        
        if (error) {
          throw error;
        }
        
        // Format the newly created subscription
        const createdSubscription: Subscription = {
          id: insertedData[0].id,
          name: insertedData[0].name,
          description: insertedData[0].description,
          amount: insertedData[0].amount,
          currency: insertedData[0].currency,
          billingCycle: insertedData[0].billing_cycle,
          category: insertedData[0].category,
          nextBillingDate: new Date(insertedData[0].next_billing_date),
          logo: insertedData[0].logo,
          color: insertedData[0].color,
          active: insertedData[0].active,
          autoRenew: insertedData[0].auto_renew,
          createdAt: new Date(insertedData[0].created_at),
          updatedAt: new Date(insertedData[0].updated_at),
        };
        
        const updatedSubscriptions = [createdSubscription, ...subscriptions];
        setSubscriptions(updatedSubscriptions);
        
        // Update localStorage
        if (user?.id) {
          localStorage.setItem(`subscriptions`, JSON.stringify(updatedSubscriptions));
        }
        
        toast({
          title: "Subscription added",
          description: `${data.name} has been added to your subscriptions`,
        });
      }
    } catch (error: unknown) {
      console.error('Error saving subscription:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to save subscription",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsAddModalOpen(false);
    }
  };
  
  const activeSubscriptions = subscriptions.filter(sub => sub.active);
  const totalMonthly = calculateTotalMonthly(subscriptions);
  const upcomingPayments = getUpcomingPayments(subscriptions);

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onAddSubscription={handleAddSubscription} />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Track and manage your subscriptions in one place
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAddSubscription={handleAddSubscription} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage your subscriptions in one place
            </p>
          </div>
          <Button 
            onClick={handleAddSubscription} 
            className="mt-4 md:mt-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subscription
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-5 rounded-lg border border-border shadow-sm animate-fade-in delay-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
                <h3 className="text-2xl font-bold">{activeSubscriptions.length}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-lg border border-border shadow-sm animate-fade-in delay-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Spend</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalMonthly)}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-lg border border-border shadow-sm animate-fade-in delay-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next 30 Days</p>
                <h3 className="text-2xl font-bold">{formatCurrency(upcomingPayments.reduce((sum, sub) => sum + sub.amount, 0))}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscriptions Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
            
            {subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((subscription, index) => (
                  <div key={subscription.id} className={`animate-fade-in delay-${(index % 5) * 100}`}>
                    <SubscriptionCard
                      subscription={subscription}
                      onEdit={handleEditSubscription}
                      onDelete={handleDeleteSubscription}
                      onToggleActive={handleToggleActive}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center animate-fade-in delay-200">
                <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your subscriptions by adding your first one
                </p>
                <Button onClick={handleAddSubscription}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Subscription
                </Button>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in delay-400">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <ExpenseChart subscriptions={subscriptions} />
            <UpcomingPayments subscriptions={subscriptions} />
          </div>
        </div>
      </main>
      
      {/* Add/Edit Subscription Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <AddSubscriptionModal
          subscription={currentSubscription}
          onSave={handleSaveSubscription}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Index;
