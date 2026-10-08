import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, children, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        aria-pressed={pressed}
        onClick={() => onPressedChange(!pressed)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] border border-ink px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal",
          {
            "bg-signal text-white": pressed,
            "bg-paper text-ink hover:bg-rule": !pressed,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Toggle.displayName = "Toggle"
