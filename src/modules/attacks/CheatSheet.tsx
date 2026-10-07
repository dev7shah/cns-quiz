import { Card, CardContent } from "@/components/ui/Card"

export default function AttacksCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Attacks Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Injection Attacks</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">SQLi:</strong> SQL Injection. Tricking the database into executing unintended commands. <strong>Fix:</strong> Prepared Statements / Parameterized Queries.</li>
                <li><strong className="text-primary">XSS:</strong> Cross-Site Scripting. Injecting malicious JavaScript into a victim&apos;s browser. <strong>Fix:</strong> Context-aware output encoding.</li>
                <li><strong className="text-primary">Command Injection:</strong> Tricking the server into executing arbitrary OS commands. <strong>Fix:</strong> Avoid calling OS commands directly from code.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Availability Attacks</h3>
              <ul className="space-y-3 font-sm">
                <li><strong className="text-destructive">DoS:</strong> Denial of Service. One machine attacking a target.</li>
                <li><strong className="text-destructive">DDoS:</strong> Distributed DoS. A botnet of many machines attacking a target.</li>
                <li><strong className="text-destructive">Botnet:</strong> A network of compromised IoT devices or computers controlled by a central Command & Control (C2) server.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Types of XSS</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Stored (Persistent):</strong> The payload is saved in the database (e.g., a forum post) and served to all users.</li>
              <li><strong>Reflected:</strong> The payload is in the URL and the server reflects it immediately (e.g., a search results page).</li>
              <li><strong>DOM-based:</strong> The vulnerability is entirely in client-side JavaScript, not the server.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
