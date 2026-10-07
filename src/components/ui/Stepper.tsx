import * as React from "react"
import { cn } from "@/lib/utils"

export function Stepper({
  steps,
  currentStep,
  className,
}: {
  steps: string[]
  currentStep: number
  className?: string
}) {
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  {
                    "border-primary bg-primary text-primary-foreground": isCompleted || isCurrent,
                    "border-muted bg-background text-muted-foreground": !isCompleted && !isCurrent,
                  }
                )}
              >
                {index + 1}
              </div>
              <div
                className={cn(
                  "absolute -bottom-6 w-max text-xs font-medium",
                  {
                    "text-foreground": isCurrent || isCompleted,
                    "text-muted-foreground": !isCurrent && !isCompleted,
                  }
                )}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-[2px] flex-1 transition-colors",
                  {
                    "bg-primary": isCompleted,
                    "bg-muted": !isCompleted,
                  }
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
