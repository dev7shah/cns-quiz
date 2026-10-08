import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { FirewallRule, Packet, evaluatePacket, Protocol } from "@/lib/firewall/simulator"

const initialRules: FirewallRule[] = [
  { id: "1", action: "DENY", protocol: "TCP", sourceIp: "192.168.1.100", destIp: "ANY", destPort: "22" },
  { id: "2", action: "ALLOW", protocol: "TCP", sourceIp: "ANY", destIp: "10.0.0.5", destPort: "80" },
  { id: "3", action: "ALLOW", protocol: "ICMP", sourceIp: "192.168.1.0", destIp: "ANY", destPort: "ANY" },
]

export default function FirewallPlayground() {
  const [rules] = useState<FirewallRule[]>(initialRules)
  const [packet, setPacket] = useState<Packet>({
    protocol: "TCP",
    sourceIp: "192.168.1.50",
    destIp: "10.0.0.5",
    destPort: "80"
  })

  const evaluation = evaluatePacket(rules, packet)

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Access Control List (ACL) Simulator</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">See how top-down rule processing works in action.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-paper border border-rule rounded-[4px] overflow-hidden">
            <div className="grid grid-cols-6 gap-2 p-4 font-mono text-[10px] uppercase tracking-wider font-bold bg-card border-b border-rule text-ink">
              <div>Order</div><div>Action</div><div>Proto</div><div>Source IP</div><div>Dest IP</div><div>Port</div>
            </div>
            {rules.map((rule, idx) => (
              <div 
                key={rule.id} 
                className={`grid grid-cols-6 gap-2 p-4 text-sm font-mono border-b border-rule last:border-0 ${evaluation.matchedRuleId === rule.id ? 'bg-signal/10 text-signal font-bold' : 'text-ink'}`}
              >
                <div>{idx + 1}</div>
                <div className={rule.action === "ALLOW" ? "text-ok" : "text-bad"}>{rule.action}</div>
                <div>{rule.protocol}</div>
                <div>{rule.sourceIp}</div>
                <div>{rule.destIp}</div>
                <div>{rule.destPort}</div>
              </div>
            ))}
            <div className={`grid grid-cols-6 gap-2 p-4 text-sm font-mono italic ${!evaluation.matchedRuleId ? 'bg-bad/10 text-bad font-bold' : 'text-ink-soft'}`}>
              <div>*</div><div>DENY</div><div>ANY</div><div>ANY</div><div>ANY</div><div>ANY</div>
            </div>
          </div>
          <p className="text-xs text-ink-soft font-sans">Note: In this simulation, IP matching must be exact or &quot;ANY&quot;.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Send a Packet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Protocol</label>
              <select className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={packet.protocol} onChange={e => setPacket({...packet, protocol: e.target.value as Protocol})}>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Source IP</label>
              <input className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={packet.sourceIp} onChange={e => setPacket({...packet, sourceIp: e.target.value})} />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Dest IP</label>
              <input className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={packet.destIp} onChange={e => setPacket({...packet, destIp: e.target.value})} />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Dest Port</label>
              <input className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" value={packet.destPort} onChange={e => setPacket({...packet, destPort: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 border border-rule bg-card rounded-[4px]">
            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-ink mb-2">Packet Status</div>
            {evaluation.action === "ALLOW" ? (
              <div className="text-4xl font-black text-ok font-mono tracking-widest">ALLOWED ✓</div>
            ) : (
              <div className="text-4xl font-black text-bad font-mono tracking-widest">DROPPED ✕</div>
            )}
            <div className="text-ink-soft mt-4 font-sans text-sm">
              {evaluation.matchedRuleId 
                ? `Matched by Rule #${rules.findIndex(r => r.id === evaluation.matchedRuleId) + 1}`
                : "Dropped by Default Implicit Deny Rule"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
