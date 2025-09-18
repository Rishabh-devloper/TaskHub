import type { User, Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  members: {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 md:p-8 shadow-sm">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {workspace.color && (
                <div className="relative">
                  <WorkspaceAvatar color={workspace.color} name={workspace.name} />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {workspace.name}
              </h1>
              {workspace.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onInviteMember}
              className="h-10 px-4 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Invite Member</span>
              <span className="sm:hidden">Invite</span>
            </Button>
            <Button
              onClick={onCreateProject}
              className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Project</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Members Section */}
        {members.length > 0 && (
          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Team Members
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                  {members.length}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {members.slice(0, 8).map((member) => (
                <div
                  key={member._id}
                  className="group flex items-center space-x-2 bg-white/50 dark:bg-slate-700/50 rounded-full pr-3 pl-1 py-1 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-sm"
                >
                  <Avatar className="h-6 w-6 border border-white dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <AvatarImage
                      src={member.user.profilePicture}
                      alt={member.user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {member.user.name.split(' ')[0]}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      ({member.role})
                    </span>
                  </div>
                </div>
              ))}
              
              {members.length > 8 && (
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-400">
                  <span>+{members.length - 8} more</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
