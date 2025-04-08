import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Download,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useAuth from '@/hooks/useAuth';
import Layout from '@/components/Layout';

// Mock data for the dashboard
const mockData = {
  totalUsers: 1245,
  activeUsers: 876,
  newUsersThisMonth: 124,
  totalRevenue: 45678.90,
  revenueGrowth: 12.5,
  userGrowth: 8.3,
  activeUserGrowth: 5.7,
  conversionRate: 3.2,
  conversionRateChange: -0.5,
  avgSessionDuration: '12m 34s',
  avgSessionDurationChange: 1.2,
  recentUsers: [
    { id: '1', name: 'John Doe', email: 'john@example.com', joined: '2023-04-01T10:30:00Z', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', joined: '2023-04-02T14:45:00Z', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', joined: '2023-04-03T09:15:00Z', status: 'inactive' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', joined: '2023-04-04T16:20:00Z', status: 'active' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', joined: '2023-04-05T11:10:00Z', status: 'active' },
  ],
  recentPayments: [
    { id: 'pay_1', user: 'John Doe', amount: 29.99, date: '2023-04-01T10:30:00Z', status: 'completed' },
    { id: 'pay_2', user: 'Jane Smith', amount: 49.99, date: '2023-04-02T14:45:00Z', status: 'completed' },
    { id: 'pay_3', user: 'Bob Johnson', amount: 19.99, date: '2023-04-03T09:15:00Z', status: 'failed' },
    { id: 'pay_4', user: 'Alice Williams', amount: 99.99, date: '2023-04-04T16:20:00Z', status: 'completed' },
    { id: 'pay_5', user: 'Charlie Brown', amount: 39.99, date: '2023-04-05T11:10:00Z', status: 'pending' },
  ],
  userActivity: [
    { date: '2023-03-30', users: 120 },
    { date: '2023-03-31', users: 135 },
    { date: '2023-04-01', users: 145 },
    { date: '2023-04-02', users: 150 },
    { date: '2023-04-03', users: 160 },
    { date: '2023-04-04', users: 170 },
    { date: '2023-04-05', users: 180 },
  ],
  revenueData: [
    { date: '2023-03-30', revenue: 1200 },
    { date: '2023-03-31', revenue: 1350 },
    { date: '2023-04-01', revenue: 1450 },
    { date: '2023-04-02', revenue: 1500 },
    { date: '2023-04-03', revenue: 1600 },
    { date: '2023-04-04', revenue: 1700 },
    { date: '2023-04-05', revenue: 1800 },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState(mockData);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is admin
  useEffect(() => {
    if (user && !user.is_admin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, you would call the API to fetch dashboard data
        // For now, we'll just simulate it with mock data
        setTimeout(() => {
          setData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast, timeRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="flex items-center text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            Inactive
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="mr-1 h-4 w-4" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="mr-1 h-4 w-4" />
            Failed
          </span>
        );
      default:
        return status;
    }
  };

  const getGrowthIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600">
          <ArrowUpRight className="mr-1 h-4 w-4" />
          {value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-600">
          <ArrowDownRight className="mr-1 h-4 w-4" />
          {Math.abs(value).toFixed(1)}%
        </span>
      );
    } else {
      return <span className="text-gray-500">0%</span>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getGrowthIndicator(data.userGrowth)}
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.activeUsers.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getGrowthIndicator(data.activeUserGrowth)}
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getGrowthIndicator(data.revenueGrowth)}
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.newUsersThisMonth.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>This month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.conversionRate}%</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getGrowthIndicator(data.conversionRateChange)}
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.avgSessionDuration}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getGrowthIndicator(data.avgSessionDurationChange)}
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="text-2xl font-bold">All Systems Operational</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>Last checked: {new Date().toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full flex items-end justify-between">
                      {data.userActivity.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-primary rounded-t-sm" 
                            style={{ 
                              height: `${(day.users / Math.max(...data.userActivity.map(d => d.users))) * 250}px` 
                            }}
                          ></div>
                          <span className="text-xs mt-2">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Daily revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full flex items-end justify-between">
                      {data.revenueData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-green-500 rounded-t-sm" 
                            style={{ 
                              height: `${(day.revenue / Math.max(...data.revenueData.map(d => d.revenue))) * 250}px` 
                            }}
                          ></div>
                          <span className="text-xs mt-2">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(user.joined)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.user}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
