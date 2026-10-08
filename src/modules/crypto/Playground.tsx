import { useState, useEffect } from "react"
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
  const rsaKeys = React.useMemo(() => generateRSAKeys(rsaP, rsaQ), [rsaP, rsaQ])

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

  useEffect(() => {
    sha256(hashInput).then(setHashOutput)
  }, [hashInput])

  return (
    <div className="space-y-12">
      
      {/* Hash Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">SHA-256 Hashing</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">Observe the avalanche effect. Even a tiny change cascades through the entire output.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Input String</label>
            <input 
              className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
              placeholder="Type to hash..."
              value={hashInput} 
              onChange={e => setHashInput(e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Output Digest (Hex)</label>
            <div className="p-4 bg-ink text-paper rounded-[4px] font-mono break-all text-sm leading-relaxed tracking-wider shadow-inner">
              {hashOutput || "Generating..."}
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setHashInput("CNS Security")} variant="outline" size="sm">CNS Security</Button>
            <Button onClick={() => setHashInput("cNS Security")} variant="outline" size="sm">cNS Security</Button>
          </div>
        </CardContent>
      </Card>

      {/* Caesar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Caesar Cipher</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">A simple substitution cipher. Highly vulnerable to brute force.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext</label>
              <input 
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={caesarInput} 
                onChange={e => setCaesarInput(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Shift</label>
              <input 
                type="number" 
                className="w-24 p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={caesarShift} 
                onChange={e => setCaesarShift(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Ciphertext</label>
            <div className="p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
              {caesarOutput}
            </div>
          </div>
          <details className="mt-8 border border-rule bg-paper rounded-[4px]">
            <summary className="cursor-pointer font-bold text-ink p-4 font-mono text-xs uppercase tracking-wider bg-card hover:bg-rule transition-colors">Launch Brute-Force Attack (O(26))</summary>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono max-h-64 overflow-y-auto">
              {caesarBruteForce.map(b => (
                <div key={b.shift} className={`p-2 border ${b.shift === caesarShift ? "border-signal bg-signal/10 text-signal font-bold" : "border-transparent text-ink-soft"}`}>
                  +{b.shift}: {b.result}
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Vigenere Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Vigenère Cipher</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">Polyalphabetic substitution. Resists simple frequency analysis.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext</label>
              <input 
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={vigenereInput} 
                onChange={e => setVigenereInput(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Keyword</label>
              <input 
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase" 
                value={vigenereKey} 
                onChange={e => setVigenereKey(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Ciphertext</label>
            <div className="p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
              {vigenereOutput}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RSA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">RSA (Public-Key Simulation)</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">Using small primes for visibility. Real RSA uses 2048+ bit primes.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 gap-6 border-b border-rule pb-8">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime p</label>
              <input type="number" className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={rsaP} onChange={e => setRsaP(parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime q</label>
              <input type="number" className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={rsaQ} onChange={e => setRsaQ(parseInt(e.target.value) || 0)} />
            </div>
          </div>
          
          {rsaKeys ? (
            <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
              <div className="p-4 border border-rule bg-card space-y-2">
                <div className="flex justify-between border-b border-rule pb-2">
                  <span className="text-ink-soft">Modulus (n)</span>
                  <strong className="text-ink">{rsaKeys.n}</strong>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-ink-soft">Totient φ(n)</span>
                  <strong className="text-ink">{rsaKeys.phi}</strong>
                </div>
              </div>
              <div className="p-4 border border-rule bg-card space-y-2">
                <div className="flex justify-between border-b border-rule pb-2">
                  <span className="text-signal font-bold uppercase text-[10px] tracking-wider">Public Key (e)</span>
                  <strong className="text-signal">{rsaKeys.e}</strong>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-bad font-bold uppercase text-[10px] tracking-wider">Private Key (d)</span>
                  <strong className="text-bad">{rsaKeys.d}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-bad/10 text-bad border border-bad font-mono text-sm">Invalid primes.</div>
          )}

          <div className="pt-8 border-t border-rule space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Message (Number M &lt; n)</label>
              <input type="number" className="w-1/2 p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={rsaMessage} onChange={e => setRsaMessage(parseInt(e.target.value) || 0)} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
              <div className="p-4 border border-signal bg-signal/5">
                <div className="text-[10px] uppercase tracking-wider text-signal mb-2">Encrypted (M<sup>e</sup> mod n)</div>
                <div className="text-3xl text-ink break-all">{rsaEncrypted}</div>
              </div>
              <div className="p-4 border border-ok bg-ok/5">
                <div className="text-[10px] uppercase tracking-wider text-ok mb-2">Decrypted (C<sup>d</sup> mod n)</div>
                <div className="text-3xl text-ink break-all">{rsaDecrypted}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
