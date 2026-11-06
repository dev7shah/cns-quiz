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
    // 6 University Syllabus Modules (CSC602 - CNS)
    { slug: 'classical' },
    { slug: 'block-public-key' },
    { slug: 'hash-signatures' },
    { slug: 'computing-resources' },
    { slug: 'network-security' },
    { slug: 'security-applications' },

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
  
  let content: React.ReactElement | null = null

  switch (slug) {
    // 6 University Syllabus Modules (CSC602)
    case 'classical':
      content = <SyllabusModuleView moduleId="m1" />; break
    case 'block-public-key':
      content = <SyllabusModuleView moduleId="m2" />; break
    case 'hash-signatures':
      content = <SyllabusModuleView moduleId="m3" />; break
    case 'computing-resources':
      content = <SyllabusModuleView moduleId="m4" />; break
    case 'network-security':
      content = <SyllabusModuleView moduleId="m5" />; break
    case 'security-applications':
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
      notFound()
  }

  return <AuthGate>{content}</AuthGate>
}
