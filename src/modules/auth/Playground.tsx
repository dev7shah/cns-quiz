import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { calculatePasswordEntropy, getPasswordStrengthLabel, isVulnerableToDictionary } from "@/lib/auth/password"
import { generateTOTP } from "@/lib/auth/totp"
import { sha256 } from "@/lib/crypto/hash"

export default function AuthPlayground() {
  const [password, setPassword] = useState("")
  const [salt, setSalt] = useState("random_salt_123")
  const [hashedPass, setHashedPass] = useState("")

  const entropy = calculatePasswordEntropy(password)
  const strength = getPasswordStrengthLabel(entropy)
  const dictVuln = isVulnerableToDictionary(password)

  useEffect(() => {
    sha256(password + salt).then(setHashedPass)
  }, [password, salt])

  const [totpSecret, setTotpSecret] = useState("MYSECRETKEY")
  const [totpCode, setTotpCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const updateTotp = async () => {
      const { code, timeLeft: tl } = await generateTOTP(totpSecret, 30)
      setTotpCode(code)
      setTimeLeft(tl)
    }
    updateTotp()
    const timer = setInterval(updateTotp, 1000)
    return () => clearInterval(timer)
  }, [totpSecret])

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Password Strength & Salting</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">See how entropy and dictionary checks affect password strength, and how salting changes the hash.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Password Input</label>
            <input 
              type="text"
              className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Type a password..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
            <div className="p-4 border border-rule bg-card space-y-2">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-4 border-b border-rule pb-2">Security Metrics</h4>
              <div className="flex justify-between mb-1">
                <span className="text-ink-soft">Entropy</span>
                <strong>{entropy} bits</strong>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-ink-soft">Strength</span>
                <strong className={strength.color.replace('text-', 'text-')}>{strength.label}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Dictionary Attack</span>
                {dictVuln ? (
                  <strong className="text-bad">Vulnerable!</strong>
                ) : (
                  <strong className="text-ok">Resistant</strong>
                )}
              </div>
            </div>

            <div className="p-4 border border-rule bg-card space-y-4">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Salting & Hashing</h4>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Database Salt (per user)</label>
                <input 
                  className="w-full p-2 border border-ink bg-paper text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                  value={salt} 
                  onChange={e => setSalt(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Resulting Database Hash</label>
                <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink tracking-widest min-h-[48px] flex items-center">
                  {hashedPass || "Generating..."}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">TOTP Authenticator Simulator</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">
            TOTP uses a shared secret and the current UTC time. No network requests are made.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Shared Secret Key</label>
              <input 
                className="w-full p-3 border border-ink bg-paper font-mono text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={totpSecret} 
                onChange={e => setTotpSecret(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 border border-rule bg-paper">
              <div className="text-5xl font-mono font-bold tracking-widest text-signal mb-4">
                {totpCode.slice(0,3)} {totpCode.slice(3,6)}
              </div>
              <div className="w-full bg-rule h-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-bad' : 'bg-signal'}`} 
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <div className="text-[10px] uppercase font-mono text-ink-soft mt-4 tracking-widest">
                Changes in {timeLeft}s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
