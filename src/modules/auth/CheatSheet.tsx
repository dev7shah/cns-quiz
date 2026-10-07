import { Card, CardContent } from "@/components/ui/Card"

export default function AuthCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Authentication Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Concepts</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">AuthN:</strong> Verification of identity (Login).</li>
                <li><strong className="text-primary">AuthZ:</strong> Verification of permissions (Access Control).</li>
                <li><strong className="text-primary">Salt:</strong> Random data appended to a password before hashing to defend against precomputed rainbow tables.</li>
                <li><strong className="text-primary">Rainbow Table:</strong> A precomputed database of password hashes.</li>
                <li><strong className="text-primary">MFA:</strong> Multi-Factor Auth (using {'>=2'} factors).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">MFA Factors</h3>
              <ul className="space-y-3">
                <li><strong>Knowledge:</strong> Something you know (Password).</li>
                <li><strong>Possession:</strong> Something you have (Phone, YubiKey).</li>
                <li><strong>Inherence:</strong> Something you are (Fingerprint).</li>
                <li><strong className="text-muted-foreground italic">(Sometimes) Location:</strong> Somewhere you are.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Hashing Algorithms for Passwords</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-destructive">DO NOT USE:</strong> MD5, SHA-1, SHA-256 (Too fast, vulnerable to brute-force).</li>
              <li><strong className="text-green-500">USE:</strong> bcrypt, scrypt, Argon2 (Slow by design, uses a configurable work factor).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
