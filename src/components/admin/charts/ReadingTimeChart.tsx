import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";

interface ReadingTimeChartProps {
  data: Array<{
    month: string;
    readTime: number;
    count?: number;
  }>;
  title?: string;
  height?: number;
}

export const ReadingTimeChart = ({ data, title = "Monthly Reading Time (minutes)", height = 300 }: ReadingTimeChartProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Card className="shadow-sm h-full">
      <div className="p-4 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
          <h3 className="text-base md:text-lg font-semibold">{t(title)}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-1 md:mr-2"></div>
              <span className="text-xs text-gray-500">{t("Reading Time (min)")}</span>
            </div>
          </div>
        </div>
        <div className="flex-grow" style={{ height: `${isMobile ? height * 0.8 : height}px`, minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={{ readTime: { color: "#8b5cf6" } }}>
              <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} stroke="#f5f5f5" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}m`}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 30 : 40}
                />
                <Line
                  type="monotone"
                  dataKey="readTime"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: isMobile ? 3 : 4 }}
                  activeDot={{ r: isMobile ? 5 : 6, strokeWidth: 2, stroke: "#fff" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
