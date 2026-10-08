"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import TLSLearn, { tlsLessonSteps, tlsLessonDiagrams } from "./Learn"
import TLSPlayground from "./Playground"
import TLSComplexity from "./Complexity"
import TLSQuiz from "./Quiz"
import TLSCheatSheet from "./CheatSheet"

export default function TLSModule() {
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
        moduleName="SSL / TLS & HTTPS"
        steps={tlsLessonSteps}
        diagrams={tlsLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="SSL / TLS & HTTPS"
      description="Understand how the Internet is secured through the TLS Handshake, Certificates, and Public Key Infrastructure (PKI)."
      learnContent={<TLSLearn />}
      playgroundContent={<TLSPlayground />}
      complexityContent={<TLSComplexity />}
      quizContent={<TLSQuiz />}
      cheatSheetContent={<TLSCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
