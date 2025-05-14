import { cn } from "@/lib/utils";

interface ProjectProgressProps {
  name: string;
  hours: number;
  percentage: number;
  color: string;
}

export function ProjectProgress({
  name,
  hours,
  percentage,
  color,
}: ProjectProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {hours.toFixed(1)}h ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}
