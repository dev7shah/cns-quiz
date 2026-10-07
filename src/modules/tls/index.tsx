"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import TLSLearn from "./Learn"
import TLSPlayground from "./Playground"
import TLSComplexity from "./Complexity"
import TLSQuiz from "./Quiz"
import TLSCheatSheet from "./CheatSheet"

export const instant = false

export default function TLSModule() {
  return (
    <ModuleShell
      title="SSL / TLS & HTTPS"
      description="Understand how the Internet is secured through the TLS Handshake, Certificates, and Public Key Infrastructure (PKI)."
      learnContent={<TLSLearn />}
      playgroundContent={<TLSPlayground />}
      complexityContent={<TLSComplexity />}
      quizContent={<TLSQuiz />}
      cheatSheetContent={<TLSCheatSheet />}
    />
  )
}
