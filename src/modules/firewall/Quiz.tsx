"use client"
import { useState } from "react"
import { firewallQuestions } from "@/data/questions/firewalls"
import { Button } from "@/components/ui/Button"

export default function FirewallQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const questions = firewallQuestions.slice(0, 5) // Just show first 5 for practice

  if (currentIdx >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
        <h2 className="text-3xl font-serif text-ink mb-6">Practice Complete!</h2>
        <Button 
          onClick={() => { setCurrentIdx(0); setShowAnswer(false); setSelectedOption(null); }}
          className="bg-ink text-paper font-mono uppercase tracking-widest rounded-none border border-ink"
        >
          Restart Practice
        </Button>
      </div>
    )
  }

  const q = questions[currentIdx]

  const handleSelect = (i: number) => {
    if (!showAnswer) {
      setSelectedOption(i)
    }
  }

  const handleCheck = () => {
    if (selectedOption !== null) {
      setShowAnswer(true)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div className="bg-card border border-ink shadow-[4px_4px_0_var(--rule)] p-6 md:p-8">
        <div className="flex justify-between items-center border-b border-rule pb-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
            {q.round} Round
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif text-ink leading-tight mb-4">{q.prompt}</h2>
        {q.scenario && (
          <div className="p-4 bg-paper border-l-4 border-signal text-ink-soft font-sans mb-6">
            {q.scenario}
          </div>
        )}

        <div className="space-y-3 mb-8">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answerIndex
            const isSelected = i === selectedOption
            
            let btnClass = "bg-paper border-rule text-ink hover:border-ink"
            let letterClass = "bg-card text-ink-soft border-rule"
            
            if (showAnswer) {
              if (isCorrect) {
                btnClass = "bg-ok border-ok text-paper shadow-[2px_2px_0_var(--ok)] translate-x-[-1px] translate-y-[-1px]"
                letterClass = "bg-paper text-ok border-paper"
              } else if (isSelected) {
                btnClass = "bg-bad border-bad text-paper"
                letterClass = "bg-paper text-bad border-paper"
              } else {
                btnClass = "bg-paper border-rule text-ink-soft opacity-50"
                letterClass = "bg-card text-rule border-rule"
              }
            } else if (isSelected) {
              btnClass = "bg-signal border-signal text-paper shadow-[2px_2px_0_var(--signal)] translate-x-[-1px] translate-y-[-1px]"
              letterClass = "bg-paper text-signal border-paper"
            }

            return (
              <button 
                key={i} 
                onClick={() => handleSelect(i)}
                disabled={showAnswer}
                className={`w-full p-4 flex items-center transition-all duration-200 border cursor-pointer text-left focus:outline-none ${btnClass}`}
              >
                <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-sm font-bold border mr-4 ${letterClass}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-sans text-sm md:text-base">{opt}</span>
              </button>
            )
          })}
        </div>
        
        {showAnswer && (
          <div className="mt-6 p-6 bg-ink text-paper border-l-4 border-signal font-sans">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2">Examiner Notes</div>
            <div className="leading-relaxed">{q.explanation}</div>
          </div>
        )}

        <div className="flex justify-end mt-8 pt-6 border-t border-rule">
          {!showAnswer ? (
            <Button 
              onClick={handleCheck} 
              disabled={selectedOption === null}
              className="bg-ink text-paper font-mono uppercase tracking-widest rounded-none border border-ink disabled:opacity-50"
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              onClick={() => { setCurrentIdx(i => i + 1); setShowAnswer(false); setSelectedOption(null); }}
              className="bg-signal text-paper font-mono uppercase tracking-widest rounded-none border border-signal"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
