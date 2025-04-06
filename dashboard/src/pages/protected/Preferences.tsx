import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  BellRing, 
  Globe, 
  Moon, 
  Sun, 
  PieChart, 
  Palette
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { defaultPreferences, UsersPreferences } from '@/client/types.gen';
import { currencies } from '@/utils/profileConstants';

const Preferences = () => {
  const { toast } = useToast();
  const { user, saveUserPreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  // Preferences state
  const [preferences, setPreferences] = useState<UsersPreferences>(defaultPreferences);
  
  // Fetch user preferences when component mounts
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const userPreferences = user.preferences
          
          if (userPreferences) {
            // Convert DB format to component format
            const formattedPrefs = {
              theme: userPreferences.theme,
              language: userPreferences.language,
              currency: userPreferences.currency,
              time_format: userPreferences.time_format,
              email_notifications: userPreferences.email_notifications,
              push_notifications: userPreferences.push_notifications,
              sms_notifications: userPreferences.sms_notifications,
              reminder_days: userPreferences.reminder_days,
              show_inactive_subscriptions: userPreferences.show_inactive_subscriptions,
              default_view: userPreferences.default_view,
              billing_updates: userPreferences.billing_updates,
              new_features: userPreferences.new_features,
              tips: userPreferences.tips,
              newsletter: userPreferences.newsletter,
            };
            
            setPreferences(formattedPrefs);
          } else {
            setPreferences(defaultPreferences);
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load preferences. Please try again.",
          });
        }
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, [user, toast]);

  // Separate effect for theme updates
  useEffect(() => {
    if (preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme]);
  
  const handleChange = async (name: string, value: any) => {
    const { success, error } = await saveUserPreferences({ requestBody: {
      [name]: value
    }})

    if (success) {
      toast({
        title: "Preferences saved",
        description: "Your settings have been updated successfully.",
      });

      setPreferences(prev => {
        const updated = {
          ...prev,
          [name]: value
        };
        
        // If theme is being changed, update it immediately
        if (name === 'theme') {
          setTheme(value);
        }
        
        return updated;
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences. Please try again.",
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Preferences</h1>
        <p className="text-muted-foreground mb-8">
          Customize your experience and settings
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how Subie looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => handleChange('theme', 'light')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                        preferences.theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Sun className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleChange('theme', 'dark')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                        preferences.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Moon className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleChange('theme', 'system')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                        preferences.theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="h-5 w-5 mb-2 flex">
                        <Sun className="h-5 w-5 mr-1" />
                        <Moon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="defaultView">Default View</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => handleChange('default_view', 'list')}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                        preferences.default_view === 'list' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span className="text-sm font-medium">List</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleChange('default_view', 'grid')}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                        preferences.default_view === 'grid' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span className="text-sm font-medium">Grid</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleChange('default_view', 'calendar')}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                        preferences.default_view === 'calendar' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span className="text-sm font-medium">Calendar</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Regional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Set your locale preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={preferences.currency || ''} 
                      onValueChange={(value) => handleChange('currency', value)}
                    >
                      <SelectTrigger id="currency" className="mt-2">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select 
                      value={preferences.time_format} 
                      onValueChange={(value) => handleChange('time_format', value)}
                    >
                      <SelectTrigger id="timeFormat" className="mt-2">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hours (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={preferences.email_notifications || false}
                    onCheckedChange={(checked) => handleChange('email_notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={preferences.push_notifications || false}
                    onCheckedChange={(checked) => handleChange('push_notifications', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="remindersBefore">Reminders Before Due Date</Label>
                  <Select 
                    value={(preferences.reminder_days || 3).toString()} 
                    onValueChange={(value) => handleChange('reminder_days', parseInt(value))}
                  >
                    <SelectTrigger id="remindersBefore" className="mt-2">
                      <SelectValue placeholder="Select days before" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="5">5 days before</SelectItem>
                      <SelectItem value="7">7 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Subscription Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Subscription Management
                </CardTitle>
                <CardDescription>
                  Control how your subscriptions are displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showInactiveSubscriptions" className="text-base">Show Inactive Subscriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Display subscriptions you've canceled or paused
                    </p>
                  </div>
                  <Switch 
                    id="showInactiveSubscriptions" 
                    checked={preferences.show_inactive_subscriptions || false}
                    onCheckedChange={(checked) => handleChange('show_inactive_subscriptions', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* <Button 
              onClick={handleSavePreferences} 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button> */}
          </div>
          
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Learn about how we handle your information.
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/privacy'}>
                  Privacy Policy
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/profile'}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/billing'}>
                  Billing Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/profile'}>
                  Security Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/profile'}>
                  Notifications Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preferences;
