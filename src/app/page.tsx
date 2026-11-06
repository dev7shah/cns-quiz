"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { GraduationCap, BookOpen, ShieldCheck, LogIn } from "lucide-react"

export default function LandingPage() {
  const mounted = useMounted()
  const { isAuthenticated, role } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!mounted) return
    if (isAuthenticated && role === "student") router.replace("/student")
    if (isAuthenticated && role === "teacher") router.replace("/teacher")
  }, [mounted, isAuthenticated, role, router])

  // Loading or redirect in-flight
  if (!mounted || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <span className="font-mono text-sm text-ink-soft animate-pulse">Loading TCET LMS…</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-paper flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full space-y-8"
        >
          {/* Institution badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-rule bg-card font-mono text-xs uppercase tracking-widest text-ink-soft mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" />
            Thakur College of Engineering &amp; Technology
          </div>

          {/* Wordmark */}
          <div>
            <div className="w-20 h-20 rounded-xs bg-ink text-paper flex items-center justify-center font-serif font-bold text-4xl border border-ink mx-auto mb-6">
              T
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
              TCET&nbsp;LMS
            </h1>
            <p className="mt-3 font-sans text-base text-ink-soft max-w-sm mx-auto">
              The integrated learning platform for TCET students and faculty — modules, quizzes, marks, and timelines in one place.
            </p>
          </div>

          {/* Login CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-ink text-paper font-mono text-sm uppercase font-bold tracking-widest hover:bg-signal transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Student Login
            </Link>
            <Link
              href="/teacher"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-rule bg-card text-ink font-mono text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Faculty Portal
            </Link>
          </div>

          {/* Features summary — no links to actual resources */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            {[
              {
                icon: <BookOpen className="w-4 h-4 text-signal" />,
                title: "Subject Modules",
                desc: "Interactive theory, labs, and guided lessons per enrolled subject.",
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-ok" />,
                title: "Quizzes & Marks",
                desc: "Module-wise quizzes and full-syllabus exams with live feedback.",
              },
              {
                icon: <GraduationCap className="w-4 h-4 text-info" />,
                title: "Academic Timeline",
                desc: "Track your progress, revision schedule, and exam readiness.",
              },
            ].map((f) => (
              <div key={f.title} className="border border-rule bg-card p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  {f.icon}
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">{f.title}</span>
                </div>
                <p className="font-sans text-xs text-ink-soft leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-rule bg-card py-4 px-6 text-center font-mono text-[10px] text-ink-soft uppercase tracking-widest">
        TCET · Mumbai University · Academic Year 2025–26 · IT / CMPN Dept
      </footer>
    </main>
  )
}
