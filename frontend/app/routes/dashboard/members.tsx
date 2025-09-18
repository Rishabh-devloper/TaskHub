import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useGetWorkspaceDetailsQuery, useInviteMemberMutation } from "@/hooks/use-workspace";
import type { Task, Workspace } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock, FilterIcon, Mail, Calendar, MoreHorizontal, UserPlus, Search, Shield, Crown, User, Users, Grid3X3, List, Phone, MapPin, Star, Settings, Trash2, Copy, Edit3 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoverMemberId, setHoverMemberId] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  
  const queryClient = useQueryClient();
  const inviteMemberMutation = useInviteMemberMutation();

  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" size="lg" />
      </div>
    );

  if (!data || !workspaceId) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold mb-2">No workspace found</h2>
      <p className="text-muted-foreground mb-4">Please select a workspace to view members</p>
      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );

  const filteredMembers = data?.members?.filter(
    (member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  // Role-based styling helper
  const getRoleStyles = (role: string) => {
    switch (role) {
      case "owner":
        return {
          gradient: "from-yellow-500/10 to-amber-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-700",
          badge: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
          icon: Crown,
          hoverGradient: "hover:from-yellow-500/20 hover:to-amber-500/20"
        };
      case "admin":
        return {
          gradient: "from-red-500/10 to-rose-500/10",
          border: "border-red-500/30", 
          text: "text-red-700",
          badge: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
          icon: Shield,
          hoverGradient: "hover:from-red-500/20 hover:to-rose-500/20"
        };
      default:
        return {
          gradient: "from-blue-500/10 to-indigo-500/10",
          border: "border-blue-500/30",
          text: "text-blue-700", 
          badge: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
          icon: User,
          hoverGradient: "hover:from-blue-500/20 hover:to-indigo-500/20"
        };
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email is already a member
  const isEmailAlreadyMember = (email: string): boolean => {
    return filteredMembers.some(member => 
      member.user.email.toLowerCase() === email.toLowerCase()
    );
  };

  // Add member handler
  const handleAddMember = async () => {
    const trimmedEmail = newMemberEmail.trim();
    
    // Validation checks
    if (!trimmedEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (isEmailAlreadyMember(trimmedEmail)) {
      toast.error("This user is already a member of the workspace");
      return;
    }
    
    if (!workspaceId) {
      toast.error("Workspace ID is missing");
      return;
    }
    
    try {
      await inviteMemberMutation.mutateAsync({
        email: trimmedEmail,
        role: newMemberRole,
        workspaceId: workspaceId
      });
      
      // Success feedback
      toast.success(`🎉 Invitation sent to ${trimmedEmail}!`, {
        description: "They will receive an email with instructions to join the workspace."
      });
      
      // Reset form
      setNewMemberEmail("");
      setNewMemberRole("member");
      setShowAddMember(false);
      
      // Refresh workspace details to get updated member list
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "details"] });
      
    } catch (error: any) {
      console.error("Failed to invite member:", error);
      
      // Extract error message from response
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send invitation";
      
      // Show more specific error messages
      if (errorMessage.includes("already a member")) {
        toast.error("User is already a member", {
          description: "This user is already part of the workspace."
        });
      } else if (errorMessage.includes("User not found")) {
        toast.error("User not found", {
          description: "No user found with this email address. They may need to create an account first."
        });
      } else if (errorMessage.includes("already invited")) {
        toast.error("User already invited", {
          description: "An invitation has already been sent to this user."
        });
      } else if (errorMessage.includes("not authorized")) {
        toast.error("Permission denied", {
          description: "You don't have permission to invite members to this workspace."
        });
      } else {
        toast.error("Failed to send invitation", {
          description: errorMessage
        });
      }
    }
  };
  
  // Handle enter key press in email input
  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl shadow-sm border border-muted/20">
        <div className="flex items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              Workspace Members
            </h1>
            <p className="text-muted-foreground">Manage and collaborate with your team</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddMember(!showAddMember)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
        
        {/* Add Member Form */}
        {showAddMember && (
          <div className="mt-4 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Input
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  onKeyPress={handleEmailKeyPress}
                  className={cn(
                    "bg-background/80 backdrop-blur-sm transition-all duration-300",
                    newMemberEmail.trim() && !isValidEmail(newMemberEmail.trim()) && "border-red-500 focus-visible:ring-red-500",
                    newMemberEmail.trim() && isEmailAlreadyMember(newMemberEmail.trim()) && "border-yellow-500 focus-visible:ring-yellow-500",
                    newMemberEmail.trim() && isValidEmail(newMemberEmail.trim()) && !isEmailAlreadyMember(newMemberEmail.trim()) && "border-green-500 focus-visible:ring-green-500"
                  )}
                  type="email"
                />
                {/* Validation feedback */}
                {newMemberEmail.trim() && (
                  <div className="text-xs transition-all duration-300">
                    {!isValidEmail(newMemberEmail.trim()) ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <span>❌</span> Invalid email format
                      </span>
                    ) : isEmailAlreadyMember(newMemberEmail.trim()) ? (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <span>⚠️</span> User is already a member
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <span>✅</span> Valid email
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
              >
                <option value="member">👤 Member</option>
                <option value="admin">🛡️ Admin</option>
              </select>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddMember}
                  disabled={
                    !newMemberEmail.trim() || 
                    !isValidEmail(newMemberEmail.trim()) || 
                    isEmailAlreadyMember(newMemberEmail.trim()) ||
                    inviteMemberMutation.isPending
                  }
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviteMemberMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>✉️ Send Invite</>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMemberEmail("");
                    setNewMemberRole("member");
                  }}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            {/* Help text */}
            <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded border">
              <span className="font-medium">💡 Tip:</span> The user must already have an account to receive an invitation. They'll get an email with a link to join this workspace.
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search members...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm border border-muted hover:border-primary/50 focus-visible:ring-primary/20 transition-all duration-300"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Tabs */}
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
                    <Users className="h-5 w-5 text-indigo-600" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    {filteredMembers?.length} members in your workspace
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 font-medium border-indigo-500/20">
                  {filteredMembers?.length} total
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-muted/20">
                {filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-xl font-medium mb-2">No members found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">Try adjusting your search query or add new members to your workspace</p>
                    <Button onClick={() => setSearch('')} variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  filteredMembers.map((member) => {
                    const roleStyles = getRoleStyles(member.role);
                    const RoleIcon = roleStyles.icon;
                    
                    return (
                      <div
                        key={member.user._id}
                        className={cn(
                          "flex flex-col md:flex-row items-center justify-between p-4 gap-3 transition-all duration-300",
                          `hover:bg-gradient-to-r ${roleStyles.gradient}`,
                          hoverMemberId === member.user._id && `bg-gradient-to-r ${roleStyles.gradient}`
                        )}
                        onMouseEnter={() => setHoverMemberId(member.user._id)}
                        onMouseLeave={() => setHoverMemberId(null)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className={cn(
                              "ring-2 transition-all duration-300",
                              hoverMemberId === member.user._id ? `ring-2 ${roleStyles.border.replace('border-', 'ring-')} scale-110` : 'ring-muted/30'
                            )}>
                              <AvatarImage src={member.user.profilePicture} />
                              <AvatarFallback className={cn("text-white", roleStyles.badge)}>
                                {member.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {/* Role indicator */}
                            <div className={cn(
                              "absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-background",
                              roleStyles.badge
                            )}>
                              <RoleIcon className="h-2.5 w-2.5" />
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium flex items-center gap-1">
                              {member.user.name}
                              {["admin", "owner"].includes(member.role) && (
                                <Star className={cn("h-3.5 w-3.5 ml-1", roleStyles.text)} />  
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-11 md:ml-0">
                          <Badge className={cn("capitalize transition-all duration-300", roleStyles.badge)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>

                          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm transition-all duration-300">
                            {data.name}
                          </Badge>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className={cn(
                                "rounded-full transition-all duration-300",
                                `hover:bg-gradient-to-r ${roleStyles.gradient} ${roleStyles.hoverGradient}`,
                                roleStyles.text
                              )}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit3 className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">Try adjusting your search query or add new members</p>
              <div className="flex gap-2">
                <Button onClick={() => setSearch('')} variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                  Clear Search
                </Button>
                <Button onClick={() => setShowAddMember(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => {
                const roleStyles = getRoleStyles(member.role);
                const RoleIcon = roleStyles.icon;
                
                return (
                  <Card 
                    key={member.user._id} 
                    className={cn(
                      "border backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg group relative",
                      roleStyles.border,
                      `bg-gradient-to-br ${roleStyles.gradient} to-background/80`,
                      `hover:shadow-${member.role === 'owner' ? 'yellow' : member.role === 'admin' ? 'red' : 'blue'}-500/20`
                    )}
                    onMouseEnter={() => setHoverMemberId(member.user._id)}
                    onMouseLeave={() => setHoverMemberId(null)}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                      `bg-gradient-to-b ${roleStyles.gradient}`
                    )} />
                    
                    <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                      <div className="relative mb-4">
                        <Avatar 
                          className={cn(
                            "ring-2 size-20 transition-all duration-300",
                            hoverMemberId === member.user._id 
                              ? `${roleStyles.border.replace('border-', 'ring-')} scale-110` 
                              : 'ring-muted/30'
                          )}
                        >
                          <AvatarImage src={member.user.profilePicture} />
                          <AvatarFallback className={cn("uppercase text-white text-xl font-bold", roleStyles.badge)}>
                            {member.user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Role indicator */}
                        <div className={cn(
                          "absolute -bottom-2 -right-2 p-2 rounded-full border-2 border-background shadow-lg",
                          roleStyles.badge
                        )}>
                          <RoleIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-1 flex items-center justify-center gap-1">
                        {member.user.name}
                        {["admin", "owner"].includes(member.role) && (
                          <Star className={cn("h-4 w-4 ml-1", roleStyles.text)} />  
                        )}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[200px]">{member.user.email}</span>
                      </p>

                      <div className="flex gap-2 flex-wrap justify-center mb-4">
                        <Badge className={cn("capitalize font-medium", roleStyles.badge)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {member.role}
                        </Badge>

                        <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-muted/40">
                          {data.name}
                        </Badge>
                      </div>
                      
                      {/* Action buttons on hover */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button size="sm" variant="ghost" className={cn(
                          "text-xs transition-all duration-300",
                          `hover:bg-gradient-to-r ${roleStyles.gradient}`,
                          roleStyles.text
                        )}>
                          <Mail className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className={cn(
                              "text-xs transition-all duration-300",
                              `hover:bg-gradient-to-r ${roleStyles.gradient}`,
                              roleStyles.text
                            )}>
                              <Settings className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit3 className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Members;
