"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { allQuestions } from "@/data/questions"
import { Round } from "@/lib/quiz/types"
import { motion } from "framer-motion"
import { Users, Settings, Play } from "lucide-react"

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
    <div className="min-h-screen bg-paper py-12 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-ink shadow-[8px_8px_0_var(--rule)]">
          <CardHeader className="border-b border-rule pb-6 mb-6">
            <div className="flex items-center gap-4 text-signal mb-2">
              <Settings className="h-8 w-8" />
              <CardTitle className="font-serif text-4xl text-ink">Exam Challenge Setup</CardTitle>
            </div>
            <p className="text-ink-soft font-sans text-sm">
              Configure the parameters for the live team-based assessment.
            </p>
          </CardHeader>
          <CardContent className="space-y-10">
            
            {/* Number of Teams */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-rule pb-2">
                <Users className="h-4 w-4 text-ink-soft" />
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-ink">Active Teams</label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[2, 3, 4, 5, 6].map((n) => (
                  <Button 
                    key={n} 
                    variant={numTeams === n ? "default" : "outline"}
                    onClick={() => handleNumTeamsChange(n)}
                    className={`font-mono text-lg h-12 w-16 ${
                      numTeams === n 
                        ? "bg-signal text-paper border-signal shadow-none" 
                        : "bg-card text-ink border-ink hover:bg-rule"
                    }`}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Team Rosters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-rule pb-2">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-ink">Team Roster Designation</label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {teamNames.map((name, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider">Squad 0{i + 1}</span>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      className="flex h-12 w-full border border-ink bg-card px-4 py-2 font-bold font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:bg-paper transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-6 border-t border-rule flex justify-end">
              <Button size="lg" onClick={startQuiz} className="bg-ink hover:bg-ink-soft text-paper border border-ink font-bold uppercase tracking-wider font-mono h-14 px-8 text-sm">
                <Play className="mr-2 h-4 w-4" /> Initialize Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
