"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { TOAModuleId, getTOAModule } from "@/lib/syllabus/toaSyllabus"
import TOALearn from "./TOALearn"
import TOAPlayground from "./TOAPlayground"
import TOAComplexity from "./TOAComplexity"
import TOAQuiz from "./TOAQuiz"
import TOACheatSheet from "./TOACheatSheet"

export default function TOAModuleView({ moduleId }: { moduleId: TOAModuleId }) {
  const router = useRouter()
  const mod = getTOAModule(moduleId)

  const primaryTopic = mod?.topics[0]?.id || "topic1"
  const presentUrl = `/present/${mod?.code.toLowerCase() || 'toa-m1'}/${primaryTopic}`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && e.target === document.body) {
        router.push(presentUrl)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [presentUrl, router])

  if (!mod) {
    return null
  }

  return (
    <ModuleShell
      title={mod.title}
      description={`Theory of Automata · ${mod.code} · ${mod.hours} Hours · ${mod.bloomRange} · ${mod.description}`}
      learnContent={<TOALearn moduleId={moduleId} />}
      playgroundContent={<TOAPlayground moduleId={moduleId} />}
      complexityContent={<TOAComplexity moduleId={moduleId} />}
      quizContent={<TOAQuiz moduleId={moduleId} />}
      cheatSheetContent={<TOACheatSheet moduleId={moduleId} />}
      onPresent={() => router.push(presentUrl)}
      backHref="/student"
      backLabel="Back to Subjects"
    />
  )
}
