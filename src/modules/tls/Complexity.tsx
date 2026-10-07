import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function TLSComplexity() {
  const data = [
    { algo: "RSA Key Exchange", time: "O(log^3 N)", space: "O(log N)", meaning: "N = key size (e.g. 2048 bits). Very slow CPU operations.", topic: "tls" },
    { algo: "AES Encryption", time: "O(P)", space: "O(1)", meaning: "P = payload size. Very fast, uses CPU hardware acceleration.", topic: "tls" },
    { algo: "Handshake Latency", time: "1-2 RTT", space: "N/A", meaning: "RTT = Round Trip Time. Network latency dictates speed.", topic: "tls" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>TLS Cryptographic Complexity</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>The Cost of Security</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            Historically, setting up an HTTPS connection was expensive for web servers because <strong>RSA decryption</strong> requires intense CPU math. 
            If thousands of clients connected at once, the server could crash. This is why websites used to only encrypt the login page.
          </p>
          <p>
            Today, servers use <strong>Elliptic Curve Cryptography (ECC)</strong> for the handshake, which is vastly faster than RSA for the same security level. 
            Furthermore, modern CPUs have dedicated silicon instructions (AES-NI) that can encrypt gigabytes of data with AES in milliseconds. 
            <strong>There is no longer a performance excuse for not using HTTPS everywhere.</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
