import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  MoreHorizontal, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useAuth from '@/hooks/useAuth';
import Layout from '@/components/Layout';

// Define payment type
interface Payment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  payment_method: string;
  subscription_id: string;
  created_at: string;
  updated_at: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isViewPaymentModalOpen, setIsViewPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
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

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // In a real app, you would call the API to fetch payments
        // For now, we'll just simulate it with mock data
        const mockPayments: Payment[] = [
          {
            id: 'pay_1',
            user_id: 'user_1',
            user_email: 'user1@example.com',
            amount: 29.99,
            currency: 'USD',
            status: 'completed',
            payment_method: 'credit_card',
            subscription_id: 'sub_1',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updated_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'pay_2',
            user_id: 'user_2',
            user_email: 'user2@example.com',
            amount: 49.99,
            currency: 'USD',
            status: 'pending',
            payment_method: 'credit_card',
            subscription_id: 'sub_2',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updated_at: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 'pay_3',
            user_id: 'user_3',
            user_email: 'user3@example.com',
            amount: 19.99,
            currency: 'USD',
            status: 'failed',
            payment_method: 'credit_card',
            subscription_id: 'sub_3',
            created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            updated_at: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: 'pay_4',
            user_id: 'user_4',
            user_email: 'user4@example.com',
            amount: 99.99,
            currency: 'USD',
            status: 'refunded',
            payment_method: 'credit_card',
            subscription_id: 'sub_4',
            created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            updated_at: new Date(Date.now() - 345600000).toISOString(),
          },
        ];
        
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  // Filter payments based on search term and status
  useEffect(() => {
    let filtered = payments;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.subscription_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleViewPayment = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsViewPaymentModalOpen(true);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // In a real app, you would generate and download a receipt
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment ${payment.id} has been downloaded.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
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
      case 'refunded':
        return (
          <span className="flex items-center text-blue-600">
            <DollarSign className="mr-1 h-4 w-4" />
            Refunded
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <Layout>
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments Management</h1>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono">{payment.id}</TableCell>
                    <TableCell>{payment.user_email}</TableCell>
                    <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{formatDate(payment.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Payment Modal */}
      <Dialog open={isViewPaymentModalOpen} onOpenChange={setIsViewPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about the payment.
            </DialogDescription>
          </DialogHeader>
          {currentPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Payment ID</Label>
                <div className="col-span-3 font-mono">{currentPayment.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">User</Label>
                <div className="col-span-3">{currentPayment.user_email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Amount</Label>
                <div className="col-span-3">{formatCurrency(currentPayment.amount, currentPayment.currency)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status</Label>
                <div className="col-span-3">{getStatusBadge(currentPayment.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Payment Method</Label>
                <div className="col-span-3 capitalize">{currentPayment.payment_method.replace('_', ' ')}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Subscription ID</Label>
                <div className="col-span-3 font-mono">{currentPayment.subscription_id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Created</Label>
                <div className="col-span-3">{formatDate(currentPayment.created_at)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Last Updated</Label>
                <div className="col-span-3">{formatDate(currentPayment.updated_at)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPaymentModalOpen(false)}>
              Close
            </Button>
            {currentPayment && (
              <Button onClick={() => handleDownloadReceipt(currentPayment)}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  );
};

export default Payments; 