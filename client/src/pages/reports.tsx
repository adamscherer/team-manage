import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectProgress } from "@/components/ui/project-progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Date range presets
const dateRanges = [
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Custom Range", value: "custom" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("summary");
  const [dateRange, setDateRange] = useState("this_week");
  const [userFilter, setUserFilter] = useState("1"); // Default to first user
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();

    switch (dateRange) {
      case "this_week":
        return {
          startDate: startOfWeek(now, { weekStartsOn: 1 }),
          endDate: endOfWeek(now, { weekStartsOn: 1 }),
        };
      case "last_week":
        return {
          startDate: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
          endDate: endOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
        };
      case "this_month":
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
      case "last_month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      case "custom":
        return {
          startDate: customDateRange.from,
          endDate: customDateRange.to,
        };
      default:
        return {
          startDate: startOfWeek(now, { weekStartsOn: 1 }),
          endDate: endOfWeek(now, { weekStartsOn: 1 }),
        };
    }
  };

  const { startDate, endDate } = getDateRange();

  // Format date range for display
  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select date range";

    return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  };

  // Get stats data for the selected date range
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [
      "/api/stats",
      {
        userId: parseInt(userFilter),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    ],
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  // Get time entries for the selected date range
  const { data: timeEntries, isLoading: isLoadingEntries } = useQuery({
    queryKey: [
      "/api/time-entries",
      {
        userId: parseInt(userFilter),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    ],
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for bar chart
  const prepareChartData = () => {
    if (!stats || !stats.dailyActivity) return [];

    return stats.dailyActivity.map((day) => ({
      name: day.day,
      hours: parseFloat(day.hours.toFixed(1)),
    }));
  };

  // Prepare data for project breakdown chart
  const prepareProjectChartData = () => {
    if (!stats || !stats.projectBreakdown) return [];

    return stats.projectBreakdown.map((project) => ({
      name: project.name,
      hours: parseFloat(project.hours.toFixed(1)),
      fill: project.color,
    }));
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div>
            <Button variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Export Report
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Analyze your time tracking data and generate reports.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {dateRange === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-calendar mr-2"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {customDateRange.from && customDateRange.to
                  ? `${format(customDateRange.from, "PPP")} - ${format(customDateRange.to, "PPP")}`
                  : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={startDate}
                selected={{
                  from: customDateRange.from,
                  to: customDateRange.to,
                }}
                onSelect={setCustomDateRange}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Date range display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{formatDateRange()}</h2>
      </div>

      {/* Report Tabs */}
      <Tabs
        defaultValue="summary"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="time">Time Breakdown</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Hours tracked"
              value={stats?.weeklyHours?.toFixed(1) || "0.0"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-clock"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />

            <StatsCard
              title="Billable hours"
              value={stats?.billableHours?.toFixed(1) || "0.0"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-dollar-sign"
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />

            <StatsCard
              title="Billable amount"
              value={
                stats?.billableAmount
                  ? formatCurrency(stats.billableAmount)
                  : "$0"
              }
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-credit-card"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              }
            />

            <StatsCard
              title="Utilization rate"
              value={`${stats?.utilizationRate?.toFixed(0) || 0}%`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trending-up"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              }
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingStats ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} hrs`, "Hours"]}
                      />
                      <Bar dataKey="hours" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingStats ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={prepareProjectChartData()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip
                        formatter={(value) => [`${value} hrs`, "Hours"]}
                      />
                      <Bar dataKey="hours" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : !stats?.projectBreakdown ||
                stats.projectBreakdown.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No project data available for the selected date range.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {stats.projectBreakdown.map((project) => (
                    <div
                      key={project.id}
                      className="border-b pb-4 last:border-0"
                    >
                      <ProjectProgress
                        name={project.name}
                        hours={project.hours}
                        percentage={project.percentage}
                        color={project.color}
                      />
                      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium text-foreground">
                            Billable amount:
                          </span>{" "}
                          {formatCurrency(project.hours * 150)}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Tasks:
                          </span>{" "}
                          {timeEntries?.filter(
                            (entry: any) => entry.projectId === project.id
                          ).length || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Breakdown Tab */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Time Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Project
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Hours
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Billable
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {isLoadingEntries ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin h-5 w-5 border-4 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                    ) : !timeEntries || timeEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-muted-foreground"
                        >
                          No time entries found for the selected date range.
                        </td>
                      </tr>
                    ) : (
                      timeEntries.map((entry: any) => (
                        <tr key={entry.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    entry.project?.color || "#e5e7eb",
                                }}
                              ></div>
                              <div className="text-sm font-medium">
                                {entry.project?.name || "Unknown Project"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {entry.task}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {(entry.duration / 60).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {entry.isBillable ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-minus text-muted-foreground"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
