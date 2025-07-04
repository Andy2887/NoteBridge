
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Bell, Shield, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import UserService from "@/service/AuthService";

interface UserSettingsForm {
  firstName: string;
  lastName: string;
  bio: string;
  phoneNumber: string;
  role: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  lessonReminders: boolean;
}

const UserSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.profileUrl || "");

  // Get token from localStorage (matching AuthContext pattern)
  const token = localStorage.getItem('token') || "";

  const form = useForm<UserSettingsForm>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      phoneNumber: user?.phoneNumber || "",
      role: user?.role || "",
      emailNotifications: true,
      marketingEmails: false,
      lessonReminders: true,
    },
  });

  const updateUserProfile = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await UserService.getProfile(token);
      if (response.statusCode === 200 && response.user) {
        // Update localStorage with the new user data
        UserService.setCurrentUser(response.user);
        // Update the profile image URL state with the latest data
        setProfileImageUrl(response.user.profileUrl || "");
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || 'Failed to fetch updated profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleProfileImageUpdate = async (newImageUrl: string) => {
    setProfileImageUrl(newImageUrl);
    // Update the user profile after image upload
    await updateUserProfile();
  };

  const onSubmit = async (data: UserSettingsForm) => {
    if (!user?.id || !token) {
      toast.error("Authentication required");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare user data for update (excluding notification preferences)
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        role: data.role as 'STUDENT' | 'TEACHER' | 'ADMIN'
      };

      // Call the updateUser API
      const response = await UserService.updateUser(user.id, userData, token);
      
      if (response.statusCode === 200) {
        // Update the user profile after successful update
        await updateUserProfile();
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would call an API to delete the account
      toast.success("Account deletion requested. You will receive a confirmation email.");
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-3xl font-bold">User Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center pb-4">
                <ProfileImageUpload
                  currentImage={profileImageUrl}
                  userInitials={user?.firstName?.charAt(0).toUpperCase() || "?"}
                  onImageUpdate={handleProfileImageUpdate}
                  userId={user?.id}
                  token={token}
                />
                <div className="mt-4">
                  <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-purple-100 text-purple-700">
                    <User size={16} />
                    <span className="font-medium">Profile</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md text-gray-600">
                    <Bell size={16} />
                    <span>Notifications</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md text-gray-600">
                    <Shield size={16} />
                    <span>Security</span>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            {user?.role === 'ADMIN' ? (
                              <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                                Admin
                              </div>
                            ) : (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="STUDENT">Student</SelectItem>
                                  <SelectItem value="TEACHER">Teacher</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself..." 
                              className="resize-none"
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">Email:</span>
                        <span>{user?.email}</span>
                        <span className="text-xs text-gray-500">(Email cannot be changed)</span>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                      <Save size={16} className="mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell size={20} />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emailNotifications" 
                    checked={form.watch("emailNotifications")}
                    onCheckedChange={(checked) => form.setValue("emailNotifications", checked as boolean)}
                  />
                  <Label htmlFor="emailNotifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email notifications for lesson updates
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="lessonReminders" 
                    checked={form.watch("lessonReminders")}
                    onCheckedChange={(checked) => form.setValue("lessonReminders", checked as boolean)}
                  />
                  <Label htmlFor="lessonReminders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lesson reminders 24 hours before
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketingEmails" 
                    checked={form.watch("marketingEmails")}
                    onCheckedChange={(checked) => form.setValue("marketingEmails", checked as boolean)}
                  />
                  <Label htmlFor="marketingEmails" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Marketing emails and promotions
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield size={20} />
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Logout</h4>
                      <p className="text-sm text-gray-600">Sign out of your account</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
