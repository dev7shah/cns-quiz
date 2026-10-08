import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { simulateTLSHandshake, TLSState, HandshakeStep } from "@/lib/tls/simulator"

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
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-serif text-3xl">TLS Handshake Simulator</CardTitle>
              <p className="text-ink-soft text-sm font-sans mt-2">Step through the process of establishing a secure connection.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={reset}>Restart</Button>
              <Button onClick={nextStep} disabled={state.isSecure}>Next Step</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold block text-ink">Network Traffic (Wireshark View)</label>
              <div className="bg-ink text-paper rounded-[4px] p-4 min-h-[300px] flex flex-col gap-2 font-mono text-sm max-h-[400px] overflow-y-auto shadow-inner">
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

            <div className="space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold block text-ink">Connection State</label>
              <div className="flex flex-col items-center justify-center p-8 border border-rule bg-card h-[300px] rounded-[4px]">
                {state.isSecure ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <div className="text-2xl font-black text-ok mb-2 font-mono">SECURE</div>
                    <p className="text-ink-soft text-sm font-sans">Symmetric Key established. Perfect Forward Secrecy active.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50">🔓</div>
                    <div className="text-2xl font-black text-bad mb-2 font-mono">UNSECURE</div>
                    <p className="text-ink-soft text-sm font-sans">Currently exchanging parameters in plaintext over the internet.</p>
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
