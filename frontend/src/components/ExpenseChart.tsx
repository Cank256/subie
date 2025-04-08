import { categories } from "../utils/mockData";
import { Subscription, CategoryInfo } from "../types/subscription";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ExpenseChartProps {
  subscriptions: Subscription[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ subscriptions }) => {
  // Calculate spending by category
  const calculateSpendingByCategory = (): ChartData[] => {
    const spending: Record<string, number> = {};
    
    subscriptions.forEach((sub) => {
      if (!sub.active) return;
      
      // Convert to monthly amount for consistent comparison
      let monthlyAmount = sub.amount;
      switch (sub.billingCycle) {
        case 'yearly':
          monthlyAmount = sub.amount / 12;
          break;
        case 'quarterly':
          monthlyAmount = sub.amount / 3;
          break;
        case 'weekly':
          monthlyAmount = sub.amount * 4.33; // Average weeks in a month
          break;
      }
      
      spending[sub.category] = (spending[sub.category] || 0) + monthlyAmount;
    });
    
    // Transform into chart data format
    return Object.keys(spending).map((category) => {
      const categoryInfo = categories.find((cat) => cat.name === category) as CategoryInfo;
      return {
        name: categoryInfo?.label || category,
        value: Number(spending[category].toFixed(2)),
        color: categoryInfo?.color || "#6c757d",
      };
    }).sort((a, b) => b.value - a.value);
  };

  const chartData = calculateSpendingByCategory();
  
  // Calculate total monthly spending
  const totalMonthly = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Format as currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ payload: ChartData }> 
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span className="font-medium">{formatCurrency(data.value)}</span>
            <span className="text-muted-foreground ml-1">
              ({((data.value / totalMonthly) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
      
      <div className="mt-2 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold">{formatCurrency(totalMonthly)}</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 space-y-2">
            {chartData.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{formatCurrency(category.value)}</span>
                  <span className="text-muted-foreground ml-1 text-xs">
                    ({((category.value / totalMonthly) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No active subscriptions
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
