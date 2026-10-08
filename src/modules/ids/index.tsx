"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import IDSLearn, { idsLessonSteps, idsLessonDiagrams } from "./Learn"
import IDSPlayground from "./Playground"
import IDSComplexity from "./Complexity"
import IDSQuiz from "./Quiz"
import IDSCheatSheet from "./CheatSheet"

export default function IDSModule() {
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
        moduleName="Intrusion Detection Systems (IDS)"
        steps={idsLessonSteps}
        diagrams={idsLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Intrusion Detection Systems (IDS)"
      description="Learn the difference between signature-based and anomaly-based detection, and see how security teams monitor networks."
      learnContent={<IDSLearn />}
      playgroundContent={<IDSPlayground />}
      complexityContent={<IDSComplexity />}
      quizContent={<IDSQuiz />}
      cheatSheetContent={<IDSCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
