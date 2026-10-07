"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import AuthLearn from "./Learn"
import AuthPlayground from "./Playground"
import AuthComplexity from "./Complexity"
import AuthQuiz from "./Quiz"
import AuthCheatSheet from "./CheatSheet"

export default function AuthModule() {
  return (
    <ModuleShell
      title="Authentication"
      description="Learn how systems verify identity through passwords, salting, and Multi-Factor Authentication (MFA)."
      learnContent={<AuthLearn />}
      playgroundContent={<AuthPlayground />}
      complexityContent={<AuthComplexity />}
      quizContent={<AuthQuiz />}
      cheatSheetContent={<AuthCheatSheet />}
    />
  )
}
