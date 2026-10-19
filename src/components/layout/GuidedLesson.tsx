"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Callout } from "@/components/ui/Callout"
import { Button } from "@/components/ui/Button"

export interface LessonStepType {
  id: string
  title: string
  analogy: string
  diagram: string
  subSteps: { caption: string; highlight: string[] }[]
  examAnswer: string
  watchOut?: string
  realWorld?: string
  glossary: string[]
  presenterScript: string
  tryItLink?: string
  checkpoint?: { q: string; options: string[]; answerIndex: number; why: string }
}

export function GuidedLesson({
  steps,
  diagrams
}: {
  steps: LessonStepType[]
  diagrams: Record<string, React.FC<{ activeSubStep: number }>>
}) {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [activeSubStepIndex, setActiveSubStepIndex] = React.useState(0)
  const [explainSimpler, setExplainSimpler] = React.useState(false)
  // Checkpoint state — reset when the user navigates to a different step
  const [checkpointSelected, setCheckpointSelected] = React.useState<number | null>(null)
  const [checkpointSubmitted, setCheckpointSubmitted] = React.useState(false)

  const activeStep = steps[activeStepIndex]
  const DiagramComponent = diagrams[activeStep.diagram]

  const handleNextSubStep = () => {
    if (activeSubStepIndex < activeStep.subSteps.length - 1) {
      setActiveSubStepIndex(prev => prev + 1)
    }
  }

  const handlePrevSubStep = () => {
    if (activeSubStepIndex > 0) {
      setActiveSubStepIndex(prev => prev - 1)
    }
  }

  const handleStepChange = (idx: number) => {
    setActiveStepIndex(idx)
    setActiveSubStepIndex(0)
    setCheckpointSelected(null)
    setCheckpointSubmitted(false)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-[1180px] mx-auto w-full relative">

      {/* Left Column: Text */}
      <div className="flex-1 max-w-[720px] space-y-16 pb-32">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex
          return (
            <div
              key={step.id}
              className={cn("transition-opacity duration-500 cursor-pointer", isActive ? "opacity-100" : "opacity-30")}
              onClick={() => handleStepChange(idx)}
            >
              <div className="font-mono text-xs text-signal tracking-widest uppercase mb-4">
                Step {String(idx + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </div>
              <h2 className="font-serif text-4xl text-ink mb-6">{step.title}</h2>

              <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-ink-soft hover:text-ink transition-colors">
                  <input
                    type="checkbox"
                    className="accent-signal"
                    checked={explainSimpler}
                    onChange={(e) => setExplainSimpler(e.target.checked)}
                  />
                  Confused? Explain simpler
                </label>
              </div>

              {explainSimpler ? (
                <p className="text-xl leading-relaxed text-ink mb-8 font-serif italic">
                  Imagine this: {step.analogy}
                </p>
              ) : (
                <p className="text-lg leading-relaxed text-ink mb-8">
                  {step.analogy}
                </p>
              )}

              {/* See it work — stopPropagation so Back/Next don't bubble to parent onClick */}
              {isActive && (() => {
                const isLastSubStep = activeSubStepIndex === activeStep.subSteps.length - 1
                const hasNextStep = activeStepIndex < steps.length - 1
                return (
                  <div
                    className="bg-card border border-rule p-6 rounded-[6px] mb-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold">See it work</span>
                        {/* Sub-step dot indicators */}
                        <div className="flex gap-1">
                          {activeStep.subSteps.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveSubStepIndex(i)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                i === activeSubStepIndex ? "bg-signal" : "bg-rule hover:bg-ink-soft"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevSubStep}
                          disabled={activeSubStepIndex === 0}
                        >
                          ← Back
                        </Button>
                        {isLastSubStep && hasNextStep ? (
                          <Button
                            size="sm"
                            onClick={() => handleStepChange(activeStepIndex + 1)}
                            className="bg-signal text-paper border-signal hover:bg-signal/90 font-mono text-[11px] uppercase tracking-wider"
                          >
                            Next Step →
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextSubStep}
                            disabled={isLastSubStep}
                          >
                            Next →
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-sans text-ink leading-relaxed">
                      <strong>Step {activeSubStepIndex + 1} of {activeStep.subSteps.length}:</strong>{" "}
                      {activeStep.subSteps[activeSubStepIndex]?.caption}
                    </p>
                  </div>
                )
              })()}

              {step.watchOut && (
                <Callout variant="warning" title="Watch Out">
                  {step.watchOut}
                </Callout>
              )}

              {step.realWorld && (
                <Callout variant="success" title="Real World">
                  {step.realWorld}
                </Callout>
              )}

              <Callout variant="default" title="Say it in Exam Words" className="border-signal border-l-[4px] bg-signal/5">
                <span className="font-sans font-medium">{step.examAnswer}</span>
              </Callout>

              {/* Quick Checkpoint — inline green/red feedback, no alert() */}
              {step.checkpoint && isActive && (
                <div
                  className="mt-12 border-t border-rule pt-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold mb-4">Quick Checkpoint</h3>
                  <p className="mb-4 font-medium">{step.checkpoint.q}</p>

                  <div className="space-y-2 mb-4">
                    {step.checkpoint.options.map((opt, i) => {
                      const isCorrect = i === step.checkpoint!.answerIndex
                      const isSelected = i === checkpointSelected

                      const optClass = cn(
                        "w-full p-3 flex items-center gap-3 transition-all duration-200 text-left text-sm font-sans border rounded-[4px]",
                        checkpointSubmitted
                          ? isCorrect
                            ? "bg-ok/10 border-ok text-ink font-semibold"
                            : isSelected
                              ? "bg-bad/10 border-bad text-ink"
                              : "opacity-40 border-rule text-ink-soft"
                          : isSelected
                            ? "bg-signal/10 border-signal text-ink"
                            : "border-rule text-ink hover:border-ink bg-paper"
                      )

                      const badgeClass = cn(
                        "w-6 h-6 flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-bold border rounded-full transition-colors",
                        checkpointSubmitted && isCorrect ? "bg-ok text-paper border-ok" :
                        checkpointSubmitted && isSelected ? "bg-bad text-paper border-bad" :
                        isSelected ? "bg-signal text-paper border-signal" :
                        "bg-card text-ink-soft border-rule"
                      )

                      return (
                        <button
                          key={i}
                          disabled={checkpointSubmitted}
                          onClick={() => setCheckpointSelected(i)}
                          className={optClass}
                        >
                          <span className={badgeClass}>{String.fromCharCode(65 + i)}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  {!checkpointSubmitted ? (
                    <Button
                      size="sm"
                      disabled={checkpointSelected === null}
                      onClick={() => setCheckpointSubmitted(true)}
                      className="font-mono text-xs uppercase tracking-wider"
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <div className={cn(
                      "p-4 border-l-4 rounded-r-[4px] text-sm font-sans",
                      checkpointSelected === step.checkpoint!.answerIndex
                        ? "bg-ok/10 border-ok"
                        : "bg-bad/10 border-bad"
                    )}>
                      <div className={cn(
                        "font-bold font-mono text-[10px] uppercase tracking-wider mb-2",
                        checkpointSelected === step.checkpoint!.answerIndex ? "text-ok" : "text-bad"
                      )}>
                        {checkpointSelected === step.checkpoint!.answerIndex ? "✓ Correct!" : "✗ Not quite"}
                      </div>
                      <p className="leading-relaxed text-ink">{step.checkpoint!.why}</p>
                      {checkpointSelected !== step.checkpoint!.answerIndex && (
                        <button
                          onClick={() => { setCheckpointSelected(null); setCheckpointSubmitted(false) }}
                          className="mt-3 font-mono text-[10px] uppercase tracking-wider underline text-ink-soft hover:text-ink"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          )
        })}
      </div>

      {/* Right Column: Sticky Diagram */}
      <div className="hidden lg:block w-[400px] shrink-0">
        <div className="sticky top-24 border border-rule bg-card rounded-[6px] p-6 shadow-[4px_4px_0_var(--color-rule)] min-h-[400px] flex items-center justify-center">
          {DiagramComponent
            ? <DiagramComponent activeSubStep={activeSubStepIndex} />
            : <div className="text-ink-soft font-mono text-sm">Diagram placeholder</div>
          }
        </div>
      </div>

    </div>
  )
}
