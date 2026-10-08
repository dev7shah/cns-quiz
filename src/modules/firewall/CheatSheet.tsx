import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function FirewallCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">Firewall Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Key Terms</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">ACL</strong> <span className="text-ink">Access Control List. Ordered rules.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Stateless</strong> <span className="text-ink">Evaluates packets individually (L3/L4).</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Stateful</strong> <span className="text-ink">Tracks active connections.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">DMZ</strong> <span className="text-ink">Demilitarized Zone for public servers.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Common Ports</h3>
              <ul className="space-y-4 font-mono text-[11px] text-ink">
                <li><strong className="text-signal mr-2">22</strong> SSH (Secure Shell)</li>
                <li><strong className="text-signal mr-2">53</strong> DNS (Domain Name System)</li>
                <li><strong className="text-signal mr-2">80</strong> HTTP (Web)</li>
                <li><strong className="text-signal mr-2">443</strong> HTTPS (Secure Web)</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Golden Rules of Firewall Config">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li><strong>Default Deny:</strong> Last rule blocks everything.</li>
                <li><strong>First Match Wins:</strong> Rules processed top-down. Place specific rules above general ones.</li>
                <li><strong>Least Privilege:</strong> Only open required ports to required IPs.</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
