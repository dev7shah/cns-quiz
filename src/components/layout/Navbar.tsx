import Link from "next/link"
import { Shield } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule bg-paper">
      <div className="container mx-auto flex h-14 items-center px-4 max-w-[1180px]">
        <div className="flex w-full justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Simple SVG icon instead of Lucide to match spec "one consistent inline SVG set" */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="text-signal group-hover:-translate-y-[1px] transition-transform">
              <rect x="3" y="3" width="18" height="18" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span className="font-serif text-xl tracking-wide pt-1">
              CNS Lab
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-sans font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-signal text-ink"
            >
              Modules
            </Link>
            <Link
              href="/quiz"
              className="transition-colors hover:text-signal text-ink"
            >
              Quiz Challenge
            </Link>
            <Link
              href="/revision"
              className="transition-colors hover:text-signal text-ink"
            >
              Revision
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
