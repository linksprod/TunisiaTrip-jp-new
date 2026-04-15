import React from "react";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { BookOpen, Clock, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface DashboardMetricsCardsProps {
  totalPosts: number;
  averageReadTime: number;
  pageLoadTime: number;
  postGrowthRate?: number;
  readTimeGrowthRate?: number;
  perfImprovementRate?: number;
}

export const DashboardMetricsCards = ({
  totalPosts,
  averageReadTime,
  pageLoadTime,
  postGrowthRate = 0,
  readTimeGrowthRate = 0,
  perfImprovementRate = -8  // Default fallback
}: DashboardMetricsCardsProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <DashboardCard
        title={t("Total Blog Posts")}
        value={totalPosts.toString()}
        change={postGrowthRate}
        icon={<BookOpen className="h-6 w-6" />}
        iconBgColor="bg-purple-50"
        iconTextColor="text-purple-600"
        period={t("compared to previous period")}
      />

      <DashboardCard
        title={t("Average Reading Time")}
        value={`${averageReadTime} min`}
        change={readTimeGrowthRate}
        icon={<Clock className="h-6 w-6" />}
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
        period={t("compared to previous period")}
      />

      <DashboardCard
        title={t("Page Load Time")}
        value={`${pageLoadTime} ms`}
        change={perfImprovementRate}
        icon={<Zap className="h-6 w-6" />}
        iconBgColor="bg-green-50"
        iconTextColor="text-green-600"
        period={t("faster than average")}
      />
    </div>
  );
};
