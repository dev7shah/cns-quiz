import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function AIComplexity() {
  const data = [
    { algo: "Prompt Injection", time: "O(1)", space: "O(1)", meaning: "Appended to context window. Immediate compromise." },
    { algo: "Data Poisoning", time: "O(T)", space: "O(D)", meaning: "T=Training time, D=Dataset size. Extremely slow to execute, but persistent." },
    { algo: "Model Inversion", time: "O(Q)", space: "O(R)", meaning: "Q=Queries, R=Responses. Reconstructs private training data." },
  ]

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">AI Attack Complexity</CardTitle>
          <p className="text-ink-soft text-sm font-sans mt-2">The computational cost of executing different attacks against LLMs.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attack Vector</TableHead>
                <TableHead>Time Complexity</TableHead>
                <TableHead>Space Complexity</TableHead>
                <TableHead>Plain English Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{row.algo}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.time}</TableCell>
                  <TableCell className="font-mono text-[11px] text-signal font-bold">{row.space}</TableCell>
                  <TableCell className="text-sm">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">The Context Window Problem</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-lg text-ink leading-relaxed">
          <p className="mb-4">
            LLMs process information using a &quot;Context Window&quot;. This window contains the developer&apos;s System Prompt, followed by the User&apos;s Prompt.
          </p>
          <p className="mb-4">
            Because the entire window is fed into the neural network at once as a single array of tokens, the model has no inherent way to distinguish which tokens came from the trusted developer and which came from the untrusted user.
          </p>
          <p>
            This lack of separation between <strong className="text-signal bg-signal/10 px-1 border border-signal">Code and Data</strong> is exactly what causes SQL Injection in databases. Now, it&apos;s causing Prompt Injection in AI.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
