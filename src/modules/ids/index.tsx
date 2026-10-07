"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import IDSLearn from "./Learn"
import IDSPlayground from "./Playground"
import IDSComplexity from "./Complexity"
import IDSQuiz from "./Quiz"
import IDSCheatSheet from "./CheatSheet"

export const instant = false

export default function IDSModule() {
  return (
    <ModuleShell
      title="Intrusion Detection Systems (IDS)"
      description="Learn the difference between signature-based and anomaly-based detection, and see how security teams monitor networks."
      learnContent={<IDSLearn />}
      playgroundContent={<IDSPlayground />}
      complexityContent={<IDSComplexity />}
      quizContent={<IDSQuiz />}
      cheatSheetContent={<IDSCheatSheet />}
    />
  )
}
