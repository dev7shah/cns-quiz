import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function MasterComplexity() {
  const data = [
    { module: "Cryptography", topic: "Caesar Cipher", time: "O(N)", space: "O(N)", meaning: "N = text length. Extremely fast, zero security." },
    { module: "Cryptography", topic: "RSA Encryption", time: "O(log³ N)", space: "O(log N)", meaning: "N = prime size. Very slow, CPU intensive." },
    { module: "Cryptography", topic: "SHA-256 Hashing", time: "O(L)", space: "O(1)", meaning: "L = message length. Fixed output size (256 bits)." },
    { module: "Authentication", topic: "Dictionary Attack", time: "O(W × H)", space: "O(1)", meaning: "W = words in dictionary, H = hash time." },
    { module: "Authentication", topic: "Rainbow Table Attack", time: "O(1) lookup", space: "O(W)", meaning: "Trades massive storage space for instant time." },
    { module: "Firewalls", topic: "Stateless ACL", time: "O(R)", space: "O(R)", meaning: "R = number of rules. Top-down sequential check." },
    { module: "Firewalls", topic: "Stateful Firewall", time: "O(1) for est.", space: "O(C)", meaning: "C = active connections. Hash table lookup for state." },
    { module: "Attacks", topic: "DDoS Amplification", time: "O(1)", space: "O(A)", meaning: "A = Amplification factor. Assymetric network bandwidth." },
    { module: "IDS", topic: "Signature IDS", time: "O(P × S)", space: "O(S)", meaning: "P = packet size, S = signatures. Regex matching." },
    { module: "SSL/TLS", topic: "TLS 1.3 Handshake", time: "1-RTT", space: "N/A", meaning: "1 Round Trip. Faster than TLS 1.2 (2-RTT)." },
  ]

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pb-6 border-b border-rule mb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-signal font-bold mb-2">Reference Table</div>
          <CardTitle className="text-4xl font-serif text-ink">Master Complexity Analysis</CardTitle>
          <p className="text-ink-soft font-sans mt-4 max-w-2xl">
            A unified view of Time, Space, and Network complexity across all CNS topics. Essential for the Viva.
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table>
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink-soft h-12">Module</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink-soft h-12">Algorithm / Topic</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink-soft h-12">Time Complexity</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink-soft h-12">Space Complexity</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink-soft h-12">Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper transition-colors">
                    <TableCell className="font-sans text-sm text-ink-soft">{row.module}</TableCell>
                    <TableCell className="font-sans font-bold text-ink">{row.topic}</TableCell>
                    <TableCell className="font-mono text-signal">{row.time}</TableCell>
                    <TableCell className="font-mono text-info">{row.space}</TableCell>
                    <TableCell className="text-sm font-sans text-ink">{row.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-paper border border-ink p-8 shadow-[4px_4px_0_var(--rule)]">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink mb-6 border-b border-rule pb-2">Examiner Notes: The Grand Tradeoff</h3>
        <p className="mb-4 text-ink font-sans leading-relaxed">Security engineering is almost always a tradeoff between <strong>Speed vs Security</strong> or <strong>Time vs Space</strong>.</p>
        <ul className="space-y-3 font-sans text-ink-soft">
          <li className="flex gap-3"><span className="text-signal">→</span> <span>We use fast Symmetric encryption (AES) for data, but slow Asymmetric encryption (RSA) for key exchange.</span></li>
          <li className="flex gap-3"><span className="text-signal">→</span> <span>Attackers trade Space (massive Rainbow Tables on disk) to save Time (instant hash reversing).</span></li>
          <li className="flex gap-3"><span className="text-signal">→</span> <span>We use fast Stateless Firewalls at the edge, and slower Stateful Firewalls deeper in the network.</span></li>
        </ul>
      </div>
    </div>
  )
}
