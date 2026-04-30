import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Zap,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  BarChart3,
  Activity,
  Plus,
  ArrowUpRight,
  MessageSquare,
  FileText,
  Globe,
  Sparkles
} from "lucide-react";
import { useBlogAnalytics } from "@/hooks/use-blog-analytics";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

export const ModernDashboard = () => {
  const { analytics, isLoading: loadingAnalytics, error: analyticsError } = useBlogAnalytics();
  const performanceMetrics = usePerformanceMetrics();
  const { toast } = useToast();
  const { currentLanguage, t } = useTranslation();

  React.useEffect(() => {
    if (analyticsError) {
      toast({
        title: t("Error loading analytics"),
        description: analyticsError.message,
        variant: "destructive"
      });
    }
  }, [analyticsError, toast, t]);

  if (loadingAnalytics) {
    return <DashboardSkeleton />;
  }

  const metrics = [
    {
      title: t("Total Posts"),
      value: analytics.totalPosts,
      change: analytics.postGrowthRate,
      changeLabel: t("from last month"),
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      trend: analytics.postGrowthRate >= 0 ? "up" : "down"
    },
    {
      title: t("Total Contacts"),
      value: analytics.totalContacts,
      change: analytics.contactGrowthRate,
      changeLabel: t("from last month"),
      icon: MessageSquare,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      trend: analytics.contactGrowthRate >= 0 ? "up" : "down"
    },
    {
      title: t("Avg. Read Time"),
      value: `${analytics.averageReadTime}m`,
      change: 2.5,
      changeLabel: t("from last month"),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      trend: "up"
    },
    {
      title: t("Monthly Views"),
      value: analytics.monthlyViews > 999 
        ? `${(analytics.monthlyViews / 1000).toFixed(1)}k` 
        : analytics.monthlyViews,
      change: 15.8,
      changeLabel: t("from last month"),
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      trend: "up"
    }
  ];

  const quickActions = [
    {
      title: t("Create Blog Post"),
      description: t("Write a new article"),
      icon: FileText,
      href: "/admin/blog",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: t("Manage Contacts"),
      description: t("Contact administration"),
      icon: MessageSquare,
      href: "/admin/contacts",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: t("Manage Users"),
      description: t("User administration"),
      icon: Users,
      href: "/admin/users",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    }
  ];

  const recentActivity = [
    {
      action: t("New blog post published"),
      title: t("Sahara Expedition: Star Wars Sites, Luxury Stay & Desert Adventure"),
      time: t("2 hours ago"),
      type: "publish",
      icon: FileText
    },
    {
      action: t("Article updated"),
      title: t("El Medina District"),
      time: t("4 hours ago"),
      type: "update",
      icon: BookOpen
    },
    {
      action: t("New contact message"),
      title: t("Travel inquiry from Sarah"),
      time: t("6 hours ago"),
      type: "message",
      icon: MessageSquare
    },
    {
      action: t("SEO optimization completed"),
      title: t("Atlantis"),
      time: t("1 day ago"),
      type: "seo",
      icon: Globe
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-gradient-to-r from-[hsl(var(--admin-gradient-start))] to-[hsl(var(--admin-gradient-end))] rounded-2xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-3xl font-bold">{t("Welcome back!")}</h1>
          </div>
          <p className="text-blue-100 text-lg">
            {t("Here's what's happening with your content today.")}
          </p>
        </div>
        <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
          <Link to="/admin/blog" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("Create New Post")}
          </Link>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className={cn(
            "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300",
            metric.borderColor,
            "bg-white dark:bg-gray-900"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {metric.title}
              </CardTitle>
              <div className={cn("p-3 rounded-xl", metric.bgColor)}>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metric.value}
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className={cn(
                  "h-4 w-4 mr-1",
                  metric.change > 0 ? "text-emerald-500" : "text-red-500"
                )} />
                <span className={cn(
                  "font-medium",
                  metric.change > 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {metric.change > 0 ? "+" : ""}{Math.abs(metric.change)}%
                </span>
                <span className="text-gray-500 ml-1">{metric.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Activity className="h-6 w-6 text-blue-600" />
              <TranslateText text="Quick Actions" language={currentLanguage} />
            </CardTitle>
            <CardDescription className="text-base">
              <TranslateText text="Access frequently used admin functions" language={currentLanguage} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent group"
                >
                  <Link to={action.href}>
                    <div className={cn(
                      "flex items-center gap-4 w-full p-6 rounded-xl text-white transition-all duration-300",
                      action.color,
                      action.hoverColor,
                      "group-hover:scale-105 group-hover:shadow-xl"
                    )}>
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-lg">{action.title}</div>
                        <div className="text-white/80 text-sm">
                          {action.description}
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
              <TranslateText text="Recent Activity" language={currentLanguage} />
            </CardTitle>
            <CardDescription className="text-base">
              <TranslateText text="Latest updates and changes" language={currentLanguage} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    activity.type === "publish" && "bg-emerald-100 text-emerald-600",
                    activity.type === "update" && "bg-blue-100 text-blue-600",
                    activity.type === "message" && "bg-orange-100 text-orange-600",
                    activity.type === "seo" && "bg-purple-100 text-purple-600",
                    activity.type === "media" && "bg-pink-100 text-pink-600"
                  )}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <TranslateText text="Content Overview" language={currentLanguage} />
            </CardTitle>
            <CardDescription className="text-base">
              <TranslateText text="Your content performance summary" language={currentLanguage} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <span className="font-medium">{t("Published Articles")}</span>
                <Badge variant="default" className="bg-blue-600 text-white">
                  {analytics.totalPosts}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{t("Draft Articles")}</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <span className="font-medium">{t("Categories")}</span>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {Object.keys(analytics.categoryCounts || {}).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <span className="font-medium">{t("Languages")}</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">🇺🇸 EN</Badge>
                  <Badge variant="outline" className="text-xs">🇯🇵 JP</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Zap className="h-6 w-6 text-yellow-600" />
              <TranslateText text="System Health" language={currentLanguage} />
            </CardTitle>
            <CardDescription className="text-base">
              <TranslateText text="Performance and system metrics" language={currentLanguage} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <span className="font-medium">{t("Page Load Time")}</span>
                <Badge variant={performanceMetrics.pageLoadTime < 1000 ? "default" : "destructive"}
                  className={performanceMetrics.pageLoadTime < 1000 ? "bg-emerald-600" : ""}>
                  {performanceMetrics.pageLoadTime}ms
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <span className="font-medium">{t("Memory Usage")}</span>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {performanceMetrics.memoryUsage.toFixed(1)}MB
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <span className="font-medium">{t("Database Status")}</span>
                <Badge className="bg-emerald-600 text-white">
                  {t("Connected")}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <span className="font-medium">{t("Last Backup")}</span>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  2 hours ago
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}