"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"

export interface ModuleShellProps {
  title: string
  description: string
  learnContent: React.ReactNode
  playgroundContent: React.ReactNode
  complexityContent: React.ReactNode
  quizContent: React.ReactNode
  cheatSheetContent: React.ReactNode
  onPresent?: () => void
}

export function ModuleShell({
  title,
  description,
  learnContent,
  playgroundContent,
  complexityContent,
  quizContent,
  cheatSheetContent,
  onPresent
}: ModuleShellProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-[1280px]">
      <Tabs defaultValue="learn" className="w-full flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left Sticky Rail */}
        <div className="md:sticky md:top-24 w-full md:w-[200px] shrink-0 space-y-8">
          <div>
            <h1 className="text-3xl font-serif text-ink tracking-tight mb-2 leading-tight">{title}</h1>
            <p className="text-xs font-mono text-ink-soft uppercase tracking-wider">{description.split(' ')[0]} Module</p>
          </div>

          <TabsList className="flex flex-col items-start w-full gap-2 border-none">
            <TabsTrigger value="learn" className="w-full justify-start text-left text-sm py-2 px-3 border-l-2 border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal/5">01 Learn</TabsTrigger>
            <TabsTrigger value="playground" className="w-full justify-start text-left text-sm py-2 px-3 border-l-2 border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal/5">02 Try</TabsTrigger>
            <TabsTrigger value="complexity" className="w-full justify-start text-left text-sm py-2 px-3 border-l-2 border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal/5">03 Cost</TabsTrigger>
            <TabsTrigger value="quiz" className="w-full justify-start text-left text-sm py-2 px-3 border-l-2 border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal/5">04 Quiz</TabsTrigger>
            <TabsTrigger value="cheatsheet" className="w-full justify-start text-left text-sm py-2 px-3 border-l-2 border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal/5">05 Recap</TabsTrigger>
          </TabsList>

          {onPresent && (
            <div className="pt-8 border-t border-rule">
              <Button onClick={onPresent} variant="outline" className="w-full justify-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Present [P]
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full">
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
        </div>

      </Tabs>
    </div>
  )
}
