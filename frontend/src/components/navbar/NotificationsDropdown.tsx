import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
};

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match our component's expected format
      const formattedNotifications: Notification[] = data?.map((item: { 
        id: string; 
        title: string; 
        description: string; 
        created_at: string; 
        read: boolean; 
        action_url?: string; 
        action_text?: string; 
      }) => ({
        id: item.id,
        title: item.title,
        message: item.description,
        date: new Date(item.created_at),
        read: item.read,
        actionUrl: item.action_url,
        actionText: item.action_text
      })) || [];
      
      setNotifications(formattedNotifications);
    } catch (error: unknown) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: "destructive",
        title: "Error fetching notifications",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffMin < 1440) {
      return `${Math.floor(diffMin / 60)}h ago`;
    } else {
      return `${Math.floor(diffMin / 1440)}d ago`;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const notifIds = notifications.filter(n => !n.read).map(n => n.id);
      
      if (notifIds.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notifIds);
      
      if (error) {
        throw error;
      }
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!user) {
    return null; // Don't show notifications for unauthenticated users
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="hidden md:flex relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 max-h-[70vh] overflow-auto"
        forceMount
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div>
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium">{notif.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatNotificationTime(notif.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                {!notif.read && (
                  <div className="mt-2 flex justify-end">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                )}
                {notif.actionUrl && (
                  <div className="flex items-center justify-between mt-4">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => window.location.href = notif.actionUrl!}
                    >
                      {notif.actionText}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="p-3 text-center border-t">
              <Link 
                to="/notifications" 
                className="text-xs text-primary hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
