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
  UserPlus, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useAuth from '@/hooks/useAuth';
import { UserPublic } from "@/client/types.gen";
import { UsersService } from "@/client/sdk.gen";
import Layout from '@/components/Layout';

const Users = () => {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserPublic | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    is_admin: false,
  });
  const [editUser, setEditUser] = useState({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    is_admin: false,
  });
  
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await UsersService.readUsers();
        if (response && response.data) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = async (user: UserPublic) => {
    setCurrentUser(user);
    setEditUser({
      id: user.id,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      is_admin: user.is_admin,
    });
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = async (user: UserPublic) => {
    const userId = user.id;
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid user ID",
      });
      return;
    }
    
    try {
      await UsersService.deleteUser({ userId });
      setUsers(users.filter(u => u.id !== userId));
      setFilteredUsers(filteredUsers.filter(u => u.id !== userId));
      setIsDeleteUserModalOpen(false);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    }
  };

  const handleSaveNewUser = async () => {
    try {
      const response = await UsersService.createUser({
        requestBody: {
          email: newUser.email,
          password: 'changeme123',
          is_superuser: newUser.is_admin,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
        },
      });
      
      setUsers([...users, response]);
      setFilteredUsers([...filteredUsers, response]);
      setIsAddUserModalOpen(false);
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        is_admin: false,
      });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user",
      });
    }
  };

  const handleSaveEditUser = async () => {
    const userId = editUser.id;
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid user ID",
      });
      return;
    }

    try {
      const response = await UsersService.updateUser({
        userId,
        requestBody: {
          email: editUser.email,
          first_name: editUser.first_name,
          last_name: editUser.last_name,
          is_admin: editUser.is_admin,
        },
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? response 
          : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === userId 
          ? response 
          : user
      ));
      setIsEditUserModalOpen(false);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      await UsersService.deleteUser({ userId: currentUser.id });
      
      setUsers(users.filter(user => user.id !== currentUser.id));
      setFilteredUsers(users.filter(user => user.id !== currentUser.id));
      setIsDeleteUserModalOpen(false);
      
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Admin
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle className="mr-1 h-4 w-4" />
                          User
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? 'Admin' : 'User'}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at || '')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
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

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={newUser.first_name}
                onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={newUser.last_name}
                onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_admin" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.is_admin ? "admin" : "user"}
                onValueChange={(value) => setNewUser({...newUser, is_admin: value === "admin"})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Make changes below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="edit-first_name"
                value={editUser.first_name}
                onChange={(e) => setEditUser({...editUser, first_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="edit-last_name"
                value={editUser.last_name}
                onChange={(e) => setEditUser({...editUser, last_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-is_admin" className="text-right">
                Role
              </Label>
              <Select
                value={editUser.is_admin ? "admin" : "user"}
                onValueChange={(value) => setEditUser({...editUser, is_admin: value === "admin"})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={isDeleteUserModalOpen} onOpenChange={setIsDeleteUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentUser?.email}</p>
            <p className="text-sm text-muted-foreground">
              {currentUser?.first_name && currentUser?.last_name 
                ? `${currentUser.first_name} ${currentUser.last_name}` 
                : 'No name provided'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  );
};

export default Users; 