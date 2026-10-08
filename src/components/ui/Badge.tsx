import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors",
        {
          "border-ink bg-signal text-white": variant === "default",
          "border-rule bg-card text-ink": variant === "secondary",
          "border-bad bg-bad text-white": variant === "destructive",
          "border-ink bg-transparent text-ink": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
