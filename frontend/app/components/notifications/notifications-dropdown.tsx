import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Check, X, Users, Crown, Shield, User, Clock } from "lucide-react";
import { 
  useGetPendingInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation
} from "@/hooks/use-workspace";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { WorkspaceInvitation } from "@/types";
import { useNavigate } from "react-router";

export const NotificationsDropdown = () => {
  const { data: invitations = [], isLoading, error, refetch } = useGetPendingInvitationsQuery();
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const declineInvitationMutation = useDeclineInvitationMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-yellow-600" />;
      case 'admin':
        return <Shield className="h-3 w-3 text-red-600" />;
      default:
        return <User className="h-3 w-3 text-blue-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    }
  };

  const handleAcceptInvitation = async (invitation: WorkspaceInvitation) => {
    try {
      const result = await acceptInvitationMutation.mutateAsync(invitation._id);
      
      toast.success(`🎉 Welcome to ${invitation.workspaceId.name}!`, {
        description: "You've successfully joined the workspace.",
        action: {
          label: "Go to Workspace",
          onClick: () => navigate(`/workspaces/${invitation.workspaceId._id}`)
        }
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      
    } catch (error: any) {
      toast.error("Failed to accept invitation", {
        description: error?.response?.data?.message || "Please try again later"
      });
    }
  };

  const handleDeclineInvitation = async (invitation: WorkspaceInvitation) => {
    try {
      await declineInvitationMutation.mutateAsync(invitation._id);
      
      toast.success("Invitation declined", {
        description: `You declined to join ${invitation.workspaceId.name}`
      });

      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
      
    } catch (error: any) {
      toast.error("Failed to decline invitation", {
        description: "Please try again later"
      });
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const inviteDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - inviteDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return format(inviteDate, 'MMM d');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          {invitations.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold animate-pulse"
            >
              {invitations.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-96 bg-background/95 backdrop-blur-sm border border-muted/30 shadow-lg max-h-[500px] overflow-y-auto"
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-primary font-semibold">
          <Bell className="h-4 w-4" />
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <h3 className="text-sm font-medium text-red-600 mb-1">Connection Issue</h3>
            <p className="text-xs text-muted-foreground mb-3">Unable to load notifications. Please check your connection.</p>
            <Button
              onClick={() => refetch()}
              size="sm"
              variant="outline"
              className="text-xs border-red-200 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No new notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {invitations.map((invitation: WorkspaceInvitation) => (
              <div
                key={invitation._id}
                className="p-4 border-b border-muted/20 last:border-b-0 hover:bg-muted/10 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  {/* Workspace Avatar */}
                  <Avatar className="w-10 h-10 ring-2 ring-muted/30">
                    <AvatarFallback 
                      className="text-white font-semibold text-sm"
                      style={{ backgroundColor: invitation.workspaceId.color }}
                    >
                      {invitation.workspaceId.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    {/* Invitation Header */}
                    <div>
                      <p className="text-sm font-medium">
                        Workspace Invitation
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(invitation.createdAt)}
                      </p>
                    </div>

                    {/* Invitation Details */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-sm">{invitation.workspaceId.name}</span>
                      </div>
                      
                      {invitation.workspaceId.description && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {invitation.workspaceId.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Role:</span>
                        <Badge className={cn("text-xs", getRoleColor(invitation.role))}>
                          {getRoleIcon(invitation.role)}
                          <span className="ml-1 capitalize">{invitation.role}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAcceptInvitation(invitation)}
                        disabled={acceptInvitationMutation.isPending}
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {acceptInvitationMutation.isPending ? "Accepting..." : "Accept"}
                      </Button>
                      
                      <Button
                        onClick={() => handleDeclineInvitation(invitation)}
                        disabled={declineInvitationMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {declineInvitationMutation.isPending ? "Declining..." : "Decline"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {invitations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
                }}
              >
                Refresh notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
