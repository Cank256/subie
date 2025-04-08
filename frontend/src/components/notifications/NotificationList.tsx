
import { BellRing } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationItem, type Notification } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationList = ({ 
  notifications, 
  onMarkAsRead,
}: NotificationListProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellRing className="h-5 w-5 mr-2" />
          Notification Center
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Your recent notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BellRing className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! No new notifications at the moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

