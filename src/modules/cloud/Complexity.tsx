import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function CloudComplexity() {
  const data = [
    { algo: "IAM Policy Evaluation", time: "O(P)", space: "O(1)", meaning: "P = Number of policies attached to user/role.", topic: "cloud" },
    { algo: "S3 Bucket Enumeration", time: "O(N)", space: "O(N)", meaning: "Attackers brute-force N common bucket names.", topic: "cloud" },
    { algo: "CloudTrail Log Analysis", time: "O(L log L)", space: "O(L)", meaning: "Sorting and indexing L log events.", topic: "cloud" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Cloud Operations Complexity</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>The Scale of the Cloud</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            Unlike on-premise networks, cloud environments are entirely API-driven. This means attackers can automate discovery and exploitation. 
            Tools like <em>Pacu</em> or <em>CloudBrute</em> can scan millions of IPs and bucket names in minutes (O(N) time but massively parallelized).
          </p>
          <p>
            Because of this automation, a misconfigured S3 bucket will usually be found and exploited by automated bots within minutes of being made public.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
