"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import CloudLearn, { cloudLessonSteps, cloudLessonDiagrams } from "./Learn"
import CloudPlayground from "./Playground"
import CloudComplexity from "./Complexity"
import CloudQuiz from "./Quiz"
import CloudCheatSheet from "./CheatSheet"

export default function CloudModule() {
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
        moduleName="Cloud Security"
        steps={cloudLessonSteps}
        diagrams={cloudLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Cloud Security"
      description="Understand the Shared Responsibility Model, IAM misconfigurations, and how to secure cloud infrastructure."
      learnContent={<CloudLearn />}
      playgroundContent={<CloudPlayground />}
      complexityContent={<CloudComplexity />}
      quizContent={<CloudQuiz />}
      cheatSheetContent={<CloudCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
