import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function TLSCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">SSL/TLS Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Key Concepts</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">TLS Handshake</strong> <span className="text-ink">The process where client and server verify each other and agree on a secret key.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">PKI</strong> <span className="text-ink">Public Key Infrastructure. The ecosystem of CAs and certificates.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Certificate</strong> <span className="text-ink">Electronic document binding a Public Key to an identity.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Algorithms</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">Key Exchange:</strong> RSA or Diffie-Hellman (ECDHE).</li>
                <li><strong className="font-mono text-[11px]">Bulk Encryption:</strong> AES (Advanced Encryption Standard).</li>
                <li><strong className="font-mono text-[11px]">Hashing/Integrity:</strong> SHA-256 or SHA-384.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="TLS 1.2 vs 1.3">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li><strong>TLS 1.2:</strong> Older. Requires 2 network round-trips to establish a connection.</li>
                <li><strong>TLS 1.3:</strong> Modern standard. Requires 1 round-trip (faster). Enforces Perfect Forward Secrecy.</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
