
import { Subscription } from '../types/subscription';
import { formatCurrency, formatDate } from '../utils/mockData';
import { CalendarIcon } from 'lucide-react';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ subscriptions }) => {
  // Get today's date
  const today = new Date();
  
  // Format relative time (e.g., "Today", "Tomorrow", "in 3 days")
  const getRelativeTime = (date: Date) => {
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if date is within the next 3 days
  const isWithinThreeDays = (date: Date) => {
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    return date <= threeDaysLater;
  };

  // Sort subscriptions by upcoming billing date
  const sortedSubscriptions = [...subscriptions]
    .filter(sub => sub.active)
    .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime())
    .slice(0, 5); // Only show the next 5 payments

  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
      <div className="flex items-center mb-4">
        <CalendarIcon className="w-5 h-5 mr-2 text-muted-foreground" />
        <h3 className="text-lg font-medium">Upcoming Payments</h3>
      </div>
      
      {sortedSubscriptions.length > 0 ? (
        <div className="space-y-4">
          {sortedSubscriptions.map((subscription) => (
            <div key={subscription.id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white font-semibold text-xs mr-3"
                  style={{ backgroundColor: subscription.color || '#333' }}
                >
                  {subscription.logo}
                </div>
                <div>
                  <p className="text-sm font-medium">{subscription.name}</p>
                  <p 
                    className={`text-xs ${
                      isToday(subscription.nextBillingDate) 
                        ? 'text-destructive font-semibold' 
                        : isWithinThreeDays(subscription.nextBillingDate)
                          ? 'text-amber-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {getRelativeTime(subscription.nextBillingDate)} • {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(subscription.amount, subscription.currency)}</p>
                <p className="text-xs text-muted-foreground">{subscription.billingCycle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No upcoming payments found</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingPayments;
