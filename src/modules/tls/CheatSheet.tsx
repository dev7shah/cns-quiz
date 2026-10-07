import { Card, CardContent } from "@/components/ui/Card"

export default function TLSCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">SSL/TLS Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Key Concepts</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">TLS Handshake:</strong> The process where client and server verify each other and agree on a secret key.</li>
                <li><strong className="text-primary">PKI (Public Key Infrastructure):</strong> The ecosystem of CAs, digital certificates, and public keys that establishes trust.</li>
                <li><strong className="text-primary">Digital Certificate:</strong> An electronic document (like an ID card) binding a Public Key to an identity (like google.com), signed by a CA.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Algorithms</h3>
              <ul className="space-y-3 font-sm">
                <li><strong className="text-primary">Key Exchange:</strong> RSA or Diffie-Hellman (ECDHE).</li>
                <li><strong className="text-primary">Bulk Encryption:</strong> AES (Advanced Encryption Standard).</li>
                <li><strong className="text-primary">Hashing / Integrity:</strong> SHA-256 or SHA-384.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">TLS 1.2 vs 1.3</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>TLS 1.2:</strong> Older. Requires 2 network round-trips to establish a connection. Supports many older, weaker cryptographic suites.</li>
              <li><strong>TLS 1.3:</strong> Modern standard. Requires only 1 round-trip (much faster). Drops support for old crypto (like MD5) and enforces Perfect Forward Secrecy.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
