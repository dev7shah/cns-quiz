"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"

export interface ModuleShellProps {
  title: string
  description: string
  learnContent: React.ReactNode
  playgroundContent: React.ReactNode
  complexityContent: React.ReactNode
  quizContent: React.ReactNode
  cheatSheetContent: React.ReactNode
}

export function ModuleShell({
  title,
  description,
  learnContent,
  playgroundContent,
  complexityContent,
  quizContent,
  cheatSheetContent,
}: ModuleShellProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue="learn" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12 mb-8">
          <TabsTrigger value="learn" className="text-base h-10">Learn</TabsTrigger>
          <TabsTrigger value="playground" className="text-base h-10">Playground</TabsTrigger>
          <TabsTrigger value="complexity" className="text-base h-10">Complexity</TabsTrigger>
          <TabsTrigger value="quiz" className="text-base h-10">Quiz</TabsTrigger>
          <TabsTrigger value="cheatsheet" className="text-base h-10">Cheat Sheet</TabsTrigger>
        </TabsList>

        <Card className="min-h-[600px] border-none shadow-none bg-transparent">
          <TabsContent value="learn" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {learnContent}
          </TabsContent>
          <TabsContent value="playground" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {playgroundContent}
          </TabsContent>
          <TabsContent value="complexity" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {complexityContent}
          </TabsContent>
          <TabsContent value="quiz" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {quizContent}
          </TabsContent>
          <TabsContent value="cheatsheet" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {cheatSheetContent}
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
