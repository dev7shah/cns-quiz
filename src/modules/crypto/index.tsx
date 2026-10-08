"use client"

import * as React from "react"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { PresenterMode } from "@/components/layout/PresenterMode"
import CryptoLearn, { cryptoLessonSteps, cryptoLessonDiagrams } from "./Learn"
import CryptoPlayground from "./Playground"
import CryptoComplexity from "./Complexity"
import CryptoQuiz from "./Quiz"
import CryptoCheatSheet from "./CheatSheet"

export default function CryptoModule() {
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
        moduleName="Cryptography"
        steps={cryptoLessonSteps}
        diagrams={cryptoLessonDiagrams}
        onClose={() => setIsPresenting(false)}
      />
    )
  }

  return (
    <ModuleShell
      title="Cryptography"
      description="Understand the mathematical foundation of secure communication: hashing, symmetric ciphers, and public-key cryptography."
      learnContent={<CryptoLearn />}
      playgroundContent={<CryptoPlayground />}
      complexityContent={<CryptoComplexity />}
      quizContent={<CryptoQuiz />}
      cheatSheetContent={<CryptoCheatSheet />}
      onPresent={() => setIsPresenting(true)}
    />
  )
}
