import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function AttacksCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">Attacks Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Injection Attacks</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">SQLi</strong> <span className="text-ink">Tricking DB into executing unintended commands. <strong>Fix:</strong> Prepared Statements.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">XSS</strong> <span className="text-ink">Injecting malicious JS into a victim&apos;s browser. <strong>Fix:</strong> Output encoding.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Cmd Inj</strong> <span className="text-ink">Executing arbitrary OS commands. <strong>Fix:</strong> Avoid calling OS commands.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Availability Attacks</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">DoS:</strong> Denial of Service. One machine attacking a target.</li>
                <li><strong className="font-mono text-[11px]">DDoS:</strong> Distributed DoS. A botnet of many machines attacking a target.</li>
                <li><strong className="font-mono text-[11px]">Botnet:</strong> A network of compromised devices controlled by a Command & Control (C2) server.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Types of XSS">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li><strong>Stored (Persistent):</strong> The payload is saved in the database (e.g., a forum post) and served to all users.</li>
                <li><strong>Reflected:</strong> The payload is in the URL and the server reflects it immediately (e.g., a search results page).</li>
                <li><strong>DOM-based:</strong> The vulnerability is entirely in client-side JavaScript, not the server.</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
