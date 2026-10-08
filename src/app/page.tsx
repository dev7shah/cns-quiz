"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Shield, Key, Lock, Network, ShieldAlert, FileKey2, BrainCircuit, Cloud, ArrowRight, Play, Presentation, GraduationCap, Flame } from "lucide-react"

const modules = [
  { id: "crypto", title: "Cryptography", icon: <Key className="h-5 w-5" />, desc: "RSA, AES, Hashing, and Quantum risks." },
  { id: "tls", title: "SSL / TLS", icon: <FileKey2 className="h-5 w-5" />, desc: "Certificates, Handshakes, and PKI." },
  { id: "firewall", title: "Firewalls", icon: <Network className="h-5 w-5" />, desc: "Stateful inspection and NAT." },
  { id: "auth", title: "Authentication", icon: <Lock className="h-5 w-5" />, desc: "Salts, KDFs, AuthZ, and MFA." },
  { id: "attacks", title: "Attacks", icon: <ShieldAlert className="h-5 w-5" />, desc: "SQLi, XSS, and DDoS amplification." },
  { id: "ids", title: "IDS / IPS", icon: <Shield className="h-5 w-5" />, desc: "Signatures vs Anomalies." },
  { id: "cloud", title: "Cloud Security", icon: <Cloud className="h-5 w-5" />, desc: "Shared responsibility and IAM." },
  { id: "ai", title: "AI Security", icon: <BrainCircuit className="h-5 w-5" />, desc: "Prompt injection and Data Poisoning." },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-px bg-signal rotate-12 opacity-50"></div>
        <div className="absolute top-[40%] right-[10%] w-[600px] h-px bg-ink rotate-45 opacity-50"></div>
        <div className="absolute -left-20 top-[60%] text-[200px] font-serif text-rule opacity-10">§</div>
      </div>

      <main className="flex-1 container mx-auto px-6 py-20 max-w-6xl relative z-10">
        <header className="mb-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-6"
            >
              Interactive Learning Environment v2.0
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif text-ink tracking-tight mb-6 leading-none"
            >
              The Modern <br/>
              <span className="text-signal italic">Security Lab</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-ink-soft max-w-lg mb-10 font-sans leading-relaxed"
            >
              A precision instrument for mastering Computer Network Security. Featuring scrollytelling lessons, live simulators, and an interactive team quiz challenge.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Button size="lg" className="bg-signal hover:bg-signal/90 text-paper border border-signal font-bold uppercase tracking-wider text-sm h-14 px-8" asChild>
                <Link href="/modules/crypto">
                  Enter Laboratory <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-sm h-14 px-8" asChild>
                <Link href="/quiz">
                  <Flame className="mr-2 h-4 w-4" /> Live Quiz
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-auto flex flex-col gap-4"
          >
            <div className="bg-card border border-ink p-6 max-w-sm flex items-start gap-4">
              <div className="bg-signal/10 p-3 text-signal shrink-0">
                <Presentation className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider font-mono mb-2">Lecturer Ready</h3>
                <p className="text-sm text-ink-soft">Press [P] in any module to launch the distraction-free Presenter Mode overlay.</p>
              </div>
            </div>
            <div className="bg-paper border border-rule p-6 max-w-sm flex items-start gap-4 relative left-0 md:-left-8">
              <div className="bg-ok/10 p-3 text-ok shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider font-mono mb-2">Exam Focused</h3>
                <p className="text-sm text-ink-soft">Every concept is broken down into a real-world analogy, visual diagram, and strict exam definition.</p>
              </div>
            </div>
          </motion.div>
        </header>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-serif text-ink">Syllabus Modules</h2>
            <div className="flex-1 h-px bg-rule"></div>
            <Link href="/revision" className="text-sm font-mono uppercase tracking-wider text-signal hover:underline">
              Access Revision Hub &rarr;
            </Link>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={`/modules/${module.id}`} className="block h-full group">
                  <div className="h-full flex flex-col bg-card border border-ink p-6 group-hover:bg-signal group-hover:border-signal transition-colors group-hover:text-paper shadow-[4px_4px_0_var(--rule)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    <div className="mb-4 text-ink group-hover:text-paper flex justify-between items-start">
                      <div className="p-2 border border-current">{module.icon}</div>
                      <div className="font-mono text-[10px] opacity-50 uppercase tracking-widest">MOD 0{i+1}</div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 font-serif">{module.title}</h3>
                    <p className="text-sm text-ink-soft group-hover:text-paper/80 flex-1">{module.desc}</p>
                    <div className="mt-4 pt-4 border-t border-rule group-hover:border-paper/20 flex items-center justify-between text-xs font-mono uppercase tracking-widest font-bold">
                      <span>Launch</span>
                      <Play className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
