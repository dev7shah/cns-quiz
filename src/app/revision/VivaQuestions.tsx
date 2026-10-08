"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const vivaQuestions = [
  { q: "Why is MD5 considered insecure for passwords?", a: "It is vulnerable to collision attacks and is extremely fast, making it susceptible to brute-force and dictionary attacks. We should use bcrypt or Argon2 instead." },
  { q: "What is the difference between Salting and Hashing?", a: "Hashing is a one-way mathematical function. Salting is adding random data to the input BEFORE hashing to ensure identical passwords have different hashes." },
  { q: "How does a Stateful Firewall differ from a Stateless one?", a: "Stateless looks at individual packets in isolation. Stateful remembers the 'state' of the connection (e.g., TCP 3-way handshake) and allows return traffic automatically." },
  { q: "Explain the TCP 3-Way Handshake.", a: "SYN (Client requests connection), SYN-ACK (Server acknowledges), ACK (Client acknowledges server). This establishes a reliable connection." },
  { q: "What is a SYN Flood Attack?", a: "A type of DDoS where the attacker sends thousands of SYN requests but never completes the final ACK. The server's memory fills up with half-open connections until it crashes." },
  { q: "Why do we need a Certificate Authority (CA)?", a: "To prevent Man-in-the-Middle (MitM) attacks. The CA acts as a trusted third party to mathematically verify that a Public Key actually belongs to the claimed entity (like Google)." },
  { q: "What is Prompt Injection?", a: "An attack against LLMs where a user inputs natural language designed to override the developer's original system instructions." },
  { q: "What is the principle of Least Privilege?", a: "A security concept where a user, program, or process is given only the bare minimum access privileges necessary to perform its function." },
  { q: "How does an IDS detect a Zero-Day attack?", a: "By using Anomaly-based detection (heuristics/machine learning) to establish a baseline of normal behavior and alerting on significant deviations, rather than looking for a known signature." },
  { q: "Why is HTTPS important even on a static blog with no logins?", a: "It prevents ISPs from injecting ads into the page, protects user privacy (ISPs can't see exactly which articles you read), and improves SEO ranking." }
]

export default function VivaQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="mb-12 border-b border-rule pb-6">
        <h2 className="text-4xl font-serif text-ink mb-2">Examiner Q&A Bank</h2>
        <p className="text-ink-soft font-sans">
          The top 10 most frequently asked oral examination questions across all security modules.
        </p>
      </div>

      <div className="space-y-4">
        {vivaQuestions.map((item, i) => (
          <div 
            key={i} 
            className={`border transition-colors duration-200 ${openIndex === i ? 'bg-card border-ink shadow-[4px_4px_0_var(--rule)]' : 'bg-paper border-rule hover:border-ink hover:bg-card'}`}
          >
            <button
              className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex gap-6 items-start">
                <span className="font-mono text-signal font-bold mt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xl font-serif text-ink">{item.q}</span>
              </div>
              {openIndex === i ? (
                <ChevronUp className="h-5 w-5 text-signal flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="h-5 w-5 text-ink-soft flex-shrink-0 ml-4" />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 ml-[3.25rem] mr-6 pb-6 text-ink border-t border-rule mt-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-3 pt-4">Expected Answer</div>
                    <p className="font-sans leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
