import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function IDSComplexity() {
  const data = [
    { algo: "Signature Matching (Regex)", time: "O(L * S)", space: "O(S)", meaning: "L = payload length, S = num signatures. Very fast." },
    { algo: "Anomaly Detection (Statistical)", time: "O(N log N)", space: "O(N)", meaning: "N = events. Requires tracking state over time." },
    { algo: "Anomaly Detection (Machine Learning)", time: "O(F * W)", space: "O(W)", meaning: "F = features, W = model weights. Deep learning is slow." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Detection Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The computational and memory cost of processing network traffic in real-time.</p>
        </CardHeader>
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
                  <TableCell className="font-mono text-xs text-ink">{row.algo}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.time}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.space}</TableCell>
                  <TableCell className="text-sm text-ink">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">The False Positive Paradox</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            If you have an IDS looking at 1,000,000 packets a day, and the anomaly detection model is 99% accurate...
          </p>
          <p className="mb-4">
            It will still generate <strong className="text-bad bg-bad/10 px-1 border border-bad">10,000 False Positives every single day</strong>! This causes <em className="text-signal font-bold">Alert Fatigue</em>, where security analysts start ignoring the dashboard entirely because there are too many useless alerts.
          </p>
          <p>
            Because of this, most enterprises rely heavily on <strong>Signature-based</strong> detection (which has almost 0% false positives) for the bulk of their alerts, and only use Anomaly-based detection for highly specific, high-risk assets.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
