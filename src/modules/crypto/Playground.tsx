import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { caesarCipher, bruteForceCaesar } from "@/lib/crypto/caesar"
import { vigenereCipher } from "@/lib/crypto/vigenere"
import { generateRSAKeys, rsaEncrypt, rsaDecrypt } from "@/lib/crypto/rsa"
import { sha256 } from "@/lib/crypto/hash"

export default function CryptoPlayground() {
  const [caesarInput, setCaesarInput] = useState("HELLO WORLD")
  const [caesarShift, setCaesarShift] = useState(3)
  const caesarOutput = caesarCipher(caesarInput, caesarShift)
  const caesarBruteForce = bruteForceCaesar(caesarOutput)

  const [vigenereInput, setVigenereInput] = useState("ATTACK AT DAWN")
  const [vigenereKey, setVigenereKey] = useState("LEMON")
  const vigenereOutput = vigenereCipher(vigenereInput, vigenereKey)

  const [rsaP, setRsaP] = useState(61)
  const [rsaQ, setRsaQ] = useState(53)
  const rsaKeys = generateRSAKeys(rsaP, rsaQ)
  const [rsaMessage, setRsaMessage] = useState(65)

  let rsaEncrypted = ""
  let rsaDecrypted = ""
  if (rsaKeys) {
    try {
      const msg = BigInt(rsaMessage)
      const e = BigInt(rsaKeys.e)
      const n = BigInt(rsaKeys.n)
      const d = BigInt(rsaKeys.d)
      rsaEncrypted = rsaEncrypt(msg, e, n).toString()
      rsaDecrypted = rsaDecrypt(BigInt(rsaEncrypted), d, n).toString()
    } catch {
      rsaEncrypted = "Error"
    }
  }

  const [hashInput, setHashInput] = useState("CNS Security")
  const [hashOutput, setHashOutput] = useState("")

  const updateHash = async (val: string) => {
    setHashInput(val)
    const h = await sha256(val)
    setHashOutput(h)
  }

  return (
    <div className="space-y-8 p-2">
      {/* Caesar Section */}
      <Card>
        <CardHeader><CardTitle>Caesar Cipher (Shift)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <input 
              className="flex-1 p-2 border rounded bg-background" 
              value={caesarInput} 
              onChange={e => setCaesarInput(e.target.value.toUpperCase())}
            />
            <input 
              type="number" 
              className="w-24 p-2 border rounded bg-background" 
              value={caesarShift} 
              onChange={e => setCaesarShift(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="p-4 bg-muted rounded font-mono break-all">
            Encrypted: {caesarOutput}
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer font-bold text-primary">Brute-Force Attack (O(26))</summary>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono max-h-64 overflow-y-auto p-4 bg-card border rounded">
              {caesarBruteForce.map(b => (
                <div key={b.shift} className={b.shift === caesarShift ? "text-primary font-bold" : ""}>
                  +{b.shift}: {b.result}
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Vigenere Section */}
      <Card>
        <CardHeader><CardTitle>Vigenère Cipher (Polyalphabetic)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-1 block">Plaintext</label>
              <input 
                className="w-full p-2 border rounded bg-background" 
                value={vigenereInput} 
                onChange={e => setVigenereInput(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block">Keyword</label>
              <input 
                className="w-full p-2 border rounded bg-background uppercase" 
                value={vigenereKey} 
                onChange={e => setVigenereKey(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded font-mono break-all">
            Encrypted: {vigenereOutput}
          </div>
        </CardContent>
      </Card>

      {/* RSA Section */}
      <Card>
        <CardHeader><CardTitle>RSA (Public-Key Simulation)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Using small primes for visibility. Real RSA uses 2048+ bit primes.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold block">Prime p</label>
              <input type="number" className="w-full p-2 border rounded bg-background" value={rsaP} onChange={e => setRsaP(parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-sm font-bold block">Prime q</label>
              <input type="number" className="w-full p-2 border rounded bg-background" value={rsaQ} onChange={e => setRsaQ(parseInt(e.target.value) || 0)} />
            </div>
          </div>
          
          {rsaKeys ? (
            <div className="p-4 bg-muted rounded text-sm grid md:grid-cols-2 gap-4">
              <div>
                <strong>Modulus (n):</strong> {rsaKeys.n} <br/>
                <strong>Totient φ(n):</strong> {rsaKeys.phi}
              </div>
              <div>
                <strong>Public Key (e):</strong> {rsaKeys.e} <br/>
                <strong>Private Key (d):</strong> {rsaKeys.d}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-destructive/10 text-destructive rounded">Invalid primes.</div>
          )}

          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm font-bold block">Message (Number M {"<"} n)</label>
              <input type="number" className="w-full p-2 border rounded bg-background" value={rsaMessage} onChange={e => setRsaMessage(parseInt(e.target.value) || 0)} />
            </div>
            <div className="flex-1 mt-5 font-mono text-sm space-y-2">
              <div className="p-2 border rounded">Encrypted (M<sup>e</sup> mod n): <span className="text-primary font-bold">{rsaEncrypted}</span></div>
              <div className="p-2 border rounded">Decrypted (C<sup>d</sup> mod n): <span className="text-primary font-bold">{rsaDecrypted}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hash Section */}
      <Card>
        <CardHeader><CardTitle>SHA-256 Hashing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <input 
            className="w-full p-2 border rounded bg-background" 
            placeholder="Type to hash..."
            value={hashInput} 
            onChange={e => updateHash(e.target.value)}
          />
          <div className="p-4 bg-muted rounded font-mono break-all text-sm">
            {hashOutput || "Generating..."}
          </div>
          <div className="text-xs text-muted-foreground">Try changing a single letter to observe the Avalanche Effect.</div>
          <Button onClick={() => updateHash("CNS Security")} variant="outline" size="sm">CNS Security</Button>
          <Button onClick={() => updateHash("cNS Security")} variant="outline" size="sm" className="ml-2">cNS Security</Button>
        </CardContent>
      </Card>

    </div>
  )
}
