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
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>TLS Handshake Simulator</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reset}>Restart</Button>
              <Button onClick={nextStep} disabled={state.isSecure}>Next Step</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold">Network Traffic (Wireshark View)</h3>
              <div className="bg-card border rounded-lg p-4 min-h-[300px] flex flex-col gap-2 font-mono text-sm max-h-[400px] overflow-y-auto shadow-inner">
                {state.messages.length === 0 ? (
                  <div className="text-muted-foreground italic">Click &quot;Next Step&quot; to begin connection to https://secure-bank.com...</div>
                ) : (
                  state.messages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded ${msg.startsWith('Client') ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {msg}
                    </div>
                  ))
                )}
                {state.isSecure && (
                  <div className="p-2 rounded bg-green-500/20 text-green-600 font-bold mt-4 animate-pulse">
                    🔒 Application Data (Encrypted payload)
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Connection State</h3>
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-card h-[300px]">
                {state.isSecure ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <div className="text-2xl font-black text-green-500 mb-2">SECURE</div>
                    <p className="text-muted-foreground text-sm">Symmetric Key established. Perfect Forward Secrecy active.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50">🔓</div>
                    <div className="text-2xl font-black text-destructive mb-2">UNSECURE</div>
                    <p className="text-muted-foreground text-sm">Currently exchanging parameters in plaintext over the internet.</p>
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
