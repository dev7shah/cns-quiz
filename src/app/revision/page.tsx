"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import Flashcards from "./Flashcards"
import MasterComplexity from "./MasterComplexity"
import VivaQuestions from "./VivaQuestions"
import { motion } from "framer-motion"

export default function RevisionPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 py-8"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Revision Hub</h1>
        <p className="text-muted-foreground text-lg">
          Master the concepts, review complex algorithms, and prep for the final Viva.
        </p>
      </div>

      <Tabs defaultValue="flashcards" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="complexity">Complexity</TabsTrigger>
            <TabsTrigger value="viva">Viva Prep</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="bg-muted/10 border rounded-xl min-h-[500px]">
          <TabsContent value="flashcards" className="m-0 p-4">
            <Flashcards />
          </TabsContent>
          
          <TabsContent value="complexity" className="m-0 p-4">
            <MasterComplexity />
          </TabsContent>
          
          <TabsContent value="viva" className="m-0 p-4">
            <VivaQuestions />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
