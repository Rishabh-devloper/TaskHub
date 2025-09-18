import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Calendar, Clock } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const getTaskUrgency = (task: Task) => {
    if (!task.dueDate) return "normal";
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isBefore(dueDate, today)) return "overdue";
    if (isBefore(dueDate, tomorrow)) return "urgent";
    return "normal";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
      case "Medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "Low":
        return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600 dark:text-green-400";
      case "In Progress":
        return "text-blue-600 dark:text-blue-400";
      case "To Do":
        return "text-slate-600 dark:text-slate-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Upcoming Tasks
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
              Tasks due in the coming days
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No upcoming tasks
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          data.map((task) => {
            const urgency = getTaskUrgency(task);
            return (
              <Link
                to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
                key={task._id}
                className="group block p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={cn(
                      "p-1 rounded-full transition-colors duration-200",
                      task.status === "Done" 
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>
                      {task.status === "Done" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                        {task.title}
                      </h3>
                      
                      {/* Priority Badge */}
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border flex-shrink-0",
                        getPriorityColor(task.priority)
                      )}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Metadata */}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={cn("font-medium", getStatusColor(task.status))}>
                        {task.status}
                      </span>
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className={cn(
                            "text-xs font-medium",
                            urgency === "overdue" && "text-red-600 dark:text-red-400",
                            urgency === "urgent" && "text-orange-600 dark:text-orange-400",
                            urgency === "normal" && "text-slate-500 dark:text-slate-400"
                          )}>
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </span>
                          {urgency === "overdue" && (
                            <span className="text-xs text-red-500 font-medium">(Overdue)</span>
                          )}
                          {urgency === "urgent" && (
                            <span className="text-xs text-orange-500 font-medium">(Due soon)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
