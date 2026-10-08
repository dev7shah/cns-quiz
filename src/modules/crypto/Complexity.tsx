import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function CryptoComplexity() {
  const data = [
    { algo: "Caesar Cipher Brute Force", time: "O(26) = O(1)", space: "O(1)", meaning: "Try all 26 shifts. Trivial for computers." },
    { algo: "Vigenère Cipher (Known Key Len)", time: "O(N)", space: "O(1)", meaning: "Frequency analysis on each interleaved shift." },
    { algo: "RSA Key Generation", time: "O(log³ N)", space: "O(log N)", meaning: "Primality testing (Miller-Rabin) is probabilistic but fast." },
    { algo: "RSA Encryption", time: "O(log³ N)", space: "O(log N)", meaning: "Modular exponentiation (M^e mod n)." },
    { algo: "AES-256 (Symmetric)", time: "O(1) per block", space: "O(1)", meaning: "Highly optimized in hardware (AES-NI). Blazing fast." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Cryptographic Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The computational cost of breaking encryption vs using it.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Time Complexity</TableHead>
                <TableHead>Space Complexity</TableHead>
                <TableHead>Plain English Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{row.algo}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.time}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.space}</TableCell>
                  <TableCell className="text-sm">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Why is RSA so slow?</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            RSA involves math with extremely large numbers (2048-bit primes). The time complexity of modular exponentiation is <strong>O(log³ N)</strong>, making it computationally heavy.
          </p>
          <p className="mb-4">
            Symmetric algorithms like AES use simple bitwise operations (XOR, shifting) and lookup tables, which are executed in a single clock cycle using hardware acceleration (AES-NI).
          </p>
          <p>
            Because of this, we <strong className="text-signal bg-signal/10 px-1 border border-signal">never encrypt large files with RSA</strong>. We use RSA to securely exchange a tiny symmetric key, and then switch to AES for the bulk data transfer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
