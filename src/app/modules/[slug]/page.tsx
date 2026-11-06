import React from "react"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import AuthGate from "@/components/layout/AuthGate"

const SyllabusModuleView = dynamic(() => import("@/modules/syllabus/SyllabusModuleView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading University Syllabus Module...</p>
})

const WPModuleView = dynamic(() => import("@/modules/wp/WPModuleView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading Web Programming Module...</p>
})

const TOAModuleView = dynamic(() => import("@/modules/toa/TOAModuleView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading Automata Theory Module...</p>
})

const UniversalUnitView = dynamic(() => import("@/modules/syllabus/UniversalUnitView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading University Syllabus Unit...</p>
})

const CryptoModule = dynamic(() => import("@/modules/crypto"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cryptography Module...</p>
})

const AuthModule = dynamic(() => import("@/modules/auth"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Authentication Module...</p>
})

const FirewallModule = dynamic(() => import("@/modules/firewall"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Firewall Module...</p>
})

const CloudModule = dynamic(() => import("@/modules/cloud"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cloud Module...</p>
})

const AttacksModule = dynamic(() => import("@/modules/attacks"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Attacks Module...</p>
})

const IDSModule = dynamic(() => import("@/modules/ids"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading IDS Module...</p>
})

const TLSModule = dynamic(() => import("@/modules/tls"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading TLS Module...</p>
})

const AIModule = dynamic(() => import("@/modules/ai"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading AI Security Module...</p>
})

export function generateStaticParams() {
  return [
    // 6 University Syllabus Modules (CSC602 - CNS) - Both Slug & Module ID
    { slug: 'classical' },
    { slug: 'block-public-key' },
    { slug: 'hash-signatures' },
    { slug: 'computing-resources' },
    { slug: 'network-security' },
    { slug: 'security-applications' },
    { slug: 'm1' },
    { slug: 'm2' },
    { slug: 'm3' },
    { slug: 'm4' },
    { slug: 'm5' },
    { slug: 'm6' },

    // 6 University Syllabus Modules (ITC504 - Web Programming)
    { slug: 'wp-fundamentals' },
    { slug: 'wp-javascript' },
    { slug: 'wp-react' },
    { slug: 'wp-nodejs' },
    { slug: 'wp-php' },
    { slug: 'wp-fullstack' },
    { slug: 'wp-m1' },
    { slug: 'wp-m2' },
    { slug: 'wp-m3' },
    { slug: 'wp-m4' },
    { slug: 'wp-m5' },
    { slug: 'wp-m6' },

    // 6 Theory of Automata (TOA) Modules
    { slug: 'toa-introduction' },
    { slug: 'toa-fa-regular-expressions' },
    { slug: 'toa-regular-languages-pumping-lemma' },
    { slug: 'toa-cfg-cfl' },
    { slug: 'toa-pushdown-automata' },
    { slug: 'toa-turing-machines' },
    { slug: 'toa-m1' },
    { slug: 'toa-m2' },
    { slug: 'toa-m3' },
    { slug: 'toa-m4' },
    { slug: 'toa-m5' },
    { slug: 'toa-m6' },

    // Other Autonomous Subject Units (ITC601, CSC404, ITC602, ITC603)
    { slug: 'itc601-m1' }, { slug: 'itc601-m2' }, { slug: 'itc601-m3' }, { slug: 'itc601-m4' }, { slug: 'itc601-m5' }, { slug: 'itc601-m6' },
    { slug: 'csc404-m1' }, { slug: 'csc404-m2' }, { slug: 'csc404-m3' }, { slug: 'csc404-m4' }, { slug: 'csc404-m5' }, { slug: 'csc404-m6' },
    { slug: 'itc602-m1' }, { slug: 'itc602-m2' }, { slug: 'itc602-m3' }, { slug: 'itc602-m4' }, { slug: 'itc602-m5' }, { slug: 'itc602-m6' },
    { slug: 'itc603-m1' }, { slug: 'itc603-m2' }, { slug: 'itc603-m3' }, { slug: 'itc603-m4' }, { slug: 'itc603-m5' }, { slug: 'itc603-m6' },

    // Legacy Routes (Backwards Compatibility with Zero Dead Links)
    { slug: 'crypto' },
    { slug: 'auth' },
    { slug: 'attacks' },
    { slug: 'firewall' },
    { slug: 'ids' },
    { slug: 'tls' },
    { slug: 'ai' },
    { slug: 'cloud' },
  ]
}

