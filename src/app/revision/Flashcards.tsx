"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-8 bg-card border border-rule px-4 py-1">
        Index {String(currentIndex + 1).padStart(2, '0')} / {String(flashcards.length).padStart(2, '0')}
      </div>

      <div className="relative w-full aspect-[3/2] perspective-[1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden p-8 md:p-12 flex flex-col items-center justify-center text-center bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
            <div className="absolute top-4 left-4 font-mono text-xs text-signal font-bold uppercase tracking-widest">Question</div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight text-ink">{flashcards[currentIndex].q}</h2>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden p-8 md:p-12 flex flex-col items-center justify-center text-center bg-paper border border-ok shadow-[4px_4px_0_var(--ok)]" style={{ transform: "rotateX(180deg)" }}>
            <div className="absolute top-4 right-4 font-mono text-xs text-ok font-bold uppercase tracking-widest">Answer</div>
            <p className="text-xl md:text-2xl font-sans leading-relaxed text-ink">{flashcards[currentIndex].a}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-12">
        <Button variant="outline" onClick={handlePrev} className="h-12 w-12 rounded-none border border-ink text-ink hover:bg-card hover:text-signal transition-colors p-0 flex items-center justify-center">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" onClick={() => setIsFlipped(!isFlipped)} className="gap-2 font-mono uppercase tracking-wider text-xs border border-transparent hover:border-ink rounded-none">
          <RefreshCw className="h-4 w-4" />
          Flip
        </Button>
        <Button variant="outline" onClick={handleNext} className="h-12 w-12 rounded-none border border-ink text-ink hover:bg-card hover:text-signal transition-colors p-0 flex items-center justify-center">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <p className="text-[10px] uppercase tracking-widest font-mono text-ink-soft mt-8">Click the card to reveal the answer</p>

      {/* Required CSS for 3D flip effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-[1000px] { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  )
}
