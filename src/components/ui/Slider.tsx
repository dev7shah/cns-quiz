import * as React from "react"
import { cn } from "@/lib/utils"

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        className={cn(
          "w-full h-1 bg-rule appearance-none cursor-pointer outline-none",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-signal [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-ink",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"
