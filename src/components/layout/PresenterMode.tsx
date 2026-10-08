"use client"
import * as React from "react"
import { LessonStepType } from "./GuidedLesson"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export function PresenterMode({
  moduleName,
  steps,
  diagrams,
  onClose
}: {
  moduleName: string
  steps: LessonStepType[]
  diagrams: Record<string, React.FC<{ activeSubStep: number }>>
  onClose: () => void
}) {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [activeSubStepIndex, setActiveSubStepIndex] = React.useState(0)
  const [showNotes, setShowNotes] = React.useState(false)
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0)
  
  const router = useRouter()

  const activeStep = steps[activeStepIndex]
  const DiagramComponent = activeStep ? diagrams[activeStep.diagram] : null

  const isRecap = activeStepIndex === steps.length

  React.useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 's' || e.key === 'S') setShowNotes(n => !n)
      if (e.key === 'q' || e.key === 'Q') router.push('/quiz')
      
      if (e.key === 'ArrowRight') {
        if (!isRecap && activeSubStepIndex < activeStep.subSteps.length - 1) {
          setActiveSubStepIndex(p => p + 1)
        } else if (activeStepIndex < steps.length) {
          setActiveStepIndex(p => p + 1)
          setActiveSubStepIndex(0)
        }
      }
      
      if (e.key === 'ArrowLeft') {
        if (!isRecap && activeSubStepIndex > 0) {
          setActiveSubStepIndex(p => p - 1)
        } else if (activeStepIndex > 0) {
          setActiveStepIndex(p => p - 1)
          setActiveSubStepIndex(0)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStepIndex, activeSubStepIndex, steps.length, isRecap, activeStep, onClose, router])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-rule bg-card text-ink font-mono text-xs uppercase tracking-widest font-bold">
        <div>
          <span className="text-signal">{moduleName}</span>
          <span className="mx-3 opacity-30">·</span>
          {!isRecap ? (
            <span>Step {activeStepIndex + 1} of {steps.length} <span className="opacity-50">· {activeStep.title}</span></span>
          ) : (
            <span>Recap</span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <span>{formatTime(elapsedSeconds)}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 text-[10px] uppercase">ESC to Exit</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area - Text/Recap */}
        <div className="w-1/2 p-16 flex flex-col justify-center border-r border-rule relative overflow-y-auto">
          {!isRecap ? (
            <>
              <h1 className="font-serif text-6xl text-ink leading-tight mb-8">{activeStep.title}</h1>
              <p className="font-sans text-2xl text-ink-soft leading-relaxed max-w-2xl mb-12">
                {activeStep.analogy}
              </p>
              
              <div className="bg-card border-l-[4px] border-signal p-8 rounded-r-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold block mb-4">Exam Definition</span>
                <p className="font-sans text-2xl text-ink font-medium leading-relaxed">
                  {activeStep.examAnswer}
                </p>
              </div>

              {activeStep.subSteps[activeSubStepIndex] && (
                <div className="mt-12 font-mono text-sm border-t border-rule pt-8">
                  <span className="opacity-50 mb-2 block">Caption:</span>
                  {activeStep.subSteps[activeSubStepIndex].caption}
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="font-serif text-6xl text-ink leading-tight mb-12">Recap: {moduleName}</h1>
              <div className="space-y-6">
                <h3 className="font-mono text-sm uppercase text-signal font-bold tracking-widest">3 Things to Remember</h3>
                <ul className="list-disc pl-6 space-y-4 text-2xl text-ink-soft">
                  {/* Ideally passed in as props, mocking for now */}
                  <li>Encryption hides data, hashing verifies integrity.</li>
                  <li>Symmetric is fast but distributing keys is hard.</li>
                  <li>Asymmetric solves key distribution but is very slow.</li>
                </ul>
              </div>
              <div className="mt-20">
                <Button size="lg" onClick={() => router.push('/quiz')} className="text-xl px-12 py-8 h-auto">Start Module Quiz</Button>
              </div>
            </>
          )}

          {/* Speaker Notes Drawer (Absolute positioned inside left area for simplicity, or could be a toast) */}
          {showNotes && !isRecap && (
            <div className="absolute bottom-0 left-0 right-0 bg-ink text-paper p-8 border-t-[4px] border-signal shadow-2xl z-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-signal uppercase tracking-widest font-bold">Speaker Notes (Press S to hide)</span>
              </div>
              <p className="font-sans text-xl leading-relaxed">
                {activeStep.presenterScript}
              </p>
            </div>
          )}
        </div>

        {/* Right Area - Diagram */}
        <div className="w-1/2 p-12 bg-card flex flex-col items-center justify-center relative">
           {!isRecap && DiagramComponent ? (
             <div className="scale-125 transform-origin-center">
               <DiagramComponent activeSubStep={activeSubStepIndex} />
             </div>
           ) : isRecap ? (
             <div className="text-center font-serif text-4xl text-ink opacity-20">
               End of Module
             </div>
           ) : null}

           {/* Controls Hint */}
           <div className="absolute bottom-8 right-8 flex gap-4 font-mono text-[10px] text-ink-soft opacity-50">
             <span>← / → : Sub-steps</span>
             <span>S : Notes</span>
             <span>Q : Quiz</span>
           </div>
        </div>

      </div>
    </div>
  )
}
