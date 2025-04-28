import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("p-5 flex items-start gap-4", className)}>
      {icon && (
        <div className="rounded-md bg-primary/10 p-3 text-primary">{icon}</div>
      )}
      <div className="flex-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={cn(
                "text-xs",
                trend.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.positive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
