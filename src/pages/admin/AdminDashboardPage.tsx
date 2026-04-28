
import React from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { ModernDashboard } from "@/components/admin/modern/ModernDashboard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReadingTimeChart } from "@/components/admin/charts/ReadingTimeChart";
import { PerformanceChart } from "@/components/admin/charts/PerformanceChart";
import { ResourceUsageChart } from "@/components/admin/charts/ResourceUsageChart";
import { CategoryDistributionChart } from "@/components/admin/charts/CategoryDistributionChart";
import { DashboardMetricsCards } from "@/components/admin/charts/DashboardMetricsCards";
import { useBlogAnalytics } from "@/hooks/use-blog-analytics";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";
import { useDeviceSize } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const AdminDashboardPage = () => {
  const { analytics, isLoading: loadingAnalytics, error: analyticsError } = useBlogAnalytics();
  const performanceMetrics = usePerformanceMetrics();
  const { isMobile } = useDeviceSize();
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
  }, [analyticsError, toast]);

  // Format categories for chart display
  const categoryData = React.useMemo(() => {
    if (!analytics || !analytics.categoryCounts) {
      return [];
    }

    return Object.entries(analytics.categoryCounts).map(
      ([category, count], index) => ({
        category: isMobile && category.length > 8 ? `${category.substring(0, 7)}...` : category,
        fullCategory: category,
        count,
        color: getColorForIndex(index),
        change: analytics.categoryGrowthRates[category] || 0
      })
    );
  }, [analytics, isMobile]);

  // Show loading state when data isn't ready
  if (loadingAnalytics) {
    return (
      <EnhancedAdminLayout>
        <div className="space-y-6 md:space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <TranslateText text="Dashboard" />
              </h1>
              <p className="text-muted-foreground">
                <TranslateText text="Loading dashboard data..." />
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      </EnhancedAdminLayout>
    );
  }

  // Calculate performance improvement rate
  // This could be replaced with actual historical data comparison
  // For now, we'll use a simple calculation based on current metrics
  const avgLoadTime = 1200; // Average benchmark load time in ms
  const perfImprovementRate = avgLoadTime > 0
    ? ((avgLoadTime - performanceMetrics.pageLoadTime) / avgLoadTime) * 100
    : 0;

  return (
    <EnhancedAdminLayout>
      <ModernDashboard />
    </EnhancedAdminLayout>
  );
};

// Utility function to get colors for categories
const getColorForIndex = (index: number): string => {
  const colors = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#ec4899', '#06b6d4', '#a855f7', '#84cc16', '#f97316'
  ];
  return colors[index % colors.length];
};

export default AdminDashboardPage;
