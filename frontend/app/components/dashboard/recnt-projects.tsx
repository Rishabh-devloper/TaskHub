import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { FolderOpen, Calendar, BarChart3 } from "lucide-react";
import { format } from "date-fns";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Recent Projects
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Your latest project activity
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No projects yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Create your first project to get started
            </p>
          </div>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <Link
                key={project._id}
                to={`/workspaces/${workspaceId}/projects/${project._id}`}
                className="group block"
              >
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 hover:shadow-sm cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1 mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          <span>{project.tasks.length} tasks</span>
                        </div>
                        {project.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{format(new Date(project.dueDate), "MMM d")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-3",
                        getTaskStatusColor(project.status)
                      )}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {projectProgress}%
                      </span>
                    </div>
                    <Progress 
                      value={projectProgress} 
                      className="h-2 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200" 
                    />
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
