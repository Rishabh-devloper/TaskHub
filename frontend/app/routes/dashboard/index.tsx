import { RecentProjects } from "@/components/dashboard/recnt-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { useGetWorkspaceStatsQuery, useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Get user's workspaces
  const { data: workspaces, isPending: isLoadingWorkspaces } = useGetWorkspacesQuery();

  // Only fetch stats if we have a valid workspaceId
  const { data, isPending, error } = useGetWorkspaceStatsQuery(workspaceId) as {
    data?: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
    error?: any;
  };

  if (isLoadingWorkspaces) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // If user has no workspaces, show create workspace prompt
  if (workspaces && workspaces.length === 0) {
    return (
      <>
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6">
                  <span className="text-white font-bold text-2xl transform -rotate-6">TH</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-bounce"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Welcome to TaskHub!
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Your productivity journey starts here. Create your first workspace to organize projects, 
                collaborate with your team, and track your progress.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={() => setIsCreatingWorkspace(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 px-8 py-4"
              >
                <Plus className="h-5 w-5" />
                Create Your First Workspace
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 px-8 py-4"
              >
                Watch Tutorial
              </Button>
            </div>
            
            {/* Features preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4V7a2 2 0 00-2-2H7a2 2 0 00-2 2v1m14 4v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8m14 4H5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Organize Projects</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Create workspaces to organize your projects and keep everything structured.</p>
              </div>
              
              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Team Collaboration</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Invite team members and collaborate on projects in real-time.</p>
              </div>
              
              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Track Progress</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Monitor project progress with detailed analytics and insights.</p>
              </div>
            </div>
          </div>
        </div>
        <CreateWorkspace
          isCreatingWorkspace={isCreatingWorkspace}
          setIsCreatingWorkspace={setIsCreatingWorkspace}
        />
      </>
    );
  }

  // If no workspace is selected, show workspace selection prompt
  if (!workspaceId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 right-1/4 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-10 animate-pulse delay-500"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-10 animate-pulse delay-1500"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-3">
                <svg className="w-8 h-8 text-white transform rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4V7a2 2 0 00-2-2H7a2 2 0 00-2 2v1m14 4v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8m14 4H5" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Choose Your Workspace
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
              Select a workspace from the header dropdown to access your projects, 
              tasks, and team collaboration tools.
            </p>
          </div>
          
          {/* Arrow pointing to header */}
          <div className="flex justify-center pt-8">
            <div className="relative">
              <div className="animate-bounce">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Click here
              </div>
            </div>
          </div>
          
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Project Dashboard</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">View and manage all your projects</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Real-time Updates</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Stay synced with your team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // If there's an error or no data, show error state
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Unable to Load Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {error?.message || "There was an error loading your dashboard data. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-100">
        <StatsCard data={data.stats} />
      </div>

      {/* Charts */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      </div>

      {/* Recent Projects and Tasks */}
      <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">
        <div className="group">
          <RecentProjects data={data.recentProjects} />
        </div>
        <div className="group">
          <UpcomingTasks data={data.upcomingTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
