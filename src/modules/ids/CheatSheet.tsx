import { Card, CardContent } from "@/components/ui/Card"

export default function IDSCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">IDS / IPS Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Key Concepts</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">IDS (Detection):</strong> Monitors traffic and sends alerts. It is passive (out-of-band).</li>
                <li><strong className="text-primary">IPS (Prevention):</strong> Sits inline with traffic and can actively drop malicious packets.</li>
                <li><strong className="text-primary">NIDS / HIDS:</strong> Network-based (monitors whole subnet) vs Host-based (monitors a single server/laptop).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Detection Types</h3>
              <ul className="space-y-3 font-sm">
                <li><strong className="text-primary">Signature:</strong> Compares traffic against a database of known bad patterns (like Antivirus). Fast, but blind to new attacks.</li>
                <li><strong className="text-primary">Anomaly:</strong> Builds a baseline of &quot;normal&quot; behavior. Flags deviations. Can catch Zero-Days, but has high False Positives.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">The SOC Reality (Alert Fatigue)</h3>
            <p className="text-sm mb-2">
              A Security Operations Center (SOC) analyst might receive 10,000 alerts per day. If 9,990 of them are False Positives (benign traffic flagged as malicious), the analyst experiences <strong>Alert Fatigue</strong> and might ignore the 10 True Positives (actual attacks).
            </p>
            <p className="text-sm font-bold text-destructive">
              This is why tuning an IDS and writing precise rules (like Snort rules) is a highly paid skill!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
