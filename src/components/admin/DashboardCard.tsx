import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface DashboardCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  period?: string;
}

export const DashboardCard = ({
  title,
  value,
  change,
  icon,
  iconBgColor,
  iconTextColor,
  period = "than last month"
}: DashboardCardProps) => {
  const { t } = useTranslation();
  const isPositive = change >= 0;

  return (
    <Card className="p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2 text-xs">
            <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center mr-3`}>
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}{" "}
              {Math.abs(change)}% {isPositive ? t("higher") : t("lower")}
            </span>
            <span className="text-gray-500">{t(period)}</span>
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor} ${iconTextColor}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
