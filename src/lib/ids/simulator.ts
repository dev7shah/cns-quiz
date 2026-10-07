export interface LogEvent {
  id: number
  ip: string
  action: string
  timestamp: number
}

export interface IDSAlert {
  eventId: number
  severity: "LOW" | "HIGH" | "CRITICAL"
  message: string
}

/**
 * Simulates a simple Intrusion Detection System (IDS).
 * Checks for signature-based threats and basic anomaly detection (rate limiting).
 */
export function analyzeLogs(logs: LogEvent[]): IDSAlert[] {
  const alerts: IDSAlert[] = []
  
  // Signature Database
  const signatures = [
    { pattern: "nmap", severity: "LOW", message: "Port Scan detected (Nmap signature)" },
    { pattern: "union select", severity: "HIGH", message: "SQL Injection payload detected" },
    { pattern: "etc/passwd", severity: "CRITICAL", message: "Directory Traversal attempt detected" }
  ]

  // Track failed logins per IP for anomaly detection
  const failedLogins: Record<string, number> = {}

  for (const log of logs) {
    const actionLower = log.action.toLowerCase()

    // 1. Signature-based Detection
    for (const sig of signatures) {
      if (actionLower.includes(sig.pattern)) {
        alerts.push({
          eventId: log.id,
          severity: sig.severity as "LOW" | "HIGH" | "CRITICAL",
          message: sig.message
        })
      }
    }

    // 2. Anomaly-based Detection (Heuristics)
    if (actionLower.includes("failed login")) {
      failedLogins[log.ip] = (failedLogins[log.ip] || 0) + 1
      if (failedLogins[log.ip] === 5) {
        alerts.push({
          eventId: log.id,
          severity: "HIGH",
          message: `Brute Force Attack suspected from ${log.ip} (5+ failed logins)`
        })
      }
    }
  }

  return alerts
}
