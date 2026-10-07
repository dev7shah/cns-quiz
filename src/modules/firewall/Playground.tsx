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
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Access Control List (ACL)</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg overflow-hidden border">
            <div className="grid grid-cols-6 gap-2 p-3 font-bold text-sm bg-card border-b">
              <div>Order</div><div>Action</div><div>Proto</div><div>Source IP</div><div>Dest IP</div><div>Port</div>
            </div>
            {rules.map((rule, idx) => (
              <div 
                key={rule.id} 
                className={`grid grid-cols-6 gap-2 p-3 text-sm border-b last:border-0 ${evaluation.matchedRuleId === rule.id ? 'bg-primary/20 font-bold' : ''}`}
              >
                <div>{idx + 1}</div>
                <div className={rule.action === "ALLOW" ? "text-green-500" : "text-destructive"}>{rule.action}</div>
                <div>{rule.protocol}</div>
                <div>{rule.sourceIp}</div>
                <div>{rule.destIp}</div>
                <div>{rule.destPort}</div>
              </div>
            ))}
            <div className={`grid grid-cols-6 gap-2 p-3 text-sm text-muted-foreground italic ${!evaluation.matchedRuleId ? 'bg-destructive/20 text-destructive font-bold' : ''}`}>
              <div>*</div><div>DENY</div><div>ANY</div><div>ANY</div><div>ANY</div><div>ANY</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">In this simulation, IP matching must be exact or &quot;ANY&quot;.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Send a Packet</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold block mb-1">Protocol</label>
              <select className="w-full p-2 border rounded bg-background" value={packet.protocol} onChange={e => setPacket({...packet, protocol: e.target.value as Protocol})}>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Source IP</label>
              <input className="w-full p-2 border rounded bg-background font-mono" value={packet.sourceIp} onChange={e => setPacket({...packet, sourceIp: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Dest IP</label>
              <input className="w-full p-2 border rounded bg-background font-mono" value={packet.destIp} onChange={e => setPacket({...packet, destIp: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Dest Port</label>
              <input className="w-full p-2 border rounded bg-background font-mono" value={packet.destPort} onChange={e => setPacket({...packet, destPort: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-card">
            <div className="text-lg font-bold mb-2">Packet Status:</div>
            {evaluation.action === "ALLOW" ? (
              <div className="text-4xl font-black text-green-500">ALLOWED ✓</div>
            ) : (
              <div className="text-4xl font-black text-destructive">DROPPED ✕</div>
            )}
            <div className="text-muted-foreground mt-2">
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
