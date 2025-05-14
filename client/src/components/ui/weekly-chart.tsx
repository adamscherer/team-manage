import { cn } from "@/lib/utils";

interface DailyActivity {
  day: string;
  hours: number;
}

interface WeeklyChartProps {
  data: DailyActivity[];
  className?: string;
}

export function WeeklyChart({ data, className }: WeeklyChartProps) {
  // Find the maximum hours to calculate relative heights
  const maxHours = Math.max(...data.map(d => d.hours), 1);

  return (
    <div className={cn("h-48 flex items-end justify-between gap-1", className)}>
      {data.map((day, index) => {
        // Calculate the height as a percentage (minimum 1% for visibility even when 0)
        const heightPercentage = Math.max((day.hours / maxHours) * 100, 1);
        
        // Generate a blue shade based on the index
        const bgColorClass = getBackgroundColor(index);
        
        return (
          <div key={day.day} className="flex flex-col items-center">
            <div 
              className={cn("w-8 rounded-t", bgColorClass)} 
              style={{ height: `${heightPercentage}%` }}
            ></div>
            <span className="text-xs mt-1 text-gray-500">{day.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to get background color class based on index
function getBackgroundColor(index: number): string {
  const colors = [
    "bg-primary-100",
    "bg-primary-200", 
    "bg-primary-300",
    "bg-primary-400",
    "bg-primary-500",
    "bg-primary-300",
    "bg-primary-200"
  ];
  
  return colors[index % colors.length];
}
