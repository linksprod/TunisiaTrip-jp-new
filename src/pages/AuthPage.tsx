
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TranslateText } from '@/components/translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';

const AuthPage = () => {
  const { user, isAdmin, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentLanguage, t } = useTranslation();

  // Log when component mounts for debugging
  useEffect(() => {
    console.log('AuthPage: Mounted at', new Date().toISOString());
    console.log('AuthPage: Current URL path:', window.location.pathname);
  }, []);

  // For debugging purposes
  useEffect(() => {
    console.log('AuthPage: User state changed:', {
      isLoggedIn: !!user,
      isAdmin,
      isLoading,
      path: window.location.pathname,
      locationPathname: location.pathname,
      href: window.location.href
    });
  }, [user, isAdmin, isLoading, location]);

  // Only redirect if user is authenticated AND admin status is confirmed (either true or false)
  // This prevents premature redirects before admin status is checked
  if (!isLoading && user && isAdmin !== null) {
    console.log(`User is authenticated, isAdmin=${isAdmin}, redirecting to admin dashboard`);
    return <Navigate to="/admin" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError(null);
    try {
      console.log(`Attempting to sign in with: ${email}`);
      await signIn(email, password);
      // No need to navigate here, the auth state listener will handle it
    } catch (error: any) {
      console.error('Sign in error in component:', error);
      setAuthError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-admin-primary" />
          <p className="mt-2 text-muted-foreground">
            <TranslateText text="Checking authentication..." language={currentLanguage} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            <TranslateText text="Admin Dashboard" language={currentLanguage} />
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            <TranslateText text="Sign in to access the admin features" language={currentLanguage} />
          </p>
        </div>

        <Card>
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle>
                <TranslateText text="Sign In" language={currentLanguage} />
              </CardTitle>
              <CardDescription>
                <TranslateText text="Enter your credentials to access the admin dashboard." language={currentLanguage} />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{authError}</span>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  <TranslateText text="Email" language={currentLanguage} />
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("you@example.com")}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  <TranslateText text="Password" language={currentLanguage} />
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-admin-primary hover:bg-admin-accent"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <TranslateText text="Please wait" language={currentLanguage} />
                  </>
                ) : (
                  <TranslateText text="Sign In" language={currentLanguage} />
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
