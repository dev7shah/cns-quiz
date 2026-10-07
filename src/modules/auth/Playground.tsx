import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
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
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Password Strength & Salting</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-bold mb-1 block">Password Input</label>
            <input 
              type="text"
              className="w-full p-2 border rounded bg-background" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Type a password..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded bg-muted/50">
              <h4 className="font-bold mb-2 text-sm">Security Metrics</h4>
              <div className="flex justify-between mb-1 text-sm">
                <span>Entropy:</span>
                <span className="font-mono">{entropy} bits</span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Strength:</span>
                <span className={`font-bold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dictionary Attack:</span>
                {dictVuln ? (
                  <span className="text-destructive font-bold">Vulnerable!</span>
                ) : (
                  <span className="text-green-500">Resistant</span>
                )}
              </div>
            </div>

            <div className="p-4 border rounded bg-muted/50">
              <h4 className="font-bold mb-2 text-sm">Salting & Hashing</h4>
              <div className="mb-2">
                <label className="text-xs font-bold block mb-1">Database Salt (per user)</label>
                <input 
                  className="w-full p-1 text-sm border rounded bg-background" 
                  value={salt} 
                  onChange={e => setSalt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Resulting Database Hash</label>
                <div className="p-2 bg-background border rounded font-mono text-xs break-all h-12 flex items-center">
                  {hashedPass}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>TOTP Authenticator (Google Authenticator Simulator)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            TOTP uses a shared secret and the current UTC time. No network requests are made.
          </p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <label className="text-sm font-bold mb-1 block">Shared Secret Key</label>
              <input 
                className="w-full p-2 border rounded bg-background uppercase font-mono" 
                value={totpSecret} 
                onChange={e => setTotpSecret(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 border-2 border-primary rounded-xl bg-card">
              <div className="text-5xl font-mono font-bold tracking-widest text-primary mb-4">
                {totpCode.slice(0,3)} {totpCode.slice(3,6)}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-destructive' : 'bg-primary'}`} 
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Changes in {timeLeft} seconds
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
