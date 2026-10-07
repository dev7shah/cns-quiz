"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import AILearn from "./Learn"
import AIPlayground from "./Playground"
import AIComplexity from "./Complexity"
import AIQuiz from "./Quiz"
import AICheatSheet from "./CheatSheet"

export const instant = false

export default function AIModule() {
  return (
    <ModuleShell
      title="AI Security"
      description="Learn about the unique vulnerabilities introduced by Large Language Models (LLMs), like Prompt Injection and Data Poisoning."
      learnContent={<AILearn />}
      playgroundContent={<AIPlayground />}
      complexityContent={<AIComplexity />}
      quizContent={<AIQuiz />}
      cheatSheetContent={<AICheatSheet />}
    />
  )
}
