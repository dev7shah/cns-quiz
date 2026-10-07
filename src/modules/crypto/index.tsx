"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import CryptoLearn from "./Learn"
import CryptoPlayground from "./Playground"
import CryptoComplexity from "./Complexity"
import CryptoQuiz from "./Quiz"
import CryptoCheatSheet from "./CheatSheet"

export default function CryptoModule() {
  return (
    <ModuleShell
      title="Cryptography"
      description="Understand the mathematical foundation of secure communication: hashing, symmetric ciphers, and public-key cryptography."
      learnContent={<CryptoLearn />}
      playgroundContent={<CryptoPlayground />}
      complexityContent={<CryptoComplexity />}
      quizContent={<CryptoQuiz />}
      cheatSheetContent={<CryptoCheatSheet />}
    />
  )
}
