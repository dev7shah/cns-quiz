"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { allQuestions } from "@/data/questions"
import { Round } from "@/lib/quiz/types"

export default function QuizSetup() {
  const router = useRouter()
  const [numTeams, setNumTeams] = useState(2)
  const [teamNames, setTeamNames] = useState<string[]>(["Team 1", "Team 2"])

  const handleNumTeamsChange = (n: number) => {
    setNumTeams(n)
    setTeamNames(Array.from({ length: n }, (_, i) => `Team ${i + 1}`))
  }

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...teamNames]
    newNames[index] = name
    setTeamNames(newNames)
  }

  const startQuiz = () => {
    // In a real implementation we would shuffle and select questions
    // Then store in localStorage or context, then navigate to /quiz/play
    const teamsData = teamNames.map((name, i) => ({ id: `t${i}`, name, score: 0 }))
    const roundsData: Round[] = ["rapid", "scenario", "image", "mixed"]
    
    // Select first 10 questions for demo
    const queue = allQuestions.slice(0, 10)
    
    localStorage.setItem("cns-quiz-setup", JSON.stringify({ teams: teamsData, rounds: roundsData, queue }))
    router.push("/quiz/play")
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Quiz Setup</CardTitle>
          <CardDescription>Configure the live quiz challenge session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Teams (2-6)</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((n) => (
                <Button 
                  key={n} 
                  variant={numTeams === n ? "default" : "outline"}
                  onClick={() => handleNumTeamsChange(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium">Team Names</label>
            {teamNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-muted-foreground font-mono">{i + 1}.</span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="lg" onClick={startQuiz}>Launch Quiz Challenge &rarr;</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