export const instant = false

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cleanSlug = slug.toLowerCase()
  
  let content: React.ReactElement | null = null

  switch (cleanSlug) {
    // 6 University Syllabus Modules (CSC602)
    case 'classical':
    case 'm1':
      content = <SyllabusModuleView moduleId="m1" />; break
    case 'block-public-key':
    case 'm2':
      content = <SyllabusModuleView moduleId="m2" />; break
    case 'hash-signatures':
    case 'm3':
      content = <SyllabusModuleView moduleId="m3" />; break
    case 'computing-resources':
    case 'm4':
      content = <SyllabusModuleView moduleId="m4" />; break
    case 'network-security':
    case 'm5':
      content = <SyllabusModuleView moduleId="m5" />; break
    case 'security-applications':
    case 'm6':
      content = <SyllabusModuleView moduleId="m6" />; break

    // 6 Web Programming Modules (ITC504)
    case 'wp-fundamentals':
    case 'wp-m1':
      content = <WPModuleView moduleId="wp-m1" />; break
    case 'wp-javascript':
    case 'wp-m2':
      content = <WPModuleView moduleId="wp-m2" />; break
    case 'wp-react':
    case 'wp-m3':
      content = <WPModuleView moduleId="wp-m3" />; break
    case 'wp-nodejs':
    case 'wp-m4':
      content = <WPModuleView moduleId="wp-m4" />; break
    case 'wp-php':
    case 'wp-m5':
      content = <WPModuleView moduleId="wp-m5" />; break
    case 'wp-fullstack':
    case 'wp-m6':
      content = <WPModuleView moduleId="wp-m6" />; break

    // 6 Theory of Automata (TOA) Modules
    case 'toa-introduction':
    case 'toa-m1':
      content = <TOAModuleView moduleId="toa-m1" />; break
    case 'toa-fa-regular-expressions':
    case 'toa-m2':
      content = <TOAModuleView moduleId="toa-m2" />; break
    case 'toa-regular-languages-pumping-lemma':
    case 'toa-m3':
      content = <TOAModuleView moduleId="toa-m3" />; break
    case 'toa-cfg-cfl':
    case 'toa-m4':
      content = <TOAModuleView moduleId="toa-m4" />; break
    case 'toa-pushdown-automata':
    case 'toa-m5':
      content = <TOAModuleView moduleId="toa-m5" />; break
    case 'toa-turing-machines':
    case 'toa-m6':
      content = <TOAModuleView moduleId="toa-m6" />; break

    // Legacy Route Fallbacks
    case 'crypto': content = <CryptoModule />; break
    case 'auth': content = <AuthModule />; break
    case 'firewall': content = <FirewallModule />; break
    case 'cloud': content = <CloudModule />; break
    case 'attacks': content = <AttacksModule />; break
    case 'ids': content = <IDSModule />; break
    case 'tls': content = <TLSModule />; break
    case 'ai': content = <AIModule />; break
    default:
      // Fallback: If it's a known autonomous unit (like itc601-m1, csc404-m2, etc.)
      if (
        cleanSlug.startsWith("itc601-") ||
        cleanSlug.startsWith("csc404-") ||
        cleanSlug.startsWith("itc602-") ||
        cleanSlug.startsWith("itc603-")
      ) {
        content = <UniversalUnitView unitSlug={cleanSlug} />
        break
      }
      notFound()
  }

  return <AuthGate>{content}</AuthGate>
}
