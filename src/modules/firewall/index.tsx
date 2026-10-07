"use client"

import { ModuleShell } from "@/components/layout/ModuleShell"
import FirewallLearn from "./Learn"
import FirewallPlayground from "./Playground"
import FirewallComplexity from "./Complexity"
import FirewallQuiz from "./Quiz"
import FirewallCheatSheet from "./CheatSheet"

export default function FirewallModule() {
  return (
    <ModuleShell
      title="Firewalls"
      description="Learn how firewalls filter traffic, the difference between stateless and stateful inspection, and how to write secure ACL rules."
      learnContent={<FirewallLearn />}
      playgroundContent={<FirewallPlayground />}
      complexityContent={<FirewallComplexity />}
      quizContent={<FirewallQuiz />}
      cheatSheetContent={<FirewallCheatSheet />}
    />
  )
}
