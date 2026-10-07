"use client"

import { useEffect, useReducer, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { quizReducer, initialQuizState } from "@/lib/quiz/engine"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

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
    } else if (e.key >= '1' && e.key <= '6') {
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
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (state.phase === 'finished') {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-extrabold mb-8 text-primary">Challenge Complete!</h1>
        <div className="flex gap-8 items-end h-64 border-b-2 border-border mb-8">
          {/* Simple podium representation */}
          {[...state.teams].sort((a, b) => b.score - a.score).map((team) => (
            <motion.div 
              key={team.id}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(10, (team.score / 100) * 100)}%` }}
              className="w-32 bg-primary/20 border-2 border-primary rounded-t-lg flex flex-col items-center justify-start pt-4"
            >
              <div className="text-2xl font-bold">{team.score}</div>
              <div className="mt-2 text-sm text-muted-foreground">{team.name}</div>
            </motion.div>
          ))}
        </div>
        <Button size="lg" onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    )
  }

  const currentQuestion = state.queue[state.currentIndex]

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold text-muted-foreground">
          Question {state.currentIndex + 1} / {state.queue.length}
        </div>
        <div className={`text-5xl font-mono font-bold ${state.timeLeft <= 5 ? 'text-destructive' : 'text-primary'}`}>
          00:{state.timeLeft.toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          {state.phase === 'asking' && (
            <Button variant="outline" onClick={() => dispatch({ type: 'REVEAL' })}>Reveal (Space)</Button>
          )}
          {state.phase === 'revealed' && (
            <Button onClick={() => dispatch({ type: 'NEXT' })}>Next (N)</Button>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <Card className="p-8 md:p-12 shadow-xl border-primary/20">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                {currentQuestion.prompt}
              </h2>
              
              {currentQuestion.scenario && (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg border text-lg italic text-muted-foreground">
                  {currentQuestion.scenario}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isRevealed = state.phase === 'revealed'
                  const isCorrect = idx === currentQuestion.answerIndex
                  
                  let optStyle = "border-2 border-border bg-card"
                  if (isRevealed) {
                    if (isCorrect) optStyle = "border-primary bg-primary/20 text-foreground"
                    else optStyle = "border-destructive/50 bg-destructive/5 text-muted-foreground opacity-50"
                  }

                  return (
                    <div 
                      key={idx}
                      className={`p-6 rounded-xl text-xl font-medium transition-colors flex items-center ${optStyle}`}
                    >
                      <span className="w-10 h-10 rounded-full bg-background flex items-center justify-center mr-4 border text-muted-foreground">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </div>
                  )
                })}
              </div>

              {state.phase === 'revealed' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-accent/10 border-l-4 border-accent rounded-r-lg"
                >
                  <h4 className="font-bold mb-2">Explanation:</h4>
                  <p className="text-lg">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scoreboard Bar */}
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        {state.teams.map((team, idx) => (
          <div key={team.id} className="bg-card border rounded-lg px-6 py-3 shadow-sm flex items-center gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Team {idx + 1}</div>
              <div className="font-bold">{team.name}</div>
            </div>
            <div className="text-3xl font-mono text-primary font-bold">
              {team.score}
            </div>
            {state.phase === 'revealed' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => dispatch({ type: 'AWARD', payload: { teamId: team.id, points: 10 } })}
              >
                +10
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
