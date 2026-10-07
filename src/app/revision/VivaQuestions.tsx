"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
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
    <div className="space-y-4 max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Top 10 Viva Questions</h2>
        <p className="text-muted-foreground">Click a question to reveal the examiner&apos;s expected answer.</p>
      </div>

      {vivaQuestions.map((item, i) => (
        <Card 
          key={i} 
          className={`cursor-pointer transition-colors ${openIndex === i ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-lg leading-tight">
              <span className="text-primary mr-3 font-mono">Q{i + 1}.</span>
              {item.q}
            </CardTitle>
            {openIndex === i ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </CardHeader>
          {openIndex === i && (
            <CardContent className="p-4 pt-0 text-muted-foreground bg-primary/5 rounded-b-lg border-t border-primary/10 mt-2">
              <div className="font-bold text-foreground mb-1">Expected Answer:</div>
              {item.a}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
