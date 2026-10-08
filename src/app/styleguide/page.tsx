import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Callout } from '@/components/ui/Callout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Stepper } from '@/components/ui/Stepper';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default function Styleguide() {
  return (
    <div className="mx-auto max-w-5xl p-8 space-y-12 pb-24">
      <header>
        <h1 className="font-serif text-5xl mb-2 text-ink">Lab Notebook Styleguide</h1>
        <p className="text-ink-soft">Core components and tokens for the CNS Security Lab.</p>
      </header>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Typography</h2>
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-ink-soft mb-1 block">Display (Instrument Serif)</span>
            <h1 className="font-serif text-6xl text-ink">The quick brown fox</h1>
          </div>
          <div>
            <span className="font-mono text-xs text-ink-soft mb-1 block">UI / Body (Geist Sans)</span>
            <p className="font-sans text-base leading-relaxed max-w-[68ch] text-ink">
              This is the standard body text used across the application. It has a maximum line length of 68 characters to ensure optimal readability. The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-ink-soft mb-1 block">Code / Labels (JetBrains Mono)</span>
            <code className="font-mono text-[13px] bg-card px-2 py-1 border border-rule text-ink">
              const example = &quot;Hello World&quot;;
            </code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Paper", bg: "bg-paper", text: "text-ink" },
            { name: "Card", bg: "bg-card", text: "text-ink" },
            { name: "Ink", bg: "bg-ink", text: "text-paper" },
            { name: "Ink Soft", bg: "bg-ink-soft", text: "text-white" },
            { name: "Rule", bg: "bg-rule", text: "text-ink" },
            { name: "Signal", bg: "bg-signal", text: "text-white" },
            { name: "OK", bg: "bg-ok", text: "text-white" },
            { name: "Warn", bg: "bg-warn", text: "text-ink" },
            { name: "Bad", bg: "bg-bad", text: "text-white" },
            { name: "Info", bg: "bg-info", text: "text-white" },
          ].map(color => (
            <div key={color.name} className={`p-4 ${color.bg} ${color.text} border border-rule font-mono text-xs`}>
              {color.name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Primary Signal</Button>
          <Button variant="secondary">Secondary Card</Button>
          <Button variant="outline">Outline Paper</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Cards</h2>
          <Card>
            <CardHeader>
              <CardTitle>RSA Encryption</CardTitle>
              <CardDescription>Public key cryptography</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The padlock anyone can snap shut, but only you hold the key to open.</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Tabs</h2>
          <Tabs defaultValue="learn">
            <TabsList>
              <TabsTrigger value="learn">01 Learn</TabsTrigger>
              <TabsTrigger value="try">02 Try it</TabsTrigger>
              <TabsTrigger value="cost">03 Cost</TabsTrigger>
            </TabsList>
            <TabsContent value="learn" className="pt-4">
              <p>Learn content goes here.</p>
            </TabsContent>
            <TabsContent value="try" className="pt-4">
              <p>Playground goes here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Callouts</h2>
        <div className="space-y-4">
          <Callout variant="default" title="Note">This is a default margin note for extra context.</Callout>
          <Callout variant="warning" title="Exam Tip">Salting prevents rainbow table attacks by adding randomness.</Callout>
          <Callout variant="danger" title="Watch Out">Do not roll your own crypto in production.</Callout>
          <Callout variant="success" title="Real World">HTTPS uses TLS 1.3 for secure communication.</Callout>
          <Callout variant="info" title="Info">This is informational content.</Callout>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Stepper</h2>
        <Stepper 
          steps={['Setup', 'Exchange', 'Encrypt', 'Finish']} 
          currentStep={1} 
        />
      </section>

      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider mb-4 border-b border-rule pb-2 text-ink">Table</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Time Complexity</TableHead>
                <TableHead>Space Complexity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">RSA KeyGen</TableCell>
                <TableCell>O(log³ n)</TableCell>
                <TableCell>O(log n)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">AES-256</TableCell>
                <TableCell>O(1) block</TableCell>
                <TableCell>O(1)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

    </div>
  );
}
