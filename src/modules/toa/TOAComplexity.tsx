"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { TOAModuleId } from "@/lib/syllabus/toaSyllabus"

interface ComplexityItem {
  algo: string
  time: string
  space: string
  meaning: string
}

const TOA_COMPLEXITY_DATA: Record<TOAModuleId, {
  title: string
  subtitle: string
  rows: ComplexityItem[]
  deepDiveTitle: string
  deepDiveContent: React.ReactNode
}> = {
  'toa-m1': {
    title: "Module 1: Finite Automata Simulation & State Matrix Complexity",
    subtitle: "Analyzing computational cost of DFA/NFA execution, transition table lookups, and Moore/Mealy output generation.",
    rows: [
      { algo: "DFA String Recognition", time: "O(n)", space: "O(1)", meaning: "n = |w|. Exactly 1 state transition per input symbol. No auxiliary memory beyond current state register." },
      { algo: "NFA Simulation (Online)", time: "O(n · |Q|²)", space: "O(|Q|)", meaning: "Tracks active subset of states. Each symbol step computes set of next states reachable in O(|Q|²)." },
      { algo: "Moore Output Generation", time: "O(n + 1)", space: "O(1)", meaning: "Outputs symbol for start state q0 + 1 symbol after each of the n transitions." },
      { algo: "Mealy Output Generation", time: "O(n)", space: "O(1)", meaning: "Outputs exactly 1 symbol on the transition edge for each of the n input characters." },
      { algo: "Transition Table Lookup", time: "O(1)", space: "O(|Q| × |Σ|)", meaning: "2D array indexing δ[state][symbol] yields immediate constant-time next state." },
      { algo: "Chomsky Type 3 Bounds", time: "O(n)", space: "O(1)", meaning: "Regular languages are the lowest class in the Chomsky hierarchy, solvable by finite-memory automata." }
    ],
    deepDiveTitle: "Why does DFA execution take strictly O(n) linear time with O(1) space?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          A Deterministic Finite Automaton (DFA) has <strong>no external memory</strong> (no stack, no tape). Its only memory is its current state, chosen from a finite fixed set <code>Q</code> of size <code>|Q|</code>.
        </p>
        <p className="mb-3">
          For any input string <code>w</code> of length <code>n</code>, the DFA reads one symbol from left to right, executes exactly <strong>one transition</strong> according to <code>δ(q, a)</code>, and never backtracks.
        </p>
        <p>
          Consequently, the execution requires exactly <code>n</code> state updates in <strong>O(n)</strong> operations and consumes <strong>O(1)</strong> auxiliary memory, making DFAs the fastest possible pattern matchers in computer science (used in compiler lexers like Flex/Lex and grep engines).
        </p>
      </>
    )
  },
  'toa-m2': {
    title: "Module 2: Automata Conversions & Minimization Algorithms",
    subtitle: "Computational complexities of subset construction, table-filling DFA minimization, and Arden's theorem.",
    rows: [
      { algo: "NFA to DFA (Subset Construction)", time: "O(2^|Q| · |Σ|)", space: "O(2^|Q|)", meaning: "Worst-case state explosion. Power set of NFA states can produce up to 2^n DFA states." },
      { algo: "ε-Closure (BFS/DFS)", time: "O(|Q| + |E_ε|)", space: "O(|Q|)", meaning: "Finds all states reachable along epsilon edges using standard graph traversal." },
      { algo: "DFA Minimization (Table-Filling)", time: "O(|Σ| · |Q|²)", space: "O(|Q|²)", meaning: "Myhill-Nerode algorithm tests all pairs of states (p, q) in a lower-triangular table." },
      { algo: "Hopcroft's DFA Minimization", time: "O(|Σ| · |Q| log |Q|)", space: "O(|Q|)", meaning: "Most efficient known minimization algorithm; partitions state blocks using inverse transitions." },
      { algo: "Thompson's Construction (RE → NFA)", time: "O(|r|)", space: "O(|r|)", meaning: "Creates an ε-NFA with at most 2|r| states and 4|r| transitions, linear in expression length." },
      { algo: "Arden's Theorem (FA → RE)", time: "O(|Q|³)", space: "O(|Q|²)", meaning: "Gaussian elimination of state transition equations to synthesize single regular expression." },
      { algo: "Emptiness Check (BFS from q0)", time: "O(|Q| · |Σ|)", space: "O(|Q|)", meaning: "Tests whether any accepting state F is reachable from start state q0." }
    ],
    deepDiveTitle: "Understanding the Exponential State Explosion in NFA-to-DFA Conversion",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Consider the language <code>L = (0 + 1)* 1 (0 + 1)^(k-1)</code>, which recognizes all binary strings where the <strong>k-th symbol from the right is 1</strong>.
        </p>
        <p className="mb-3">
          An NFA can solve this with only <strong>k + 1</strong> states by guessing non-deterministically when it has reached the k-th symbol from the end.
        </p>
        <p>
          However, any equivalent DFA must remember all possible combinations of the last <code>k</code> bits seen so far, requiring at least <strong>2^k</strong> distinct states. This proves that while NFAs and DFAs have the same expressive power, NFAs can be exponentially more concise.
        </p>
      </>
    )
  },
  'toa-m3': {
    title: "Module 3: Pumping Lemma Bounds & Decision Complexities",
    subtitle: "Complexities of testing language properties and Myhill-Nerode equivalence class computation.",
    rows: [
      { algo: "Pumping Lemma String Decomposition", time: "O(p)", space: "O(p)", meaning: "Divides string s with |s| ≥ p into x, y, z where |xy| ≤ p and |y| ≥ 1." },
      { algo: "Language Emptiness (Is L = ∅?)", time: "O(|Q| + |δ|)", space: "O(|Q|)", meaning: "Graph reachability from q0 to F using Breadth-First Search in linear time." },
      { algo: "Language Finiteness (Is |L| < ∞?)", time: "O(|Q| + |δ|)", space: "O(|Q|)", meaning: "Cycle detection: detects if any state on a path from q0 to F lies on a directed cycle." },
      { algo: "Language Equivalence (Is L1 = L2?)", time: "O(|Q1| · |Q2|)", space: "O(|Q1| · |Q2|)", meaning: "Constructs product DFA for symmetric difference (L1 ∩ L2') ∪ (L1' ∩ L2) and checks for emptiness." },
      { algo: "Myhill-Nerode Index Computation", time: "O(|Σ| · |Q|²)", space: "O(|Q|²)", meaning: "Computes right-invariant equivalence classes; index exactly equals minimal DFA state count." }
    ],
    deepDiveTitle: "The Decidability Landscape of Regular Languages",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Regular languages are the <strong>most well-behaved</strong> language class in computer science. Every fundamental question you can ask about regular languages is completely <strong>decidable</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3 text-xs">
          <li><strong>Membership (w ∈ L):</strong> Decidable in O(|w|) time via DFA simulation.</li>
          <li><strong>Emptiness (L = ∅):</strong> Decidable in O(|Q| + |E|) time via reachability analysis.</li>
          <li><strong>Finiteness (|L| &lt; ∞):</strong> Decidable in O(|Q| + |E|) time via directed cycle detection.</li>
          <li><strong>Equivalence (L1 = L2):</strong> Decidable in O(|Q1| · |Q2|) time via symmetric difference emptiness.</li>
        </ul>
        <p>
          As we ascend higher in the Chomsky hierarchy (CFL, CSL, RE), these questions become exponentially harder or provably <strong>undecidable</strong>.
        </p>
      </>
    )
  },
  'toa-m4': {
    title: "Module 4: Parsing Complexity & Normal Form Transformations",
    subtitle: "CYK algorithm, derivation tree depth, and grammar simplification time bounds.",
    rows: [
      { algo: "CYK Parsing Algorithm (CNF)", time: "O(n³ · |P|)", space: "O(n² · |V|)", meaning: "Dynamic programming tabular parser. Determines whether string of length n is generated by CFG in CNF." },
      { algo: "CNF Derivation Steps", time: "2n - 1 steps", space: "O(n)", meaning: "Every string of length n derived from a Chomsky Normal Form grammar takes exactly 2n-1 rule expansions." },
      { algo: "Useless Symbols Elimination", time: "O(|P| · |V|)", space: "O(|V| + |T|)", meaning: "Two-pass algorithm: Phase 1 finds generating non-terminals; Phase 2 finds reachable non-terminals." },
      { algo: "Nullable (ε-Production) Elimination", time: "O(|P| · 2^k)", space: "O(|V|)", meaning: "Calculates nullable variables; can expand productions by factor of 2^k where k is rule RHS length." },
      { algo: "Unit Production Elimination", time: "O(|V| · |P|)", space: "O(|V|²)", meaning: "Computes unit pairs (A, B) such that A ⟹* B using transitive closure." },
      { algo: "CFL Emptiness Problem", time: "O(|P|)", space: "O(|V|)", meaning: "Checks if start symbol S is generating. If S cannot generate terminals, L(G) is empty (Decidable)." },
      { algo: "CFL Equivalence Problem", time: "UNDECIDABLE", space: "UNDECIDABLE", meaning: "Provably impossible for any algorithm to determine if two arbitrary CFGs generate the same language." }
    ],
    deepDiveTitle: "The Cocke-Younger-Kasami (CYK) O(n³) Parsing Algorithm",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Given a CFG in <strong>Chomsky Normal Form (CNF)</strong> (where all rules are <code>A → BC</code> or <code>A → a</code>) and an input string <code>w = a1 a2 ... an</code>, the CYK algorithm tests membership in polynomial time.
        </p>
        <p className="mb-3">
          It constructs an upper-triangular table <code>V[i, j]</code> of sets of variables that can derive the substring <code>ai ... aj</code> of length <code>j - i + 1</code>.
        </p>
        <p>
          Base cases (length 1) take <code>O(n)</code> time. For substrings of length <code>len = 2 to n</code>, CYK splits the substring at all possible partition points <code>k</code> and checks if <code>A → BC</code> with <code>B ∈ V[i, k]</code> and <code>C ∈ V[k+1, j]</code>. With 3 nested loops over length, start position, and split point, overall runtime is <strong>O(n³ · |P|)</strong>.
        </p>
      </>
    )
  },
  'toa-m5': {
    title: "Module 5: Pushdown Automata Stack Complexities & Determinism",
    subtitle: "Analyzing stack depth, DPDA vs NPDA branching factor, and CFG-PDA equivalence overhead.",
    rows: [
      { algo: "DPDA String Recognition", time: "O(n)", space: "O(n)", meaning: "Deterministic PDA: at most 1 choice per configuration. Linear time, stack bounded by string length." },
      { algo: "NPDA Simulation (Exhaustive)", time: "O(b^n)", space: "O(n)", meaning: "b = branching factor. Non-deterministic branch exploration without grammar normalization." },
      { algo: "CFG to PDA (Top-Down Parser)", time: "O(|P|)", space: "O(|P|)", meaning: "Constructs 1-state NPDA with transitions for each production rule in constant factor time." },
      { algo: "PDA to CFG (Triple Construction)", time: "O(|Q|³ · |P|)", space: "O(|Q|² · |Γ|)", meaning: "Aho-Ullman construction creates variables [q, X, p] denoting transitions that pop X." },
      { algo: "DPDA Equivalence (Sénizergues 1997)", time: "DECIDABLE", space: "Primitive Rec.", meaning: "Géraud Sénizergues won Gödel Prize for proving equivalence of two DPDAs is decidable!" },
      { algo: "NPDA Equivalence", time: "UNDECIDABLE", space: "UNDECIDABLE", meaning: "Determining whether two arbitrary NPDAs accept the same language is undecidable." }
    ],
    deepDiveTitle: "The Power Divide: Why NPDAs are Strictly More Powerful than DPDAs",
    deepDiveContent: (
      <>
        <p className="mb-3">
          In finite automata, <code>NFA ≡ DFA</code>: every NFA has an equivalent DFA via subset construction.
        </p>
        <p className="mb-3">
          For Pushdown Automata, this equivalence <strong>BREAKS DOWN</strong>:
          <code> DPDA &lt; NPDA (DCFL ⊂ CFL)</code>.
        </p>
        <p>
          Consider the language of even-length palindromes <code>L = &#123; w w^R | w ∈ (0 + 1)* &#125;</code>. To recognize this language, the automaton must push <code>w</code> onto the stack, and then pop characters matching <code>w^R</code>. But without a marker (like <code>#</code> in <code>w # w^R</code>), a deterministic machine cannot know when the middle of the string has arrived! An NPDA guesses the center non-deterministically, whereas a DPDA cannot.
        </p>
      </>
    )
  },
  'toa-m6': {
    title: "Module 6: Turing Machine Time/Space Classes & Undecidability",
    subtitle: "Computational complexity classes, Universal TM simulation overhead, and the Halting Problem.",
    rows: [
      { algo: "Single-Tape TM Step", time: "O(1)", space: "O(1)", meaning: "Reads cell, writes replacement symbol, updates state, moves head L or R." },
      { algo: "Multitape to 1-Tape TM Simulation", time: "O(T²)", space: "O(S)", meaning: "Simulating T steps of a k-tape TM on a single tape requires at most quadratic O(T²) time." },
      { algo: "Non-Deterministic TM Simulation", time: "O(2^T)", space: "O(T)", meaning: "Deterministic TM simulates NDTM using breadth-first search across computation tree." },
      { algo: "Universal TM (UTM) Overhead", time: "O(T log T)", space: "O(S)", meaning: "UTM simulates T steps of machine M with only logarithmic slowdown using efficient tape encoding." },
      { algo: "Halting Problem (H_TM)", time: "UNDECIDABLE", space: "UNDECIDABLE", meaning: "No algorithm can decide if arbitrary TM M halts on input w. Proved via Cantor's diagonal argument." },
      { algo: "Post Correspondence Problem (PCP)", time: "UNDECIDABLE", space: "UNDECIDABLE", meaning: "Fundamental undecidable string puzzle used to prove undecidability of CFG ambiguity and intersection." },
      { algo: "Rice's Theorem", time: "UNDECIDABLE", space: "UNDECIDABLE", meaning: "ANY non-trivial semantic property of the language recognized by a Turing Machine is undecidable!" }
    ],
    deepDiveTitle: "Cantor's Diagonalization & The Proof of the Halting Problem",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Alan Turing proved in 1936 that the <strong>Halting Problem is undecidable</strong> using a proof by contradiction based on Georg Cantor&apos;s diagonal method:
        </p>
        <p className="mb-3">
          Suppose a subroutine <code>Halts(M, w)</code> exists that returns <code>true</code> if <code>M(w)</code> halts, and <code>false</code> if it loops forever.
        </p>
        <p className="mb-3">
          We can now construct an adversarial program <code>Opposite(P)</code>:
          <br />
          <code>
            if Halts(P, P) == true then loop_forever() else halt_and_accept()
          </code>
        </p>
        <p>
          What happens when we execute <code>Opposite(Opposite)</code>?
          If it halts, it must loop forever. If it loops forever, it must halt. This is an inescapable logical contradiction, proving that the hypothetical decider <code>Halts</code> cannot exist!
        </p>
      </>
    )
  }
}

