import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { checkCloudConfiguration, S3BucketPolicy, IAMUser } from "@/lib/cloud/checker"

export default function CloudPlayground() {
  const [bucket, setBucket] = useState<S3BucketPolicy>({
    PublicAccessBlock: false,
    EncryptionAtRest: false,
    MFA_Delete: false
  })
  
  const [users, setUsers] = useState<IAMUser[]>([
    { name: "alice", hasMFA: false, attachedPolicies: ["AdministratorAccess"], passwordAgeDays: 120 },
    { name: "bob", hasMFA: true, attachedPolicies: ["S3ReadOnlyAccess"], passwordAgeDays: 10 }
  ])

  const report = checkCloudConfiguration(bucket, users)

  const toggleUserMfa = (idx: number) => {
    const newUsers = [...users]
    newUsers[idx].hasMFA = !newUsers[idx].hasMFA
    setUsers(newUsers)
  }

  const changeUserPolicy = (idx: number, policy: string) => {
    const newUsers = [...users]
    newUsers[idx].attachedPolicies = [policy]
    setUsers(newUsers)
  }

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Cloud Security Posture Management (CSPM)</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">Simulate cloud misconfigurations and evaluate the security score.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <div className="border border-rule p-4 bg-card">
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold mb-3 text-ink">S3 Bucket Configuration</h3>
                <label className="flex items-center gap-2 mb-2 cursor-pointer font-sans text-sm text-ink">
                  <input type="checkbox" checked={bucket.PublicAccessBlock} onChange={e => setBucket({...bucket, PublicAccessBlock: e.target.checked})} className="w-4 h-4 accent-signal" />
                  Block Public Access
                </label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer font-sans text-sm text-ink">
                  <input type="checkbox" checked={bucket.EncryptionAtRest} onChange={e => setBucket({...bucket, EncryptionAtRest: e.target.checked})} className="w-4 h-4 accent-signal" />
                  Enable Encryption at Rest (SSE)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-ink">
                  <input type="checkbox" checked={bucket.MFA_Delete} onChange={e => setBucket({...bucket, MFA_Delete: e.target.checked})} className="w-4 h-4 accent-signal" />
                  Enable MFA Delete
                </label>
              </div>

              <div className="border border-rule p-4 bg-card">
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold mb-3 text-ink">IAM Users</h3>
                {users.map((u, idx) => (
                  <div key={idx} className="mb-4 p-3 border border-ink bg-paper flex flex-col gap-2">
                    <div className="font-bold font-mono text-sm text-ink">{u.name} (Pass age: {u.passwordAgeDays}d)</div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer font-sans text-ink">
                      <input type="checkbox" checked={u.hasMFA} onChange={() => toggleUserMfa(idx)} className="w-4 h-4 accent-signal" />
                      MFA Enabled
                    </label>
                    <select 
                      className="p-2 border border-ink text-sm w-full bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal font-mono"
                      value={u.attachedPolicies[0]}
                      onChange={(e) => changeUserPolicy(idx, e.target.value)}
                    >
                      <option value="AdministratorAccess">AdministratorAccess</option>
                      <option value="S3ReadOnlyAccess">S3ReadOnlyAccess</option>
                      <option value="EC2FullAccess">EC2FullAccess</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 p-4 border border-rule bg-card">
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-ink">Security Score</h3>
                <div className={`text-3xl font-serif ${report.score >= 90 ? 'text-ok' : report.score >= 60 ? 'text-signal' : 'text-bad'}`}>
                  {report.score} / 100
                </div>
              </div>

              <div className="flex-1 border border-rule p-4 bg-paper overflow-y-auto">
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-bad mb-2">Findings</h4>
                {report.findings.length === 0 ? (
                  <p className="text-sm text-ok italic mb-4 font-sans">No critical issues found!</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-bad mb-6 space-y-2 font-mono text-xs">
                    {report.findings.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}

                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-ok mb-2 pt-4 border-t border-rule">Passed Checks</h4>
                <ul className="list-disc pl-5 text-sm text-ok space-y-2 font-mono text-xs">
                  {report.passed.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
