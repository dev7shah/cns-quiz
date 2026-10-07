import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function CloudLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">The Shared Responsibility Model</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          When you move to the cloud (AWS, Azure, GCP), security becomes a shared responsibility between the Cloud Service Provider (CSP) and the Customer. You cannot just &quot;blame Amazon&quot; if you get hacked.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/50">
          <CardHeader><CardTitle>Security OF the Cloud (Provider)</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">The CSP is responsible for protecting the infrastructure that runs all the services.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Physical security of data centers.</li>
              <li>Hardware, servers, and storage maintenance.</li>
              <li>Network infrastructure and hypervisors.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader><CardTitle>Security IN the Cloud (Customer)</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">The Customer is responsible for how they configure and use the services.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Customer data and encryption.</li>
              <li>Identity and Access Management (IAM).</li>
              <li>Operating system patches (for IaaS like EC2).</li>
              <li>Firewall configuration (Security Groups).</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">Top Cloud Security Threats</h3>
        <ul className="space-y-4">
          <li className="p-4 bg-muted rounded-lg border border-border">
            <strong>1. Misconfiguration (The #1 Threat)</strong>
            <p className="text-muted-foreground text-sm mt-1">Leaving an S3 bucket or database exposed to the public internet without authentication. Over 70% of cloud breaches start here.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <strong>2. Poor IAM Practices</strong>
            <p className="text-muted-foreground text-sm mt-1">Giving everyone `AdministratorAccess`, not enforcing MFA, or hardcoding AWS Access Keys in public GitHub repositories.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <strong>3. Insecure APIs</strong>
            <p className="text-muted-foreground text-sm mt-1">Cloud environments are heavily API-driven. Unauthenticated or vulnerable APIs can grant attackers full control of the infrastructure.</p>
          </li>
        </ul>
      </section>
      
      <Callout variant="default">
        <strong>Principle of Least Privilege (PoLP):</strong> A user, program, or process should have only the bare minimum privileges necessary to perform its intended function.
      </Callout>
    </div>
  )
}
