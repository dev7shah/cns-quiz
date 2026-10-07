import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { simulateSQLi, simulateXSS } from "@/lib/attacks/simulator"

export default function AttacksPlayground() {
  const [sqliUser, setSqliUser] = useState("admin")
  const [sqliPass, setSqliPass] = useState("' OR '1'='1")
  const [sqliSafe, setSqliSafe] = useState(false)
  const sqliResult = simulateSQLi(sqliUser, sqliPass, !sqliSafe)

  const [xssInput, setXssInput] = useState("<script>alert('Hacked!');</script>")
  const [xssSafe, setXssSafe] = useState(false)
  const xssResult = simulateXSS(xssInput, xssSafe)

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>SQL Injection Simulator</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
              <h3 className="font-bold">Login Form</h3>
              <div>
                <label className="text-xs font-bold block mb-1">Username</label>
                <input 
                  className="w-full p-2 border rounded bg-background" 
                  value={sqliUser} 
                  onChange={e => setSqliUser(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Password</label>
                <input 
                  className="w-full p-2 border rounded bg-background text-destructive font-mono text-sm" 
                  value={sqliPass} 
                  onChange={e => setSqliPass(e.target.value)} 
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input type="checkbox" checked={sqliSafe} onChange={e => setSqliSafe(e.target.checked)} className="w-4 h-4" />
                Use Parameterized Query (Fix)
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Backend Execution</h3>
              <div>
                <span className="text-xs font-bold">Generated SQL Query:</span>
                <div className="p-3 bg-card border rounded font-mono text-xs mt-1 break-all">
                  {sqliResult.queryExecuted}
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center p-6 border rounded-lg bg-card">
                <div className="text-lg font-bold mb-2">Auth Status:</div>
                {sqliResult.isAuthenticated ? (
                  <div className="text-3xl font-black text-destructive">LOGGED IN (Bypassed) ✕</div>
                ) : (
                  <div className="text-3xl font-black text-green-500">ACCESS DENIED ✓</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cross-Site Scripting (XSS) Simulator</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
              <h3 className="font-bold">Leave a Comment</h3>
              <textarea 
                className="w-full p-2 border rounded bg-background font-mono text-sm h-24" 
                value={xssInput} 
                onChange={e => setXssInput(e.target.value)}
              />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={xssSafe} onChange={e => setXssSafe(e.target.checked)} className="w-4 h-4" />
                Sanitize Output (Fix)
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Rendered Output</h3>
              <div className="p-4 border rounded min-h-[100px] bg-card overflow-hidden">
                {xssResult.isExploited ? (
                  <div className="animate-pulse bg-destructive/20 p-4 border border-destructive rounded text-destructive font-bold text-center">
                    [Browser executes popup alert!]
                  </div>
                ) : (
                  <span className="font-mono text-sm">{xssResult.renderedOutput}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
