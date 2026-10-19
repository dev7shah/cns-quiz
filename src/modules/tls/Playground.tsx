import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { simulateTLSHandshake, TLSState } from "@/lib/tls/simulator"

export default function TLSPlayground() {
  const [state, setState] = useState<TLSState>({ step: "CLIENT_HELLO", messages: [], isSecure: false })

  const nextStep = () => {
    const nextState = simulateTLSHandshake(state.step)
    setState({
      step: nextState.step,
      messages: [...state.messages, ...nextState.messages],
      isSecure: nextState.isSecure
    })
  }

  const reset = () => {
    setState({ step: "CLIENT_HELLO", messages: [], isSecure: false })
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
            <div>
              <CardTitle className="font-serif text-2xl sm:text-3xl">TLS Handshake Simulator</CardTitle>
              <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1 sm:mt-2">Step through the process of establishing a secure connection.</p>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Button variant="outline" size="sm" onClick={reset} className="text-xs h-9">Restart</Button>
              <Button size="sm" onClick={nextStep} disabled={state.isSecure} className="bg-signal text-paper border-signal hover:bg-signal/90 text-xs h-9">Next Step</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold block text-ink">Network Traffic (Wireshark View)</label>
              <div className="bg-ink text-paper rounded-[4px] p-3 sm:p-4 min-h-[220px] sm:min-h-[300px] flex flex-col gap-2 font-mono text-xs sm:text-sm max-h-[400px] overflow-y-auto shadow-inner">
                {state.messages.length === 0 ? (
                  <div className="text-ink-soft italic">Click &quot;Next Step&quot; to begin connection to https://secure-bank.com...</div>
                ) : (
                  state.messages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded-[4px] ${msg.startsWith('Client') ? 'bg-signal/20 text-signal' : 'bg-ok/20 text-ok'}`}>
                      {msg}
                    </div>
                  ))
                )}
                {state.isSecure && (
                  <div className="p-2 rounded-[4px] bg-ok/30 text-ok font-bold mt-4 animate-pulse">
                    🔒 Application Data (Encrypted payload)
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold block text-ink">Connection State</label>
              <div className="flex flex-col items-center justify-center p-6 sm:p-8 border border-rule bg-card min-h-[220px] sm:h-[300px] rounded-[4px]">
                {state.isSecure ? (
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔒</div>
                    <div className="text-xl sm:text-2xl font-black text-ok mb-1 sm:mb-2 font-mono">SECURE</div>
                    <p className="text-ink-soft text-xs sm:text-sm font-sans">Symmetric Key established. Perfect Forward Secrecy active.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50">🔓</div>
                    <div className="text-xl sm:text-2xl font-black text-bad mb-1 sm:mb-2 font-mono">UNSECURE</div>
                    <p className="text-ink-soft text-xs sm:text-sm font-sans">Currently exchanging parameters in plaintext over the internet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
