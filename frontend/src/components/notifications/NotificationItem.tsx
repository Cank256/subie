
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Clock, 
  RefreshCw, 
  Tag, 
  Settings,
  ArrowRight 
} from 'lucide-react';
import { Notification, NotificationItemProps,  } from '@/client/types.gen';



export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-5 w-5 text-primary" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'renewal':
        return <RefreshCw className="h-5 w-5 text-green-500" />;
      case 'price_change':
        return <Tag className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMin < 60) {
      return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <div 
      key={notification.id} 
      className={`p-4 rounded-lg border ${notification.read ? 'border-border' : 'border-primary bg-primary/5'}`}
    >
      <div className="flex">
        <div className="mr-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {notification.title}
                {!notification.read && (
                  <Badge variant="outline" className="ml-2 bg-primary/20 text-xs">
                    New
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatNotificationDate(notification.date)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            {notification.action_url && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-primary"
                onClick={() => window.location.href = notification.action_url!}
              >
                {notification.action_text}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

