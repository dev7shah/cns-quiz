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
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Network Traffic Logs</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addNormalTraffic}>+ Normal</Button>
              <Button variant="outline" size="sm" onClick={addMaliciousTraffic}>+ Malicious</Button>
              <Button size="sm" onClick={runSimulation}>Analyze Logs (Run IDS)</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-muted/30 max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="p-2 text-left font-bold border-b">ID</th>
                  <th className="p-2 text-left font-bold border-b">Source IP</th>
                  <th className="p-2 text-left font-bold border-b">Action / Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b last:border-0 font-mono">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.ip}</td>
                    <td className="p-2 break-all">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader><CardTitle className="text-destructive">IDS Alerts ({alerts.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-4 border rounded-lg flex items-start gap-4 ${
                  alert.severity === 'CRITICAL' ? 'bg-destructive/20 border-destructive text-destructive' :
                  alert.severity === 'HIGH' ? 'bg-orange-500/20 border-orange-500 text-orange-600' :
                  'bg-yellow-500/20 border-yellow-500 text-yellow-600'
                }`}>
                  <div className="font-bold shrink-0">[{alert.severity}]</div>
                  <div>
                    <div className="font-bold">{alert.message}</div>
                    <div className="text-sm opacity-80 mt-1">Triggered by Event ID: {alert.eventId}</div>
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
