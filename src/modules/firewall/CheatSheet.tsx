import { Card, CardContent } from "@/components/ui/Card"

export default function FirewallCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Firewall & Networking Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Key Terms</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">ACL (Access Control List):</strong> The ordered list of rules a firewall uses to filter traffic.</li>
                <li><strong className="text-primary">Stateless:</strong> Evaluates packets individually (Layer 3/4).</li>
                <li><strong className="text-primary">Stateful:</strong> Tracks active connections (Layer 4).</li>
                <li><strong className="text-primary">WAF:</strong> Web Application Firewall. Inspects HTTP/S traffic (Layer 7) for SQLi, XSS, etc.</li>
                <li><strong className="text-primary">DMZ:</strong> Demilitarized Zone. A subnet for external-facing servers (web, email) isolated from the internal network.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Ports</h3>
              <ul className="space-y-1 font-mono text-sm">
                <li>20/21 - FTP (File Transfer)</li>
                <li>22 - SSH (Secure Shell)</li>
                <li>23 - Telnet (Insecure, DO NOT USE)</li>
                <li>25 - SMTP (Email Routing)</li>
                <li>53 - DNS (Domain Name System)</li>
                <li>80 - HTTP (Web)</li>
                <li>443 - HTTPS (Secure Web)</li>
                <li>3389 - RDP (Remote Desktop)</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg border-l-4 border-destructive">
            <h3 className="text-lg font-bold mb-2">Golden Rules of Firewall Config</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Default Deny:</strong> The last rule should always block everything. Only explicitly allowed traffic should pass.</li>
              <li><strong>First Match Wins:</strong> Rules are processed top-down. Place more specific rules (e.g., blocking a single bad IP) above general rules (e.g., allowing a whole subnet).</li>
              <li><strong>Least Privilege:</strong> Only open the specific ports required for a service, to the specific IPs that need it. Never use `ALLOW ANY ANY` unless it&apos;s a public web server on port 80/443.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
