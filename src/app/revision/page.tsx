"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import Flashcards from "./Flashcards"
import MasterComplexity from "./MasterComplexity"
import VivaQuestions from "./VivaQuestions"
import { motion } from "framer-motion"
import { BookOpen, TableProperties, Speech } from "lucide-react"

export default function RevisionPage() {
  return (
    <div className="min-h-screen bg-paper py-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6 sm:mb-12 border-b border-rule pb-6 sm:pb-8 text-center">
          <div className="inline-block bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-4 sm:mb-6">
            Review Mode
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight mb-2 sm:mb-4">Revision Hub</h1>
          <p className="text-ink-soft text-sm sm:text-lg font-sans max-w-2xl mx-auto">
            Master the concepts, review complex algorithms, and prep for the final Viva.
          </p>
        </div>

        <Tabs defaultValue="flashcards" className="w-full">
          <div className="flex justify-center mb-6 sm:mb-12 overflow-x-auto -mx-2 px-2 scrollbar-none">
            <TabsList className="flex bg-card border border-ink shadow-[3px_3px_0_var(--rule)] sm:shadow-[4px_4px_0_var(--rule)] h-auto p-0 w-max">
              <TabsTrigger 
                value="flashcards" 
                className="rounded-none border-r border-ink data-[state=active]:bg-signal data-[state=active]:text-paper px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-mono uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Flashcards
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="complexity" 
                className="rounded-none border-r border-ink data-[state=active]:bg-signal data-[state=active]:text-paper px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-mono uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TableProperties className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Complexity
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="viva" 
                className="rounded-none data-[state=active]:bg-signal data-[state=active]:text-paper px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-mono uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Speech className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Viva Prep
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="min-h-[500px]">
            <TabsContent value="flashcards" className="m-0 mt-8 focus-visible:outline-none focus-visible:ring-0">
              <Flashcards />
            </TabsContent>
            
            <TabsContent value="complexity" className="m-0 mt-8 focus-visible:outline-none focus-visible:ring-0">
              <MasterComplexity />
            </TabsContent>
            
            <TabsContent value="viva" className="m-0 mt-8 focus-visible:outline-none focus-visible:ring-0">
              <VivaQuestions />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}
