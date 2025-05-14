import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction?: "up" | "down" | "neutral";
    text: string;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-primary">{icon}</div>
        </div>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn("flex items-center", {
                "text-green-600": trend.direction === "up",
                "text-red-600": trend.direction === "down",
                "text-gray-600": trend.direction === "neutral",
              })}
            >
              {trend.direction === "up" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up mr-1"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-down mr-1"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              )}
              {trend.direction === "neutral" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-minus mr-1"
                >
                  <path d="M5 12h14" />
                </svg>
              )}
              {trend.value} {trend.text}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
