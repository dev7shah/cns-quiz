"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import FirewallLearn, { firewallLessonSteps, firewallLessonDiagrams } from "./Learn"
import FirewallPlayground from "./Playground"
import FirewallComplexity from "./Complexity"
import FirewallQuiz from "./Quiz"
import FirewallCheatSheet from "./CheatSheet"

export default function FirewallModule() {
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
        moduleName="Firewalls"
        steps={firewallLessonSteps}
        diagrams={firewallLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Firewalls"
      description="Learn how firewalls filter traffic, the difference between stateless and stateful inspection, and how to write secure ACL rules."
      learnContent={<FirewallLearn />}
      playgroundContent={<FirewallPlayground />}
      complexityContent={<FirewallComplexity />}
      quizContent={<FirewallQuiz />}
      cheatSheetContent={<FirewallCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
