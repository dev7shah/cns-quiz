import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function IDSComplexity() {
  const data = [
    { algo: "Signature Matching (Regex)", time: "O(L * S)", space: "O(S)", meaning: "L = payload length, S = num signatures. Very fast.", topic: "ids" },
    { algo: "Anomaly Detection (Statistical)", time: "O(N log N)", space: "O(N)", meaning: "N = events. Requires tracking state over time.", topic: "ids" },
    { algo: "Anomaly Detection (Machine Learning)", time: "O(F * W)", space: "O(W)", meaning: "F = features, W = model weights. Deep learning is slow.", topic: "ids" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Detection Complexity</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detection Method</TableHead>
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
        <CardHeader><CardTitle>The False Positive Paradox</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have an IDS looking at 1,000,000 packets a day, and the anomaly detection model is 99% accurate...
          </p>
          <p className="mb-4">
            It will still generate <strong>10,000 False Positives every single day</strong>! This causes <em>Alert Fatigue</em>, where security analysts start ignoring the dashboard entirely because there are too many useless alerts.
          </p>
          <p>
            Because of this, most enterprises rely heavily on <strong>Signature-based</strong> detection (which has almost 0% false positives) for the bulk of their alerts, and only use Anomaly-based detection for highly specific, high-risk assets.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
