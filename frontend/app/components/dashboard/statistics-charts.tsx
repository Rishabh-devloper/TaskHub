import type {
  ProjectStatusData,
  StatsCardProps,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface StatisticsChartsProps {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
}

export const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  const chartColors = {
    primary: "#3b82f6", // Blue
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    danger: "#ef4444",  // Red
    purple: "#8b5cf6", // Purple
    indigo: "#6366f1", // Indigo
    gray: "#6b7280",   // Gray
  };

  return (
    <div className="space-y-8">
      {/* Main Charts Grid */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Task Trends Chart - Takes 2/3 width on xl screens */}
        <Card className="xl:col-span-2 group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Task Trends
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Daily task status changes over time
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 group-hover:scale-110 transition-transform duration-200">
                <ChartLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full">
              <ChartContainer
                className="h-[350px] w-full"
                config={{
                  completed: { color: chartColors.success, label: "Completed" },
                  inProgress: { color: chartColors.primary, label: "In Progress" },
                  todo: { color: chartColors.warning, label: "To Do" },
                }}
              >
                <LineChart data={taskTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                  />
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    className="stroke-slate-200 dark:stroke-slate-700" 
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: chartColors.gray, strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke={chartColors.success}
                    strokeWidth={3}
                    dot={{ fill: chartColors.success, r: 5 }}
                    activeDot={{ r: 7, fill: chartColors.success }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inProgress"
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ fill: chartColors.primary, r: 5 }}
                    activeDot={{ r: 7, fill: chartColors.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="todo"
                    stroke={chartColors.warning}
                    strokeWidth={3}
                    dot={{ fill: chartColors.warning, r: 5 }}
                    activeDot={{ r: 7, fill: chartColors.warning }}
                  />
                  <ChartLegend 
                    content={<ChartLegendContent />} 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Pie Chart */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Project Status
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Project status distribution
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 group-hover:scale-110 transition-transform duration-200">
                <ChartPie className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center">
              <ChartContainer
                className="h-[280px] w-full max-w-[280px]"
                config={{
                  Completed: { color: chartColors.success, label: "Completed" },
                  "In Progress": { color: chartColors.primary, label: "In Progress" },
                  Planning: { color: chartColors.warning, label: "Planning" },
                  "On Hold": { color: chartColors.gray, label: "On Hold" },
                }}
              >
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {projectStatusData.map((entry, index) => {
                      const colors = [chartColors.success, chartColors.primary, chartColors.warning, chartColors.gray];
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={colors[index] || chartColors.gray}
                          className="hover:opacity-80 transition-opacity duration-200"
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0];
                        return (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-slate-900 dark:text-white">{data.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {data.value} projects ({((data.value / projectStatusData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
                {projectStatusData.map((entry, index) => {
                  const colors = [chartColors.success, chartColors.primary, chartColors.warning, chartColors.gray];
                  return (
                    <div key={entry.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colors[index] || chartColors.gray }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{entry.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* Task Priority Chart */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Task Priority
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Priority distribution
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 group-hover:scale-110 transition-transform duration-200">
                <ChartPie className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center">
              <ChartContainer
                className="h-[250px] w-full max-w-[250px]"
                config={{
                  High: { color: chartColors.danger, label: "High" },
                  Medium: { color: chartColors.warning, label: "Medium" },
                  Low: { color: chartColors.success, label: "Low" },
                }}
              >
                <PieChart>
                  <Pie
                    data={taskPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {taskPriorityData?.map((entry, index) => {
                      const colors = [chartColors.danger, chartColors.warning, chartColors.success];
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={colors[index] || chartColors.gray}
                          className="hover:opacity-80 transition-opacity duration-200"
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0];
                        return (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-slate-900 dark:text-white">{data.name} Priority</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {data.value} tasks ({((data.value / taskPriorityData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
              {/* Custom Legend */}
              <div className="flex justify-center space-x-4 mt-3">
                {taskPriorityData?.map((entry, index) => {
                  const colors = [chartColors.danger, chartColors.warning, chartColors.success];
                  return (
                    <div key={entry.name} className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colors[index] || chartColors.gray }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{entry.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Workspace Productivity Bar Chart */}
        <Card className="lg:col-span-2 group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Workspace Productivity
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Task completion across projects
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 group-hover:scale-110 transition-transform duration-200">
                <ChartBarBig className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full">
              <ChartContainer
                className="h-[320px] w-full"
                config={{
                  total: { color: chartColors.gray, label: "Total Tasks" },
                  completed: { color: chartColors.primary, label: "Completed Tasks" },
                }}
              >
                <BarChart
                  data={workspaceProductivityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barGap={8}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                  />
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    className="stroke-slate-200 dark:stroke-slate-700" 
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between space-x-3">
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">{entry.name}</span>
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{entry.value}</span>
                              </div>
                            ))}
                            {payload.length >= 2 && (
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Completion: {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill={chartColors.gray}
                    radius={[6, 6, 0, 0]}
                    name="Total Tasks"
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                  <Bar
                    dataKey="completed"
                    fill={chartColors.primary}
                    radius={[6, 6, 0, 0]}
                    name="Completed Tasks"
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                  <ChartLegend 
                    content={<ChartLegendContent />} 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
