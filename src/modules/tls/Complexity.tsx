import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function TLSComplexity() {
  const data = [
    { algo: "RSA Key Exchange", time: "O(log³ N)", space: "O(log N)", meaning: "N = key size (e.g. 2048 bits). Very slow CPU operations." },
    { algo: "AES Encryption", time: "O(P)", space: "O(1)", meaning: "P = payload size. Very fast, uses CPU hardware acceleration." },
    { algo: "Handshake Latency", time: "1-2 RTT", space: "N/A", meaning: "RTT = Round Trip Time. Network latency dictates speed." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">TLS Cryptographic Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The performance impact of establishing secure connections.</p>
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
          <CardTitle className="font-serif text-3xl">The Cost of Security</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            Historically, setting up an HTTPS connection was expensive for web servers because <strong>RSA decryption</strong> requires intense CPU math. 
            If thousands of clients connected at once, the server could crash. This is why websites used to only encrypt the login page.
          </p>
          <p className="mb-4">
            Today, servers use <strong>Elliptic Curve Cryptography (ECC)</strong> for the handshake, which is vastly faster than RSA for the same security level. 
          </p>
          <p>
            Furthermore, modern CPUs have dedicated silicon instructions (AES-NI) that can encrypt gigabytes of data with AES in milliseconds. 
            <strong className="text-signal bg-signal/10 px-1 border border-signal">There is no longer a performance excuse for not using HTTPS everywhere.</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
