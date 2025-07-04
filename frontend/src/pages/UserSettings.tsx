
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Bell, Shield, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ProfileImageUpload from "@/components/ProfileImageUpload";

interface UserSettingsForm {
  name: string;
  email: string;
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
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || "",
      email: user?.email || "",
      emailNotifications: true,
      marketingEmails: false,
      lessonReminders: true,
    },
  });

  const handleProfileImageUpdate = (newImageUrl: string) => {
    setProfileImageUrl(newImageUrl);
    // Here you could also update the user context or make an API call to update user profile
  };

  const onSubmit = async (data: UserSettingsForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Saving user settings:", data);
    toast.success("Settings saved successfully!");
    setIsLoading(false);
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
                  <CardTitle>{user?.firstName}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
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
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
