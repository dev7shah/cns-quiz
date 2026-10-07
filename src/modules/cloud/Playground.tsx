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
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>Cloud Security Posture Management (CSPM)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <div className="border p-4 rounded-lg bg-muted/50">
                <h3 className="font-bold mb-3">S3 Bucket Configuration</h3>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={bucket.PublicAccessBlock} onChange={e => setBucket({...bucket, PublicAccessBlock: e.target.checked})} className="w-4 h-4" />
                  Block Public Access
                </label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={bucket.EncryptionAtRest} onChange={e => setBucket({...bucket, EncryptionAtRest: e.target.checked})} className="w-4 h-4" />
                  Enable Encryption at Rest (SSE)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={bucket.MFA_Delete} onChange={e => setBucket({...bucket, MFA_Delete: e.target.checked})} className="w-4 h-4" />
                  Enable MFA Delete
                </label>
              </div>

              <div className="border p-4 rounded-lg bg-muted/50">
                <h3 className="font-bold mb-3">IAM Users</h3>
                {users.map((u, idx) => (
                  <div key={idx} className="mb-4 p-3 border rounded bg-card flex flex-col gap-2">
                    <div className="font-bold">{u.name} (Pass age: {u.passwordAgeDays}d)</div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={u.hasMFA} onChange={() => toggleUserMfa(idx)} className="w-4 h-4" />
                      MFA Enabled
                    </label>
                    <select 
                      className="p-1 border rounded text-sm w-full bg-background"
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
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 p-4 border rounded-lg bg-card">
                <h3 className="font-bold text-lg">Security Score</h3>
                <div className={`text-3xl font-black ${report.score >= 90 ? 'text-green-500' : report.score >= 60 ? 'text-yellow-500' : 'text-destructive'}`}>
                  {report.score} / 100
                </div>
              </div>

              <div className="flex-1 border rounded-lg p-4 bg-muted/30 overflow-y-auto">
                <h4 className="font-bold text-destructive mb-2">Findings</h4>
                {report.findings.length === 0 ? (
                  <p className="text-sm text-green-500 italic mb-4">No critical issues found!</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-destructive mb-6 space-y-1">
                    {report.findings.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}

                <h4 className="font-bold text-green-600 mb-2">Passed Checks</h4>
                <ul className="list-disc pl-5 text-sm text-green-600 space-y-1">
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
