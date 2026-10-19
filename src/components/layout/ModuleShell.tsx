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
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-[1280px]">
      <Tabs defaultValue="learn" className="w-full flex flex-col md:flex-row gap-6 md:gap-12 items-start">
        
        {/* Left Rail / Mobile Top Bar */}
        <div className="w-full md:w-[220px] md:sticky md:top-24 shrink-0 space-y-4 md:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight mb-1 md:mb-2 leading-tight">{title}</h1>
            <p className="text-[11px] font-mono text-ink-soft uppercase tracking-wider">{description.split(' ')[0]} Module</p>
          </div>

          {/* Horizontal scrollable tab list on mobile, vertical sticky rail on desktop */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-none">
            <TabsList className="flex flex-row md:flex-col items-center md:items-start w-max md:w-full gap-1.5 md:gap-2 border-b md:border-none pb-2 md:pb-0 bg-transparent">
              <TabsTrigger value="learn" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                01 Learn
              </TabsTrigger>
              <TabsTrigger value="playground" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                02 Try
              </TabsTrigger>
              <TabsTrigger value="complexity" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                03 Cost
              </TabsTrigger>
              <TabsTrigger value="quiz" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                04 Quiz
              </TabsTrigger>
              <TabsTrigger value="cheatsheet" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                05 Recap
              </TabsTrigger>
            </TabsList>
          </div>

          {onPresent && (
            <div className="pt-2 md:pt-8 md:border-t border-rule">
              <Button onClick={onPresent} variant="outline" size="sm" className="w-full justify-center md:justify-start gap-2 font-mono text-xs uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Present <span className="hidden md:inline">[P]</span>
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
