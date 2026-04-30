
import React, { useState, useEffect } from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, UserPlus, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminUsersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminRoles, setAdminRoles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch admin roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) {
        console.warn("Could not fetch roles (might be RLS):", rolesError);
      }

      const adminUserIds = new Set((rolesData || []).map(r => r.user_id));
      setAdminRoles(adminUserIds);
      setProfiles(profilesData || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Failed to load users.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGrantAdminByEmail = async () => {
    if (!newAdminEmail) return;
    
    if (newAdminPassword && newAdminPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Passwords do not match.")
      });
      return;
    }

    setLoading(true);
    try {
      let targetUserId: string | null = null;

      // 1. Check if user already exists in profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail)
        .maybeSingle();

      if (existingProfile) {
        targetUserId = existingProfile.id;
      } else if (newAdminPassword) {
        // 2. If not and password is provided, try to create the user
        // Note: In a real app, you'd use an edge function or admin API to avoid signing out current user
        // But for this simple implementation, we'll use signUp
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: newAdminEmail,
          password: newAdminPassword,
          options: {
            data: { is_admin: true }
          }
        });

        if (signUpError) throw signUpError;
        if (authData.user) {
          targetUserId = authData.user.id;
        }
      }

      if (!targetUserId) {
        throw new Error(t("User not found and no password provided to create account."));
      }

      // 3. Grant role (this will work if the admin has permission to insert into user_roles)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: targetUserId, role: 'admin' });

      // We ignore unique constraint error (user already has role)
      if (roleError && !roleError.message.includes('unique constraint')) {
        throw roleError;
      }

      // 4. Update profile flag for legacy support
      await supabase.from('profiles').update({ is_admin: true }).eq('id', targetUserId);

      toast({
        title: t("Success"),
        description: `${newAdminEmail} ${t("has been granted administrator access.")}`
      });
      setIsAddDialogOpen(false);
      setNewAdminEmail("");
      setNewAdminPassword("");
      setConfirmPassword("");
      fetchData();
    } catch (error: any) {
      console.error("Add admin error:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    setActionLoading(userId);
    try {
      if (currentIsAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
        
        // Also update profiles table for legacy support if it exists
        await supabase.from('profiles').update({ is_admin: false }).eq('id', userId);

        toast({
          title: t("Role Removed"),
          description: t("Admin privileges removed successfully.")
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;

        // Also update profiles table for legacy support
        await supabase.from('profiles').update({ is_admin: true }).eq('id', userId);

        toast({
          title: t("Role Granted"),
          description: t("Admin privileges granted successfully.")
        });
      }
      fetchData();
    } catch (error: any) {
      console.error("Error toggling admin role:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message || t("Failed to update user role.")
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <EnhancedAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <TranslateText text="User Management" />
            </h1>
            <p className="text-muted-foreground mt-2">
              <TranslateText text="Manage administrator roles and permissions." />
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <TranslateText text="Refresh" />
            </Button>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <TranslateText text="Create or Grant Admin Access" />
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <TranslateText text="User Email" />
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <TranslateText text="Password" />
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">
                  <TranslateText text="Required to create a new account. Leave empty to only promote an existing user." />
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <TranslateText text="Confirm Password" />
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-md" 
                  onClick={handleGrantAdminByEmail}
                  disabled={loading || !newAdminEmail}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  <TranslateText text="Create & Grant Access" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <TranslateText text="Administrators & Users" />
            </CardTitle>
            <CardDescription>
              <TranslateText text="Assign admin roles to existing users. Users must first create an account." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">
                  <TranslateText text="Loading users..." />
                </p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                  <TranslateText text="No users found." />
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TranslateText text="User" />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Joined" />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Role" />
                    </TableHead>
                    <TableHead className="text-right">
                      <TranslateText text="Actions" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map(profile => {
                    const isUserAdmin = adminRoles.has(profile.id) || profile.is_admin;
                    return (
                      <TableRow key={profile.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{profile.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {isUserAdmin ? (
                            <Badge className="bg-primary text-primary-foreground border-0 gap-1 px-2">
                              <ShieldCheck className="h-3 w-3" />
                              <TranslateText text="Administrator" />
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 px-2">
                              <TranslateText text="User" />
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={isUserAdmin ? "outline" : "default"}
                            size="sm"
                            className={isUserAdmin ? "text-destructive hover:bg-destructive/10" : "bg-primary hover:bg-primary/90 shadow-sm"}
                            onClick={() => handleToggleAdmin(profile.id, isUserAdmin)}
                            disabled={actionLoading === profile.id}
                          >
                            {actionLoading === profile.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-2" />
                            ) : isUserAdmin ? (
                              <ShieldAlert className="h-3 w-3 mr-2" />
                            ) : (
                              <ShieldCheck className="h-3 w-3 mr-2" />
                            )}
                            {isUserAdmin ? (
                              <TranslateText text="Remove Admin" />
                            ) : (
                              <TranslateText text="Make Admin" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </EnhancedAdminLayout>
  );
};

export default AdminUsersPage;
