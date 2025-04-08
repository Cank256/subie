import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NotificationList } from '@/components/notifications/NotificationList';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { HelpCard } from '@/components/notifications/HelpCard';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import { Notification } from '@/client/types.gen';
import { UsersService } from '@/client/sdk.gen';

// Define the notification settings interface
interface NotificationSettingsType {
  enableAll: boolean;
  payments: boolean;
  reminders: boolean;
  renewals: boolean;
  priceChanges: boolean;
  system: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderDays: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  // Add notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    enableAll: true,
    payments: true,
    reminders: true,
    renewals: true,
    priceChanges: true,
    system: true,
    emailNotifications: true,
    pushNotifications: true,
    reminderDays: 3
  });

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      const userProfile = await UsersService.readUserProfile();
      
      if (userProfile && userProfile.preferences) {
        const settings = userProfile.preferences;
        setNotificationSettings({
          enableAll: Boolean(settings.billing_updates) && Boolean(settings.new_features) && Boolean(settings.tips) && Boolean(settings.newsletter),
          payments: Boolean(settings.billing_updates) || true,
          reminders: true,
          renewals: true,
          priceChanges: Boolean(settings.billing_updates) || true,
          system: Boolean(settings.new_features) || true,
          emailNotifications: Boolean(settings.email_notifications) || true,
          pushNotifications: Boolean(settings.push_notifications) || true,
          reminderDays: settings.reminder_days || 3
        });
      }
    } catch (error: unknown) {
      console.error('Error fetching notification settings:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      // Since there's no direct notification service, we'll use a mock implementation
      // In a real implementation, you would create a NotificationsService in the SDK
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'payment',
          title: 'Upcoming Payment',
          description: 'Your subscription to Netflix will renew in 3 days',
          date: new Date(),
          read: false,
          actionUrl: '/subscriptions',
          actionText: 'View Subscription',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'system',
          title: 'Welcome to Subie',
          description: 'Thank you for joining Subie. We\'re here to help you manage your subscriptions.',
          date: new Date(Date.now() - 86400000), // 1 day ago
          read: true,
          actionUrl: '/help',
          actionText: 'Learn More',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error: unknown) {
      console.error('Error fetching notifications:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to load notifications",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchSettings();
    }
  }, [user, fetchNotifications, fetchSettings]);

  const handleMarkAsRead = async (id: string) => {
    try {
      // Mock implementation - in a real app, you would call a service method
      console.log(`Marking notification ${id} as read`);
      
      setNotifications(
        notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error: unknown) {
      console.error('Error marking notification as read:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to update notification",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const ids = notifications.filter(n => !n.read).map(n => n.id);
      
      if (ids.length === 0) return;
      
      // Mock implementation - in a real app, you would call a service method
      console.log(`Marking all notifications as read: ${ids.join(', ')}`);
      
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      
      toast({
        title: "All notifications marked as read",
        description: `${ids.length} notifications updated`,
      });
    } catch (error: unknown) {
      console.error('Error marking all as read:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to update notifications",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleClearAll = async () => {
    try {
      const ids = notifications.map(n => n.id);
      
      if (ids.length === 0) return;
      
      // Mock implementation - in a real app, you would call a service method
      console.log(`Clearing all notifications: ${ids.join(', ')}`);
      
      setNotifications([]);
      
      toast({
        title: "All notifications cleared",
        description: "Your notification center is now empty",
      });
    } catch (error: unknown) {
      console.error('Error clearing notifications:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Failed to clear notifications",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSettingChange = async (setting: string, value: boolean | number) => {
    if (!user) return;
    
    // Update local state first for immediate UI feedback
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    try {
      // Map component settings to backend format
      const dbSettings = {
        email_notifications: notificationSettings.emailNotifications,
        push_notifications: notificationSettings.pushNotifications,
        sms_notifications: false,
        reminder_days: typeof value === 'number' && setting === 'reminderDays' ? value : notificationSettings.reminderDays,
        billing_updates: setting === 'payments' || setting === 'priceChanges' ? value : notificationSettings.payments,
        new_features: setting === 'system' ? value : notificationSettings.system,
        tips: notificationSettings.enableAll,
        newsletter: notificationSettings.enableAll
      };
      
      // If the master toggle is clicked, update all settings
      if (setting === 'enableAll') {
        dbSettings.billing_updates = value as boolean;
        dbSettings.new_features = value as boolean;
        dbSettings.tips = value as boolean;
        dbSettings.newsletter = value as boolean;
        
        // Also update all the other settings in the local state
        setNotificationSettings(prev => ({
          ...prev,
          payments: value as boolean,
          reminders: value as boolean,
          renewals: value as boolean,
          priceChanges: value as boolean,
          system: value as boolean
        }));
      }
      
      // Special handling for emailNotifications and pushNotifications
      if (setting === 'emailNotifications') {
        dbSettings.email_notifications = value as boolean;
      }
      
      if (setting === 'pushNotifications') {
        dbSettings.push_notifications = value as boolean;
      }
      
      await UsersService.updateUserPreferences({
        requestBody: dbSettings
      });
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved"
      });
    } catch (error: unknown) {
      console.error('Error saving notification settings:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notification settings. Please try again."
      });
      // Revert the local state change
      fetchSettings();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your alerts and notification preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <Tabs defaultValue="all" className="w-full" 
                  onValueChange={(value) => setActiveTab(value)}
                >
                  <TabsList>
                    <TabsTrigger value="all">
                      All{unreadCount > 0 && ` (${unreadCount})`}
                    </TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="payment">Payments</TabsTrigger>
                    <TabsTrigger value="reminder">Reminders</TabsTrigger>
                  </TabsList>

                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearAll}
                      disabled={notifications.length === 0}
                    >
                      Clear all
                    </Button>
                  </div>

                  <div className="p-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <TabsContent value={activeTab} className="mt-0">
                        <NotificationList 
                          notifications={filteredNotifications}
                          onMarkAsRead={handleMarkAsRead}
                          onMarkAllAsRead={handleMarkAllAsRead}
                          onClearAll={handleClearAll}
                        />
                      </TabsContent>
                    )}
                  </div>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <NotificationSettings 
              settings={notificationSettings}
              onSettingChange={handleSettingChange}
            />
            <HelpCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
