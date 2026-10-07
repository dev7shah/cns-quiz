import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function AttacksComplexity() {
  const data = [
    { algo: "DDoS Reflection/Amplification", time: "O(1)", space: "O(N)", meaning: "Small request yields N-sized amplified response.", topic: "attacks" },
    { algo: "SQL Injection Payload", time: "O(1)", space: "O(1)", meaning: "Appends logical ORs to bypass checks.", topic: "attacks" },
    { algo: "XSS Delivery", time: "O(1)", space: "O(1)", meaning: "Script delivered straight to the victim's DOM.", topic: "attacks" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Attack Mechanics & Amplification</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attack Vector</TableHead>
                <TableHead>Time Complexity</TableHead>
                <TableHead>Payload Scale</TableHead>
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
        <CardHeader><CardTitle>The Power of Amplification</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            In a <strong>DNS Amplification Attack</strong>, the attacker spoofs the victim's IP address and sends a small 60-byte query to a vulnerable DNS server.
          </p>
          <p className="mb-4">
            The DNS server responds with a massive 3000-byte record directly to the victim. This is an <strong>Amplification Factor of 50x</strong>.
          </p>
          <p>
            If the attacker controls a botnet of 10,000 devices, and each sends 10 requests per second, the victim gets hit with <strong>~12 Gigabits per second</strong> of junk traffic, instantly taking them offline.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
