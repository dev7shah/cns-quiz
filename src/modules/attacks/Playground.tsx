import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
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
    <div className="space-y-8 sm:space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl sm:text-3xl">SQL Injection Simulator</CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1 sm:mt-2">See how malicious input can alter the logic of an unsanitized query.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 font-mono text-sm">
            <div className="space-y-3 sm:space-y-4 border border-rule p-3 sm:p-4 bg-card">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Login Form</h3>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 block text-ink">Username</label>
                <input 
                  className="w-full p-2 border border-ink bg-paper text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                  value={sqliUser} 
                  onChange={e => setSqliUser(e.target.value)} 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 block text-ink">Password</label>
                <input 
                  className="w-full p-2 border border-ink bg-paper text-bad font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                  value={sqliPass} 
                  onChange={e => setSqliPass(e.target.value)} 
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-3 sm:mt-4 text-ink-soft hover:text-ink transition-colors min-h-[32px]">
                <input type="checkbox" checked={sqliSafe} onChange={e => setSqliSafe(e.target.checked)} className="w-4 h-4 accent-ok" />
                Use Parameterized Query (Fix)
              </label>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Backend Execution</h3>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 block text-signal">Generated SQL Query</span>
                <div className="p-2.5 sm:p-3 bg-signal/5 border border-signal text-ink font-mono text-xs break-all min-h-[56px] sm:min-h-[64px]">
                  {sqliResult.queryExecuted}
                </div>
              </div>
              <div className={`mt-3 sm:mt-4 flex flex-col items-center justify-center p-4 sm:p-6 border ${sqliResult.isAuthenticated ? 'border-bad bg-bad/10' : 'border-ok bg-ok/10'}`}>
                <div className="text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 text-ink-soft">Auth Status</div>
                {sqliResult.isAuthenticated ? (
                  <div className="text-lg sm:text-xl font-bold text-bad tracking-widest text-center">LOGGED IN (Bypassed) ✕</div>
                ) : (
                  <div className="text-lg sm:text-xl font-bold text-ok tracking-widest text-center">ACCESS DENIED ✓</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl sm:text-3xl">Cross-Site Scripting (XSS) Simulator</CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1 sm:mt-2">Inject a script into the comment to see how it executes if not sanitized.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 font-mono text-sm">
            <div className="space-y-3 sm:space-y-4 border border-rule p-3 sm:p-4 bg-card">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Leave a Comment</h3>
              <textarea 
                className="w-full p-2 border border-ink bg-paper font-mono text-sm h-20 sm:h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={xssInput} 
                onChange={e => setXssInput(e.target.value)}
              />
              <label className="flex items-center gap-2 cursor-pointer mt-2 text-ink-soft hover:text-ink transition-colors min-h-[32px]">
                <input type="checkbox" checked={xssSafe} onChange={e => setXssSafe(e.target.checked)} className="w-4 h-4 accent-ok" />
                Sanitize Output (Fix)
              </label>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Rendered Output</h3>
              <div className="p-3 sm:p-4 border border-ink bg-paper min-h-[80px] sm:min-h-[100px]">
                {xssResult.isExploited ? (
                  <div className="animate-pulse bg-bad/20 p-3 sm:p-4 border border-bad text-bad font-bold text-center tracking-wider text-xs sm:text-sm">
                    [Browser executes popup alert!]
                  </div>
                ) : (
                  <span className="font-mono text-xs sm:text-sm text-ink break-all">{xssResult.renderedOutput}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
