"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Stepper } from "@/components/ui/Stepper";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";

// Visual Grammar & Scene Engine
import { ActorKind, Scene } from "@/components/scene/types";
import { ActorGlyph } from "@/components/scene/ActorGlyphs";
import { ObjectToken } from "@/components/scene/ObjectTokens";
import { ScenePlayer } from "@/components/scene/ScenePlayer";

// Specialized Figure Components
import { SequenceDiagram } from "@/components/figures/SequenceDiagram";
import { StateGrid } from "@/components/figures/StateGrid";
import { FeistelDiagram } from "@/components/figures/FeistelDiagram";
import { ModeDiagram } from "@/components/figures/ModeDiagram";
import { BitStrip } from "@/components/figures/BitStrip";
import { StackDiagram } from "@/components/figures/StackDiagram";
import { CurvePlot } from "@/components/figures/CurvePlot";
import { PacketBuilder } from "@/components/figures/PacketBuilder";
import { TopologyDiagram } from "@/components/figures/TopologyDiagram";
import { ChainDiagram } from "@/components/figures/ChainDiagram";
import { GrowthChart } from "@/components/figures/GrowthChart";
import { MathBlock } from "@/components/figures/MathBlock";

export default function Styleguide() {
  const allActorKinds: { kind: ActorKind; name: string }[] = [
    { kind: "alice", name: "Alice (Sender)" },
    { kind: "bob", name: "Bob (Receiver)" },
    { kind: "eve", name: "Eve (Passive)" },
    { kind: "mallory", name: "Mallory (Attacker)" },
    { kind: "server", name: "Server" },
    { kind: "client", name: "Client" },
    { kind: "ca", name: "Certificate Auth" },
    { kind: "kdc", name: "KDC / AS / TGS" },
    { kind: "router", name: "Router" },
    { kind: "switch", name: "Switch" },
    { kind: "firewall", name: "Firewall" },
    { kind: "ids", name: "IDS / Sensor" },
    { kind: "honeypot", name: "Honeypot" },
    { kind: "cloud", name: "Cloud VPC" },
    { kind: "db", name: "Database" },
    { kind: "app", name: "Application" },
  ];

  // Sample Scene for the Declarative Scene Engine
  const sampleSymmetricScene: Scene = {
    id: "styleguide-symmetric-demo",
    title: "Symmetric Encryption & Passive Eavesdropping",
    viewBox: "0 0 800 450",
    actors: [
      { id: "alice", kind: "alice", label: "Alice", pos: { x: 140, y: 220 } },
      { id: "eve", kind: "eve", label: "Eve (Passive)", pos: { x: 400, y: 110 } },
      { id: "bob", kind: "bob", label: "Bob", pos: { x: 660, y: 220 } },
    ],
    objects: [
      { id: "plain1", kind: "plain", label: "M", value: "TRANSFER $500", at: { x: 140, y: 280 } },
      { id: "key1", kind: "key-shared", label: "K_AB", at: { x: 140, y: 340 } },
      { id: "key2", kind: "key-shared", label: "K_AB", at: { x: 660, y: 340 } },
    ],
    zones: [
      {
        id: "eavesdrop-zone",
        label: "Insecure Public Channel (Eve Eavesdrops)",
        rect: { x: 260, y: 60, width: 280, height: 260 },
        dashed: true,
        tone: "bad",
      },
    ],
    legend: [
      "Alice / Bob: Legitimate endpoints",
      "Eve: Passive observer on the wire",
      "K_AB: Pre-shared secret key",
      "Red boundary: Insecure network channel",
    ],
    steps: [
      {
        caption: "Alice prepares a plaintext message to send Bob using their pre-shared key.",
        eli5: "Alice writes a private letter to Bob. Both already have identical keys.",
        actions: [
          { do: "say", actor: "alice", text: "Ready to transmit." },
          { do: "highlight", target: ["plain1"], tone: "signal" },
        ],
      },
      {
        caption: "Alice encrypts the plaintext with the shared key, creating ciphertext.",
        eli5: "Alice locks the letter in a box using her key. The message becomes unreadable.",
        actions: [
          { do: "transform", obj: "plain1", into: { kind: "cipher", value: "7A9F04B1", tone: "signal" } },
          { do: "pulse", target: "plain1" },
          { do: "formula", tex: "C = E(K_{AB}, M)", highlight: ["E", "K_{AB}", "M"] },
        ],
      },
      {
        caption: "The ciphertext crosses the public channel; Eve can observe it but cannot read it.",
        eli5: "The locked box passes in front of Eve, but she cannot open it without the key.",
        actions: [
          { do: "zone", id: "eavesdrop-zone", show: true },
          { do: "move", obj: "plain1", to: { x: 400, y: 280 } },
          { do: "say", actor: "eve", text: "Only seeing random bytes!" },
        ],
      },
      {
        caption: "Bob receives the ciphertext and decrypts it with his matching shared key.",
        eli5: "Bob uses his identical key to unlock the box and read Alice's original letter.",
        actions: [
          { do: "move", obj: "plain1", to: { x: 660, y: 280 } },
          { do: "transform", obj: "plain1", into: { kind: "plain", value: "TRANSFER $500", tone: "ok" } },
          { do: "say", actor: "bob", text: "Decrypted successfully." },
          { do: "formula", tex: "M = D(K_{AB}, C)", highlight: ["D", "K_{AB}", "C"] },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8 space-y-16 pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-rule pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-signal font-bold mb-2">
          Design System & Visual Primitives
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-ink leading-tight mb-3">
          Lab Notebook Styleguide
        </h1>
        <p className="text-ink-soft text-base max-w-3xl leading-relaxed">
          The unified pictorial teaching system for Computer Network Security. Warm paper background, editorial typography, precise 1px rules, offset shadows, and declarative inline SVG figures.
        </p>
      </header>

      {/* SECTION 1: VISUAL GRAMMAR */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">1. Visual Grammar: Actors & Glyphs</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Consistent line-drawn glyphs for every network role across all 6 modules
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 p-4 bg-paper border border-ink rounded-[2px] shadow-[2px_2px_0_var(--rule)]">
          {allActorKinds.map(item => (
            <div key={item.kind} className="flex flex-col items-center p-2 rounded hover:bg-card transition-colors">
              <ActorGlyph kind={item.kind} size={48} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink text-center mt-2 font-bold truncate w-full" title={item.name}>
                {item.kind}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: DATA OBJECTS & TOKENS */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">2. Visual Grammar: Data Objects & Tokens</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Standard visual chips for plaintext, ciphertext, keys, hashes, packets, and certificates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-6 bg-paper border border-ink rounded-[2px] shadow-[2px_2px_0_var(--rule)]">
          <ObjectToken kind="plain" label="HELLO WORLD" />
          <ObjectToken kind="cipher" label="7A9F04B1" />
          <ObjectToken kind="key-pub" label="K_pub (RSA)" />
          <ObjectToken kind="key-priv" label="K_priv (RSA)" />
          <ObjectToken kind="key-shared" label="K_shared (AES)" />
          <ObjectToken kind="hash" label="SHA-256 Digest" />
          <ObjectToken kind="sig" label="RSA-Sig(M)" />
          <ObjectToken kind="cert" label="*.google.com" />
          <ObjectToken kind="packet" label="192.168.1.1" value="SYN" />
          <ObjectToken kind="ticket" label="TGS Ticket" />
          <ObjectToken kind="bits" value="10110010" />
        </div>
      </section>

      {/* SECTION 3: DECLARATIVE SCENE ENGINE */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">3. Declarative Scene Engine</h2>
            <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
              Lessons are pure data. Reversible scrubber, autoplay, ELI5 captions, and static SVG export.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-signal px-2 py-0.5 border border-signal bg-card rounded-xs">
              Keyboard: ← → Space R E
            </span>
          </div>
        </div>

        <ScenePlayer scene={sampleSymmetricScene} />
      </section>

      {/* SECTION 4: PROTOCOL SEQUENCE DIAGRAM */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">4. Protocol Sequence Diagram</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Timed lifelines and message arrows (TLS 1.3 Handshake demonstration)
          </p>
        </div>

        <SequenceDiagram
          title="TLS 1.3 Handshake Protocol (1-RTT Key Exchange)"
          actors={[
            { id: "client", label: "Client (Browser)", subLabel: "192.168.1.100" },
            { id: "server", label: "Server (Nginx)", subLabel: "203.0.113.80" },
          ]}
          messages={[
            {
              from: "client",
              to: "server",
              label: "ClientHello",
              subLabel: "Supported Ciphers + Client Random + ECDH KeyShare (P-256)",
              tone: "signal",
              note: "Unencrypted Start",
            },
            {
              from: "server",
              to: "server",
              label: "Compute Shared Secret",
              subLabel: "ECDH Shared Secret derived = g^{ab} mod p",
              tone: "info",
              note: "Local Math",
            },
            {
              from: "server",
              to: "client",
              label: "ServerHello",
              subLabel: "Selected Cipher + Server Random + ECDH KeyShare (P-256)",
              tone: "signal",
            },
            {
              from: "server",
              to: "client",
              label: "{EncryptedExtensions}",
              subLabel: "ALPN, Server Parameters",
              tone: "ok",
              dashed: true,
            },
            {
              from: "server",
              to: "client",
              label: "{Certificate + CertificateVerify}",
              subLabel: "X.509 Chain + Server Signature",
              tone: "ok",
              dashed: true,
            },
            {
              from: "server",
              to: "client",
              label: "{Finished}",
              subLabel: "HMAC of Handshake Transcript",
              tone: "ok",
              dashed: true,
              note: "Handshake Complete",
            },
            {
              from: "client",
              to: "server",
              label: "[Application Data]",
              subLabel: "GET /dashboard HTTP/1.1 (AES-256-GCM)",
              tone: "signal",
              note: "Secure Channel",
            },
          ]}
        />
      </section>

      {/* SECTION 5: STATE GRID */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">5. State Grid Matrix</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            N×M interactive coordinate matrix for Playfair 5×5 and AES 4×4 State
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StateGrid
            title="Playfair 5×5 Key Matrix"
            subTitle="Key: 'MONARCHY' (I/J combined in cell 1,4)"
            rows={5}
            cols={5}
            colLabels={["0", "1", "2", "3", "4"]}
            rowLabels={["0", "1", "2", "3", "4"]}
            cells={[
              ["M", "O", "N", "A", "R"],
              ["C", "H", "Y", "B", "D"],
              ["E", "F", "G", "I/J", "K"],
              ["L", "P", "Q", "S", "T"],
              ["U", "V", "W", "X", "Z"],
            ]}
            highlights={[
              { r: 0, c: 3, tone: "signal", label: "A" },
              { r: 3, c: 3, tone: "signal", label: "S" },
              { r: 1, c: 1, tone: "ok", label: "H" },
            ]}
          />

          <StateGrid
            title="AES-128 4×4 State Matrix"
            subTitle="16-byte state undergoing ShiftRows / SubBytes"
            rows={4}
            cols={4}
            colLabels={["Col 0", "Col 1", "Col 2", "Col 3"]}
            rowLabels={["Row 0", "Row 1", "Row 2", "Row 3"]}
            cells={[
              ["0x19", "0xA0", "0x9A", "0xE9"],
              ["0x3D", "0xF4", "0xC6", "0xF8"],
              ["0xE3", "0xE2", "0x8D", "0x48"],
              ["0xBE", "0x2B", "0x2A", "0x08"],
            ]}
            highlights={[
              { r: 1, c: 0, tone: "signal", label: "Rot 1" },
              { r: 2, c: 0, tone: "info", label: "Rot 2" },
              { r: 3, c: 0, tone: "warn", label: "Rot 3" },
            ]}
          />
        </div>
      </section>

      {/* SECTION 6: FEISTEL CIPHER DIAGRAM */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">6. Feistel Cipher Structure</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Reversible round function, subkey scheduling, XOR mixing, and register swaps
          </p>
        </div>

        <FeistelDiagram />
      </section>

      {/* SECTION 7: BLOCK CIPHER MODES */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">7. Block Cipher Modes of Operation</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            ECB, CBC, CFB, OFB, and CTR mode chaining with error propagation
          </p>
        </div>

        <ModeDiagram />
      </section>

      {/* SECTION 8: BITWISE ENGINE & AVALANCHE */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">8. Bitwise Strip & Avalanche Heatmap</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Interactive XOR, left shift, circular rotation, and Hamming distance calculator
          </p>
        </div>

        <BitStrip />
      </section>

      {/* SECTION 9: STACK DIAGRAM & BUFFER OVERFLOW */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">9. Stack Diagram & Protocol Layers</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Interactive memory buffer overflow simulation (Canary smash) & TCP/IP security model
          </p>
        </div>

        <StackDiagram />
      </section>

      {/* SECTION 10: ELLIPTIC CURVE PLOT */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">10. Elliptic Curve over Finite Field</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Weierstrass curve dot grid with interactive point addition P + Q over F_17
          </p>
        </div>

        <CurvePlot />
      </section>

      {/* SECTION 11: PACKET BUILDER */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">11. Packet Builder & IPsec Inspector</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            L3/L4 datagram framing with IP spoofing, TCP scanning flags, and IPsec AH / ESP encapsulation
          </p>
        </div>

        <PacketBuilder />
      </section>

      {/* SECTION 12: DEFENSE-IN-DEPTH TOPOLOGY */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">12. Defense-in-Depth Network Topology</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            WAN, DMZ, and LAN segmentation with clickable node security inspectors
          </p>
        </div>

        <TopologyDiagram />
      </section>

      {/* SECTION 13: CHAIN DIAGRAM */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">13. Chain Diagram (PKI & Hash Chain)</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Certificate authority verification paths and blockchain hash dependency tampering
          </p>
        </div>

        <ChainDiagram />
      </section>

      {/* SECTION 14: GROWTH CHART */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">14. Algorithmic Complexity Growth Chart</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Logarithmic scale comparison of O(1), O(log n), O(n), O(n²), and O(2ⁿ) with input slider
          </p>
        </div>

        <GrowthChart />
      </section>

      {/* SECTION 15: MATH BLOCK */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">15. Mathematical Formulations & Matrices</h2>
          <p className="text-ink-soft text-xs font-mono uppercase tracking-wider">
            Proper superscripts, subscripts, modular arithmetic, and bracketed linear algebra
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <MathBlock
            expression="C = M^e (mod n)"
            highlightTerms={["M^e", "C"]}
            caption="RSA Encryption Formula"
          />
          <MathBlock
            expression="M = C^d (mod n)"
            highlightTerms={["C^d", "M"]}
            caption="RSA Decryption Formula"
          />
          <MathBlock
            matrix={[
              [3, 3],
              [2, 5],
            ]}
            caption="Hill Cipher Key Matrix K (det = 9)"
          />
          <MathBlock
            expression="E(x) = (ax + b) (mod 26)"
            highlightTerms={["ax", "26"]}
            caption="Affine Cipher Encryption"
          />
        </div>
      </section>

      {/* SECTION 16: BASE UI COMPONENTS */}
      <section className="space-y-6">
        <div className="border-b border-rule pb-2">
          <h2 className="font-serif text-2xl font-bold text-ink">16. Base Lab Notebook Components</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider mb-3 text-ink-soft">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Primary Signal</Button>
              <Button variant="secondary">Secondary Card</Button>
              <Button variant="outline">Outline Paper</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider mb-3 text-ink-soft">Callouts</h3>
            <div className="space-y-2">
              <Callout variant="default" title="Exam Words">
                Stateful firewalls maintain connection tables to match return packets.
              </Callout>
              <Callout variant="warning" title="Watch Out">
                ECB mode preserves plaintext patterns and leaks bitmap structures.
              </Callout>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider mb-3 text-ink-soft">Card & Stepper</h3>
            <Card>
              <CardHeader>
                <CardTitle>Lesson Progression</CardTitle>
                <CardDescription>Step-by-step concept scaffolding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Stepper steps={["Picture it", "See it work", "Say it"]} currentStep={1} />
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider mb-3 text-ink-soft">Tabs & Table</h3>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-2">
                <p className="text-xs text-ink-soft">Structured tab content panel.</p>
              </TabsContent>
              <TabsContent value="table" className="pt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Complexity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">Caesar</TableCell>
                      <TableCell className="font-mono text-xs">O(26)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
