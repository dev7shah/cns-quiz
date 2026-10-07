import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function AIComplexity() {
  const data = [
    { algo: "Prompt Injection", time: "O(1)", space: "O(1)", meaning: "Appended to context window. Immediate compromise.", topic: "ai" },
    { algo: "Data Poisoning", time: "O(T)", space: "O(D)", meaning: "T=Training time, D=Dataset size. Extremely slow to execute, but persistent.", topic: "ai" },
    { algo: "Model Inversion", time: "O(Q)", space: "O(R)", meaning: "Q=Queries, R=Responses. Reconstructs private training data.", topic: "ai" },
  ]

  return (
    <div className="space-y-8 p-2">
      <Card>
        <CardHeader><CardTitle>AI Attack Complexity</CardTitle></CardHeader>
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
                  <TableCell className="font-medium">{row.algo}</TableCell>
                  <TableCell className="font-mono text-primary">{row.time}</TableCell>
                  <TableCell className="font-mono">{row.space}</TableCell>
                  <TableCell>{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>The Context Window Problem</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">
            LLMs process information using a &quot;Context Window&quot;. This window contains the developer&apos;s System Prompt, followed by the User&apos;s Prompt.
          </p>
          <p className="mb-4">
            Because the entire window is fed into the neural network at once as a single array of tokens, the model has no inherent way to distinguish which tokens came from the trusted developer and which came from the untrusted user. It simply tries to predict the next word that best continues the document.
          </p>
          <p className="text-destructive font-bold">
            This lack of separation between Code (System Prompt) and Data (User Input) is exactly what causes SQL Injection in databases. Now, it&apos;s causing Prompt Injection in AI.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
