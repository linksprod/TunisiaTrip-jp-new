import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PerformanceMetrics } from "@/hooks/use-performance-metrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";

interface PerformanceChartProps {
  metrics: PerformanceMetrics;
  title?: string;
  height?: number;
}

export const PerformanceChart = ({ metrics, title = "Page Performance (ms)", height = 300 }: PerformanceChartProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // Format metrics for chart display
  const chartData = [
    { name: t('Page Load'), value: metrics.pageLoadTime },
    { name: 'FCP', value: metrics.fcpTime },
    { name: 'LCP', value: metrics.lcpTime || 0 },
    { name: isMobile ? 'JS' : t('JavaScript'), value: metrics.resourceLoadTimes.js },
    { name: 'CSS', value: metrics.resourceLoadTimes.css },
    { name: isMobile ? 'Img' : t('Images'), value: metrics.resourceLoadTimes.img },
  ];

  return (
    <Card className="shadow-sm h-full">
      <div className="p-4 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
          <h3 className="text-base md:text-lg font-semibold">{t(title)}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1 md:mr-2"></div>
              <span className="text-xs text-gray-500">{t("Load Time (ms)")}</span>
            </div>
          </div>
        </div>
        <div className="flex-grow" style={{ height: `${isMobile ? height * 0.8 : height}px`, minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={{ value: { color: "#3b82f6" } }}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} stroke="#f5f5f5" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickMargin={8}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}${isMobile ? '' : 'ms'}`}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 30 : 40}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={isMobile ? 30 : 40} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
