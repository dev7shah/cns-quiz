import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function IDSCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">IDS / IPS Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Key Concepts</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">IDS (Detection)</strong> <span className="text-ink">Monitors traffic and sends alerts. Passive (out-of-band).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">IPS (Prevention)</strong> <span className="text-ink">Sits inline with traffic. Actively drops malicious packets.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">NIDS</strong> <span className="text-ink">Network-based. Monitors an entire subnet.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">HIDS</strong> <span className="text-ink">Host-based. Monitors a single server/laptop.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Detection Types</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">Signature:</strong> Compares traffic against known bad patterns (like Antivirus). Fast, 0% false positives, but blind to new attacks.</li>
                <li><strong className="font-mono text-[11px]">Anomaly:</strong> Builds a baseline of &quot;normal&quot; behavior. Flags deviations. Can catch Zero-Days, but has high False Positives.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="The SOC Reality (Alert Fatigue)">
              <p className="font-sans text-sm mt-2">
                A Security Operations Center (SOC) analyst might receive 10,000 alerts per day. If 9,990 of them are False Positives (benign traffic flagged as malicious), the analyst experiences <strong>Alert Fatigue</strong> and might ignore the 10 True Positives (actual attacks).
              </p>
              <p className="font-sans text-sm mt-2 font-bold text-bad">
                This is why tuning an IDS and writing precise rules (like Snort rules) is a highly paid skill!
              </p>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
