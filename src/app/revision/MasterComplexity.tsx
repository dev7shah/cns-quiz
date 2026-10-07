import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function MasterComplexity() {
  const data = [
    { module: "Cryptography", topic: "Caesar Cipher", time: "O(N)", space: "O(N)", meaning: "N = text length. Extremely fast, zero security." },
    { module: "Cryptography", topic: "RSA Encryption", time: "O(log^3 N)", space: "O(log N)", meaning: "N = prime size. Very slow, CPU intensive." },
    { module: "Cryptography", topic: "SHA-256 Hashing", time: "O(L)", space: "O(1)", meaning: "L = message length. Fixed output size (256 bits)." },
    { module: "Authentication", topic: "Dictionary Attack", time: "O(W * H)", space: "O(1)", meaning: "W = words in dictionary, H = hash time." },
    { module: "Authentication", topic: "Rainbow Table Attack", time: "O(1) lookup", space: "O(W)", meaning: "Trades massive storage space for instant time." },
    { module: "Firewalls", topic: "Stateless ACL", time: "O(R)", space: "O(R)", meaning: "R = number of rules. Top-down sequential check." },
    { module: "Firewalls", topic: "Stateful Firewall", time: "O(1) for est.", space: "O(C)", meaning: "C = active connections. Hash table lookup for state." },
    { module: "Attacks", topic: "DDoS Amplification", time: "O(1)", space: "O(A)", meaning: "A = Amplification factor. Assymetric network bandwidth." },
    { module: "IDS", topic: "Signature IDS", time: "O(P * S)", space: "O(S)", meaning: "P = packet size, S = signatures. Regex matching." },
    { module: "SSL/TLS", topic: "TLS 1.3 Handshake", time: "1-RTT", space: "N/A", meaning: "1 Round Trip. Faster than TLS 1.2 (2-RTT)." },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Master Complexity Table</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            A unified view of Time, Space, and Network complexity across all CNS topics. Essential for the Viva.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Algorithm / Topic</TableHead>
                  <TableHead>Time Complexity</TableHead>
                  <TableHead>Space Complexity</TableHead>
                  <TableHead>Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-primary">{row.module}</TableCell>
                    <TableCell className="font-medium">{row.topic}</TableCell>
                    <TableCell className="font-mono">{row.time}</TableCell>
                    <TableCell className="font-mono">{row.space}</TableCell>
                    <TableCell className="text-sm">{row.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="text-accent">Key Takeaway for Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Security engineering is almost always a tradeoff between <strong>Speed vs Security</strong> or <strong>Time vs Space</strong>.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>We use fast Symmetric encryption (AES) for data, but slow Asymmetric encryption (RSA) for key exchange.</li>
            <li>Attackers trade Space (massive Rainbow Tables on disk) to save Time (instant hash reversing).</li>
            <li>We use fast Stateless Firewalls at the edge, and slower Stateful Firewalls deeper in the network.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
