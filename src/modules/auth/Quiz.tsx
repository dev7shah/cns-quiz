import { useState } from "react"
import { authQuestions } from "@/data/questions/auth"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function AuthQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const questions = authQuestions.slice(0, 5)

  if (currentIdx >= questions.length) {
    return (
      <Card className="p-12 text-center">
        <CardTitle className="text-3xl mb-4">Practice Complete!</CardTitle>
        <Button onClick={() => { setCurrentIdx(0); setShowAnswer(false); }}>Restart Practice</Button>
      </Card>
    )
  }

  const q = questions[currentIdx]

  return (
    <div className="space-y-8 p-2 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center text-muted-foreground text-sm mb-2">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span className="capitalize">{q.round} Round</span>
          </div>
          <CardTitle className="text-2xl leading-tight">{q.prompt}</CardTitle>
          {q.scenario && <p className="text-muted-foreground italic mt-2">{q.scenario}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answerIndex
              let btnClass = ""
              if (showAnswer) {
                if (isCorrect) btnClass = "bg-primary/20 border-primary text-foreground"
                else btnClass = "opacity-50"
              }
              return (
                <div key={i} className={`p-4 border rounded-lg ${btnClass}`}>
                  <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span> {opt}
                </div>
              )
            })}
          </div>
          
          {showAnswer && (
            <div className="mt-6 p-4 bg-accent/20 rounded-lg border-l-4 border-accent">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
          ) : (
            <Button onClick={() => { setCurrentIdx(i => i + 1); setShowAnswer(false); }}>Next Question</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
