"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { caesarCipher, bruteForceCaesar } from "@/lib/crypto/caesar"
import { vigenereCipher } from "@/lib/crypto/vigenere"
import { generateRSAKeys, rsaEncrypt, rsaDecrypt } from "@/lib/crypto/rsa"
import { sha256 } from "@/lib/crypto/hash"
import {
  affineEncrypt,
  affineDecrypt,
  isValidAffineMultiplier,
  modInverse26,
  getValidAffineMultipliers
} from "@/lib/crypto/affine"
import {
  buildPlayfairMatrix,
  prepareDigraphs,
  playfairEncrypt,
  playfairDecrypt
} from "@/lib/crypto/playfair"
import {
  det2x2,
  isValidHillMatrix,
  invertMatrix2x2,
  hillEncrypt2x2,
  hillDecrypt2x2,
  Matrix2x2
} from "@/lib/crypto/hill"
import {
  railFenceEncrypt,
  railFenceDecrypt,
  columnarEncrypt,
  columnarDecrypt,
  getColumnOrder
} from "@/lib/crypto/transposition"
import {
  ENGLISH_LETTER_FREQUENCIES,
  computeFrequencies,
  indexOfCoincidence
} from "@/lib/crypto/cryptanalysis"

export default function CryptoPlayground() {
  // Tab selector for classical vs modern
  const [activeTab, setActiveTab] = useState<'caesar' | 'affine' | 'playfair' | 'vigenere' | 'hill' | 'transposition' | 'cryptanalysis' | 'rsa' | 'hash'>('caesar')

  // --- 1. Caesar State ---
  const [caesarInput, setCaesarInput] = useState("HELLO WORLD")
  const [caesarShift, setCaesarShift] = useState(3)
  const caesarOutput = useMemo(() => caesarCipher(caesarInput, caesarShift), [caesarInput, caesarShift])
  const caesarBruteForce = useMemo(() => bruteForceCaesar(caesarOutput), [caesarOutput])

  // --- 2. Affine State ---
  const [affineInput, setAffineInput] = useState("AFFINE CIPHER")
  const [affineA, setAffineA] = useState(7)
  const [affineB, setAffineB] = useState(2)
  const validMultipliers = useMemo(() => getValidAffineMultipliers(26), [])
  const isAValid = isValidAffineMultiplier(affineA, 26)
  const aInverse = useMemo(() => modInverse26(affineA, 26), [affineA])
  const affineEncrypted = useMemo(() => {
    if (!isAValid) return "Invalid multiplier 'a'"
    try {
      return affineEncrypt(affineInput, affineA, affineB, 26)
    } catch {
      return "Error"
    }
  }, [affineInput, affineA, affineB, isAValid])
  const affineDecrypted = useMemo(() => {
    if (!isAValid) return "Invalid multiplier 'a'"
    try {
      return affineDecrypt(affineEncrypted, affineA, affineB, 26)
    } catch {
      return "Error"
    }
  }, [affineEncrypted, affineA, affineB, isAValid])

  // --- 3. Playfair State ---
  const [playfairInput, setPlayfairInput] = useState("INSTRUMENT")
  const [playfairKeyword, setPlayfairKeyword] = useState("MONARCHY")
  const playfairMatrix = useMemo(() => buildPlayfairMatrix(playfairKeyword), [playfairKeyword])
  const playfairDigraphs = useMemo(() => prepareDigraphs(playfairInput), [playfairInput])
  const playfairCipher = useMemo(() => {
    try {
      return playfairEncrypt(playfairInput, playfairKeyword)
    } catch {
      return "Error"
    }
  }, [playfairInput, playfairKeyword])
  const playfairDecrypted = useMemo(() => {
    try {
      return playfairDecrypt(playfairCipher, playfairKeyword)
    } catch {
      return "Error"
    }
  }, [playfairCipher, playfairKeyword])

  // --- 4. Vigenère State ---
  const [vigenereInput, setVigenereInput] = useState("ATTACK AT DAWN")
  const [vigenereKey, setVigenereKey] = useState("LEMON")
  const vigenereOutput = useMemo(() => vigenereCipher(vigenereInput, vigenereKey), [vigenereInput, vigenereKey])

  // --- 5. Hill State ---
  const [hillInput, setHillInput] = useState("ACT")
  const [h00, setH00] = useState(3)
  const [h01, setH01] = useState(3)
  const [h10, setH10] = useState(2)
  const [h11, setH11] = useState(5)
  const hillMatrix: Matrix2x2 = useMemo(() => [[h00, h01], [h10, h11]], [h00, h01, h10, h11])
  const hillDet = useMemo(() => det2x2(hillMatrix), [hillMatrix])
  const isHillValid = useMemo(() => isValidHillMatrix(hillMatrix), [hillMatrix])
  const hillInverse = useMemo(() => {
    if (!isHillValid) return null
    try {
      return invertMatrix2x2(hillMatrix)
    } catch {
      return null
    }
  }, [hillMatrix, isHillValid])
  const hillCipher = useMemo(() => {
    if (!isHillValid) return "Invalid key matrix (det has no inverse mod 26)"
    try {
      return hillEncrypt2x2(hillInput, hillMatrix)
    } catch {
      return "Error"
    }
  }, [hillInput, hillMatrix, isHillValid])
  const hillDecrypted = useMemo(() => {
    if (!isHillValid) return "Invalid key matrix"
    try {
      return hillDecrypt2x2(hillCipher, hillMatrix)
    } catch {
      return "Error"
    }
  }, [hillCipher, hillMatrix, isHillValid])

  // --- 6. Transposition State ---
  const [transInput, setTransInput] = useState("DEFEND THE EAST WALL")
  const [transType, setTransType] = useState<'rail' | 'columnar'>('rail')
  const [railDepth, setRailDepth] = useState(3)
  const [colKey, setColKey] = useState("ZEBRA")
  const railCipher = useMemo(() => railFenceEncrypt(transInput, railDepth), [transInput, railDepth])
  const railDecrypted = useMemo(() => railFenceDecrypt(railCipher, railDepth), [railCipher, railDepth])
  const colCipher = useMemo(() => columnarEncrypt(transInput, colKey), [transInput, colKey])
  const colDecrypted = useMemo(() => columnarDecrypt(colCipher, colKey), [colCipher, colKey])
  const colOrder = useMemo(() => getColumnOrder(colKey), [colKey])

  // --- 7. Cryptanalysis State ---
  const [cryptoAnalysisText, setCryptoAnalysisText] = useState(
    "WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ DQG UXQV DZDB WR VDIHWB"
  )
  const textFreqs = useMemo(() => computeFrequencies(cryptoAnalysisText), [cryptoAnalysisText])
  const textIoC = useMemo(() => indexOfCoincidence(cryptoAnalysisText), [cryptoAnalysisText])

  // --- 8. RSA State ---
  const [rsaP, setRsaP] = useState(61)
  const [rsaQ, setRsaQ] = useState(53)
  const [rsaMessage, setRsaMessage] = useState(65)
  const rsaKeys = useMemo(() => generateRSAKeys(rsaP, rsaQ), [rsaP, rsaQ])
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

  // --- 9. Hash State ---
  const [hashInput, setHashInput] = useState("CNS Security")
  const [hashOutput, setHashOutput] = useState("")
  useEffect(() => {
    sha256(hashInput).then(setHashOutput)
  }, [hashInput])

  const tabs: { id: typeof activeTab; label: string; tag: string }[] = [
    { id: 'caesar', label: 'Caesar', tag: 'Shift' },
    { id: 'affine', label: 'Affine', tag: 'Linear' },
    { id: 'playfair', label: 'Playfair', tag: 'Digraph' },
    { id: 'vigenere', label: 'Vigenère', tag: 'Poly' },
    { id: 'hill', label: 'Hill', tag: 'Matrix' },
    { id: 'transposition', label: 'Transposition', tag: 'Permute' },
    { id: 'cryptanalysis', label: 'Cryptanalysis', tag: 'Freq / IoC' },
    { id: 'rsa', label: 'RSA', tag: 'Asymmetric' },
    { id: 'hash', label: 'SHA-256', tag: 'Digest' }
  ]

  return (
    <div className="space-y-8">
      {/* Top Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              activeTab === t.id
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            {t.label} <span className="opacity-60 text-[10px]">[{t.tag}]</span>
          </button>
        ))}
      </div>

      {/* --- CAESAR TAB --- */}
      {activeTab === 'caesar' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 4</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Caesar Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Keyspace: 25</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Monoalphabetic shift cipher: <code className="font-mono font-bold text-ink">C = (P + k) mod 26</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext (P)</label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={caesarInput}
                  onChange={e => setCaesarInput(e.target.value.toUpperCase())}
                />
              </div>
              <div className="w-full sm:w-36">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Shift (k: 0..25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={caesarShift}
                  onChange={e => setCaesarShift(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Ciphertext (C)</label>
              <div className="p-3 sm:p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                {caesarOutput}
              </div>
            </div>
            <details className="mt-4 border border-rule bg-paper rounded-[4px]">
              <summary className="cursor-pointer font-bold text-ink p-3 sm:p-4 font-mono text-xs uppercase tracking-wider bg-card hover:bg-rule transition-colors">
                Launch Brute-Force Key Exhaustion (25 Keys)
              </summary>
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono max-h-64 overflow-y-auto">
                {caesarBruteForce.map(b => (
                  <div
                    key={b.shift}
                    className={`p-2 border ${b.shift === caesarShift ? "border-signal bg-signal/10 text-signal font-bold" : "border-transparent text-ink-soft"}`}
                  >
                    k={b.shift}: {b.result}
                  </div>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {/* --- AFFINE TAB --- */}
      {activeTab === 'affine' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 5</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Affine Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Keyspace: 12 × 26 = 312</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Linear modular transformation: <code className="font-mono font-bold text-ink">C ≡ (a·P + b) mod 26</code>. Multiplier <code className="font-mono font-bold text-ink">a</code> must satisfy <code className="font-mono font-bold text-ink">gcd(a, 26) = 1</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Multiplier a (Coprime to 26)
                </label>
                <select
                  value={affineA}
                  onChange={e => setAffineA(parseInt(e.target.value))}
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {validMultipliers.map(m => (
                    <option key={m} value={m}>
                      a = {m} (a⁻¹ mod 26 = {modInverse26(m, 26)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Shift b (0..25)
                </label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={affineB}
                  onChange={e => setAffineB(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Modular Inverse a⁻¹
                </label>
                <div className="p-3 bg-card border border-rule font-mono text-sm text-ink font-bold">
                  {aInverse !== null ? `a⁻¹ = ${aInverse}` : 'No inverse'}
                </div>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext (P)</label>
              <input
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                value={affineInput}
                onChange={e => setAffineInput(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">
                  Ciphertext C ≡ ({affineA}·P + {affineB}) mod 26
                </label>
                <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {affineEncrypted}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ok">
                  Decrypted P ≡ {aInverse}·(C - {affineB}) mod 26
                </label>
                <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {affineDecrypted}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- PLAYFAIR TAB --- */}
      {activeTab === 'playfair' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 6</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Playfair Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">5×5 Matrix · Digraphs</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Digraph substitution using a 5×5 key matrix (I/J merged). Rules: same row (shift right), same column (shift down), rectangle (swap columns).
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Keyword
                </label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                  value={playfairKeyword}
                  onChange={e => setPlayfairKeyword(e.target.value.toUpperCase())}
                />

                <div className="mt-4">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                    Plaintext
                  </label>
                  <input
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                    value={playfairInput}
                    onChange={e => setPlayfairInput(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="mt-4 p-3 bg-card border border-rule font-mono text-xs">
                  <span className="text-ink-soft block text-[10px] uppercase">Digraph Pairs (with filler X):</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {playfairDigraphs.map(([a, b], idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-paper border border-ink font-bold">
                        {a}{b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5x5 Key Matrix Display */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  5×5 Key Matrix
                </label>
                <div className="inline-block p-3 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
                  <div className="grid grid-cols-5 gap-1.5">
                    {playfairMatrix.map((row, r) =>
                      row.map((ch, c) => (
                        <div
                          key={`${r}-${c}`}
                          className="w-9 h-9 flex items-center justify-center font-mono font-bold text-sm bg-paper border border-rule hover:border-signal hover:text-signal transition-colors"
                        >
                          {ch}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">
                  Ciphertext
                </label>
                <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {playfairCipher}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ok">
                  Decrypted Text
                </label>
                <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {playfairDecrypted}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- VIGENÈRE TAB --- */}
      {activeTab === 'vigenere' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 7</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Vigenère Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Polyalphabetic</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Polyalphabetic substitution with repeating keyword: <code className="font-mono font-bold text-ink">C_i = (P_i + K_(i mod d)) mod 26</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="p-3 sm:p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                {vigenereOutput}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- HILL TAB --- */}
      {activeTab === 'hill' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 8</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Hill Cipher (2×2 Matrix)</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Linear Algebra mod 26</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Block cipher via matrix multiplication: <code className="font-mono font-bold text-ink">C = P · K mod 26</code>. Invertible only when <code className="font-mono font-bold text-ink">gcd(det(K), 26) = 1</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  2×2 Key Matrix K
                </label>
                <div className="inline-block p-4 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
                  <div className="grid grid-cols-2 gap-3 w-44">
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h00}
                      onChange={e => setH00(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h01}
                      onChange={e => setH01(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h10}
                      onChange={e => setH10(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h11}
                      onChange={e => setH11(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-paper border border-rule font-mono text-xs space-y-1">
                  <div>
                    <span className="text-ink-soft">Determinant det(K): </span>
                    <strong className={isHillValid ? 'text-ok' : 'text-bad'}>{hillDet} mod 26</strong>
                  </div>
                  <div>
                    <span className="text-ink-soft">Status: </span>
                    <strong className={isHillValid ? 'text-ok' : 'text-bad'}>
                      {isHillValid ? 'Invertible (Valid Key)' : 'Singular / Not Coprime (Invalid Key)'}
                    </strong>
                  </div>
                  {hillInverse && (
                    <div className="text-[11px] text-ink-soft pt-1 border-t border-rule">
                      Inverse K⁻¹: [[{hillInverse[0][0]}, {hillInverse[0][1]}], [{hillInverse[1][0]}, {hillInverse[1][1]}]]
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Plaintext (P)
                </label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                  value={hillInput}
                  onChange={e => setHillInput(e.target.value.toUpperCase())}
                />

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Ciphertext (C)
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {hillCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted (P)
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {hillDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TRANSPOSITION TAB --- */}
      {activeTab === 'transposition' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 9</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Transposition Ciphers</CardTitle>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTransType('rail')}
                  className={`px-2 py-1 font-mono text-xs border ${transType === 'rail' ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-rule'}`}
                >
                  Rail Fence
                </button>
                <button
                  onClick={() => setTransType('columnar')}
                  className={`px-2 py-1 font-mono text-xs border ${transType === 'columnar' ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-rule'}`}
                >
                  Columnar
                </button>
              </div>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Permutation ciphers rearrange the order of symbols without altering individual character identities.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext</label>
              <input
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                value={transInput}
                onChange={e => setTransInput(e.target.value.toUpperCase())}
              />
            </div>

            {transType === 'rail' ? (
              <div className="space-y-4">
                <div className="w-48">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Rail Depth (d)</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    value={railDepth}
                    onChange={e => setRailDepth(parseInt(e.target.value) || 2)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Rail Fence Ciphertext
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {railCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted Plaintext
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {railDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Transposition Key</label>
                  <input
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    value={colKey}
                    onChange={e => setColKey(e.target.value.toUpperCase())}
                  />
                  <span className="text-[10px] font-mono text-ink-soft mt-1 block">
                    Column Order: [{colOrder.join(', ')}]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Columnar Ciphertext
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {colCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted Plaintext
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {colDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- CRYPTANALYSIS TAB --- */}
      {activeTab === 'cryptanalysis' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 11</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Cryptanalysis & Statistical Profiler</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Al-Kindi Frequency Analysis</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Inspect letter unigram distributions and Index of Coincidence (IoC) to detect monoalphabetic vs polyalphabetic encryption.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                Intercepted Ciphertext / Sample Text
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                value={cryptoAnalysisText}
                onChange={e => setCryptoAnalysisText(e.target.value.toUpperCase())}
              />
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Index of Coincidence (IoC)</span>
                <strong className="text-lg text-signal">{textIoC.toFixed(4)}</strong>
                <span className="text-[10px] text-ink-soft block mt-1">
                  (English ≈ 0.065, Random/Poly ≈ 0.038)
                </span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Cipher Profile Classification</span>
                <strong className="text-lg text-ink">
                  {textIoC > 0.055 ? 'Monoalphabetic' : 'Polyalphabetic / High Entropy'}
                </strong>
                <span className="text-[10px] text-ink-soft block mt-1">Based on IoC threshold</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Total Alphabetic Characters</span>
                <strong className="text-lg text-ink">
                  {cryptoAnalysisText.replace(/[^A-Z]/g, '').length}
                </strong>
                <span className="text-[10px] text-ink-soft block mt-1">Min 30 letters recommended</span>
              </div>
            </div>

            {/* Frequency Bar Chart */}
            <div className="p-4 bg-paper border border-rule">
              <div className="font-mono text-xs uppercase text-ink-soft mb-3 flex justify-between">
                <span>Letter Frequencies vs English Standard</span>
                <span className="text-[10px]">Vermilion = Observed, Gray = English Reference</span>
              </div>
              <div className="grid grid-cols-13 sm:grid-cols-26 gap-1 items-end h-36 border-b border-rule pb-1">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(ch => {
                  const obsPct = textFreqs[ch] || 0
                  const refPct = ENGLISH_LETTER_FREQUENCIES[ch] || 0
                  const obsHeight = Math.min(100, Math.round(obsPct * 7))
                  const refHeight = Math.min(100, Math.round(refPct * 7))
                  return (
                    <div key={ch} className="flex flex-col items-center h-full justify-end group relative">
                      <div className="w-full flex items-end justify-center gap-0.5 h-full">
                        {/* Reference English (gray) */}
                        <div
                          style={{ height: `${refHeight}%` }}
                          className="w-1.5 bg-rule rounded-t-sm"
                          title={`English ${ch}: ${refPct.toFixed(1)}%`}
                        />
                        {/* Observed (signal) */}
                        <div
                          style={{ height: `${obsHeight}%` }}
                          className="w-1.5 bg-signal rounded-t-sm"
                          title={`Observed ${ch}: ${obsPct.toFixed(1)}%`}
                        />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-ink mt-1">{ch}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- RSA TAB --- */}
      {activeTab === 'rsa' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic Preview</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">RSA (Public-Key Simulation)</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Trapdoor Permutation</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">Using small primes for visibility. Real RSA uses 2048+ bit primes.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-rule pb-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime p</label>
                <input
                  type="number"
                  className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaP}
                  onChange={e => setRsaP(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime q</label>
                <input
                  type="number"
                  className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaQ}
                  onChange={e => setRsaQ(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {rsaKeys ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                <div className="p-4 border border-rule bg-card space-y-2">
                  <div className="flex justify-between border-b border-rule pb-2">
                    <span className="text-ink-soft">Modulus (n = p·q)</span>
                    <strong className="text-ink">{rsaKeys.n}</strong>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-ink-soft">Totient φ(n) = (p-1)(q-1)</span>
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

            <div className="pt-4 border-t border-rule space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Message (Number M &lt; n)</label>
                <input
                  type="number"
                  className="w-full sm:w-1/2 p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaMessage}
                  onChange={e => setRsaMessage(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                <div className="p-4 border border-signal bg-signal/5">
                  <div className="text-[10px] uppercase tracking-wider text-signal mb-2">Encrypted (M<sup>e</sup> mod n)</div>
                  <div className="text-2xl text-ink break-all font-bold">{rsaEncrypted}</div>
                </div>
                <div className="p-4 border border-ok bg-ok/5">
                  <div className="text-[10px] uppercase tracking-wider text-ok mb-2">Decrypted (C<sup>d</sup> mod n)</div>
                  <div className="text-2xl text-ink break-all font-bold">{rsaDecrypted}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- HASH TAB --- */}
      {activeTab === 'hash' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic Preview</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">SHA-256 Hashing</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Avalanche Effect</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Cryptographic hash function producing a deterministic 256-bit fixed-length output.
            </p>
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
              <div className="p-4 bg-ink text-paper rounded-[4px] font-mono break-all text-xs sm:text-sm leading-relaxed tracking-wider shadow-inner">
                {hashOutput || "Generating..."}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setHashInput("CNS Security")} variant="outline" size="sm" className="text-xs">
                &quot;CNS Security&quot;
              </Button>
              <Button onClick={() => setHashInput("cNS Security")} variant="outline" size="sm" className="text-xs">
                &quot;cNS Security&quot; (1 bit change)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
