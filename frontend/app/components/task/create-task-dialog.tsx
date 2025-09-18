import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Users, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTaskMutation();

  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Create New Task
              </DialogTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Add a new task to your project
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Task Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Task Title</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a descriptive task title..."
                        className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Task Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide details about what needs to be done..."
                        className="min-h-[100px] bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status and Priority Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Status
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            <SelectItem value="To Do" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                                <span>To Do</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="In Progress" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Done" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Done</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Priority
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            <SelectItem value="Low" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Low Priority</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span>Medium Priority</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="High" className="focus:bg-slate-50 dark:focus:bg-slate-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span>High Priority</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Due Date (Optional)
                    </FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200",
                              !field.value && "text-slate-500 dark:text-slate-400"
                            )}
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "MMM d, yyyy")
                            ) : (
                              <span>Select due date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(
                                date?.toISOString() || undefined
                              );
                            }}
                            className="rounded-lg"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignees */}
              <FormField
                control={form.control}
                name="assignees"
                render={({ field }) => {
                  const selectedMembers = field.value || [];

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Assignees (Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-11 justify-start text-left font-normal bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                            >
                              <Users className="h-4 w-4 mr-2 text-slate-400" />
                              {selectedMembers.length === 0 ? (
                                <span className="text-slate-500 dark:text-slate-400">
                                  Select team members
                                </span>
                              ) : selectedMembers.length <= 2 ? (
                                <span className="text-slate-900 dark:text-white">
                                  {selectedMembers
                                    .map((m) => {
                                      const member = projectMembers.find(
                                        (wm) => wm.user._id === m
                                      );
                                      return member?.user.name;
                                    })
                                    .join(", ")}
                                </span>
                              ) : (
                                <span className="text-slate-900 dark:text-white">
                                  {selectedMembers.length} members selected
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-80 max-h-60 overflow-y-auto p-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
                            align="start"
                          >
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
                                Select team members
                              </div>
                              {projectMembers.map((member) => {
                                const selectedMember = selectedMembers.find(
                                  (m) => m === member.user?._id
                                );
                                return (
                                  <div
                                    key={member.user._id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                  >
                                    <Checkbox
                                      checked={!!selectedMember}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...selectedMembers,
                                            member.user._id,
                                          ]);
                                        } else {
                                          field.onChange(
                                            selectedMembers.filter(
                                              (m) => m !== member.user._id
                                            )
                                          );
                                        }
                                      }}
                                      id={`member-${member.user._id}`}
                                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                    <div className="flex items-center space-x-2 flex-1">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                        {member.user.name.charAt(0)}
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                          {member.user.name}
                                        </span>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                          {member.role}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <DialogFooter className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Create Task</span>
                    </div>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
