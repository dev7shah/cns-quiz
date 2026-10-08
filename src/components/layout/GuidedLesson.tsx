"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Callout } from "@/components/ui/Callout"
import { GlossaryTooltip } from "@/components/ui/GlossaryTooltip"
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

  // A real implementation would use IntersectionObserver for scrollytelling.
  // For this prototype, we'll use a stepper-based navigation to guarantee accessibility and robustness.

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

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-[1180px] mx-auto w-full relative">
      
      {/* Left Column: Text (Scrollytelling text area) */}
      <div className="flex-1 max-w-[720px] space-y-16 pb-32">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex
          return (
            <div 
              key={step.id} 
              className={cn("transition-opacity duration-500 cursor-pointer", isActive ? "opacity-100" : "opacity-30")}
              onClick={() => {
                setActiveStepIndex(idx)
                setActiveSubStepIndex(0)
              }}
            >
              <div className="font-mono text-xs text-signal tracking-widest uppercase mb-4">
                Step {String(idx + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </div>
              <h2 className="font-serif text-4xl text-ink mb-6">{step.title}</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-ink-soft hover:text-ink transition-colors">
                  <input type="checkbox" className="accent-signal" checked={explainSimpler} onChange={(e) => setExplainSimpler(e.target.checked)} />
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

              {isActive && (
                <div className="bg-card border border-rule p-6 rounded-[6px] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-bold">See it work</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handlePrevSubStep} disabled={activeSubStepIndex === 0}>Back</Button>
                      <Button variant="outline" size="sm" onClick={handleNextSubStep} disabled={activeSubStepIndex === activeStep.subSteps.length - 1}>Next</Button>
                    </div>
                  </div>
                  <p className="text-sm font-sans text-ink leading-relaxed">
                    <strong>Step {activeSubStepIndex + 1}:</strong> {activeStep.subSteps[activeSubStepIndex]?.caption}
                  </p>
                </div>
              )}

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

              {step.checkpoint && isActive && (
                <div className="mt-12 border-t border-rule pt-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold mb-4">Quick Checkpoint</h3>
                  <p className="mb-4 font-medium">{step.checkpoint.q}</p>
                  <div className="space-y-2">
                    {step.checkpoint.options.map((opt, i) => (
                      <Button key={i} variant="outline" className="w-full justify-start text-left font-normal" onClick={() => {
                        if (i === step.checkpoint?.answerIndex) alert("Correct! " + step.checkpoint.why)
                        else alert("Incorrect. Try again.")
                      }}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )
        })}
      </div>

      {/* Right Column: Sticky Diagram */}
      <div className="hidden lg:block w-[400px] shrink-0">
        <div className="sticky top-24 border border-rule bg-card rounded-[6px] p-6 shadow-[4px_4px_0_var(--color-rule)] min-h-[400px] flex items-center justify-center">
          {DiagramComponent ? <DiagramComponent activeSubStep={activeSubStepIndex} /> : <div className="text-ink-soft font-mono text-sm">Diagram placeholder</div>}
        </div>
      </div>
      
    </div>
  )
}
