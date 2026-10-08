"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import AILearn, { aiLessonSteps, aiLessonDiagrams } from "./Learn"
import AIPlayground from "./Playground"
import AIComplexity from "./Complexity"
import AIQuiz from "./Quiz"
import AICheatSheet from "./CheatSheet"

export default function AIModule() {
  const [isPresenting, setIsPresenting] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && e.target === document.body) {
        setIsPresenting(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isPresenting) {
    return (
      <PresenterMode
        moduleName="AI Security"
        steps={aiLessonSteps}
        diagrams={aiLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="AI Security"
      description="Learn about the unique vulnerabilities introduced by Large Language Models (LLMs), like Prompt Injection and Data Poisoning."
      learnContent={<AILearn />}
      playgroundContent={<AIPlayground />}
      complexityContent={<AIComplexity />}
      quizContent={<AIQuiz />}
      cheatSheetContent={<AICheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
