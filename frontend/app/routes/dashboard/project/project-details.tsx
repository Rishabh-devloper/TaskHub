import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const updateTaskStatus = useUpdateTaskStatusMutation();

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    try {
      await updateTaskStatus.mutateAsync({
        taskId: task._id,
        status: newStatus,
      });
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error("Status update error:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200 dark:shadow-red-900/20";
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-200 dark:shadow-yellow-900/20";
      case "Low":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200 dark:shadow-green-900/20";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-slate-200 dark:shadow-slate-900/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600 dark:text-green-400";
      case "In Progress":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-semibold shadow-sm",
              getPriorityColor(task.priority)
            )}
          >
            {task.priority}
          </Badge>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {task.status !== "To Do" && (
              <Button
                variant="ghost"
                size="icon"
                disabled={updateTaskStatus.isPending}
                className="h-7 w-7 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate("To Do");
                }}
                title="Mark as To Do"
              >
                {updateTaskStatus.isPending ? (
                  <div className="w-3.5 h-3.5 border border-orange-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant="ghost"
                size="icon"
                disabled={updateTaskStatus.isPending}
                className="h-7 w-7 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate("In Progress");
                }}
                title="Mark as In Progress"
              >
                {updateTaskStatus.isPending ? (
                  <div className="w-3.5 h-3.5 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant="ghost"
                size="icon"
                disabled={updateTaskStatus.isPending}
                className="h-7 w-7 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate("Done");
                }}
                title="Mark as Done"
              >
                {updateTaskStatus.isPending ? (
                  <div className="w-3.5 h-3.5 border border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
            {task.description}
          </p>
        )}

        {/* Assignees and Due Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((member) => (
                  <Avatar
                    key={member._id}
                    className="h-7 w-7 border-2 border-white dark:border-slate-800 shadow-sm hover:scale-110 transition-transform duration-200"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 3 && (
                  <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      +{task.assignees.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3" />
              <span className="font-medium">
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            </div>
          )}
        </div>

        {/* Status and Subtasks */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className={cn("text-xs font-medium", getStatusColor(task.status))}>
            {task.status}
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-900 dark:text-white">
                {task.subtasks.filter((subtask) => subtask.completed).length}
              </span>
              <span className="mx-1">/</span>
              <span>{task.subtasks.length}</span>
              <span className="ml-1">subtasks</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
