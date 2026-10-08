import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "danger" | "success" | "info"
  title?: string
}

export function Callout({
  className,
  children,
  variant = "default",
  title,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "border-l-[3px] py-2 pl-4 pr-2 my-4 bg-transparent",
        {
          "border-signal text-ink": variant === "default",
          "border-warn text-ink": variant === "warning",
          "border-bad text-ink": variant === "danger",
          "border-ok text-ink": variant === "success",
          "border-info text-ink": variant === "info",
        },
        className
      )}
      {...props}
    >
      {title && (
        <div className="font-mono text-[11px] tracking-[0.08em] uppercase mb-1 font-bold">
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
