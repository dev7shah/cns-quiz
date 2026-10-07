"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import CloudLearn from "./Learn"
import CloudPlayground from "./Playground"
import CloudComplexity from "./Complexity"
import CloudCheatSheet from "./CheatSheet"
import CloudQuiz from "./Quiz"

export default function CloudModule() {
  return (
    <ModuleShell
      title="Cloud Security"
      description="Understand the Shared Responsibility Model, IAM misconfigurations, and how to secure cloud infrastructure."
      learnContent={<CloudLearn />}
      playgroundContent={<CloudPlayground />}
      complexityContent={<CloudComplexity />}
      quizContent={<CloudQuiz />}
      cheatSheetContent={<CloudCheatSheet />}
    />
  )
}
