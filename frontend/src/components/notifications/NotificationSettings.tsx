
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Clock, 
  RefreshCw, 
  Tag, 
  Settings
} from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    enableAll: boolean;
    payments: boolean;
    reminders: boolean;
    renewals: boolean;
    priceChanges: boolean;
    system: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderDays: number;
  };
  onSettingChange: (setting: string, value: boolean | number) => void;
}

export const NotificationSettings = ({ 
  settings,
  onSettingChange
}: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Control what notifications you receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">All Notifications</p>
            <p className="text-sm text-muted-foreground">
              Master toggle for all notifications
            </p>
          </div>
          <Switch 
            checked={settings.enableAll}
            onCheckedChange={(checked) => onSettingChange('enableAll', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Types</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              <p className="text-sm">Payment Notifications</p>
            </div>
            <Switch 
              checked={settings.payments}
              onCheckedChange={(checked) => onSettingChange('payments', checked)}
              disabled={!settings.enableAll}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-yellow-500" />
              <p className="text-sm">Payment Reminders</p>
            </div>
            <Switch 
              checked={settings.reminders}
              onCheckedChange={(checked) => onSettingChange('reminders', checked)}
              disabled={!settings.enableAll}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 text-green-500" />
              <p className="text-sm">Renewal Notifications</p>
            </div>
            <Switch 
              checked={settings.renewals}
              onCheckedChange={(checked) => onSettingChange('renewals', checked)}
              disabled={!settings.enableAll}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-orange-500" />
              <p className="text-sm">Price Change Alerts</p>
            </div>
            <Switch 
              checked={settings.priceChanges}
              onCheckedChange={(checked) => onSettingChange('priceChanges', checked)}
              disabled={!settings.enableAll}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2 text-purple-500" />
              <p className="text-sm">System Notifications</p>
            </div>
            <Switch 
              checked={settings.system}
              onCheckedChange={(checked) => onSettingChange('system', checked)}
              disabled={!settings.enableAll}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Delivery Methods</h3>
          
          <div className="flex items-center justify-between">
            <p className="text-sm">Email Notifications</p>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
              disabled={!settings.enableAll}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm">Push Notifications</p>
            <Switch 
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
              disabled={!settings.enableAll}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => window.location.href = '/preferences'}>
          Manage All Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};
