"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

interface AuthGateProps {
  children: React.ReactNode
}

/**
 * Wraps any page that requires authentication.
 * - Not mounted yet → loading spinner
 * - Not authenticated → "Login required" gate UI
 * - Authenticated → renders children
 */
export default function AuthGate({ children }: AuthGateProps) {
  const mounted = useMounted()
  const { isAuthenticated } = useAuthStore()

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-paper">
        <span className="font-mono text-sm text-ink-soft animate-pulse">Verifying session…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-paper">
        <div className="max-w-sm w-full border border-rule bg-card p-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-rule flex items-center justify-center bg-paper">
              <ShieldCheck className="w-7 h-7 text-ink-soft" />
            </div>
          </div>
          <div>
            <p className="font-serif text-xl font-bold text-ink mb-1">Login Required</p>
            <p className="font-sans text-sm text-ink-soft">
              This page is only accessible to authenticated TCET students and faculty.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login"
              className="block w-full py-2.5 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-widest hover:bg-signal transition-colors"
            >
              Student Login →
            </Link>
            <Link
              href="/teacher"
              className="block w-full py-2 border border-rule bg-paper text-ink font-mono text-xs uppercase tracking-widest hover:bg-card transition-colors"
            >
              Faculty Portal
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
