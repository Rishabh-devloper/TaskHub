import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock, FilterIcon, Calendar, Search, SortAsc, SortDesc, Layers, Filter, Grid3X3, List, Target, Zap, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoverTaskId, setHoverTaskId] = useState<string | null>(null);

  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc"
  );
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection)
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: myTasks, isLoading } = useGetMyTasksQuery() as {
    data: Task[];
    isLoading: boolean;
  };

  const filteredTasks =
    myTasks?.length > 0
      ? myTasks
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "inprogress") return task.status === "In Progress";
            if (filter === "done") return task.status === "Done";
            if (filter === "achieved") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";

            return true;
          })
          .filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description?.toLowerCase().includes(search.toLowerCase())
          )
      : [];

  //   sort task
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

  const todoTasks = sortedTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = sortedTasks.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = sortedTasks.filter((task) => task.status === "Done");

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" size="lg" />
      </div>
    );
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl shadow-sm border border-muted/20">
        <div className="flex items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">My Tasks</h1>
            <p className="text-muted-foreground">Manage and track your assigned tasks</p>
          </div>

          <div className="flex flex-col items-start md:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-500/30 text-blue-700 hover:text-blue-800 transition-all duration-300"
            >
              {sortDirection === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4 mr-2" />
                  Oldest First
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-2" />
                  Newest First
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30 text-purple-700 hover:text-purple-800 transition-all duration-300"
                >
                  <FilterIcon className="w-4 h-4 mr-2" /> 
                  {filter === "all" ? "All Tasks" : filter === "todo" ? "To Do" : filter === "inprogress" ? "In Progress" : filter === "done" ? "Done" : filter === "achieved" ? "Achieved" : "High Priority"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-background/95 backdrop-blur-sm border border-muted/30">
                <DropdownMenuLabel className="text-primary font-semibold">Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setFilter("all")}
                  className={cn("cursor-pointer", filter === "all" && "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter("todo")}
                  className={cn("cursor-pointer", filter === "todo" && "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 font-medium")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter("inprogress")}
                  className={cn("cursor-pointer", filter === "inprogress" && "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 font-medium")}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter("done")}
                  className={cn("cursor-pointer", filter === "done" && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 font-medium")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter("achieved")}
                  className={cn("cursor-pointer", filter === "achieved" && "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 font-medium")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Achieved
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter("high")}
                  className={cn("cursor-pointer", filter === "high" && "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-700 font-medium")}
                >
                  <Zap className="w-4 h-4 mr-2 text-red-500" />
                  High Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search tasks...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm border border-muted hover:border-primary/50 focus-visible:ring-primary/20 transition-all duration-300"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger 
            value="list" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/80 data-[state=active]:to-purple-500/80 data-[state=active]:text-white transition-all duration-300"
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger 
            value="board" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/80 data-[state=active]:to-pink-500/80 data-[state=active]:text-white transition-all duration-300"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Board View
          </TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}
        <TabsContent value="list">
          <Card className="border border-muted/30 bg-gradient-to-br from-background/80 to-muted/10 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-b border-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    My Tasks
                  </CardTitle>
                  <CardDescription>
                    {sortedTasks?.length} tasks assigned to you
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 font-medium border-indigo-500/20">
                  {sortedTasks?.length} total
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-muted/20">
                {sortedTasks?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">Try adjusting your search or filter criteria</p>
                    <Button onClick={() => { setSearch(''); setFilter('all'); }} variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  sortedTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className="p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500/5 hover:to-purple-500/5"
                      onMouseEnter={() => setHoverTaskId(task._id)}
                      onMouseLeave={() => setHoverTaskId(null)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-3">
                        <div className="flex">
                          <div className="flex gap-2 mr-2">
                            {task.status === "Done" ? (
                              <CheckCircle className="size-4 text-emerald-600" />
                            ) : task.status === "In Progress" ? (
                              <Zap className="size-4 text-blue-600" />
                            ) : (
                              <Clock className="size-4 text-amber-600" />
                            )}
                          </div>

                          <div>
                            <Link
                              to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                              className={cn(
                                "font-medium hover:underline transition-all duration-300 flex items-center group",
                                hoverTaskId === task._id ? "text-indigo-600" : "hover:text-primary"
                              )}
                            >
                              {task.title}
                              <ArrowUpRight className={cn(
                                "size-4 ml-1 transition-all duration-300",
                                hoverTaskId === task._id ? "translate-x-1 -translate-y-1" : ""
                              )} />
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                className={cn(
                                  "transition-all duration-300",
                                  task.status === "Done" 
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                    : task.status === "In Progress"
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                                )}
                              >
                                {task.status}
                              </Badge>

                              {task.priority && (
                                <Badge
                                  className={cn(
                                    "transition-all duration-300",
                                    task.priority === "High"
                                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                                      : task.priority === "Medium"
                                      ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                  )}
                                >
                                  {task.priority}
                                </Badge>
                              )}

                              {task.isArchived && (
                                <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Archived
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>
                              Project: <span className="font-medium text-indigo-600">{task.project.title}</span>
                            </span>
                          </div>

                          <div>Modified: {format(task.updatedAt, "MMM d, yyyy")}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TO DO COLUMN */}
            <Card className="border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-200/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-amber-700">To Do</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {todoTasks?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                {todoTasks?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-sm text-muted-foreground">No pending tasks</p>
                  </div>
                ) : (
                  todoTasks.map((task) => (
                    <Card
                      key={task._id}
                      className="group bg-gradient-to-br from-background/90 to-amber-50/30 backdrop-blur-sm border border-amber-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                      onMouseEnter={() => setHoverTaskId(task._id)}
                      onMouseLeave={() => setHoverTaskId(null)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Link
                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                        className="block p-4 relative z-10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={cn(
                            "font-semibold transition-colors duration-200 line-clamp-2 flex-1 mr-3",
                            hoverTaskId === task._id ? "text-amber-700" : "text-foreground"
                          )}>
                            {task.title}
                          </h3>
                          {task.priority && (
                            <Badge
                              className={cn(
                                "px-2 py-1 text-xs font-semibold shadow-sm flex-shrink-0",
                                task.priority === "High"
                                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                                  : task.priority === "Medium"
                                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              )}
                            >
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-amber-200/30">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-amber-700">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs bg-amber-50/50 text-amber-700 border-amber-300/50">
                            {task.project.title}
                          </Badge>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* IN PROGRESS COLUMN */}
            <Card className="border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-200/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-700">In Progress</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {inProgressTasks?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                {inProgressTasks?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-sm text-muted-foreground">No active tasks</p>
                  </div>
                ) : (
                  inProgressTasks.map((task) => (
                    <Card
                      key={task._id}
                      className="group bg-gradient-to-br from-background/90 to-blue-50/30 backdrop-blur-sm border border-blue-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                      onMouseEnter={() => setHoverTaskId(task._id)}
                      onMouseLeave={() => setHoverTaskId(null)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Link
                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                        className="block p-4 relative z-10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={cn(
                            "font-semibold transition-colors duration-200 line-clamp-2 flex-1 mr-3",
                            hoverTaskId === task._id ? "text-blue-700" : "text-foreground"
                          )}>
                            {task.title}
                          </h3>
                          {task.priority && (
                            <Badge
                              className={cn(
                                "px-2 py-1 text-xs font-semibold shadow-sm flex-shrink-0",
                                task.priority === "High"
                                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                                  : task.priority === "Medium"
                                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              )}
                            >
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-blue-200/30">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-blue-700">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs bg-blue-50/50 text-blue-700 border-blue-300/50">
                            {task.project.title}
                          </Badge>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* DONE COLUMN */}
            <Card className="border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/30 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-200/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-700">Done</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                    {doneTasks?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                {doneTasks?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-sm text-muted-foreground">No completed tasks</p>
                  </div>
                ) : (
                  doneTasks.map((task) => (
                    <Card
                      key={task._id}
                      className="group bg-gradient-to-br from-background/90 to-emerald-50/30 backdrop-blur-sm border border-emerald-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                      onMouseEnter={() => setHoverTaskId(task._id)}
                      onMouseLeave={() => setHoverTaskId(null)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Link
                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                        className="block p-4 relative z-10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={cn(
                            "font-semibold transition-colors duration-200 line-clamp-2 flex-1 mr-3",
                            hoverTaskId === task._id ? "text-emerald-700" : "text-foreground"
                          )}>
                            {task.title}
                          </h3>
                          <Badge className="px-2 py-1 text-xs font-semibold shadow-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white flex-shrink-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-emerald-200/30">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-emerald-700">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs bg-emerald-50/50 text-emerald-700 border-emerald-300/50">
                            {task.project.title}
                          </Badge>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
