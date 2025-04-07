import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Dialog } from "@/components/ui/dialog";
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import AddSubscriptionModal from '@/components/subscription/AddSubscriptionModal';
import { Subscription } from '@/types/subscription';
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Filter, 
  ArrowDownUp,
  ListFilter,
  Circle,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match our Subscription type
      const formattedData = data.map((sub: Record<string, unknown>) => ({
        ...sub,
        nextBillingDate: new Date(sub.next_billing_date as string),
        createdAt: new Date(sub.created_at as string),
        updatedAt: new Date(sub.updated_at as string),
      })) as unknown as Subscription[];
      
      setSubscriptions(formattedData);
    } catch (error: unknown) {
      console.error('Error fetching subscriptions:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to load subscriptions",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user, fetchSubscriptions]);
  
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
      
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed from your list",
      });
    } catch (error: unknown) {
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
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? { ...sub, active } : sub
      ));
      
      toast({
        title: active ? "Subscription activated" : "Subscription paused",
        description: active 
          ? "The subscription has been activated" 
          : "The subscription has been paused",
      });
    } catch (error: unknown) {
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
        
        setSubscriptions(subscriptions.map(sub => 
          sub.id === currentSubscription.id ? { ...sub, ...data } : sub
        ));
        
        toast({
          title: "Subscription updated",
          description: "Your changes have been saved",
        });
      } else {
        // Create new subscription
        const newSubscription = {
          id: uuidv4(),
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
        const createdSubscription = {
          ...insertedData[0],
          nextBillingDate: new Date(insertedData[0].next_billing_date),
          createdAt: new Date(insertedData[0].created_at),
          updatedAt: new Date(insertedData[0].updated_at),
        };
        
        setSubscriptions([createdSubscription, ...subscriptions]);
        
        toast({
          title: "Subscription added",
          description: `${data.name} has been added to your subscriptions`,
        });
      }
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Failed to save subscription",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsAddModalOpen(false);
    }
  };
  
  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = [...subscriptions]
    .filter(sub => {
      // Apply search filter
      const matchesSearch = searchTerm === '' || 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.description && sub.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply category filter if selected
      const matchesCategory = selectedCategory === null || sub.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else { // date
        return sortDirection === 'asc' 
          ? a.nextBillingDate.getTime() - b.nextBillingDate.getTime()
          : b.nextBillingDate.getTime() - a.nextBillingDate.getTime();
      }
    });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // If loading, show a loading state
  if (loading) {
    return (
      <Layout onAddSubscription={handleAddSubscription}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
              <p className="text-muted-foreground">
                Manage all your subscription services in one place
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onAddSubscription={handleAddSubscription}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage all your subscription services in one place
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
        
        {/* Search and filters */}
        <div className="bg-card p-5 rounded-lg border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-muted" : ""}
                  >
                    <Circle className={`mr-2 h-4 w-4 ${selectedCategory === null ? "fill-foreground" : ""}`} />
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={selectedCategory === category.name ? "bg-muted" : ""}
                    >
                      <Circle 
                        className={`mr-2 h-4 w-4 ${selectedCategory === category.name ? "fill-foreground" : ""}`} 
                        style={{ color: category.color }}
                      />
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <ArrowDownUp className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => setSortBy('name')}
                      className={sortBy === 'name' ? "bg-muted" : ""}
                    >
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortBy('amount')}
                      className={sortBy === 'amount' ? "bg-muted" : ""}
                    >
                      Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortBy('date')}
                      className={sortBy === 'date' ? "bg-muted" : ""}
                    >
                      Next Billing Date
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleSortDirection}>
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Active filters */}
          {(selectedCategory || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center">
                  <span>Category: {categories.find(c => c.name === selectedCategory)?.label}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {searchTerm && (
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center">
                  <span>Search: {searchTerm}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {(selectedCategory || searchTerm) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6 px-2"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchTerm('');
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Subscriptions grid */}
        {filteredAndSortedSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSubscriptions.map((subscription) => (
              <div key={subscription.id}>
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
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <ListFilter className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No subscriptions found</h3>
            {searchTerm || selectedCategory ? (
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            ) : (
              <p className="text-muted-foreground mb-4">
                You don't have any subscriptions yet. Add your first one to get started.
              </p>
            )}
            <Button onClick={handleAddSubscription}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Subscription Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <AddSubscriptionModal
          subscription={currentSubscription}
          onSave={handleSaveSubscription}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Dialog>
    </Layout>
  );
};

export default Subscriptions;
