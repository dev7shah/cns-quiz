"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import AttacksLearn, { attacksLessonSteps, attacksLessonDiagrams } from "./Learn"
import AttacksPlayground from "./Playground"
import AttacksComplexity from "./Complexity"
import AttacksQuiz from "./Quiz"
import AttacksCheatSheet from "./CheatSheet"

export default function AttacksModule() {
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
        moduleName="Network & Web Attacks"
        steps={attacksLessonSteps}
        diagrams={attacksLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Network & Web Attacks"
      description="Explore common vulnerabilities like SQL Injection, Cross-Site Scripting (XSS), and Denial of Service (DDoS) attacks."
      learnContent={<AttacksLearn />}
      playgroundContent={<AttacksPlayground />}
      complexityContent={<AttacksComplexity />}
      quizContent={<AttacksQuiz />}
      cheatSheetContent={<AttacksCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
