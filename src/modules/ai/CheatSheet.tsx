import { Card, CardContent } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function AICheatSheet() {
  return (
    <div className="space-y-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-serif mb-8 text-ink border-b border-rule pb-4">AI Security Recap</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Top Vulnerabilities</h3>
              <ul className="space-y-4">
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Prompt Injection</strong> <span className="text-ink">Bypassing system instructions via malicious natural language.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Data Poisoning</strong> <span className="text-ink">Attacking the model during training by introducing malicious data.</span></li>
                <li><strong className="text-signal font-mono text-[11px] uppercase tracking-wider mr-2">Model Inversion</strong> <span className="text-ink">Extracting private or sensitive data memorized during training.</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink-soft mb-6 border-b border-rule pb-2">Defensive Concepts</h3>
              <ul className="space-y-4 text-ink">
                <li><strong className="font-mono text-[11px]">LLM Firewalls:</strong> Proxies that analyze prompts and responses for malicious intent.</li>
                <li><strong className="font-mono text-[11px]">RLHF:</strong> Reinforcement Learning from Human Feedback. Trains models to refuse harmful requests.</li>
                <li><strong className="font-mono text-[11px]">Sandboxing:</strong> Executing AI-generated code or tools in isolated environments.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Callout variant="warning" title="Direct vs Indirect Injection">
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-sm">
                <li><strong>Direct (Jailbreak):</strong> The user actively types malicious commands (e.g. <em>&quot;Ignore rules...&quot;</em>).</li>
                <li><strong>Indirect:</strong> The user asks the AI to process an external file/webpage containing hidden malicious commands. The AI unknowingly executes them.</li>
              </ul>
            </Callout>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
