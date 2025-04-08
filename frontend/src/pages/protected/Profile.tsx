import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  User, 
  Lock, 
  Bell, 
  Save,
  Pencil,
  Calendar,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import {  
  signOutSession,
  signOutAllSessions,
} from '@/utils/profileUtils';
import { timezones, languages, currencies } from '@/utils/profileConstants';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Session } from '@/client';

const Profile = () => {
  const { toast } = useToast();
  const { user, sessions, logUserSession, updateUser, updatePassword, saveUserPreferences } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [photoLoading, setPhotoLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    timezone: 'Africa/Kampala',
    language: 'English',
    currency: 'UGX'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: true,
    reminder_days: 3,
    billing_updates: true,
    new_features: true,
    tips: false,
    newsletter: true
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user?.email || '',
        phone: user.phone || '',
        timezone: user.timezone || 'Africa/Kampala',
        language: user.language || 'English',
        currency: user.currency || 'UGX'
      });
      setUserSessions(sessions || []);
      
      // Load notification settings
      const loadNotificationSettings = async () => {
        if (!user) return;
        
        const notificationSettings = user.preferences;
        
        if (notificationSettings) {
          setNotifications({
            email_notifications: notificationSettings.email_notifications || false,
            push_notifications: notificationSettings.push_notifications || false,
            sms_notifications: notificationSettings.sms_notifications || false,
            reminder_days: notificationSettings.reminder_days || 3,
            billing_updates: notificationSettings.billing_updates || false,
            new_features: notificationSettings.new_features || false,
            tips: notificationSettings.tips || false,
            newsletter: notificationSettings.newsletter || false
          });
        }
      };
      
      loadNotificationSettings();
    }
  }, [user, sessions]);
  
  const handleSwitchChange = async (key: string, value: boolean) => {
    const { success } = await saveUserPreferences({ requestBody: {
      [key]: value
    }})

    if (success) {
      toast({
        title: "Preferences saved",
        description: "Your settings have been updated successfully.",
      });

      setNotifications(prev => ({
        ...prev,
        [key]: value
      }));

    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences. Please try again.",
      });
    }
  };
  
  const handleNumericPreferenceChange = async (key: string, value: number) => {
    const { success } = await saveUserPreferences({ requestBody: {
      [key]: value
    }})

    if (success) {
      toast({
        title: "Preferences saved",
        description: "Your settings have been updated successfully.",
      });

      setNotifications(prev => ({
        ...prev,
        [key]: value
      }));

    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences. Please try again.",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validatePasswordForm = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: ''
    };
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (passwordForm.newPassword == passwordForm.currentPassword) {
      errors.newPassword = 'New password cannot be the same as the current password';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    
    return !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    const { success, error } = await updatePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    
    setLoading(false);
    
    if (success) {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        general: error || 'Failed to update password'
      }));
    }
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    const updatedProfile = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      timezone: formData.timezone,
      language: formData.language,
      currency: formData.currency
    };
    
    const { success, error } = await updateUser(updatedProfile);
    
    setLoading(false);
    
    if (success) {
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error || "There was a problem updating your profile",
      });
    }
  };
  
  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || !e.target.files[0] || !user) return;
    
  //   const file = e.target.files[0];
    
  //   if (file.size > 5 * 1024 * 1024) {
  //     toast({
  //       variant: "destructive",
  //       title: "File too large",
  //       description: "Profile picture must be less than 5MB",
  //     });
  //     return;
  //   }
    
  //   if (!file.type.startsWith('image/')) {
  //     toast({
  //       variant: "destructive",
  //       title: "Invalid file type",
  //       description: "Please upload an image file",
  //     });
  //     return;
  //   }
    
  //   setPhotoLoading(true);
    
  //   try {
  //     // Compress the image before uploading
  //     const compressedFile = await compressImage(file);
      
  //     const { success, error } = await updateUser({avatar_url: compressedFile});
      
  //     if (success) {
  //       toast({
  //         title: "Photo uploaded",
  //         description: "Your profile photo has been updated",
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Upload failed",
  //         description: error || "There was a problem uploading your photo",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Upload failed",
  //       description: "There was a problem processing your image",
  //     });
  //   } finally {
  //     setPhotoLoading(false);
  //   }
  // };
  
  // const handleRemovePhoto = async () => {
  //   if (!user) return;
    
  //   setPhotoLoading(true);
    
  //   const { success, error } = await removeProfilePhoto(user.id);
    
  //   setPhotoLoading(false);
    
  //   if (success) {
  //     if (updateUser) {
  //       await updateUser({ avatar_url: null });
  //     }
      
  //     toast({
  //       title: "Photo removed",
  //       description: "Your profile photo has been removed",
  //     });
  //   } else {
  //     toast({
  //       variant: "destructive",
  //       title: "Remove failed",
  //       description: error || "There was a problem removing your photo",
  //     });
  //   }
  // };
  
  const handleSignOutSession = async (sessionId: string) => {
    setSessionLoading(true);
    
    const { success, error } = await signOutSession(sessionId);
    
    if (success) {
      logUserSession(user?.id || '');
      
      toast({
        title: "Session signed out",
        description: "The device has been signed out successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error || "Failed to sign out the device",
      });
    }
    
    setSessionLoading(false);
  };
  
  const handleSignOutAllSessions = async () => {
    if (!user) return;
    
    setSessionLoading(true);
    
    const { success, error } = await signOutAllSessions(user.id);
    
    if (success) {
      logUserSession(user.id);
      
      toast({
        title: "All sessions signed out",
        description: "All other devices have been signed out",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error || "Failed to sign out all devices",
      });
    }
    
    setSessionLoading(false);
  };
  
  // const getInitials = () => {
  //   if (!user) return 'U';
    
  //   const firstInitial = user.first_name ? user.first_name[0] : '';
  //   const lastInitial = user.last_name ? user.last_name[0] : '';
    
  //   return (firstInitial + lastInitial).toUpperCase() || 'U';
  // };
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile information...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>
        
        <Tabs defaultValue="personal" className="space-y-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={loading}
                      >
                        {isEditing ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Pencil className="h-4 w-4 mr-1" />
                        )}
                        {isEditing ? 'Done' : 'Edit'}
                      </Button>
                    </div>
                    <CardDescription>Update your personal information and how we can reach you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name" 
                            name="first_name" 
                            value={formData.first_name} 
                            onChange={handleInputChange}
                            disabled={!isEditing || loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name" 
                            name="last_name" 
                            value={formData.last_name} 
                            onChange={handleInputChange}
                            disabled={!isEditing || loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            disabled={true}
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange}
                            disabled={!isEditing || loading}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={formData.timezone}
                            onValueChange={(value) => handleSelectChange('timezone', value)}
                            disabled={!isEditing || loading}
                          >
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {timezones.map((timezone) => (
                                <SelectItem key={timezone.value} value={timezone.value}>
                                  {timezone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select
                            value={formData.language}
                            onValueChange={(value) => handleSelectChange('language', value)}
                            disabled={!isEditing || loading}
                          >
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                  {language.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={formData.currency}
                            onValueChange={(value) => handleSelectChange('currency', value)}
                            disabled={!isEditing || loading}
                          >
                            <SelectTrigger id="currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                  {currency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="mt-6">
                          <Button 
                            type="submit" 
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="flex items-center">
                                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                Saving...
                              </span>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Account Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Member Since</span>
                          <span>{user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plan</span>
                          <span className="text-green-500 font-medium">
                            {user.plan_id === 'premium' ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>

                      <Button size="sm" className="mt-4" onClick={() => navigate('/billing')}>
                        Upgrade Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Personalize your account with a profile photo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user.first_name || 'User'} />
                      ) : (
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-2 w-full">
                      <label htmlFor="photo-upload">
                        <Button variant="outline" className="w-full cursor-pointer" asChild>
                          <div className="flex items-center">
                            {photoLoading ? (
                              <span className="flex items-center">
                                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></span>
                                Uploading...
                              </span>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Photo
                              </>
                            )}
                          </div>
                        </Button>
                      </label>
                      <input 
                        id="photo-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={photoLoading}
                      />
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={handleRemovePhoto}
                        disabled={photoLoading || !user.avatar_url}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}
                
                <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/30">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Delete Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 text-red-600/80 dark:text-red-400/80">
                      Once you delete your account, there is no going back. All of your data will be permanently removed.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings to keep your account safe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      {passwordErrors.general && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                          {passwordErrors.general}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password" 
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password" 
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password" 
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                            Updating...
                          </span>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </form>
                    
                    <Separator className="my-8" />
                    
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication (2FA)</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-medium">Protect your account with 2FA</p>
                        <p className="text-muted-foreground text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            toast({
                              title: "Coming Soon",
                              description: "Two-factor authentication will be available in a future update.",
                              duration: 4000,
                            });
                            // Automatically turn off the switch after a short delay
                            setTimeout(() => {
                              const switchElement = document.querySelector('[data-state="checked"]');
                              if (switchElement) {
                                switchElement.setAttribute('data-state', 'unchecked');
                              }
                            }, 100);
                          }
                        }} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When 2FA is enabled, you'll be required to enter a code from your authenticator app in addition to your password when signing in.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Login Sessions</CardTitle>
                    <CardDescription>Manage devices where you're currently logged in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sessionLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading your sessions...</p>
                      </div>
                    ) : userSessions.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No active sessions found</p>
                    ) : (
                      <div className="space-y-4">
                        {userSessions.map((session) => (
                          <div key={session.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {session.device_name} on {session.device_type}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {session.location || 'Unknown location'} • Last active: {
                                  session.last_active 
                                    ? new Date(session.last_active).toLocaleString() 
                                    : 'Unknown'
                                }
                              </p>
                            </div>
                            {session.is_current ? (
                              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Current</span>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSignOutSession(session.id)}
                              >
                                Sign Out
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={handleSignOutAllSessions}
                      disabled={sessionLoading || userSessions.filter(s => !s.is_current).length === 0}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out of All Other Devices
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Activity</CardTitle>
                    <CardDescription>
                      Recent security events for your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-2 border-green-500 pl-4 py-1">
                      <p className="text-sm font-medium">Last Successful login</p>
                      <p className="text-xs text-muted-foreground">Today, {new Date().toLocaleTimeString()}</p>
                    </div>
                    {userSessions.length > 1 && (
                      <div className="border-l-2 border-green-500 pl-4 py-1">
                        <p className="text-sm font-medium">New device logged in</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(userSessions[1]?.created_at || new Date()).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div className="border-l-2 border-green-500 pl-4 py-1">
                      <p className="text-sm font-medium">Profile updated</p>
                      <p className="text-xs text-muted-foreground">
                        {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-4 py-1">
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-xs text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    <Button variant="link" className="text-xs p-0">View full activity log</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm font-medium">Use a strong password</p>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm font-medium">Enable 2FA for additional security</p>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm font-medium">Don't share your password</p>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm font-medium">Sign out from unused devices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={notifications.email_notifications}
                          onCheckedChange={(checked) => handleSwitchChange('email_notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications in-app and on your devices</p>
                        </div>
                        <Switch 
                          id="push-notifications"
                          checked={notifications.push_notifications}
                          onCheckedChange={(checked) => handleSwitchChange('push_notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive important notifications via SMS</p>
                        </div>
                        <Switch 
                          id="sms-notifications"
                          checked={notifications.sms_notifications}
                          onCheckedChange={(checked) => handleSwitchChange('sms_notifications', checked)}
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="billing-updates">Billing Updates</Label>
                          <p className="text-sm text-muted-foreground">Invoices, payment confirmations, and billing issues</p>
                        </div>
                        <Switch 
                          id="billing-updates"
                          checked={notifications.billing_updates}
                          onCheckedChange={(checked) => handleSwitchChange('billing_updates', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="new-features">New Features</Label>
                          <p className="text-sm text-muted-foreground">Updates about new features and improvements</p>
                        </div>
                        <Switch 
                          id="new-features"
                          checked={notifications.new_features}
                          onCheckedChange={(checked) => handleSwitchChange('new_features', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="tips">Tips & Tutorials</Label>
                          <p className="text-sm text-muted-foreground">Helpful tips to get the most out of Subie</p>
                        </div>
                        <Switch 
                          id="tips"
                          checked={notifications.tips}
                          onCheckedChange={(checked) => handleSwitchChange('tips', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base" htmlFor="newsletter">Newsletter</Label>
                          <p className="text-sm text-muted-foreground">Monthly newsletter with subscription trends and updates</p>
                        </div>
                        <Switch 
                          id="newsletter"
                          checked={notifications.newsletter}
                          onCheckedChange={(checked) => handleSwitchChange('newsletter', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Notifications</CardTitle>
                    <CardDescription>Notifications you'll receive soon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div className="border-l-2 border-primary pl-4 py-1">
                      <p className="text-sm font-medium">Netflix Renewal</p>
                      <p className="text-xs text-muted-foreground">In 3 days • $15.99 monthly</p>
                    </div> */}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Notification Schedule</CardTitle>
                    <CardDescription>
                      Set custom notification timing for renewals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="reminder-days">Days Before Renewal</Label>
                      <div className="flex space-x-2">
                        <Select 
                          value={(notifications.reminder_days || 3).toString()} 
                          onValueChange={(value) => handleNumericPreferenceChange('reminder_days', parseInt(value))}
                        >
                          <SelectTrigger id="remindersBefore" className="mt-2">
                            <SelectValue placeholder="Select days before" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day before</SelectItem>
                            <SelectItem value="3">3 days before</SelectItem>
                            <SelectItem value="5">5 days before</SelectItem>
                            <SelectItem value="7">7 days before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a notification this many days before each subscription renewal.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Did you know?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Setting up notifications for your subscriptions can help you avoid surprise charges and make informed decisions about which services to keep or cancel.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
