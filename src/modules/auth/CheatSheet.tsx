import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function AuthCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">Authentication Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Key Concepts</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">AuthN</strong> <span className="text-ink">Verification of identity (Login).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">AuthZ</strong> <span className="text-ink">Verification of permissions (Access Control).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Salt</strong> <span className="text-ink">Random data appended before hashing. Defeats rainbow tables.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Rainbow Table</strong> <span className="text-ink">A precomputed database of hashes.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">MFA</strong> <span className="text-ink">Multi-Factor Auth (using {'>=2'} factors).</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">MFA Factors</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">Knowledge:</strong> Something you know (Password).</li>
                <li><strong className="font-mono text-[11px]">Possession:</strong> Something you have (Phone, YubiKey).</li>
                <li><strong className="font-mono text-[11px]">Inherence:</strong> Something you are (Fingerprint).</li>
                <li><strong className="font-mono text-[11px] text-ink-soft line-through">(Sometimes) Location:</strong> Somewhere you are.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Hashing Algorithms for Passwords">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li><strong className="text-bad">DO NOT USE:</strong> MD5, SHA-1, SHA-256 (Too fast, vulnerable to brute-force).</li>
                <li><strong className="text-ok">USE:</strong> bcrypt, scrypt, Argon2 (Slow by design, uses a configurable work factor).</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
