"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { TOAModuleId } from "@/lib/syllabus/toaSyllabus"
import { Play, RotateCcw, Check, Sparkles, GitBranch, ArrowRight, Layers, Cpu, Terminal, ShieldCheck } from "lucide-react"

export default function TOAPlayground({ moduleId }: { moduleId: TOAModuleId }) {
  if (moduleId === 'toa-m1') {
    return <TOA1Playground />
  }
  if (moduleId === 'toa-m2') {
    return <TOA2Playground />
  }
  if (moduleId === 'toa-m3') {
    return <TOA3Playground />
  }
  if (moduleId === 'toa-m4') {
    return <TOA4Playground />
  }
  if (moduleId === 'toa-m5') {
    return <TOA5Playground />
  }
  return <TOA6Playground />
}

// ========================================================
// MODULE 1: INTERACTIVE DFA / NFA STATE MACHINE SIMULATOR
// ========================================================
function TOA1Playground() {
  const [testString, setTestString] = useState("101")
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // DFA definition: Language L = { w | w ends with '01' } over {0, 1}
  // States: q0 (start), q1 (seen 0), q2 (seen 01 - accept)
  // Transitions:
  // q0: 0 -> q1, 1 -> q0
  // q1: 0 -> q1, 1 -> q2
  // q2: 0 -> q1, 1 -> q0
  const states = ["q0", "q1", "q2"]
  const acceptStates = ["q2"]

  const transitions: Record<string, Record<string, string>> = {
    q0: { "0": "q1", "1": "q0" },
    q1: { "0": "q1", "1": "q2" },
    q2: { "0": "q1", "1": "q0" }
  }

  // Calculate full trace
  const trace = useMemo(() => {
    const steps: { state: string; charRead: string | null }[] = [{ state: "q0", charRead: null }]
    let current = "q0"
    for (let i = 0; i < testString.length; i++) {
      const char = testString[i]
      if (char === "0" || char === "1") {
        current = transitions[current][char]
        steps.push({ state: current, charRead: char })
      }
    }
    return steps
  }, [testString])

  const currentState = trace[Math.min(activeStep, trace.length - 1)].state
  const isAccepted = activeStep === trace.length - 1 && acceptStates.includes(currentState)
  const isRejected = activeStep === trace.length - 1 && !acceptStates.includes(currentState)

  const handleNext = () => {
    if (activeStep < trace.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">Automata Laboratory</span>
            <span className="text-signal font-bold">L = Strings ending in &quot;01&quot;</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Interactive Deterministic Finite Automaton (DFA) Simulator
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Watch state transitions step-by-step as each symbol is read from the tape.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Controls & Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-paper border border-rule font-mono text-xs">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-bold text-ink whitespace-nowrap">Input Tape (Σ = &#123;0, 1&#125;):</span>
              <input
                type="text"
                value={testString}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^01]/g, "").slice(0, 15)
                  setTestString(val)
                  setActiveStep(0)
                }}
                className="px-3 py-1.5 border border-ink bg-card text-ink font-mono font-bold text-sm tracking-widest w-full max-w-[200px]"
                placeholder="e.g. 101"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                disabled={activeStep >= trace.length - 1}
                className="px-4 py-1.5 bg-signal text-paper font-bold uppercase hover:bg-signal/90 disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Step Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 border border-ink bg-card text-ink font-bold hover:bg-paper cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Tape Visualizer */}
          <div className="p-4 bg-card border border-ink space-y-2">
            <span className="font-mono text-[11px] uppercase font-bold text-ink-soft block">
              Execution Tape &amp; Read Head:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto pb-2 font-mono">
              <div className="p-2 border border-rule bg-paper text-ink-soft text-xs text-center min-w-[36px]">
                ^
              </div>
              {testString.split("").map((ch, idx) => {
                const isRead = idx < activeStep
                const isCurrent = idx === activeStep - 1

                return (
                  <div
                    key={idx}
                    className={`p-2 border text-center text-sm font-bold min-w-[36px] transition-all ${
                      isCurrent
                        ? "border-signal bg-signal text-paper scale-105 shadow-xs"
                        : isRead
                        ? "border-ok bg-ok/10 text-ok"
                        : "border-rule bg-paper text-ink"
                    }`}
                  >
                    {ch}
                  </div>
                )
              })}
              <div className="p-2 border border-dashed border-rule bg-paper/50 text-ink-soft text-xs text-center min-w-[36px]">
                $
              </div>
            </div>
          </div>

          {/* Visual State Diagram Graph */}
          <div className="p-6 bg-paper border-2 border-ink space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-ink uppercase">Live State Graph:</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-signal inline-block" /> Active State
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border-2 border-ok inline-block" /> Accept State
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {states.map((st) => {
                const isActive = currentState === st
                const isAccept = acceptStates.includes(st)

                return (
                  <div
                    key={st}
                    className={`p-5 border-2 transition-all flex flex-col items-center justify-center space-y-2 text-center rounded-sm ${
                      isActive
                        ? "border-signal bg-signal/10 shadow-[4px_4px_0_var(--signal)] scale-105"
                        : isAccept
                        ? "border-ok bg-card"
                        : "border-ink bg-card"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-lg border-2 ${
                        isAccept ? "border-double border-4 border-ok" : "border-ink"
                      } ${isActive ? "bg-signal text-paper" : "bg-paper text-ink"}`}
                    >
                      {st}
                    </div>

                    <div className="font-mono text-xs">
                      {st === "q0" && <span className="text-signal font-bold">(Start State)</span>}
                      {st === "q1" && <span className="text-ink-soft">Seen &quot;0&quot;</span>}
                      {st === "q2" && <span className="text-ok font-bold">ACCEPT (Seen &quot;01&quot;)</span>}
                    </div>

                    <div className="w-full pt-2 border-t border-rule font-mono text-[10px] text-ink-soft space-y-0.5 text-left">
                      <div>δ({st}, 0) ➔ <strong>{transitions[st]["0"]}</strong></div>
                      <div>δ({st}, 1) ➔ <strong>{transitions[st]["1"]}</strong></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Outcome Status */}
          <div className="p-4 border border-ink bg-card flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="text-ink-soft">Current Configuration: </span>
              <strong className="text-ink text-sm">State {currentState}</strong>
              <span className="text-ink-soft ml-2">
                (Step {activeStep} of {trace.length - 1})
              </span>
            </div>

            {activeStep === trace.length - 1 && (
              <div>
                {isAccepted ? (
                  <span className="px-3 py-1 bg-ok text-paper font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Check className="h-4 w-4" /> STRING ACCEPTED by DFA
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-bad text-paper font-bold uppercase tracking-wider shadow-xs">
                    ✕ STRING REJECTED by DFA
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================
// MODULE 2: REGEX TO FINITE AUTOMATA INTERACTIVE EXPLORER
// ========================================================
function TOA2Playground() {
  const [selectedRegex, setSelectedRegex] = useState<string>("(a+b)*ab")
  const [testWord, setTestWord] = useState<string>("aab")

  const samples = [
    { exp: "(a+b)*ab", desc: "Strings ending in 'ab'", accepts: ["ab", "aab", "bab", "bbab"], rejects: ["a", "b", "aba", "ba"] },
    { exp: "a*b*", desc: "Any number of a's followed by b's", accepts: ["a", "b", "aa", "abb", "ε"], rejects: ["ba", "aba", "bab"] },
    { exp: "(00+11)*", desc: "Even blocks of 0s and 1s", accepts: ["00", "11", "0011", "110000"], rejects: ["0", "1", "01", "10"] }
  ]

  const activeSample = samples.find(s => s.exp === selectedRegex) || samples[0]

  return (
    <div className="space-y-6 font-mono text-xs">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">RegEx Lab</span>
            <span className="text-signal font-bold">Thompson Construction &amp; Arden&apos;s Theorem</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Regular Expressions to State Transition Machine Studio
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Explore conversion between algebraic Regular Expressions and Finite Automata.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Sample Selector */}
          <div className="space-y-2">
            <span className="font-bold text-ink uppercase">Select Language Regular Expression:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {samples.map((s) => (
                <button
                  key={s.exp}
                  onClick={() => setSelectedRegex(s.exp)}
                  className={`p-3 border text-left transition-colors cursor-pointer ${
                    selectedRegex === s.exp
                      ? "border-signal bg-signal text-paper shadow-xs font-bold"
                      : "border-rule bg-paper text-ink hover:border-ink"
                  }`}
                >
                  <div className="text-sm font-bold">{s.exp}</div>
                  <div className="text-[10px] opacity-80 font-sans mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Expression Details Card */}
          <div className="p-5 bg-paper border border-ink space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-2">
              <div>
                <span className="text-[10px] uppercase text-ink-soft block font-bold">Selected Expression:</span>
                <span className="text-lg font-bold text-signal font-mono">{activeSample.exp}</span>
              </div>
              <span className="px-2 py-0.5 bg-card border border-rule text-ink-soft text-[11px]">
                {activeSample.desc}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-card border border-ok/30 space-y-1">
                <span className="text-ok font-bold uppercase text-[10px] block">✓ Sample Accepted Words:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSample.accepts.map((w) => (
                    <span key={w} className="px-2 py-0.5 bg-ok/10 border border-ok/30 text-ok font-bold">
                      &quot;{w}&quot;
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-card border border-bad/30 space-y-1">
                <span className="text-bad font-bold uppercase text-[10px] block">✕ Sample Rejected Words:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSample.rejects.map((w) => (
                    <span key={w} className="px-2 py-0.5 bg-bad/10 border border-bad/30 text-bad font-bold">
                      &quot;{w}&quot;
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-card border border-rule text-xs space-y-1 font-sans">
              <strong className="text-ink font-mono uppercase text-[10px] block">Arden&apos;s Theorem Identity:</strong>
              <p className="text-ink-soft">
                For state equation <code className="font-mono text-signal font-bold">R = Q + RP</code> (where ε ∉ P), the closed form equivalence is <code className="font-mono text-ok font-bold">R = QP*</code>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================
// MODULE 3: PUMPING LEMMA VISUAL DECOMPOSITION STUDIO
// ========================================================
function TOA3Playground() {
  const [p, setP] = useState(3)
  const [iVal, setIVal] = useState(2)

  // Language L = { 0^n 1^n | n >= 0 }
  // String s = 0^p 1^p
  // Split s = xyz with |xy| <= p, |y| >= 1
  // y consists entirely of 0s: y = 0^k (1 <= k <= p)
  const [k, setK] = useState(1)

  const numZeros = p
  const numOnes = p

  const xPart = "0".repeat(p - k)
  const yPart = "0".repeat(k)
  const zPart = "1".repeat(p)

  const pumpedString = xPart + yPart.repeat(iVal) + zPart
  const pumpedZeros = (p - k) + (k * iVal)
  const pumpedOnes = p
  const isInLanguage = pumpedZeros === pumpedOnes

  return (
    <div className="space-y-6 font-mono text-xs">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">Non-Regularity Proof Lab</span>
            <span className="text-signal font-bold">Language L = &#123; 0ⁿ 1ⁿ | n ≥ 0 &#125;</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Pumping Lemma Adversary Decomposition Simulator
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Demonstrate why {`0ⁿ 1ⁿ`} cannot be recognized by any finite automaton by pumping string partitions.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-paper border border-rule">
            <div className="space-y-1">
              <label className="block text-ink font-bold">1. Pumping Length (p): {p}</label>
              <input
                type="range"
                min={2}
                max={5}
                value={p}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setP(val)
                  if (k > val) setK(1)
                }}
                className="w-full accent-signal"
              />
              <span className="text-[10px] text-ink-soft block">String s = 0^{p} 1^{p} (|s| = {2 * p})</span>
            </div>

            <div className="space-y-1">
              <label className="block text-ink font-bold">2. |y| Substring Length: {k}</label>
              <input
                type="range"
                min={1}
                max={p}
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="w-full accent-signal"
              />
              <span className="text-[10px] text-ink-soft block">|xy| = {p} ≤ p, |y| = {k} ≥ 1</span>
            </div>

            <div className="space-y-1">
              <label className="block text-ink font-bold">3. Pump Count (i): {iVal}</label>
              <input
                type="range"
                min={0}
                max={4}
                value={iVal}
                onChange={(e) => setIVal(Number(e.target.value))}
                className="w-full accent-signal"
              />
              <span className="text-[10px] text-ink-soft block">
                {iVal === 0 ? "Pumping Down (i = 0)" : `Repeating y ${iVal} times`}
              </span>
            </div>
          </div>

          {/* Partition Breakdown */}
          <div className="p-4 bg-card border border-ink space-y-3">
            <span className="font-bold text-ink uppercase block">Decomposition s = x · y · z:</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 border border-rule bg-paper">
                <span className="text-[10px] text-ink-soft block font-bold">x (0^{p - k})</span>
                <span className="font-bold text-ink text-sm">&quot;{xPart || "ε"}&quot;</span>
              </div>
              <div className="p-3 border-2 border-signal bg-signal/10">
                <span className="text-[10px] text-signal block font-bold">y (0^{k}) · PUMPED</span>
                <span className="font-bold text-signal text-sm">&quot;{yPart}&quot;</span>
              </div>
              <div className="p-3 border border-rule bg-paper">
                <span className="text-[10px] text-ink-soft block font-bold">z (1^{p})</span>
                <span className="font-bold text-ink text-sm">&quot;{zPart}&quot;</span>
              </div>
            </div>
          </div>

          {/* Pumped Result */}
          <div className="p-5 bg-paper border-2 border-ink space-y-3">
            <span className="font-bold text-ink uppercase block">Resulting String s&apos; = x · y^{iVal} · z:</span>
            <div className="p-3 bg-card border border-ink font-mono text-base font-bold text-ink break-all tracking-widest text-center">
              {pumpedString}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-rule text-xs">
              <div>
                <span>Count of 0s: <strong>{pumpedZeros}</strong> | Count of 1s: <strong>{pumpedOnes}</strong></span>
              </div>

              <div>
                {isInLanguage ? (
                  <span className="px-3 py-1 bg-ok text-paper font-bold">
                    ✓ Inside Language (i = 1 trivial case)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-bad text-paper font-bold shadow-xs">
                    ✕ CONTRADICTION: s&apos; ∉ L ({pumpedZeros} zeros ≠ {pumpedOnes} ones)
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================
// MODULE 4: CFG DERIVATION TREE & PARSE BUILDER
// ========================================================
function TOA4Playground() {
  const [grammarType, setGrammarType] = useState<"balanced" | "arithmetic">("balanced")

  return (
    <div className="space-y-6 font-mono text-xs">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">CFG Lab</span>
            <span className="text-signal font-bold">Derivations &amp; Normal Forms (CNF)</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Context-Free Grammar (CFG) Derivation &amp; Parse Tree Studio
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Trace Leftmost Derivations (LMD) and inspect syntax parse tree hierarchies.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGrammarType("balanced")}
              className={`px-3 py-1.5 border font-bold transition-colors cursor-pointer ${
                grammarType === "balanced"
                  ? "border-signal bg-signal text-paper"
                  : "border-rule bg-paper text-ink"
              }`}
            >
              Balanced Parentheses: S ➔ (S) | SS | ε
            </button>
            <button
              onClick={() => setGrammarType("arithmetic")}
              className={`px-3 py-1.5 border font-bold transition-colors cursor-pointer ${
                grammarType === "arithmetic"
                  ? "border-signal bg-signal text-paper"
                  : "border-rule bg-paper text-ink"
              }`}
            >
              Arithmetic Ambiguity: E ➔ E + E | E * E | id
            </button>
          </div>

          <div className="p-5 bg-paper border border-ink space-y-4">
            {grammarType === "balanced" ? (
              <div className="space-y-3">
                <span className="text-sm font-bold text-signal block">Derivation of string &quot;()()&quot;:</span>
                <div className="p-3 bg-card border border-rule space-y-1.5">
                  <div>1. S ➔ SS (Rule: S ➔ SS)</div>
                  <div>2. ➔ (S)S (Leftmost: S ➔ (S))</div>
                  <div>3. ➔ ()S (Leftmost: S ➔ ε)</div>
                  <div>4. ➔ ()(S) (Leftmost: S ➔ (S))</div>
                  <div>5. ➔ ()() (Leftmost: S ➔ ε) [TERMINAL STRING]</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-sm font-bold text-bad block">Proof of Ambiguity for &quot;id + id * id&quot;:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-card border border-rule space-y-1">
                    <strong className="text-signal block font-bold">Parse Tree 1: (id + id) * id</strong>
                    <div>E ➔ E * E</div>
                    <div>➔ (E + E) * E</div>
                    <div>➔ (id + id) * id</div>
                  </div>
                  <div className="p-3 bg-card border border-rule space-y-1">
                    <strong className="text-signal block font-bold">Parse Tree 2: id + (id * id)</strong>
                    <div>E ➔ E + E</div>
                    <div>➔ E + (E * E)</div>
                    <div>➔ id + (id * id)</div>
                  </div>
                </div>
                <p className="font-sans text-xs text-bad">
                  Because string &quot;id + id * id&quot; has two distinct parse trees, the grammar is formally AMBIGUOUS.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================
// MODULE 5: PUSHDOWN AUTOMATA (PDA) STACK SIMULATOR
// ========================================================
function TOA5Playground() {
  const [inputWord, setInputWord] = useState("0011")
  const [stepIndex, setStepIndex] = useState(0)

  // PDA for L = { 0^n 1^n | n >= 1 }
  // State q0: on 0, push 0. on 1, pop 0 and go to q1
  // State q1: on 1, pop 0. on empty tape and Z0 on top, go to q_f
  const simulationSteps = useMemo(() => {
    const steps: { state: string; tapeLeft: string; stack: string[] }[] = [
      { state: "q0", tapeLeft: inputWord, stack: ["Z0"] }
    ]

    let state = "q0"
    let stack = ["Z0"]
    let tape = inputWord

    while (tape.length > 0) {
      const ch = tape[0]
      tape = tape.slice(1)

      if (state === "q0" && ch === "0") {
        stack = ["0", ...stack]
        steps.push({ state: "q0", tapeLeft: tape, stack: [...stack] })
      } else if (state === "q0" && ch === "1") {
        if (stack[0] === "0") {
          stack = stack.slice(1)
          state = "q1"
          steps.push({ state: "q1", tapeLeft: tape, stack: [...stack] })
        } else {
          break
        }
      } else if (state === "q1" && ch === "1") {
        if (stack[0] === "0") {
          stack = stack.slice(1)
          steps.push({ state: "q1", tapeLeft: tape, stack: [...stack] })
        } else {
          break
        }
      } else {
        break
      }
    }

    if (tape.length === 0 && stack.length === 1 && stack[0] === "Z0") {
      steps.push({ state: "q_f", tapeLeft: "ε", stack: ["Z0"] })
    }

    return steps
  }, [inputWord])

  const current = simulationSteps[Math.min(stepIndex, simulationSteps.length - 1)]

  return (
    <div className="space-y-6 font-mono text-xs">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">Pushdown Automata Lab</span>
            <span className="text-signal font-bold">L = &#123; 0ⁿ 1ⁿ | n ≥ 1 &#125;</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Interactive PDA Stack Memory Visualizer
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Watch stack push and pop operations execute in sync with input consumption.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-paper border border-rule">
            <span className="font-bold text-ink">Input String:</span>
            <input
              type="text"
              value={inputWord}
              onChange={(e) => {
                setInputWord(e.target.value.replace(/[^01]/g, "").slice(0, 8))
                setStepIndex(0)
              }}
              className="px-3 py-1.5 border border-ink bg-card text-ink font-mono font-bold"
              placeholder="e.g. 0011"
            />
            <button
              onClick={() => {
                if (stepIndex < simulationSteps.length - 1) setStepIndex(stepIndex + 1)
              }}
              className="px-4 py-1.5 bg-signal text-paper font-bold uppercase hover:bg-signal/90 cursor-pointer"
            >
              Step Forward →
            </button>
            <button
              onClick={() => setStepIndex(0)}
              className="px-3 py-1.5 border border-ink bg-card text-ink font-bold hover:bg-paper cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instantaneous Description */}
            <div className="p-4 bg-card border border-ink space-y-3">
              <span className="font-bold text-ink uppercase block">Instantaneous Description (ID):</span>
              <div className="p-3 bg-paper border border-rule text-sm font-bold text-signal">
                (State: {current.state}, Remaining: &quot;{current.tapeLeft}&quot;, Stack: [{current.stack.join(", ")}])
              </div>
              <div className="text-ink-soft text-[11px] font-sans">
                By standard convention, the top of the stack is the leftmost element.
              </div>
            </div>

            {/* Stack Visualizer */}
            <div className="p-4 bg-card border border-ink space-y-2">
              <span className="font-bold text-ink uppercase block">Physical LIFO Stack:</span>
              <div className="w-32 mx-auto border-x-2 border-b-2 border-ink bg-paper p-2 flex flex-col gap-1 min-h-[140px] justify-end">
                {current.stack.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border text-center font-bold font-mono text-xs ${
                      idx === 0
                        ? "border-signal bg-signal/20 text-signal font-extrabold"
                        : "border-rule bg-card text-ink"
                    }`}
                  >
                    {item} {idx === 0 && "(TOP)"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================
// MODULE 6: TURING MACHINE 1D TAPE SIMULATOR
// ========================================================
function TOA6Playground() {
  const [tape, setTape] = useState<string[]>(["B", "1", "1", "1", "B", "B"])
  const [headPos, setHeadPos] = useState(1)
  const [state, setState] = useState("q0")

  // TM to decrement a unary number by 1 (e.g. 111 -> 11)
  const handleStep = () => {
    const symbol = tape[headPos]
    if (state === "q0") {
      if (symbol === "1") {
        // Move right looking for the end
        setHeadPos(headPos + 1)
      } else if (symbol === "B") {
        // Reached end, move left to erase last 1
        setState("q1")
        setHeadPos(headPos - 1)
      }
    } else if (state === "q1") {
      if (symbol === "1") {
        // Replace 1 with B and halt
        const newTape = [...tape]
        newTape[headPos] = "B"
        setTape(newTape)
        setState("q_halt")
      }
    }
  }

  const handleReset = () => {
    setTape(["B", "1", "1", "1", "B", "B"])
    setHeadPos(1)
    setState("q0")
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">Turing Machine Lab</span>
            <span className="text-signal font-bold">Unary Decrement Function: f(n) = n - 1</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-ink">
            Infinite 1D Tape &amp; Read/Write Head Simulator
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft">
            Observe the tape head read symbols, overwrite cells, and transition state.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStep}
              disabled={state === "q_halt"}
              className="px-4 py-2 bg-signal text-paper font-bold uppercase hover:bg-signal/90 disabled:opacity-40 cursor-pointer"
            >
              Step TM Head →
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 border border-ink bg-card text-ink font-bold hover:bg-paper cursor-pointer"
            >
              Reset Tape
            </button>
            <div className="ml-auto font-mono text-sm">
              State: <strong className="text-signal">{state}</strong>
            </div>
          </div>

          {/* Tape Display */}
          <div className="p-6 bg-paper border-2 border-ink space-y-3">
            <span className="font-bold text-ink uppercase block">1D Turing Tape Cells:</span>
            <div className="flex items-center justify-center gap-1 font-mono text-lg overflow-x-auto py-4">
              {tape.map((cell, idx) => {
                const isHead = idx === headPos

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-14 border-2 flex items-center justify-center font-bold ${
                        isHead
                          ? "border-signal bg-signal text-paper scale-110 shadow-md"
                          : "border-ink bg-card text-ink"
                      }`}
                    >
                      {cell}
                    </div>
                    {isHead && (
                      <span className="text-signal font-bold text-xs mt-1">▲ HEAD</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {state === "q_halt" && (
            <div className="p-3 bg-ok/10 border border-ok text-ok font-bold text-center">
              ✓ Turing Machine Halted Successfully! Output tape computed.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
