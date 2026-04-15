import React from "react";
import { Card } from "@/components/ui/card";
import { PerformanceMetrics } from "@/hooks/use-performance-metrics";
import { useTranslation } from "@/hooks/use-translation";

interface ResourceUsageChartProps {
  metrics: PerformanceMetrics;
  title?: string;
}

export const ResourceUsageChart = ({
  metrics,
  title = "Resource Usage"
}: ResourceUsageChartProps) => {
  const { t } = useTranslation();
  return (
    <Card className="p-4 md:p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold">{t(title)}</h3>
        <span className="text-xs text-gray-500">{t("Current Session")}</span>
      </div>

      <div className="space-y-5">
        {/* Memory Usage */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-500">{t("Memory Usage")}</span>
            <span className="text-xs md:text-sm font-medium">
              {metrics.memoryUsage ? `${metrics.memoryUsage} MB` : 'N/A'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: metrics.memoryUsage
                  ? `${Math.min(metrics.memoryUsage / 2, 100)}%`
                  : '0%'
              }}
            />
          </div>
        </div>

        {/* Resource Load Times */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-500">{t("JS Resources")}</span>
            <span className="text-xs md:text-sm font-medium">{metrics.resourceLoadTimes.js} ms</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.resourceLoadTimes.js / 10, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-500">{t("CSS Resources")}</span>
            <span className="text-xs md:text-sm font-medium">{metrics.resourceLoadTimes.css} ms</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.resourceLoadTimes.css / 5, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-500">{t("Image Resources")}</span>
            <span className="text-xs md:text-sm font-medium">{metrics.resourceLoadTimes.img} ms</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.resourceLoadTimes.img / 20, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
