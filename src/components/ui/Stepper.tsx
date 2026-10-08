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
    <div className={cn("flex w-full items-center justify-between font-mono", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center border border-ink text-[11px] font-bold transition-colors",
                  {
                    "bg-signal text-white": isCurrent,
                    "bg-ink text-paper": isCompleted && !isCurrent,
                    "bg-paper text-ink": !isCompleted && !isCurrent,
                  }
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <div
                className={cn(
                  "absolute -bottom-6 w-max text-[10px] tracking-wider uppercase transition-colors",
                  {
                    "text-signal font-bold": isCurrent,
                    "text-ink font-semibold": isCompleted && !isCurrent,
                    "text-ink-soft": !isCurrent && !isCompleted,
                  }
                )}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-[1px] flex-1 transition-colors",
                  {
                    "bg-ink": isCompleted || isCurrent,
                    "bg-rule": !isCompleted && !isCurrent,
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
