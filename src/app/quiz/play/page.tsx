"use client"

import { useEffect, useReducer, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { quizReducer, initialQuizState } from "@/lib/quiz/engine"
import { Button } from "@/components/ui/Button"

export default function QuizPlay() {
  const router = useRouter()
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)

  useEffect(() => {
    const setupData = localStorage.getItem("cns-quiz-setup")
    if (!setupData) {
      router.push("/quiz")
      return
    }
    const { teams, rounds, queue } = JSON.parse(setupData)
    if (queue.length > 0) {
      dispatch({ type: 'START', payload: { teams, rounds, queue } })
    }
  }, [router])

  useEffect(() => {
    if (state.phase !== 'asking' || state.paused) return
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(timer)
  }, [state.phase, state.paused])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      if (state.phase === 'asking') dispatch({ type: 'REVEAL' })
    } else if (e.code === 'KeyN') {
      if (state.phase === 'revealed') dispatch({ type: 'NEXT' })
    } else if (e.code === 'KeyP') {
      dispatch({ type: 'PAUSE' })
    } else if (e.key >= '1' && e.key <= '9') {
      const teamIdx = parseInt(e.key) - 1
      if (state.phase === 'revealed' && state.teams[teamIdx]) {
        dispatch({ type: 'AWARD', payload: { teamId: state.teams[teamIdx].id, points: 10 } })
      }
    }
  }, [state.phase, state.teams])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (state.phase === 'setup' || state.queue.length === 0) {
    return <div className="flex h-screen items-center justify-center bg-paper text-ink font-mono uppercase tracking-widest">Initializing...</div>
  }

  if (state.phase === 'finished') {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 text-center bg-paper relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-px bg-signal rotate-12 opacity-20 pointer-events-none"></div>
        <h1 className="text-6xl md:text-8xl font-serif mb-12 text-ink z-10">Challenge Complete</h1>
        <div className="flex gap-4 md:gap-8 items-end h-80 border-b border-rule mb-12 z-10">
          {[...state.teams].sort((a, b) => b.score - a.score).map((team, idx) => (
            <motion.div 
              key={team.id}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(15, (team.score / Math.max(...state.teams.map(t => t.score), 1)) * 100)}%` }}
              className={`w-24 md:w-40 border border-b-0 flex flex-col items-center justify-start pt-6 shadow-[4px_0_0_var(--rule)] ${
                idx === 0 ? 'bg-signal border-signal text-paper' : 'bg-card border-ink text-ink'
              }`}
            >
              <div className="text-3xl md:text-5xl font-mono font-bold">{team.score}</div>
              <div className="mt-4 text-xs md:text-sm font-sans font-bold uppercase tracking-widest opacity-80 px-2 break-words text-center">{team.name}</div>
            </motion.div>
          ))}
        </div>
        <Button size="lg" onClick={() => router.push("/")} className="bg-ink text-paper font-mono uppercase tracking-widest rounded-none border border-ink z-10">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const currentQuestion = state.queue[state.currentIndex]
  const isRevealed = state.phase === 'revealed'

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top Bar (Host HUD) */}
      <div className="flex justify-between items-center p-4 md:p-6 border-b border-rule bg-card">
        <div className="flex items-center gap-4">
          <div className="bg-ink text-paper px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold">
            Q {state.currentIndex + 1} / {state.queue.length}
          </div>
          <div className="text-sm font-mono text-ink-soft hidden md:block">
            {state.phase === 'asking' ? 'Awaiting Answer...' : 'Answer Revealed'}
          </div>
        </div>
        
        {/* Giant Timer */}
        <div className={`text-6xl md:text-7xl font-mono font-bold leading-none ${state.timeLeft <= 5 && !isRevealed ? 'text-bad animate-pulse' : 'text-ink'}`}>
          00:{state.timeLeft.toString().padStart(2, '0')}
        </div>

        <div className="flex gap-2">
          {state.phase === 'asking' && (
            <div className="hidden md:flex gap-2 font-mono text-[10px] text-ink-soft uppercase items-center">
              <span>Shortcuts:</span>
              <span className="border border-rule px-1 rounded bg-paper">Space</span> to Reveal,
              <span className="border border-rule px-1 rounded bg-paper">P</span> to Pause
            </div>
          )}
          {state.phase === 'revealed' && (
            <div className="hidden md:flex gap-2 font-mono text-[10px] text-ink-soft uppercase items-center">
              <span>Shortcuts:</span>
              <span className="border border-rule px-1 rounded bg-paper">N</span> for Next,
              <span className="border border-rule px-1 rounded bg-paper">1-9</span> to Award Pts
            </div>
          )}
          {/* Fallback buttons for mouse users */}
          {state.phase === 'asking' && (
            <Button variant="outline" className="md:hidden font-mono text-xs rounded-none" onClick={() => dispatch({ type: 'REVEAL' })}>Reveal</Button>
          )}
          {state.phase === 'revealed' && (
            <Button variant="outline" className="md:hidden font-mono text-xs rounded-none" onClick={() => dispatch({ type: 'NEXT' })}>Next</Button>
          )}
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center"
          >
            {/* The Question */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-ink mb-12 leading-[1.1] text-center max-w-5xl mx-auto">
              {currentQuestion.prompt}
            </h2>
            
            {currentQuestion.scenario && (
              <div className="mb-12 p-6 bg-card border-l-4 border-signal text-xl md:text-2xl font-sans text-ink-soft max-w-4xl mx-auto">
                {currentQuestion.scenario}
              </div>
            )}

            {/* The Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
              {currentQuestion.options.map((opt, idx) => {
                const isCorrect = idx === currentQuestion.answerIndex
                
                // Style logic for Lab Notebook theme
                let optClass = "bg-card border border-ink text-ink shadow-[4px_4px_0_var(--rule)]"
                let letterClass = "bg-paper text-ink-soft border-rule"
                
                if (isRevealed) {
                  if (isCorrect) {
                    optClass = "bg-ok border-ok text-paper shadow-[4px_4px_0_var(--ok)] translate-x-[-2px] translate-y-[-2px]"
                    letterClass = "bg-paper text-ok border-paper"
                  } else {
                    optClass = "bg-paper border-rule text-ink-soft opacity-40 shadow-none"
                    letterClass = "bg-card text-rule border-rule"
                  }
                }

                return (
                  <div 
                    key={idx}
                    className={`p-6 md:p-8 flex items-center transition-all duration-500 ease-out ${optClass}`}
                  >
                    <span className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-mono text-xl font-bold border mr-6 ${letterClass}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-2xl md:text-3xl font-sans font-medium">{opt}</span>
                  </div>
                )
              })}
            </div>

            {/* Explanation Drawer */}
            {isRevealed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-12 w-full max-w-6xl bg-ink text-paper p-8 font-sans border-l-4 border-signal"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2">Examiner Notes</div>
                <p className="text-xl md:text-2xl leading-relaxed">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Docked Scoreboard */}
      <div className="bg-card border-t border-rule p-4 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {state.teams.map((team, idx) => (
            <div key={team.id} className="bg-paper border border-ink p-3 flex items-center justify-between min-w-[200px]">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-soft">Team {idx + 1}</div>
                <div className="font-bold text-sm font-sans text-ink truncate max-w-[100px]">{team.name}</div>
              </div>
              <div className="text-2xl font-mono text-signal font-bold ml-4">
                {team.score}
              </div>
              {isRevealed && (
                <button 
                  className="ml-4 h-8 w-8 bg-card border border-rule flex items-center justify-center text-ink hover:bg-signal hover:text-paper hover:border-signal transition-colors font-mono text-xs cursor-pointer focus:outline-none"
                  onClick={() => dispatch({ type: 'AWARD', payload: { teamId: team.id, points: 10 } })}
                  title="Award 10 Points"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
