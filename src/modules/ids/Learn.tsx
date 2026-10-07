import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function IDSLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">What is an IDS?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          An Intrusion Detection System (IDS) is a device or software application that monitors a network or systems for malicious activity or policy violations. Unlike a firewall (which blocks traffic), a traditional IDS only <strong>detects and alerts</strong>.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Signature-Based Detection</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Works exactly like a traditional anti-virus scanner.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>It looks for specific patterns (signatures) of known malware or attacks (e.g., a specific byte sequence in a packet payload).</li>
              <li><strong>Pros:</strong> Very fast. Almost zero false positives for known threats.</li>
              <li><strong>Cons:</strong> Cannot detect Zero-Day (unknown) attacks. If the signature isn&apos;t in the database, the attack slips through.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Anomaly-Based Detection</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Uses machine learning or statistical baselines.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>It learns what &quot;normal&quot; traffic looks like for your specific network, and alerts on significant deviations.</li>
              <li><strong>Pros:</strong> Can detect brand new (Zero-Day) attacks!</li>
              <li><strong>Cons:</strong> Slower to process. High rate of <strong>False Positives</strong> (e.g., alerting just because a user logs in at an unusual time).</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">IDS vs IPS</h3>
        <p className="mb-4">
          While an <strong>IDS</strong> (Detection) only sends an alert to a dashboard, an <strong>IPS</strong> (Intrusion Prevention System) is placed inline with the traffic and can actively drop packets to stop the attack in real-time.
        </p>
      </section>
      
      <Callout variant="default">
        <strong>The Problem with IPS:</strong> Because Anomaly-based detection has high false positives, putting it in an IPS mode is risky. If the AI makes a mistake, it might accidentally block a legitimate customer from accessing your website!
      </Callout>
    </div>
  )
}
