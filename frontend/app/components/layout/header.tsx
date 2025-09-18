import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import { NotificationsDropdown } from "../notifications/notifications-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] } | null;
  const workspaces = loaderData?.workspaces || [];
  const isOnWorkspacePage = useLocation().pathname.includes("/workspace");

  const handleOnClick = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;

    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname;

      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="h-10 px-4 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
            >
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium text-slate-900 dark:text-white ml-2">{selectedWorkspace?.name}</span>
                </>
              ) : (
                <span className="font-medium text-slate-600 dark:text-slate-400">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
            <DropdownMenuLabel className="text-slate-600 dark:text-slate-400 font-medium">Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />

            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => handleOnClick(ws)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-slate-50 dark:focus:bg-slate-700 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-2">
                    {ws.color && (
                      <WorkspaceAvatar color={ws.color} name={ws.name} />
                    )}
                    <span className="font-medium text-slate-900 dark:text-white">{ws.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={onCreateWorkspace}
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 transition-colors duration-150"
              >
                <PlusCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-600 dark:text-blue-400">Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all duration-200 hover:shadow-sm">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
            >
              <DropdownMenuLabel className="text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-slate-50 dark:focus:bg-slate-700 transition-colors duration-150">
                <Link to="/user/profile" className="flex items-center w-full text-slate-900 dark:text-white">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
              <DropdownMenuItem 
                onClick={logout}
                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors duration-150 text-red-600 dark:text-red-400"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
