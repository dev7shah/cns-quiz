"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Shield, Key, Lock, Network, ShieldAlert, FileKey2, BrainCircuit, Cloud } from "lucide-react"

const topics = [
  { id: "crypto", title: "Cryptography", icon: <Key className="h-6 w-6" />, summary: "Algorithms for encryption, decryption, and hashing." },
  { id: "auth", title: "Authentication", icon: <Lock className="h-6 w-6" />, summary: "Verifying identity with passwords, salts, and TOTP." },
  { id: "attacks", title: "Attacks", icon: <ShieldAlert className="h-6 w-6" />, summary: "Simulating SQLi, DoS, and common network attacks." },
  { id: "firewall", title: "Firewalls", icon: <Network className="h-6 w-6" />, summary: "Packet filtering and stateful inspection." },
  { id: "ids", title: "IDS", icon: <Shield className="h-6 w-6" />, summary: "Intrusion Detection Systems and signature matching." },
  { id: "tls", title: "SSL/TLS", icon: <FileKey2 className="h-6 w-6" />, summary: "Secure handshakes, certificates, and PKI." },
  { id: "ai", title: "AI Security", icon: <BrainCircuit className="h-6 w-6" />, summary: "Adversarial attacks and data poisoning." },
  { id: "cloud", title: "Cloud Security", icon: <Cloud className="h-6 w-6" />, summary: "Shared responsibility and IAM misconfigurations." },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <section className="mb-12 text-center pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
        >
          Welcome to <span className="text-primary">CNS Security Lab</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
        >
          Interactive learning, animated demos, complexity analysis, and a live team-based Quiz Challenge for Computer Network Security.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/modules/crypto">Start Learning</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/quiz">Play Quiz Challenge</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/revision">Quick Revision</Link>
          </Button>
        </motion.div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Explore Topics</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="h-full flex flex-col hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-2 text-primary">{topic.icon}</div>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>{topic.summary}</CardDescription>
                </CardHeader>
                <div className="flex-1" />
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={`/modules/${topic.id}`}>View Module &rarr;</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
