import { Subscription } from '@/types/subscription';
import { formatCurrency, formatDate } from '@/utils/mockData';
import { MoreHorizontal, Edit, Trash, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategoryBadge from './CategoryBadge';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  // Check if the billing date is within the next 7 days
  const isUpcoming = () => {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    return subscription.nextBillingDate <= sevenDaysLater;
  };

  // Format the billing cycle for display
  const formatBillingCycle = (cycle: string | undefined | null) => {
    if (!cycle) {
      return "";
    }
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  return (
    <div 
      className={`subscription-card bg-card p-5 rounded-lg border border-border shadow-card overflow-hidden ${!subscription.active ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: subscription.color || '#333' }}
          >
            {subscription.logo}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">{subscription.name}</h3>
            <CategoryBadge category={subscription.category} className="mt-1" />
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] bg-white shadow-lg rounded-md p-2 z-50">
            <DropdownMenuItem onClick={() => onEdit(subscription)} className="cursor-pointer flex items-center py-2">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleActive(subscription.id, !subscription.active)}
              className="cursor-pointer flex items-center py-2"
            >
              {subscription.active ? (
                <>
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(subscription.id)}
              className="cursor-pointer flex items-center text-destructive py-2"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Amount</span>
          <span className="text-sm font-semibold">{formatCurrency(subscription.amount, subscription.currency)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Billing</span>
          <span className="text-xs">{formatBillingCycle(subscription.billingCycle)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Next payment</span>
          <span className={`text-xs ${isUpcoming() ? 'text-destructive font-medium' : ''}`}>
            {formatDate(subscription.nextBillingDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
