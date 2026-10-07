import { Card, CardContent } from "@/components/ui/Card"

export default function CloudCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Cloud Security Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Service Models</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">IaaS:</strong> Infrastructure as a Service (e.g. AWS EC2). You manage the OS, runtime, and apps. Provider manages hardware.</li>
                <li><strong className="text-primary">PaaS:</strong> Platform as a Service (e.g. Heroku). You manage apps and data. Provider manages OS and runtime.</li>
                <li><strong className="text-primary">SaaS:</strong> Software as a Service (e.g. Gmail). Provider manages everything. You only manage access and data.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Core AWS Security Services</h3>
              <ul className="space-y-3 font-sm">
                <li><strong>IAM:</strong> Identity and Access Management (Users, Roles, Policies).</li>
                <li><strong>CloudTrail:</strong> Logs every API call made in the account (Auditing).</li>
                <li><strong>GuardDuty:</strong> Intelligent threat detection using machine learning.</li>
                <li><strong>Security Groups:</strong> Stateful virtual firewalls at the instance level.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Cloud Security Posture Management (CSPM) Checklist</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Always enable <strong>Block Public Access</strong> on S3 buckets unless specifically hosting a public website.</li>
              <li>Enforce <strong>MFA (Multi-Factor Authentication)</strong> for all IAM users, especially the root account.</li>
              <li>Apply the <strong>Principle of Least Privilege</strong> to IAM policies.</li>
              <li>Ensure data is encrypted <strong>in transit</strong> (HTTPS/TLS) and <strong>at rest</strong> (KMS/SSE).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
