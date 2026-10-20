import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { simulateSQLi, simulateXSS } from "@/lib/attacks/simulator"
import { simulateBufferOverflow } from "@/lib/security/bufferOverflow"

export default function AttacksPlayground() {
  const [sqliUser, setSqliUser] = useState("admin")
  const [sqliPass, setSqliPass] = useState("' OR '1'='1")
  const [sqliSafe, setSqliSafe] = useState(false)
  const sqliResult = simulateSQLi(sqliUser, sqliPass, !sqliSafe)

  const [xssInput, setXssInput] = useState("<script>alert('Hacked!');</script>")
  const [xssSafe, setXssSafe] = useState(false)
  const xssResult = simulateXSS(xssInput, xssSafe)

  // Buffer Overflow State
  const [bofInput, setBofInput] = useState("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\\xEF\\xBE\\xAD\\xDE")
  const [bofCanary, setBofCanary] = useState(true)
  const [bofDEP, setBofDEP] = useState(false)
  const bofResult = useMemo(
    () => simulateBufferOverflow(bofInput, 16, { enableCanary: bofCanary, enableDEP: bofDEP }),
    [bofInput, bofCanary, bofDEP]
  )
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

      {/* --- BUFFER OVERFLOW CARD --- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M4 · Topic 1</span>
              <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Stack Buffer Overflow & Canary Simulator</CardTitle>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Smash the Stack</span>
          </div>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            Simulates x86 memory layout with a 16-byte buffer, StackGuard canary, saved EBP, and return address (EIP).
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                Payload Input ({bofInput.length} bytes / 16-byte buffer capacity)
              </label>
              <input
                className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                value={bofInput}
                onChange={e => setBofInput(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bofCanary}
                  onChange={e => setBofCanary(e.target.checked)}
                  className="w-4 h-4 accent-signal"
                />
                Stack Canary Enabled (-fstack-protector)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bofDEP}
                  onChange={e => setBofDEP(e.target.checked)}
                  className="w-4 h-4 accent-signal"
                />
                DEP / NX (Non-executable stack)
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBofInput("Hello")}
                className="text-xs"
              >
                Safe String (5B)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBofInput("A".repeat(16) + "EVIL" + "BBBB")}
                className="text-xs"
              >
                Smash Canary (24B)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBofCanary(false)
                  setBofInput("A".repeat(16) + "BBBB" + "\\xef\\xbe\\xad\\xde")
                }}
                className="text-xs"
              >
                Hijack EIP (24B, No Canary)
              </Button>
            </div>
          </div>

          {/* Stack Slots Visualization */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wider">Stack Frame Memory Slots</h4>
            <div className="space-y-1.5">
              {bofResult.stackSlots.map(slot => (
                <div
                  key={slot.offset}
                  className={`p-2.5 border flex justify-between items-center ${
                    slot.isCorrupted
                      ? "bg-bad/10 border-bad text-bad"
                      : "bg-paper border-rule text-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[10px] text-ink-soft">+{slot.offset}B</span>
                    <span>{slot.name}</span>
                  </div>
                  <div className="font-mono text-xs">
                    {slot.isCorrupted ? (
                      <span className="font-bold text-bad">SMASHED: {slot.currentValue}</span>
                    ) : (
                      <span className="text-ok">SAFE: {slot.currentValue}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Terminal Result */}
          <div className={`p-4 border font-mono text-xs ${
            bofResult.executionStatus === "control_flow_hijacked"
              ? "bg-bad text-paper border-bad font-bold"
              : bofResult.executionStatus === "aborted_by_canary"
              ? "bg-signal text-paper border-signal font-bold"
              : bofResult.executionStatus === "dep_blocked"
              ? "bg-amber-950 text-paper border-amber-800 font-bold"
              : "bg-ok/10 border-ok text-ok"
          }`}>
            <div>STATUS: {bofResult.executionStatus.toUpperCase()}</div>
            <div className="mt-1">{bofResult.terminalOutput}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
