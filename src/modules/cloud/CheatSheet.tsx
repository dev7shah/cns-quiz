import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function CloudCheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">Cloud Security Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Service Models</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">IaaS:</strong> <span className="text-ink">Infrastructure as a Service (e.g. AWS EC2). You manage OS, runtime.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">PaaS:</strong> <span className="text-ink">Platform as a Service (e.g. Heroku). You manage apps and data.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">SaaS:</strong> <span className="text-ink">Software as a Service (e.g. Gmail). Provider manages everything.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Core AWS Security Services</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">IAM:</strong> Identity and Access Management (Users, Roles, Policies).</li>
                <li><strong className="font-mono text-[11px]">CloudTrail:</strong> Logs every API call made in the account (Auditing).</li>
                <li><strong className="font-mono text-[11px]">GuardDuty:</strong> Intelligent threat detection using machine learning.</li>
                <li><strong className="font-mono text-[11px]">Security Groups:</strong> Stateful virtual firewalls at the instance level.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Cloud Security Posture Management (CSPM) Checklist">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li>Always enable <strong>Block Public Access</strong> on S3 buckets unless hosting a public website.</li>
                <li>Enforce <strong>MFA (Multi-Factor Authentication)</strong> for all IAM users, especially the root account.</li>
                <li>Apply the <strong>Principle of Least Privilege</strong> to IAM policies.</li>
                <li>Ensure data is encrypted <strong>in transit</strong> (HTTPS/TLS) and <strong>at rest</strong> (KMS/SSE).</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
