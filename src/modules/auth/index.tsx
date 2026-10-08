"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import AuthLearn, { authLessonSteps, authLessonDiagrams } from "./Learn"
import AuthPlayground from "./Playground"
import AuthComplexity from "./Complexity"
import AuthQuiz from "./Quiz"
import AuthCheatSheet from "./CheatSheet"

export default function AuthModule() {
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
        moduleName="Authentication"
        steps={authLessonSteps}
        diagrams={authLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Authentication"
      description="Learn how systems verify identity through passwords, salting, and Multi-Factor Authentication (MFA)."
      learnContent={<AuthLearn />}
      playgroundContent={<AuthPlayground />}
      complexityContent={<AuthComplexity />}
      quizContent={<AuthQuiz />}
      cheatSheetContent={<AuthCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
