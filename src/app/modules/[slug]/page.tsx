import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

const CryptoModule = dynamic(() => import("@/modules/crypto").then(mod => mod.default), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cryptography Module...</p>
})

const AuthModule = dynamic(() => import("@/modules/auth").then(mod => mod.default), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Authentication Module...</p>
})

const FirewallModule = dynamic(() => import("@/modules/firewall").then(mod => mod.default), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Firewall Module...</p>
})

const CloudModule = dynamic(() => import("@/modules/cloud").then(mod => mod.default), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cloud Module...</p>
})

export function generateStaticParams() {
  return [
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
  
  switch (slug) {
    case 'crypto': return <CryptoModule />
    case 'auth': return <AuthModule />
    case 'firewall': return <FirewallModule />
    case 'cloud': return <CloudModule />
    case 'attacks':
    case 'ids':
    case 'tls':
    case 'ai':
      return (
        <div className="container mx-auto p-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6 capitalize">{slug} Module</h1>
          <p className="text-muted-foreground">
            This module is scheduled for Phase 3 and is currently under construction.
          </p>
        </div>
      )
    default:
      notFound()
  }
}
