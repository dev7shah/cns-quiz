import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "danger" | "success"
  icon?: React.ReactNode
}

export function Callout({
  className,
  children,
  variant = "default",
  icon,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex items-start space-x-3",
        {
          "bg-secondary/50 border-border text-secondary-foreground": variant === "default",
          "bg-warning/10 border-warning/20 text-warning-foreground": variant === "warning",
          "bg-destructive/10 border-destructive/20 text-destructive-foreground": variant === "danger",
          "bg-primary/10 border-primary/20 text-primary-foreground": variant === "success",
        },
        className
      )}
      {...props}
    >
      {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
      <div className="flex-1 overflow-hidden leading-relaxed">{children}</div>
    </div>
  )
}
