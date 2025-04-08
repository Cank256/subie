import { Link } from 'react-router-dom';
import { User, Bell, CreditCard, Settings, LayoutDashboard, LogOut, UserCircle, Users } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuth from '@/hooks/useAuth';
import { UserPublic } from "@/client/types.gen";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  // Handle undefined case and explicitly type the user object
  const typedUser = user as UserPublic | null;

  // Create initials from first and last name with proper null checks
  const getInitials = () => {
    if (!typedUser) return 'U';

    // Check for first_name and last_name first
    if (typedUser.first_name || typedUser.last_name) {
      const first = typedUser.first_name ? typedUser.first_name.charAt(0) : '';
      const last = typedUser.last_name ? typedUser.last_name.charAt(0) : '';
      return (first + last).toUpperCase() || 'U';
    }
    
    // Then fallback to email with proper null check
    return typedUser.email ? typedUser.email.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const displayName = typedUser 
    ? `${typedUser.first_name || ''} ${typedUser.last_name || ''}`.trim() || typedUser.email || 'User'
    : 'User';
  
  const displayEmail = typedUser?.email || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          {typedUser ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={typedUser?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          ) : (
            <UserCircle className="h-6 w-6" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {typedUser ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {displayEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {typedUser.is_admin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard" className="cursor-pointer flex w-full items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users" className="cursor-pointer flex w-full items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/payments" className="cursor-pointer flex w-full items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/notifications" className="cursor-pointer flex w-full items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/billing" className="cursor-pointer flex w-full items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/preferences" className="cursor-pointer flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuLabel>
            <p className="text-sm text-center">Sign in to access your account</p>
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
