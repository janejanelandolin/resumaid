import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, UserMinus, Shield, Search, Mail, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserData {
  user_id: string;
  email: string;
  name?: string;
  is_admin: boolean;
  role_id?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch users and their roles
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get unique users from session_logs and their roles
      const { data: sessionUsers, error: sessionError } = await supabase
        .from('session_logs')
        .select('user_id, email, name')
        .not('user_id', 'is', null);

      if (sessionError) throw sessionError;

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, id');

      if (rolesError) throw rolesError;

      // Combine and deduplicate users
      const uniqueUsers = sessionUsers?.reduce((acc: UserData[], current) => {
        if (!acc.find(user => user.user_id === current.user_id)) {
          const userRole = userRoles?.find(role => role.user_id === current.user_id);
          acc.push({
            user_id: current.user_id,
            email: current.email,
            name: current.name,
            is_admin: userRole?.role === 'admin',
            role_id: userRole?.id
          });
        }
        return acc;
      }, []) || [];

      setUsers(uniqueUsers);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Grant admin privileges
  const grantAdmin = async (userId: string, email: string) => {
    try {
      setIsProcessing(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Admin privileges granted",
        description: `${email} is now an admin`,
      });

      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error granting admin privileges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // Revoke admin privileges
  const revokeAdmin = async (userId: string, email: string, roleId?: string) => {
    try {
      setIsProcessing(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Admin privileges revoked",
        description: `${email} is no longer an admin`,
      });

      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error revoking admin privileges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // Add admin by email
  const addAdminByEmail = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing('search');

      // First check if user exists in our system
      const { data: existingUser, error: searchError } = await supabase
        .from('session_logs')
        .select('user_id, email, name')
        .eq('email', searchEmail.trim())
        .limit(1)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      if (!existingUser) {
        toast({
          title: "User not found",
          description: "This email is not associated with any user in the system",
          variant: "destructive",
        });
        return;
      }

      // Check if already admin
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', existingUser.user_id)
        .eq('role', 'admin')
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      if (existingRole) {
        toast({
          title: "Already an admin",
          description: `${searchEmail} already has admin privileges`,
          variant: "destructive",
        });
        return;
      }

      // Grant admin privileges
      await grantAdmin(existingUser.user_id, existingUser.email);
      setSearchEmail('');
      
    } catch (error: any) {
      toast({
        title: "Error adding admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage admin privileges for users in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add admin by email */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email-search">Grant admin privileges by email</Label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email-search"
                    type="email"
                    placeholder="Enter email address..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addAdminByEmail();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={addAdminByEmail}
                  disabled={isProcessing === 'search' || !searchEmail.trim()}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {isProcessing === 'search' ? 'Adding...' : 'Add Admin'}
                </Button>
              </div>
            </div>
          </div>

          {/* Users table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {user.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_admin ? "default" : "secondary"}>
                          {user.is_admin ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.is_admin ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={isProcessing === user.user_id}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <UserMinus className="h-4 w-4" />
                                Revoke Admin
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Admin Privileges</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke admin privileges for <strong>{user.email}</strong>? 
                                  This action will remove their access to the admin panel.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => revokeAdmin(user.user_id, user.email, user.role_id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Revoke Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => grantAdmin(user.user_id, user.email)}
                            disabled={isProcessing === user.user_id}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                          >
                            <UserPlus className="h-4 w-4" />
                            {isProcessing === user.user_id ? 'Granting...' : 'Grant Admin'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;