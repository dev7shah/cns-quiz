import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function FirewallLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">What is a Firewall?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization&apos;s previously established security policies (Access Control Lists or ACLs).
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Stateless Firewalls</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Evaluates each packet in isolation.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Looks only at headers (Source IP, Dest IP, Port, Protocol).</li>
              <li>Has no memory of previous packets or established connections.</li>
              <li><strong>Drawback:</strong> To allow web browsing (port 80 out), you must manually open port 1024-65535 inwards for the return traffic, which is dangerous.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stateful Firewalls</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Maintains a <strong>State Table</strong> of active connections.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Understands the context of traffic (e.g., the TCP 3-way handshake).</li>
              <li>If internal machine A initiates a connection to external server B, the firewall dynamically allows the return traffic from B to A.</li>
              <li>Much more secure and easier to configure than stateless.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">How Firewall Rules Work</h3>
        <p className="mb-4">Rules are evaluated <strong>top-down</strong>. The very first rule that matches a packet dictates what happens. If no rules match, the firewall drops the packet (Default Deny).</p>
        
        <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
          <div className="font-bold border-b pb-2 mb-2">Example ACL Table:</div>
          <div className="grid grid-cols-6 gap-2 opacity-70">
            <div>Order</div><div>Action</div><div>Proto</div><div>Source IP</div><div>Dest IP</div><div>Port</div>
          </div>
          <div className="grid grid-cols-6 gap-2 py-1 text-destructive">
            <div>1</div><div>DENY</div><div>TCP</div><div>10.0.0.5</div><div>ANY</div><div>22</div>
          </div>
          <div className="grid grid-cols-6 gap-2 py-1 text-green-500">
            <div>2</div><div>ALLOW</div><div>TCP</div><div>ANY</div><div>ANY</div><div>22</div>
          </div>
          <div className="grid grid-cols-6 gap-2 py-1 text-destructive font-bold mt-2 border-t pt-2">
            <div>*</div><div>DENY</div><div>ANY</div><div>ANY</div><div>ANY</div><div>ANY</div>
          </div>
        </div>
        
        <Callout variant="warning">
          <strong>Rule Ordering is Critical:</strong> In the example above, if IP 10.0.0.5 tries to use Port 22 (SSH), it will be blocked by Rule 1. Even though Rule 2 allows ANY IP to use Port 22, the firewall stops checking after Rule 1 matches!
        </Callout>
      </section>
    </div>
  )
}
