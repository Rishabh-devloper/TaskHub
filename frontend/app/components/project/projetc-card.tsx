import type { Project } from "@/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
              {project.title}
            </CardTitle>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
            {project.description || "No description available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="space-y-5">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-slate-200 dark:bg-slate-700"
              />
            </div>

            {/* Stats Section */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    {project.tasks.length}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-500">
                    Tasks
                  </span>
                </div>
              </div>

              {project.dueDate && (
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {format(project.dueDate, "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
