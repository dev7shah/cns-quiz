import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { analyzeLogs, LogEvent, IDSAlert } from "@/lib/ids/simulator"

const sampleLogs: LogEvent[] = [
  { id: 101, ip: "192.168.1.45", action: "GET /index.html", timestamp: 1620000000 },
  { id: 102, ip: "10.0.0.99", action: "Nmap scan", timestamp: 1620000010 },
  { id: 103, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000020 },
  { id: 104, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000022 },
  { id: 105, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000024 },
  { id: 106, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000026 },
  { id: 107, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000028 },
  { id: 108, ip: "192.168.1.10", action: "POST /login UNION SELECT * FROM users", timestamp: 1620000030 },
]

export default function IDSPlayground() {
  const [logs, setLogs] = useState<LogEvent[]>(sampleLogs)
  const [alerts, setAlerts] = useState<IDSAlert[]>([])

  const runSimulation = () => {
    const results = analyzeLogs(logs)
    setAlerts(results)
  }

  const addNormalTraffic = () => {
    setLogs([...logs, { id: Date.now(), ip: "192.168.1.100", action: "GET /about.html", timestamp: Date.now() }])
  }

  const addMaliciousTraffic = () => {
    setLogs([...logs, { id: Date.now(), ip: "10.0.0.50", action: "GET /../../../etc/passwd", timestamp: Date.now() }])
  }

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle className="font-serif text-3xl">Network Traffic Logs</CardTitle>
              <p className="text-ink-soft text-sm font-sans mt-2">Simulate real-time network traffic and pass it through the IDS.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addNormalTraffic}>+ Normal</Button>
              <Button variant="outline" size="sm" onClick={addMaliciousTraffic}>+ Malicious</Button>
              <Button size="sm" onClick={runSimulation} className="bg-signal text-paper hover:bg-signal/90 border border-signal shadow-sm font-mono uppercase tracking-wider text-[11px] font-bold">Analyze Logs</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-rule bg-card max-h-80 overflow-y-auto">
            <table className="w-full text-sm font-mono text-left">
              <thead className="bg-paper sticky top-0 border-b border-rule z-10 text-[10px] uppercase tracking-wider text-ink-soft font-bold">
                <tr>
                  <th className="p-3 border-r border-rule">ID</th>
                  <th className="p-3 border-r border-rule">Source IP</th>
                  <th className="p-3">Action / Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-rule last:border-0 hover:bg-rule/50 transition-colors text-ink">
                    <td className="p-3 border-r border-rule">{log.id}</td>
                    <td className="p-3 border-r border-rule">{log.ip}</td>
                    <td className="p-3 break-all">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="border-bad shadow-[0_0_15px_rgba(var(--color-bad-rgb),0.1)]">
          <CardHeader>
            <CardTitle className="font-serif text-3xl text-bad">IDS Alerts ({alerts.length})</CardTitle>
            <p className="text-ink-soft text-sm font-sans mt-2">The IDS has matched signatures or anomalies against the traffic.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-4 border bg-card flex items-start gap-4 ${
                  alert.severity === 'CRITICAL' ? 'border-bad text-bad' :
                  alert.severity === 'HIGH' ? 'border-orange-500 text-orange-600' :
                  'border-signal text-signal'
                }`}>
                  <div className="font-bold shrink-0 uppercase tracking-wider text-[10px] bg-paper px-2 py-1 border border-current">
                    {alert.severity}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{alert.message}</div>
                    <div className="text-[11px] opacity-80 mt-2 uppercase tracking-wider">Triggered by Event ID: {alert.eventId}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
