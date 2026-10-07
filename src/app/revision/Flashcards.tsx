"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

const flashcards = [
  { q: "What is the difference between Symmetric and Asymmetric Cryptography?", a: "Symmetric uses the same key to encrypt/decrypt. Asymmetric uses a Public key to encrypt and a Private key to decrypt." },
  { q: "What does a Salt do in Password Hashing?", a: "A unique random string added to a password before hashing. It prevents pre-computed dictionary and rainbow table attacks." },
  { q: "What is a Stateless Firewall?", a: "A firewall that filters packets based purely on individual packet headers (IP/Port), without remembering previous connection state." },
  { q: "What is the Shared Responsibility Model in Cloud Security?", a: "AWS/Azure is responsible for the security OF the cloud (infrastructure). The customer is responsible for security IN the cloud (data, IAM, configs)." },
  { q: "What is SQL Injection (SQLi)?", a: "An attack where malicious SQL statements are inserted into an entry field, tricking the DB into executing them. Fix: Parameterized Queries." },
  { q: "What is Cross-Site Scripting (XSS)?", a: "An attack where malicious scripts are injected into trusted web pages, executing in the victim's browser. Fix: Output Sanitization." },
  { q: "What is the difference between IDS and IPS?", a: "IDS only detects and alerts (passive). IPS can actively drop malicious packets and block traffic (inline)." },
  { q: "What is Perfect Forward Secrecy (PFS)?", a: "A feature in TLS where a unique session key is generated for every session. Even if the server's private key is stolen later, past traffic cannot be decrypted." },
  { q: "What is AI Prompt Injection?", a: "Tricking an LLM into ignoring its original system instructions and executing a user's malicious instructions." },
  { q: "What is Data Poisoning in AI?", a: "Intentionally introducing malicious data into an AI model's training set to alter its future behavior or introduce backdoors." }
]

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto">
      <div className="text-muted-foreground mb-4 font-mono">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div className="relative w-full aspect-[3/2] perspective-[1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <Card className="absolute w-full h-full backface-hidden p-8 flex items-center justify-center text-center shadow-lg bg-card border-primary/20">
            <h2 className="text-2xl font-bold leading-tight">{flashcards[currentIndex].q}</h2>
          </Card>

          {/* Back */}
          <Card className="absolute w-full h-full backface-hidden p-8 flex items-center justify-center text-center shadow-lg bg-primary/10 border-primary" style={{ transform: "rotateX(180deg)" }}>
            <p className="text-xl leading-relaxed">{flashcards[currentIndex].a}</p>
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <Button variant="outline" size="icon" onClick={handlePrev} className="h-12 w-12 rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" onClick={() => setIsFlipped(!isFlipped)} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Flip
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="h-12 w-12 rounded-full">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">Click the card or press Flip to see the answer</p>

      {/* Required CSS for 3D flip effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-[1000px] { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  )
}
