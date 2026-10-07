import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function CryptoComplexity() {
  const data = [
    { algo: "Caesar Brute Force", time: "O(26)", space: "O(1)", meaning: "Try all 26 shifts, constant time.", topic: "crypto" },
    { algo: "Vigenère Brute Force", time: "O(26^L)", space: "O(1)", meaning: "Exponential to key length L.", topic: "crypto" },
    { algo: "RSA Encryption (Mod Exp)", time: "O(log e)", space: "O(1)", meaning: "Square and multiply makes it fast.", topic: "crypto" },
    { algo: "RSA Breaking (Factoring)", time: "Sub-exponential", space: "Large", meaning: "General Number Field Sieve.", topic: "crypto" },
    { algo: "SHA-256 Hashing", time: "O(n)", space: "O(1)", meaning: "Linear to the length of the message.", topic: "crypto" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Time & Space Complexity</CardTitle></CardHeader>
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
                  <TableCell className="font-medium">{row.algo}</TableCell>
                  <TableCell className="font-mono text-primary">{row.time}</TableCell>
                  <TableCell className="font-mono">{row.space}</TableCell>
                  <TableCell>{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Why RSA is Secure (But Slow)</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            RSA&apos;s security relies on the fact that multiplying two large prime numbers takes <span className="font-mono text-primary">O(log<sup>2</sup> n)</span> time, but factoring the resulting large number takes <em>Sub-exponential time</em>.
          </p>
          <p>
            However, the modular exponentiation required to encrypt and decrypt data also takes significantly more CPU cycles than symmetric bit-shifting (AES). This is why RSA is primarily used to encrypt <em>keys</em>, not bulk data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
