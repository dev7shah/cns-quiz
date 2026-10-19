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

  const handleNext = React.useCallback(() => {
    if (!isRecap && activeStep && activeSubStepIndex < activeStep.subSteps.length - 1) {
      setActiveSubStepIndex(p => p + 1)
    } else if (activeStepIndex < steps.length) {
      setActiveStepIndex(p => p + 1)
      setActiveSubStepIndex(0)
    }
  }, [isRecap, activeStep, activeSubStepIndex, activeStepIndex, steps.length])

  const handlePrev = React.useCallback(() => {
    if (!isRecap && activeSubStepIndex > 0) {
      setActiveSubStepIndex(p => p - 1)
    } else if (activeStepIndex > 0) {
      setActiveStepIndex(p => p - 1)
      setActiveSubStepIndex(0)
    }
  }, [isRecap, activeSubStepIndex, activeStepIndex])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 's' || e.key === 'S') setShowNotes(n => !n)
      if (e.key === 'q' || e.key === 'Q') router.push('/quiz')
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, onClose, router])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-rule bg-card text-ink font-mono text-xs uppercase tracking-widest font-bold">
        <div className="truncate mr-2">
          <span className="text-signal">{moduleName}</span>
          <span className="mx-2 sm:mx-3 opacity-30">·</span>
          {!isRecap ? (
            <span>Step {activeStepIndex + 1} of {steps.length} <span className="opacity-50 hidden sm:inline">· {activeStep.title}</span></span>
          ) : (
            <span>Recap</span>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <span className="font-mono">{formatTime(elapsedSeconds)}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 px-2 text-[10px] uppercase font-mono">
            Exit ✕
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        
        {/* Left Area - Text/Recap */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-rule relative overflow-y-auto min-h-max">
          {!isRecap ? (
            <>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-ink leading-tight mb-4 md:mb-8">{activeStep.title}</h1>
              <p className="font-sans text-base sm:text-lg md:text-2xl text-ink-soft leading-relaxed max-w-2xl mb-6 md:mb-12">
                {activeStep.analogy}
              </p>
              
              <div className="bg-card border-l-[4px] border-signal p-4 sm:p-6 md:p-8 rounded-r-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold block mb-2 sm:mb-4">Exam Definition</span>
                <p className="font-sans text-base sm:text-xl md:text-2xl text-ink font-medium leading-relaxed">
                  {activeStep.examAnswer}
                </p>
              </div>

              {activeStep.subSteps[activeSubStepIndex] && (
                <div className="mt-6 md:mt-12 font-mono text-xs sm:text-sm border-t border-rule pt-4 md:pt-8">
                  <span className="opacity-50 mb-1 block">Caption:</span>
                  {activeStep.subSteps[activeSubStepIndex].caption}
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-ink leading-tight mb-6 md:mb-12">Recap: {moduleName}</h1>
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-mono text-xs sm:text-sm uppercase text-signal font-bold tracking-widest">3 Things to Remember</h3>
                <ul className="list-disc pl-5 space-y-3 text-base sm:text-xl md:text-2xl text-ink-soft">
                  <li>Encryption hides data, hashing verifies integrity.</li>
                  <li>Symmetric is fast but distributing keys is hard.</li>
                  <li>Asymmetric solves key distribution but is very slow.</li>
                </ul>
              </div>
              <div className="mt-8 md:mt-20">
                <Button size="lg" onClick={() => router.push('/quiz')} className="text-base sm:text-xl px-6 sm:px-12 py-4 sm:py-8 h-auto w-full sm:w-auto">Start Module Quiz</Button>
              </div>
            </>
          )}

          {/* Speaker Notes Drawer */}
          {showNotes && !isRecap && (
            <div className="mt-6 md:absolute md:bottom-0 md:left-0 md:right-0 bg-ink text-paper p-4 sm:p-6 md:p-8 border-t-[4px] border-signal shadow-2xl z-50 rounded md:rounded-none">
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className="font-mono text-[10px] text-signal uppercase tracking-widest font-bold">Speaker Notes</span>
                <Button variant="ghost" size="sm" onClick={() => setShowNotes(false)} className="text-paper h-6 text-xs p-1">Close</Button>
              </div>
              <p className="font-sans text-sm sm:text-base md:text-xl leading-relaxed">
                {activeStep.presenterScript}
              </p>
            </div>
          )}
        </div>

        {/* Right Area - Diagram */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 bg-card flex flex-col items-center justify-center relative min-h-[280px]">
           {!isRecap && DiagramComponent ? (
             <div className="scale-95 sm:scale-110 md:scale-125 transform-origin-center max-w-full overflow-x-auto">
               <DiagramComponent activeSubStep={activeSubStepIndex} />
             </div>
           ) : isRecap ? (
             <div className="text-center font-serif text-2xl sm:text-4xl text-ink opacity-20">
               End of Module
             </div>
           ) : null}

           {/* Desktop Controls Hint */}
           <div className="hidden md:flex absolute bottom-8 right-8 gap-4 font-mono text-[10px] text-ink-soft opacity-50">
             <span>← / → : Sub-steps</span>
             <span>S : Notes</span>
             <span>Q : Quiz</span>
           </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation Toolbar */}
      <div className="border-t border-rule bg-paper p-3 flex items-center justify-between gap-2 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrev} 
          disabled={activeStepIndex === 0 && activeSubStepIndex === 0}
          className="font-mono text-xs uppercase px-3 h-10"
        >
          ← Prev
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowNotes(n => !n)}
          className={`font-mono text-xs uppercase px-3 h-10 ${showNotes ? 'bg-signal text-paper' : ''}`}
        >
          Notes {showNotes ? '✓' : ''}
        </Button>
        <Button 
          size="sm" 
          onClick={handleNext} 
          disabled={isRecap}
          className="bg-signal text-paper hover:bg-signal/90 border-signal font-mono text-xs uppercase px-4 h-10"
        >
          Next →
        </Button>
      </div>
    </div>
  )
}
