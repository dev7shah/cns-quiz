import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function FirewallComplexity() {
  const data = [
    { algo: "Stateless Evaluation", time: "O(N)", space: "O(1)", meaning: "N is the number of rules. Must check top-down.", topic: "firewall" },
    { algo: "Stateful Connection Lookup", time: "O(1) to O(log M)", space: "O(M)", meaning: "M is active connections. Uses Hash/Tree map.", topic: "firewall" },
    { algo: "Deep Packet Inspection", time: "O(P)", space: "O(S)", meaning: "P=Payload size. Very slow, analyzes content.", topic: "firewall" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Firewall Processing Complexity</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
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
        <CardHeader><CardTitle>Performance Trade-offs</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            Firewalls operate on the boundary of a network, meaning they must process millions of packets per second. 
            If a firewall uses <strong>Deep Packet Inspection (DPI)</strong> to look for malware signatures inside the payload, 
            the processing time jumps massively compared to simply checking IP headers.
          </p>
          <p>
            To optimize performance, stateful firewalls use a fast-path for <strong>ESTABLISHED</strong> connections. 
            Once the initial handshake is evaluated against the slow O(N) rule list, subsequent packets are quickly 
            matched in an O(1) hash table of active connections and passed through.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
