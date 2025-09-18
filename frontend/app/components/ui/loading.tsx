import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  className?: string;
  text?: string;
}

export const Loading = ({ 
  size = "md", 
  variant = "spinner", 
  className, 
  text 
}: LoadingProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <Loader2 className={cn("animate-spin text-blue-600 dark:text-blue-400", sizes[size])} />
        {text && (
          <span className={cn("text-slate-600 dark:text-slate-400 font-medium", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                "rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce",
                size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: "0.6s"
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn("text-slate-600 dark:text-slate-400 font-medium ml-3", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div 
          className={cn(
            "rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse",
            sizes[size]
          )}
        />
        {text && (
          <span className={cn("text-slate-600 dark:text-slate-400 font-medium", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        {[1, 2, 3].map((index) => (
          <div 
            key={index}
            className="animate-pulse flex space-x-4"
          >
            <div className="rounded-full bg-slate-300 dark:bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Skeleton loader for specific components
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse", className)}>
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-800"></div>
          ))}
        </div>
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  </div>
);

// Loading button state
export const LoadingButton = ({ 
  children, 
  isLoading = false, 
  className, 
  ...props 
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  [key: string]: any;
}) => (
  <button
    className={cn(
      "relative overflow-hidden",
      "transition-all duration-200 transform",
      "hover:scale-105 active:scale-95",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      className
    )}
    disabled={isLoading}
    {...props}
  >
    <span className={cn(
      "transition-opacity duration-200",
      isLoading && "opacity-0"
    )}>
      {children}
    </span>
    
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )}
  </button>
);

// Shimmer effect for loading placeholders
export const Shimmer = ({ className }: { className?: string }) => (
  <div 
    className={cn(
      "relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded",
      "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r",
      "before:from-transparent before:via-white/20 before:to-transparent",
      "before:animate-[shimmer_2s_infinite]",
      className
    )}
  />
);

// Floating action button with pulse animation
export const FloatingActionButton = ({ 
  children, 
  className, 
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <button
    className={cn(
      "fixed bottom-6 right-6 z-50",
      "h-14 w-14 rounded-full shadow-lg",
      "bg-gradient-to-r from-blue-600 to-purple-600",
      "text-white flex items-center justify-center",
      "hover:shadow-xl hover:scale-110",
      "active:scale-95 transition-all duration-200",
      "animate-bounce hover:animate-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
