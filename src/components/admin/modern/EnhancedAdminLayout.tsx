import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
  Home,
  BookOpen,
  Users,
  Search,
  LogOut,
  ChevronRight,
  Shield,
  BarChart3,
  Settings,
  Globe
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';

interface EnhancedAdminLayoutProps {
  children: React.ReactNode;
}

export function EnhancedAdminLayout({ children }: EnhancedAdminLayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { currentLanguage, setLanguageWithReload, t } = useTranslation();

  const navItems = [
    {
      icon: Home,
      label: t("Dashboard"),
      href: "/admin"
    },
    {
      icon: BookOpen,
      label: t("Blog"),
      href: "/admin/blog"
    },
    {
      icon: Users,
      label: t("Contacts"),
      href: "/admin/contacts"
    },
    {
      icon: Search,
      label: t("SEO"),
      href: "/admin/seo"
    },
  ];

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (pathSegments.length > 0 && pathSegments[0] === 'admin') {
      breadcrumbs.push({ label: t('Admin'), href: '/admin' });

      if (pathSegments.length > 1) {
        const currentNavItem = navItems.find(item =>
          item.href === `/${pathSegments.slice(0, 2).join('/')}`
        );
        if (currentNavItem) {
          breadcrumbs.push({
            label: currentNavItem.label,
            href: currentNavItem.href
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen w-full bg-background">
      <ErrorBoundary>
        <SidebarProvider defaultExpanded={true}>
          <div className="flex min-h-screen w-full">
            <AdminSidebar
              navItems={navItems}
              user={user}
              userInitials={userInitials}
              onSignOut={signOut}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Modern Header */}
              <header className="h-16 border-b bg-card shadow-sm flex items-center px-6 gap-4">
                <SidebarTrigger />

                <div className="flex-1">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.href}>
                          <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                              <BreadcrumbPage className="font-semibold text-foreground">
                                {breadcrumb.label}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link
                                  to={{ pathname: breadcrumb.href, search: location.search }}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {breadcrumb.label}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLanguageWithReload(currentLanguage === 'JP' ? 'EN' : 'JP')}
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title={currentLanguage === 'JP' ? 'Switch to English' : '日本語に切り替え'}
                  >
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">
                      {currentLanguage === 'JP' ? 'Switch to English' : 'Switch to Japanese'}
                    </span>
                  </Button>
                  
                  <div className="h-6 w-[1px] bg-border mx-1" />
                  
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold shadow-inner">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </header>

              {/* Main content */}
              <div className="flex-1 p-8 overflow-auto bg-muted/30">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </ErrorBoundary>
    </div>
  );
}

interface AdminSidebarProps {
  navItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
  }>;
  user: any;
  userInitials: string;
  onSignOut: () => void;
}

function AdminSidebar({ navItems, user, userInitials, onSignOut }: AdminSidebarProps) {
  const { expanded } = useSidebar();
  const collapsed = !expanded;
  const location = useLocation();
  const { currentLanguage, t } = useTranslation();

  return (
    <Sidebar className="border-r bg-card shadow-sm">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Shield className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <TranslateText text="Admin Panel" language={currentLanguage} />
              </h2>
              <p className="text-sm text-muted-foreground">
                <TranslateText text="Tunisia Tourism" language={currentLanguage} />
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        h-11 px-4 rounded-lg transition-all duration-200 font-medium
                        ${isActive
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }
                      `}
                    >
                      <Link 
                        to={{ pathname: item.href, search: location.search }} 
                        className="flex items-center gap-3"
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                        {!collapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!collapsed && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate text-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  <TranslateText text="Administrator" language={currentLanguage} />
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              {t("Sign out")}
            </Button>
          </div>
        )}

        {collapsed && (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}