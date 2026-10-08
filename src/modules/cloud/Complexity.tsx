import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function CloudComplexity() {
  const data = [
    { algo: "IAM Policy Evaluation", time: "O(P)", space: "O(1)", meaning: "P = Number of policies attached to user/role." },
    { algo: "S3 Bucket Enumeration", time: "O(N)", space: "O(N)", meaning: "Attackers brute-force N common bucket names." },
    { algo: "CloudTrail Log Analysis", time: "O(L log L)", space: "O(L)", meaning: "Sorting and indexing L log events." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Cloud Operations Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The computational scale of cloud security operations.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation / Attack</TableHead>
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
          <CardTitle className="font-serif text-3xl">The Scale of the Cloud</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            Unlike on-premise networks, cloud environments are entirely API-driven. This means attackers can automate discovery and exploitation. 
            Tools like <em className="text-signal bg-signal/10 px-1 border border-signal not-italic">Pacu</em> or <em className="text-signal bg-signal/10 px-1 border border-signal not-italic">CloudBrute</em> can scan millions of IPs and bucket names in minutes (O(N) time but massively parallelized).
          </p>
          <p>
            Because of this automation, a misconfigured S3 bucket will usually be found and exploited by automated bots within minutes of being made public.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
