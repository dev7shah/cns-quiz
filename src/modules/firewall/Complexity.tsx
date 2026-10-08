import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function FirewallComplexity() {
  const data = [
    { algo: "Stateless Evaluation", time: "O(N)", space: "O(1)", meaning: "N is the number of rules. Must check top-down." },
    { algo: "Stateful Connection Lookup", time: "O(1) to O(log M)", space: "O(M)", meaning: "M is active connections. Uses Hash/Tree map." },
    { algo: "Deep Packet Inspection", time: "O(P)", space: "O(S)", meaning: "P=Payload size. Very slow, analyzes content." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Firewall Processing Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The performance cost of filtering network traffic.</p>
        </CardHeader>
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
          <CardTitle className="font-serif text-3xl">Performance Trade-offs</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            Firewalls operate on the boundary of a network, meaning they must process millions of packets per second. 
            If a firewall uses <strong className="text-signal bg-signal/10 px-1 border border-signal">Deep Packet Inspection (DPI)</strong> to look for malware signatures inside the payload, 
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
