"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { TOAModuleId, getTOAModule } from "@/lib/syllabus/toaSyllabus"
import { Presentation, ArrowRight, Lightbulb, ShieldCheck, AlertCircle, BookMarked, GitBranch, CheckCircle2, Cpu, Terminal, Layers } from "lucide-react"
import { useAcademicStore } from "@/lib/academicStore"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

interface DeepDiveContent {
  analogy: string
  mechanics: string
  examAnswer: string
  watchOut: string
  diagramTitle: string
  diagramContent: React.ReactNode
}

const TOA_DEEP_DIVES: Record<TOAModuleId, DeepDiveContent> = {
  'toa-m1': {
    analogy: "Think of a Deterministic Finite Automaton (DFA) like a coin-operated vending machine: You start in state 'Waiting for Money'. If you insert a 5-rupee coin, you transition to '5 Rupees In'. If you press the snack button now, it refuses and returns to 'Waiting'. If you insert another 5 rupees, you reach the final accepting state '10 Rupees In' where the snack is dispensed. The machine has NO memory of your life story, how many hours you stood there, or future transactions; it only tracks its current discrete state based on the current input symbol.",
    mechanics: "A DFA is formalized by a 5-tuple M = (Q, Σ, δ, q0, F). The transition function δ: Q × Σ → Q is total and deterministic (for every state and symbol, there is exactly one next state). In contrast, an NFA replaces δ with Q × (Σ ∪ {ε}) → 2^Q, enabling non-deterministic branching. Transducers extend acceptors with outputs: Moore machines emit outputs based on state alone (λ: Q → Δ), producing n + 1 symbols for length n input; Mealy machines emit outputs on transition edges (λ: Q × Σ → Δ), producing n symbols.",
    examAnswer: "Finite Automata are abstract models of computation with finite internal memory. Formally, a DFA is M = (Q, Σ, δ, q0, F). A string w is accepted if the extended transition δ*(q0, w) ∈ F. An NFA allows multiple next states and ε-transitions; by the Subset Construction Theorem, any NFA can be converted into an equivalent DFA with at most 2^|Q| states. Moore machines have output function λ(q), while Mealy machines have output function λ(q, a); any Moore machine can be transformed into an equivalent Mealy machine by propagating state outputs onto incoming transition arcs.",
    watchOut: "In Mumbai University exams, students frequently forget to draw trap/dead states for invalid transitions in DFAs. A DFA MUST have an outgoing transition for every symbol in Σ from every state; if a sequence cannot lead to an accept state, it must explicitly transition to a trap state with self-loops on all symbols.",
    diagramTitle: "DFA State Transition Diagram & Moore/Mealy Transducer Model",
    diagramContent: (
      <div className="space-y-4">
        {/* DFA Graph SVG */}
        <div className="p-4 bg-paper border border-ink space-y-2">
          <div className="text-center font-mono font-bold text-xs text-signal">
            DFA for L = &#123; w ∈ &#123;0, 1&#125;* | w ends in &quot;01&quot; &#125;
          </div>
          <svg viewBox="0 0 600 160" className="w-full h-auto max-h-[160px]">
            {/* Start Arrow */}
            <line x1="20" y1="80" x2="60" y2="80" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="30" y="70" className="font-mono text-[10px] fill-current">Start</text>

            {/* State q0 */}
            <circle cx="90" cy="80" r="28" fill="var(--card)" stroke="currentColor" strokeWidth="2" />
            <text x="90" y="85" textAnchor="middle" className="font-mono font-bold text-sm fill-current">q0</text>
            {/* q0 self loop (1) */}
            <path d="M 80,55 C 70,20 110,20 100,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="90" y="25" textAnchor="middle" className="font-mono text-xs fill-current">1</text>

            {/* q0 -> q1 (0) */}
            <line x1="118" y1="80" x2="232" y2="80" stroke="currentColor" strokeWidth="2" />
            <polygon points="232,80 222,75 222,85" fill="currentColor" />
            <text x="175" y="72" textAnchor="middle" className="font-mono text-xs fill-signal font-bold">0</text>

            {/* State q1 */}
            <circle cx="260" cy="80" r="28" fill="var(--card)" stroke="currentColor" strokeWidth="2" />
            <text x="260" y="85" textAnchor="middle" className="font-mono font-bold text-sm fill-current">q1</text>
            {/* q1 self loop (0) */}
            <path d="M 250,55 C 240,20 280,20 270,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="260" y="25" textAnchor="middle" className="font-mono text-xs fill-current">0</text>

            {/* q1 -> q2 (1) */}
            <line x1="288" y1="80" x2="402" y2="80" stroke="currentColor" strokeWidth="2" />
            <polygon points="402,80 392,75 392,85" fill="currentColor" />
            <text x="345" y="72" textAnchor="middle" className="font-mono text-xs fill-ok font-bold">1</text>

            {/* State q2 (Double circle accept) */}
            <circle cx="430" cy="80" r="28" fill="var(--card)" stroke="currentColor" strokeWidth="2" />
            <circle cx="430" cy="80" r="23" fill="none" stroke="var(--ok)" strokeWidth="2" />
            <text x="430" y="85" textAnchor="middle" className="font-mono font-bold text-sm fill-current">q2</text>

            {/* q2 -> q1 (0) */}
            <path d="M 410,105 C 340,150 310,150 280,105" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="280,105 285,115 292,108" fill="currentColor" />
            <text x="345" y="145" textAnchor="middle" className="font-mono text-xs fill-current">0</text>

            {/* q2 -> q0 (1) */}
            <path d="M 430,52 C 400,-10 120,-10 90,52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <polygon points="90,52 92,42 98,46" fill="currentColor" />
            <text x="260" y="5" textAnchor="middle" className="font-mono text-xs fill-current">1</text>
          </svg>
        </div>

        {/* Moore vs Mealy Architecture */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-3 border border-rule bg-card space-y-1">
            <span className="font-bold text-signal block">Moore Machine (State-Bound)</span>
            <p className="text-ink-soft">Output is mapped to state: λ: Q → Δ. Total output length = |w| + 1.</p>
          </div>
          <div className="p-3 border border-rule bg-card space-y-1">
            <span className="font-bold text-ok block">Mealy Machine (Transition-Bound)</span>
            <p className="text-ink-soft">Output is mapped to edge: λ: Q × Σ → Δ. Total output length = |w|.</p>
          </div>
        </div>
      </div>
    )
  },
  'toa-m2': {
    analogy: "Thompson's Construction is like building complex plumbing systems out of standardized LEGO blocks: Every base symbol 'a' is a simple 2-state pipe with a valve. To make 'a + b', you connect two pipes in parallel using a split pipe (ε-transitions). To make 'a · b', you solder the exit of pipe a directly to the entrance of pipe b. To make 'a*', you install a feedback loop from the exit back to the entrance with a bypass route for zero iterations.",
    mechanics: "Regular expressions and finite automata have identical language generative power (Kleene's Theorem). Converting RE to NFA uses Thompson's inductive construction, resulting in an ε-NFA with at most 2|r| states. Converting FA to RE uses Arden's Lemma (solving R = Q + RP with unique solution R = QP*) or the State Elimination Method. DFA minimization eliminates indistinguishable states via the Table-Filling Algorithm (Myhill-Nerode theorem), creating the unique canonical minimum state DFA.",
    examAnswer: "Kleene's Theorem proves the equivalence between Regular Expressions and Finite Automata. For RE to NFA, Thompson's Construction recursively builds ε-NFAs for basic symbols, union (+), concatenation (·), and Kleene star (*). For FA to RE, Arden's Theorem (R = Q + RP ⟹ R = QP*) solves system state linear equations. DFA Minimization employs the Myhill-Nerode table-filling algorithm: 1. Remove unreachable states. 2. Mark pairs (p, q) where one is accept and one is reject. 3. Iteratively mark (p, q) if (δ(p, a), δ(q, a)) is marked for any a ∈ Σ. 4. Merge unmarked pairs into equivalence states.",
    watchOut: "When applying Arden's Theorem R = Q + RP ⟹ R = QP*, always verify that P does NOT contain the null string ε. If ε ∈ P, the solution is NOT unique and applying Arden's lemma will yield incorrect regular expressions.",
    diagramTitle: "Thompson's Construction Primitive Modules (Union, Concat, Star)",
    diagramContent: (
      <div className="p-4 bg-paper border border-ink space-y-3 font-mono text-xs">
        <div className="text-center font-bold text-signal">Thompson Construction Primitive Subgraphs</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border border-rule bg-card space-y-2 text-center">
            <span className="font-bold text-ink block">Union: r1 + r2</span>
            <div className="py-2 text-[10px] text-ink-soft">
              Start state branches via ε into r1 and r2; both merge via ε to final accept state.
            </div>
          </div>
          <div className="p-3 border border-rule bg-card space-y-2 text-center">
            <span className="font-bold text-ink block">Concatenation: r1 · r2</span>
            <div className="py-2 text-[10px] text-ink-soft">
              Accept state of r1 connects via ε-transition directly to start state of r2.
            </div>
          </div>
          <div className="p-3 border border-rule bg-card space-y-2 text-center">
            <span className="font-bold text-ink block">Kleene Star: r1*</span>
            <div className="py-2 text-[10px] text-ink-soft">
              Includes forward ε-bypass (0 occurrences) and backward ε-loop (infinite repetitions).
            </div>
          </div>
        </div>
      </div>
    )
  },
  'toa-m3': {
    analogy: "The Pumping Lemma is like the Pigeonhole Principle in a hotel with 5 rooms: If 6 guests arrive, at least one room MUST host two guests. In a DFA with 'p' states, any string of length p or more must visit at least p + 1 states during its journey. Because there are only p distinct states, the machine is FORCED to visit the exact same state twice! The sequence of symbols read between those two identical visits forms a loop (y). Once a loop exists, you can pump it 0 times, 2 times, or 100 times, and the machine will still end up in the exact same state.",
    mechanics: "The Pumping Lemma for Regular Languages states that if L is regular, there exists a pumping length p such that any s ∈ L with |s| ≥ p can be factored as s = xyz with: 1. |y| > 0, 2. |xy| ≤ p, 3. ∀i ≥ 0, xy^i z ∈ L. Because y lies within the first p characters, in languages requiring unbounded counting (like 0^n 1^n), y consists entirely of the first character class (0s). Pumping i ≠ 1 unbalances the counts, yielding a contradiction and proving L is non-regular.",
    examAnswer: "The Pumping Lemma is a necessary property of all regular languages derived from the Pigeonhole Principle. It states that any string s ∈ L of length ≥ p can be split into s = xyz where |xy| ≤ p, |y| ≥ 1, such that ∀i ≥ 0, xy^i z ∈ L. To prove L = { 0^n 1^n | n ≥ 0 } is non-regular: 1. Assume L is regular with pumping length p. 2. Choose s = 0^p 1^p ∈ L (|s| = 2p ≥ p). 3. Since |xy| ≤ p, y must be 0^k for some k ≥ 1. 4. Pump with i = 2: s' = x y^2 z has p + k zeros and p ones. Since p + k ≠ p, s' ∉ L, contradicting the lemma. Hence, L is not regular.",
    watchOut: "Never pick a specific value for the pumping length p (like p = 3 or p = 5). P is an arbitrary constant chosen by the adversary; your proof must work for ANY valid integer p ≥ 1.",
    diagramTitle: "Pumping Lemma Loop Diagram (Pigeonhole Cycle on State q_j)",
    diagramContent: (
      <div className="p-4 bg-paper border border-ink space-y-3 font-mono text-xs">
        <div className="text-center font-bold text-signal">State Path Traversal with Loop on State q_j</div>
        <div className="flex items-center justify-between p-3 bg-card border border-rule overflow-x-auto text-center gap-2">
          <div className="p-2 border border-rule bg-paper">q0 ➔ ... ➔ q_j<br /><span className="text-ink-soft text-[10px]">Prefix x</span></div>
          <div className="p-2 border-2 border-signal bg-signal/10 font-bold">q_j ➔ ... ➔ q_j<br /><span className="text-signal text-[10px]">LOOP y (Pumpable)</span></div>
          <div className="p-2 border border-rule bg-paper">q_j ➔ ... ➔ q_accept<br /><span className="text-ink-soft text-[10px]">Suffix z</span></div>
        </div>
        <p className="text-[11px] text-ink-soft font-sans leading-relaxed">
          Because |xy| ≤ p, the cycle at q_j must be completed within the first p steps. Pumping y copies the loop without altering the prefix x or suffix path z.
        </p>
      </div>
    )
  },
  'toa-m4': {
    analogy: "A Context-Free Grammar is like English sentence syntax: A Sentence breaks down into [Noun Phrase] + [Verb Phrase]. The Noun Phrase breaks into [Article] + [Noun]. An ambiguous grammar is like the newspaper headline: 'Enraged Cow Injures Farmer with Axe'. Did the farmer have the axe, or did the cow use an axe? Because the sentence has two completely distinct parse trees, the meaning is ambiguous! Normal forms (like CNF) are like standardized military phrasing: every command must strictly consist of either two code words or one direct verb, eliminating all ambiguity in execution time.",
    mechanics: "A CFG G = (V, T, P, S) generates Context-Free Languages (Type 2). Derivations can proceed Leftmost (LMD) or Rightmost (RMD). Grammars with multiple parse trees for any single string are ambiguous. Grammar simplification follows a strict sequence: 1. Eliminate ε-productions. 2. Eliminate unit productions (A → B). 3. Eliminate useless non-terminals. Chomsky Normal Form (CNF) enforces all productions to be A → BC or A → a, enabling the O(n³) Cocke-Younger-Kasami (CYK) tabular parsing algorithm.",
    examAnswer: "A CFG is defined as G = (V, T, P, S). A grammar is ambiguous if there exists some w ∈ L(G) with two or more distinct leftmost derivations or derivation trees. Chomsky Normal Form (CNF) restricts rules to A → BC or A → a. Conversion to CNF: 1. Eliminate ε-productions. 2. Eliminate unit rules (A → B). 3. Eliminate useless symbols. 4. Replace terminal-variable hybrids with auxiliary variables (A → aB becomes A → C_a B, C_a → a). 5. Cascade long variable chains (A → BCD becomes A → B X1, X1 → CD). For string of length n, CNF derivations take exactly 2n - 1 steps.",
    watchOut: "The order of CFG simplification is critical in university exams! You MUST eliminate ε-productions FIRST, then unit productions, and finally useless symbols. Doing it in any other order will reintroduce useless or unit productions.",
    diagramTitle: "Chomsky Normal Form (CNF) Binary Branching Parse Tree",
    diagramContent: (
      <div className="p-4 bg-paper border border-ink space-y-3 font-mono text-xs">
        <div className="text-center font-bold text-signal">Binary Branching Property of Chomsky Normal Form</div>
        <div className="p-4 bg-card border border-rule text-center space-y-2">
          <div className="inline-block p-1.5 border border-ink bg-paper font-bold">A (Variable)</div>
          <div className="text-ink-soft">↙  ↘ (Strict Binary Split)</div>
          <div className="flex justify-center gap-8">
            <div className="p-1.5 border border-signal bg-signal/10 font-bold">B (Variable)</div>
            <div className="p-1.5 border border-signal bg-signal/10 font-bold">C (Variable)</div>
          </div>
          <div className="text-ink-soft">↓   ↓ (Single Terminal Drops)</div>
          <div className="flex justify-center gap-12 font-bold text-ok">
            <div>&quot;b&quot; (Terminal)</div>
            <div>&quot;c&quot; (Terminal)</div>
          </div>
        </div>
      </div>
    )
  },
  'toa-m5': {
    analogy: "A Pushdown Automaton is like an office clerk with a single-column spike on their desk for paper receipts: When an incoming customer arrives with order '0', the clerk impales a green paper slip on the spike (Push). When order '1' arrives, the clerk removes the top slip from the spike (Pop). If the customer finishes their orders and the spike is clean (empty stack), the accounts match perfectly! The stack gives the machine UNLIMITED memory depth, but with a strict Last-In, First-Out (LIFO) access constraint—the clerk can never inspect the bottom receipt without popping everything above it.",
    mechanics: "A PDA M = (Q, Σ, Γ, δ, q0, Z0, F) augments finite control with an infinite LIFO stack. The transition function δ: Q × (Σ ∪ {ε}) × Γ → 2^(Q × Γ*) reads current state, input symbol, and stack top, transitioning to a new state while replacing the stack top with a string of symbols. Acceptance can be by Final State (L(M)) or Empty Stack (N(M)); both are equivalent in generative power for NPDAs. DPDAs accept Deterministic CFLs (DCFLs) and are strictly less expressive than NPDAs.",
    examAnswer: "A Pushdown Automaton (PDA) is defined by the 7-tuple M = (Q, Σ, Γ, δ, q0, Z0, F). Configurations are represented by Instantaneous Descriptions (IDs) (q, w, α), where w is remaining input and α is current stack content (leftmost symbol is stack top). Acceptance by Final State: (q0, w, Z0) ⊢* (q_f, ε, γ) where q_f ∈ F. Acceptance by Empty Stack: (q0, w, Z0) ⊢* (q, ε, ε). NPDAs accept Context-Free Languages, while DPDAs accept Deterministic CFLs. NPDAs are strictly more powerful than DPDAs because languages like even palindromes { w w^R } cannot be recognized deterministically without knowing the midpoint.",
    watchOut: "Remember that DPDAs are NOT equivalent to NPDAs! In finite automata, NFA ≡ DFA. But in pushdown automata, DPDA ⊂ NPDA. This is one of the most frequently tested distinction questions in university exams.",
    diagramTitle: "PDA Architecture (Finite Control + Read Head + LIFO Stack)",
    diagramContent: (
      <div className="p-4 bg-paper border border-ink space-y-3 font-mono text-xs">
        <div className="text-center font-bold text-signal">PDA Three-Component Physical Architecture</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-rule bg-card space-y-1">
            <span className="font-bold text-ink block">1. Input Tape</span>
            <p className="text-[10px] text-ink-soft">One-way read head scanning input characters from left to right.</p>
          </div>
          <div className="p-3 border-2 border-signal bg-signal/10 space-y-1">
            <span className="font-bold text-signal block">2. Finite State Control</span>
            <p className="text-[10px] text-ink-soft">Finite state registers (Q, δ) deciding moves based on input and stack top.</p>
          </div>
          <div className="p-3 border border-rule bg-card space-y-1">
            <span className="font-bold text-ok block">3. LIFO Infinite Stack</span>
            <p className="text-[10px] text-ink-soft">Unbounded push/pop auxiliary memory with bottom-of-stack marker Z0.</p>
          </div>
        </div>
      </div>
    )
  },
  'toa-m6': {
    analogy: "A Turing Machine is the ultimate mathematical computer: Imagine an infinite strip of paper tape divided into discrete squares, with a robot head perched on top. The head can read a symbol, erase it and write a new symbol, move one square Left, or move one square Right. This simple mechanical concept—invented by Alan Turing before electronic computers ever existed—can execute EVERY program that can ever be written in Python, C++, or Java! The Halting Problem proves that there is NO master debugger program that can analyze ANY arbitrary program and tell you with certainty whether it will finish or get stuck in an infinite loop.",
    mechanics: "A Turing Machine M = (Q, Σ, Γ, δ, q0, B, F) features a bidirectional infinite tape and read/write head. Transition δ: Q × Γ → Q × Γ × {L, R, S} is a partial function. Languages recognized by TMs are Recursively Enumerable (RE / Type 0). If the TM is guaranteed to halt on all inputs (accept or reject), the language is Recursive (Decidable). Alan Turing proved the Halting Problem is undecidable using Cantor's diagonalization argument, showing that algorithmic computation has inherent mathematical boundaries.",
    examAnswer: "A Turing Machine (TM) is defined by the 7-tuple M = (Q, Σ, Γ, δ, q0, B, F). TMs serve as language acceptors, deciders, and function computers. By the Church-Turing Thesis, any effectively calculable function can be computed by a Turing Machine. Multitape TMs, Non-Deterministic TMs, and Universal TMs (UTM) all possess equal computational power. The Halting Problem H = { (M, w) | TM M halts on input w } is provably undecidable: if a decider Halts(M, w) existed, one could construct machine D(M) that loops if M(M) halts and halts if M(M) loops; running D(D) yields an inescapable logical contradiction.",
    watchOut: "Do not confuse Recursive (Decidable) languages with Recursively Enumerable (RE) languages! A decider for a Recursive language MUST halt on ALL inputs. An acceptor for an RE language halts and accepts if w ∈ L, but may run forever (loop infinitely) if w ∉ L.",
    diagramTitle: "Turing Machine Model & Complete Chomsky Hierarchy Summary",
    diagramContent: (
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 bg-paper border border-ink space-y-2">
          <div className="text-center font-bold text-signal">Turing Machine 1D Tape &amp; Bidirectional Head</div>
          <div className="flex items-center justify-center gap-1 overflow-x-auto py-2">
            {["...", "B", "1", "0", "1", "1", "0", "B", "..."].map((c, i) => (
              <div key={i} className={`w-8 h-10 border flex items-center justify-center font-bold ${i === 4 ? "border-signal bg-signal text-paper" : "border-ink bg-card text-ink"}`}>
                {c}
              </div>
            ))}
          </div>
          <div className="text-center text-[10px] text-ink-soft">
            Head can read, write, and move Left (L) or Right (R) infinitely.
          </div>
        </div>

        {/* Chomsky Hierarchy Visual Rings */}
        <div className="p-4 bg-card border border-rule space-y-2 text-center text-[11px]">
          <span className="font-bold text-ink block uppercase">Chomsky Hierarchy of Languages &amp; Machines</span>
          <div className="p-2 border border-ink bg-paper text-ink space-y-1">
            <span className="font-bold text-bad">Type 0: Recursively Enumerable (Turing Machine)</span>
            <div className="p-2 border border-dashed border-ink bg-card text-ink space-y-1">
              <span className="font-bold text-signal">Type 1: Context-Sensitive (Linear Bounded Automaton)</span>
              <div className="p-2 border border-ink bg-paper text-ink space-y-1">
                <span className="font-bold text-ok">Type 2: Context-Free (Pushdown Automaton)</span>
                <div className="p-2 border border-signal bg-signal/10 font-bold text-signal">
                  Type 3: Regular Languages (Finite State Automata)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default function TOALearn({ moduleId }: { moduleId: TOAModuleId }) {
  const mod = getTOAModule(moduleId)
  const deepDive = TOA_DEEP_DIVES[moduleId] || TOA_DEEP_DIVES['toa-m1']
  const mounted = useMounted()
  const { role, isAuthenticated } = useAuthStore()
  const isTeacher = mounted && isAuthenticated && role === "teacher"
  const { isTopicCompleted, toggleTopicCovered, moduleProgress } = useAcademicStore()
  const progress = moduleProgress[moduleId]

  if (!mod) return null

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* 1. Module Overview Banner */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">{mod.code}</span>
              <span className="text-signal font-bold uppercase">{mod.hours} Hours Total</span>
            </div>
            <span className="px-2 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
              {mod.bloomRange}
            </span>
          </div>

          <CardTitle className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {mod.title}
          </CardTitle>
          <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed mt-2">
            {mod.description}
          </p>

          {/* Teacher Portion Tracker Banner */}
          {isTeacher && (
            <div className="mt-4 p-3 bg-paper border border-signal flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ok animate-pulse" />
                <span className="text-ink font-bold">Faculty Portion Management:</span>
                <span className="text-ink-soft">
                  Click [Mark Done] next to any topic below as you complete classroom instruction.
                </span>
              </div>
              <span className="px-2 py-0.5 bg-signal text-paper font-bold text-[10px] uppercase">
                Portion Tracker Active
              </span>
            </div>
          )}
        </CardHeader>

        {/* 2. Interactive Topic Checklist */}
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-rule pb-2">
            <h4 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-signal" />
              <span>Syllabus Teaching Topics ({mod.topics.length} Units)</span>
            </h4>
            <span className="font-mono text-xs text-ink-soft">
              All topics open for student self-study
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mod.topics.map((t, idx) => {
              const isCovered = progress ? isTopicCompleted(moduleId, idx + 1) : false

              return (
                <div
                  key={t.id}
                  className={`p-4 border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                    isCovered ? "bg-ok/5 border-ok/40" : "bg-card border-rule hover:border-ink"
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink font-bold">
                        Topic {idx + 1}
                      </span>
                      <span className="text-ink-soft">{t.hours} hrs</span>
                      <span className="px-1.5 py-0.2 bg-paper border border-rule text-signal text-[10px] font-bold">
                        {t.bloom}
                      </span>
                      {isCovered && (
                        <span className="px-2 py-0.5 bg-ok/20 border border-ok/40 text-ok font-bold text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Covered by Faculty
                        </span>
                      )}
                    </div>
                    <div className="font-serif text-base font-bold text-ink">
                      {t.title}
                    </div>
                    <p className="font-sans text-xs text-ink-soft leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {isTeacher && (
                    <button
                      onClick={() => toggleTopicCovered(moduleId, idx + 1, "Faculty Instructor")}
                      className={`px-3 py-1.5 font-mono text-xs uppercase font-bold shrink-0 transition-colors border cursor-pointer ${
                        isCovered
                          ? "bg-ok text-paper border-ok hover:bg-ok/80"
                          : "bg-paper text-ink border-rule hover:border-signal hover:text-signal"
                      }`}
                    >
                      {isCovered ? "✓ Covered" : "Mark Done"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Deep-Dive Pedagogical Sections */}
      <div className="space-y-8">
        <h3 className="font-serif text-2xl font-bold text-ink border-b-2 border-ink pb-2">
          Mastering Automata Theory: Intuition, Formal Math &amp; University Pointers
        </h3>

        {/* Analogy Card */}
        <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
          <CardHeader className="border-b border-rule pb-3">
            <CardTitle className="font-serif text-lg font-bold text-signal flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-signal" />
              <span>Real-World Physical Intuition &amp; Mental Model</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 font-sans text-xs sm:text-sm text-ink leading-relaxed">
            {deepDive.analogy}
          </CardContent>
        </Card>

        {/* Visual State Machine Diagram Card */}
        <Card className="border-2 border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
          <CardHeader className="border-b border-rule pb-3">
            <CardTitle className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-ok" />
              <span>{deepDive.diagramTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {deepDive.diagramContent}
          </CardContent>
        </Card>

        {/* Mechanics & Formal Definitions Card */}
        <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
          <CardHeader className="border-b border-rule pb-3">
            <CardTitle className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <Cpu className="h-5 w-5 text-ink" />
              <span>Mathematical Architecture &amp; Formal Definitions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 font-sans text-xs sm:text-sm text-ink leading-relaxed">
            {deepDive.mechanics}
          </CardContent>
        </Card>

        {/* University Exam Model Answer */}
        <Card className="border-2 border-ink bg-paper shadow-[4px_4px_0_var(--rule)]">
          <CardHeader className="border-b border-rule pb-3">
            <CardTitle className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-ok" />
              <span>University Examination Model Answer (10-Mark Question)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 font-sans text-xs sm:text-sm text-ink leading-relaxed bg-card border border-rule m-4">
            <div className="font-mono text-[10px] text-ink-soft uppercase font-bold mb-2">
              Expected Model Structure for Maximum Score:
            </div>
            {deepDive.examAnswer}
          </CardContent>
        </Card>

        {/* Examiner Trap */}
        <Card className="border-2 border-bad/50 bg-bad/5 shadow-[4px_4px_0_var(--rule)]">
          <CardHeader className="border-b border-bad/30 pb-3">
            <CardTitle className="font-serif text-lg font-bold text-bad flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-bad" />
              <span>Examiner Trap &amp; Common Hall-Ticket Blunder</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 font-sans text-xs sm:text-sm text-ink leading-relaxed">
            {deepDive.watchOut}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
