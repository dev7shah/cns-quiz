import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function AuthLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">Authentication vs Authorization</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Authentication (AuthN)</CardTitle></CardHeader>
            <CardContent>
              <p>Verifying <strong>WHO</strong> you are.</p>
              <p className="text-muted-foreground mt-2 text-sm">Examples: Passwords, Fingerprints, TOTP, Smart Cards.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Authorization (AuthZ)</CardTitle></CardHeader>
            <CardContent>
              <p>Verifying <strong>WHAT</strong> you are allowed to do.</p>
              <p className="text-muted-foreground mt-2 text-sm">Examples: RBAC (Role-Based Access Control), File Permissions, OAuth Scopes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Safe Password Storage</h2>
        <p className="text-muted-foreground mb-4">
          Never store passwords in plaintext. Instead, store a <strong>Hash</strong> of the password.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-bold mb-2">1. The Problem with basic Hashing</h3>
            <p className="text-sm">If two users have the same password, their hashes will be identical. Attackers can precompute the hashes of millions of common passwords (a <strong>Rainbow Table</strong>) and instantly crack basic hashes.</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-card border-primary/50">
            <h3 className="font-bold mb-2 text-primary">2. The Solution: Salting</h3>
            <p className="text-sm">A <strong>Salt</strong> is a random string generated for each user and appended to the password before hashing: <code>Hash(Password + Salt)</code>. This ensures that even if users share the same password, their hashes will be completely different, defeating Rainbow Tables.</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-card border-green-500/50">
            <h3 className="font-bold mb-2 text-green-500">3. The Best Practice: Key Derivation Functions</h3>
            <p className="text-sm">Modern systems use algorithms like <strong>bcrypt, scrypt, or Argon2</strong>. These algorithms deliberately introduce a <em>Work Factor</em> (making them slow to compute), which prevents attackers from using massive GPU arrays to brute-force passwords quickly.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Multi-Factor Authentication (MFA)</h2>
        <p className="mb-4">MFA requires users to present two or more independent pieces of evidence (factors):</p>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground">
          <li><strong>Knowledge</strong> (Something you know): Password, PIN.</li>
          <li><strong>Possession</strong> (Something you have): Smartphone, YubiKey hardware token.</li>
          <li><strong>Inherence</strong> (Something you are): Fingerprint, Face ID.</li>
        </ul>

        <Callout variant="default">
          <strong>TOTP (Time-based One-Time Password):</strong> The algorithm used by Google Authenticator. Both the server and the phone share a secret key. They mathematically combine this secret key with the <em>current time</em> to generate a 6-digit code that changes every 30 seconds.
        </Callout>
      </section>
    </div>
  )
}
