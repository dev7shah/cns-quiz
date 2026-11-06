"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { BookOpen, GraduationCap, LogIn, LogOut } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useMounted()
  const pathname = usePathname()
  const router = useRouter()
  const { role, student, teacher, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const isLoggedIn = mounted && isAuthenticated
  const isStudent = isLoggedIn && role === "student"
  const isTeacher = isLoggedIn && role === "teacher"

  // Brand destination
  const brandHref = isTeacher ? "/teacher" : isStudent ? "/student" : "/"

  // Navigation links are strictly subject-first; all modules/quizzes live inside the subject workspace
  const navLinks = isTeacher
    ? [
        { href: "/teacher", label: "My Subjects", icon: BookOpen },
      ]
    : isStudent
    ? [
        { href: "/student", label: "My Subjects", icon: BookOpen },
      ]
    : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule bg-paper">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-[1180px]">
        {/* Brand */}
        <Link
          href={brandHref}
          className="flex items-center space-x-3 group"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-xs bg-ink text-paper flex items-center justify-center font-serif font-bold text-sm border border-ink group-hover:bg-signal transition-colors shrink-0">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-wide font-bold leading-tight text-ink">
              TCET LMS
            </span>
            <span className="font-mono text-[9px] text-ink-soft uppercase tracking-wider hidden sm:block">
              Thakur College of Engg &amp; Tech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Subjects-Only) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-sans font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition-colors hover:text-signal ${
                  isActive ? "text-signal font-bold" : "text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop Right Actions / User Profile */}
        <div className="hidden md:flex items-center space-x-3 font-mono text-xs">
          {isTeacher ? (
            <div className="flex items-center gap-3">
              <Link
                href="/teacher"
                className="flex items-center gap-2 px-3 py-1 bg-ink text-paper hover:bg-signal transition-colors rounded-xs"
                title="Faculty Gradebook & Controls"
              >
                <span>👩‍🏫</span>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-sans font-bold text-xs">{teacher?.name}</span>
                  <span className="font-mono text-[9px] text-paper/70 uppercase">Faculty In-Charge</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-ink-soft hover:text-bad text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-3 w-3" />
                <span>Exit</span>
              </button>
            </div>
          ) : isStudent ? (
            <div className="flex items-center gap-3">
              <Link
                href="/student"
                className="flex items-center gap-2 px-3 py-1 bg-card border border-rule hover:border-signal text-ink transition-colors rounded-xs group"
                title="Student Profile & My Subjects"
              >
                <span className="w-5 h-5 rounded-full bg-signal/15 text-signal font-bold text-xs flex items-center justify-center group-hover:bg-signal group-hover:text-paper transition-colors">
                  🎓
                </span>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-sans font-bold text-xs text-ink">{student?.name}</span>
                  <span className="font-mono text-[10px] text-ink-soft">{student?.rollNo} · {student?.department || "INFT"}</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-ink-soft hover:text-bad text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-3 w-3" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-signal text-paper font-semibold uppercase tracking-wider text-xs transition-opacity hover:opacity-90"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Student Login</span>
              </Link>
              <Link
                href="/teacher"
                className="text-ink-soft hover:text-ink text-[11px] underline"
              >
                Faculty Access
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-ink hover:text-signal hover:bg-card focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-rule bg-paper/98 backdrop-blur-sm px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 font-sans font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded text-base transition-colors ${
                    isActive ? "bg-signal text-paper font-bold" : "text-ink hover:bg-card hover:text-signal"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {!isLoggedIn && (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold text-center"
                >
                  Student Login
                </Link>
                <Link
                  href="/teacher"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 border border-rule bg-card text-ink font-mono text-xs uppercase text-center"
                >
                  Faculty Portal Access
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Auth status when logged in */}
          {isLoggedIn && (
            <div className="pt-2 border-t border-rule font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-2 bg-card border border-rule">
                <div>
                  <span className="text-[10px] uppercase text-ink-soft block font-bold">
                    {isTeacher ? "Faculty Account" : "Student Profile"}
                  </span>
                  <span className="font-bold text-ink">
                    {isTeacher ? teacher?.name : `${student?.name} (${student?.rollNo})`}
                  </span>
                  <span className="text-[10px] text-ink-soft block font-sans">
                    {isTeacher ? "Faculty In-Charge" : student?.department || "INFT / CMPN"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-paper border border-rule text-bad uppercase font-bold text-[11px]"
                >
                  Exit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
