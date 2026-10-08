import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:pointer-events-none disabled:opacity-50",
          "border border-ink", // 1px ink border
          "shadow-[2px_2px_0_var(--color-rule)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none", // offset shadow moving 2px
          {
            "bg-signal text-white": variant === "default",
            "bg-bad text-white": variant === "destructive",
            "bg-paper text-ink": variant === "outline",
            "bg-card text-ink": variant === "secondary",
            "border-transparent bg-transparent text-ink shadow-none hover:bg-rule hover:translate-x-0 hover:translate-y-0": variant === "ghost",
            "border-transparent bg-transparent text-signal underline-offset-4 hover:underline shadow-none hover:translate-x-0 hover:translate-y-0": variant === "link",
            "h-9 px-4 py-2": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-8 text-base": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
