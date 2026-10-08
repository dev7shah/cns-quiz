import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function AuthComplexity() {
  const data = [
    { algo: "Brute Force (No restrictions)", time: "O(R^L)", space: "O(1)", meaning: "Try every combination. R=pool size, L=length.", topic: "auth" },
    { algo: "Dictionary Attack", time: "O(D)", space: "O(D)", meaning: "Check against D known passwords.", topic: "auth" },
    { algo: "Rainbow Table Attack", time: "O(1) lookup", space: "O(R^L)", meaning: "Precompute all hashes. Requires massive storage.", topic: "auth" },
    { algo: "Bcrypt Hashing", time: "O(2^C)", space: "O(1)", meaning: "C is the cost factor. Intentionally slow.", topic: "auth" },
    { algo: "TOTP Generation", time: "O(1)", space: "O(1)", meaning: "Fast HMAC calculation.", topic: "auth" },
  ]
  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Authentication Attack Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The computational cost of breaking passwords vs defending them.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attack / Algorithm</TableHead>
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
          <CardTitle className="font-serif text-3xl">The Physics of Password Cracking</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            A password with 40 bits of entropy has <span className="font-mono bg-paper px-1 border border-ink">2<sup>40</sup> ≈ 1 trillion</span> possibilities. 
            A modern GPU cluster can compute billions of fast hashes (like MD5) per second, cracking this in minutes.
          </p>
          <p>
            By using a slow hashing algorithm like <strong className="text-signal">bcrypt</strong> with a high cost factor, you force the GPU to take 0.1 seconds per hash. 
            Suddenly, cracking those 1 trillion possibilities takes <strong className="text-ok bg-ok/10 px-1 border border-ok">3,170 years</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