export default function TOAComplexity({ moduleId }: { moduleId: TOAModuleId }) {
  const data = TOA_COMPLEXITY_DATA[moduleId] || TOA_COMPLEXITY_DATA['toa-m1']

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Overview Banner */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex items-center gap-2 font-mono text-[11px] mb-1">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">Automata Theory Complexity</span>
            <span className="text-signal font-bold">Chomsky Hierarchy &amp; Bounds</span>
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-ink">
            {data.title}
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft mt-1">
            {data.subtitle}
          </p>
        </CardHeader>
      </Card>

      {/* Complexity Matrix Table */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card overflow-hidden">
        <CardHeader className="border-b border-rule pb-3">
          <CardTitle className="font-serif text-lg font-bold text-ink">
            Algorithm &amp; Language Recognizer Performance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-paper border-b border-rule font-mono text-xs">
                <TableRow>
                  <TableHead className="font-bold text-ink">Algorithm / Operation</TableHead>
                  <TableHead className="font-bold text-signal">Time Complexity</TableHead>
                  <TableHead className="font-bold text-ok">Space Complexity</TableHead>
                  <TableHead className="font-bold text-ink">Theoretical Meaning &amp; University Pointers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-xs">
                {data.rows.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-paper/60 transition-colors">
                    <TableCell className="font-bold text-ink whitespace-nowrap">{row.algo}</TableCell>
                    <TableCell className="font-bold text-signal whitespace-nowrap">{row.time}</TableCell>
                    <TableCell className="font-semibold text-ok whitespace-nowrap">{row.space}</TableCell>
                    <TableCell className="font-sans text-xs text-ink-soft leading-relaxed">{row.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Deep-Dive Theory Card */}
      <Card className="border border-ink bg-paper shadow-[4px_4px_0_var(--rule)]">
        <CardHeader className="border-b border-rule pb-3">
          <CardTitle className="font-serif text-lg font-bold text-ink flex items-center gap-2">
            <span>💡</span>
            <span>{data.deepDiveTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 font-sans text-xs text-ink leading-relaxed">
          {data.deepDiveContent}
        </CardContent>
      </Card>
    </div>
  )
}
