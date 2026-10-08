import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function CryptoCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">Cryptography Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Key Terms</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Plaintext</strong> <span className="text-ink">The original readable message.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Ciphertext</strong> <span className="text-ink">The scrambled, unreadable message.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Key</strong> <span className="text-ink">A piece of information used by the cipher to encrypt/decrypt.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Symmetric</strong> <span className="text-ink">Same key for both sides (AES, DES).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Asymmetric</strong> <span className="text-ink">Public/Private key pair (RSA, ECC).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Hash</strong> <span className="text-ink">One-way mathematical function (SHA-256).</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Common Algorithms</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">AES:</strong> Advanced Encryption Standard. The current symmetric standard. Fast and secure.</li>
                <li><strong className="font-mono text-[11px]">RSA:</strong> Rivest-Shamir-Adleman. Standard for asymmetric encryption and digital signatures.</li>
                <li><strong className="font-mono text-[11px]">Diffie-Hellman (DH):</strong> A protocol used to securely exchange symmetric keys over an insecure channel.</li>
                <li><strong className="font-mono text-[11px]">SHA-256:</strong> Secure Hash Algorithm 256-bit. Used for data integrity and password hashing.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Public Key Infrastructure (PKI) Rules">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li>To send a secret message to Alice, encrypt with <strong>Alice&apos;s Public Key</strong>.</li>
                <li>To prove a message came from Alice (Digital Signature), Alice encrypts the hash with <strong>her Private Key</strong>.</li>
                <li>Anyone can verify Alice&apos;s signature using <strong>Alice&apos;s Public Key</strong>.</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
