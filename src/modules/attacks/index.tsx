"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import AttacksLearn from "./Learn"
import AttacksPlayground from "./Playground"
import AttacksComplexity from "./Complexity"
import AttacksQuiz from "./Quiz"
import AttacksCheatSheet from "./CheatSheet"

export default function AttacksModule() {
  return (
    <ModuleShell
      title="Network & Web Attacks"
      description="Explore common vulnerabilities like SQL Injection, Cross-Site Scripting (XSS), and Denial of Service (DDoS) attacks."
      learnContent={<AttacksLearn />}
      playgroundContent={<AttacksPlayground />}
      complexityContent={<AttacksComplexity />}
      quizContent={<AttacksQuiz />}
      cheatSheetContent={<AttacksCheatSheet />}
    />
  )
}
