
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { AdminChartSection } from "../AdminChartSection";
import { useDeviceSize } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";

interface CategoryItem {
  category: string;
  fullCategory: string;
  count: number;
  color: string;
}

interface CategoryDistributionChartProps {
  categoryData: CategoryItem[];
  height?: number;
}

export const CategoryDistributionChart = ({
  categoryData,
  height = 250
}: CategoryDistributionChartProps) => {
  const { isMobile } = useDeviceSize();
  const { t } = useTranslation();

  return (
    <AdminChartSection
      title={t("Blog Category Distribution")}
      data={categoryData}
      height={height}
      showLegend={isMobile ? false : true}
      legendItems={isMobile ? [] : categoryData.slice(0, 5).map(item => ({
        color: item.color,
        label: item.fullCategory || item.category
      }))}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer
          config={
            Object.fromEntries(
              categoryData.map((item) => [
                item.category, { color: item.color }
              ])
            )
          }
        >
          <BarChart
            data={categoryData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} stroke="#f5f5f5" strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 25 : 30}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={isMobile ? 30 : 50}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    const item = categoryData.find(c => c.category === label);
                    return item?.fullCategory || label;
                  }}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </AdminChartSection>
  );
};
