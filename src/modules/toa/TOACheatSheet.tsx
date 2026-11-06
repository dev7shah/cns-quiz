"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { TOAModuleId, getTOAModule } from "@/lib/syllabus/toaSyllabus"
import { AlertTriangle, BookOpen, CheckCircle2, GitBranch, Cpu, Network } from "lucide-react"

export interface CheatSheetData {
  title: string
  hours: string
  bloom: string
  coreConcepts: { name: string; summary: string }[]
  keyFormulas: string[]
  commonTraps: string[]
}

export const TOA_CHEAT_SHEETS: Record<TOAModuleId, CheatSheetData> = {
  'toa-m1': {
    title: "Module 1: Mathematical Preliminaries & Finite Automata (DFA, NFA, Moore/Mealy)",
    hours: "5 Hours",
    bloom: "Bloom L1, L2",
    coreConcepts: [
      { name: "Formal Language Definitions", summary: "Alphabet Σ (non-empty finite set of symbols). String w (finite sequence over Σ). Language L ⊆ Σ*. Empty string ε (|ε| = 0). Empty language ∅ (|∅| = 0)." },
      { name: "DFA Formal 5-Tuple", summary: "M = (Q, Σ, δ, q0, F) where Q = finite set of states, Σ = alphabet, δ: Q × Σ → Q is total transition function, q0 ∈ Q is start state, F ⊆ Q is set of final/accepting states." },
      { name: "NFA Formal 5-Tuple", summary: "M = (Q, Σ, δ, q0, F) where transition function δ: Q × (Σ ∪ {ε}) → 2^Q maps to power set of states. An NFA accepts w if at least ONE computation branch ends in F." },
      { name: "Moore Machine (Output on State)", summary: "Transducer M = (Q, Σ, Δ, δ, λ, q0) where output function λ: Q → Δ. For input string of length n, output string has length n + 1 (initial state produces output before reading input)." },
      { name: "Mealy Machine (Output on Transition)", summary: "Transducer M = (Q, Σ, Δ, δ, λ, q0) where output function λ: Q × Σ → Δ. For input string of length n, output string has length n." },
      { name: "Chomsky Hierarchy Overview", summary: "Type 3: Regular (DFA/NFA) ⊂ Type 2: Context-Free (PDA) ⊂ Type 1: Context-Sensitive (LBA) ⊂ Type 0: Recursively Enumerable (Turing Machine)." }
    ],
    keyFormulas: [
      "DFA Transition: δ: Q × Σ → Q (Exactly 1 transition per state per symbol)",
      "NFA Transition: δ: Q × (Σ ∪ {ε}) → 2^Q (0, 1, or multiple next states)",
      "Moore Output Length: |Output| = |Input| + 1",
      "Mealy Output Length: |Output| = |Input|",
      "Language accepted by DFA: L(M) = { w ∈ Σ* | δ*(q0, w) ∈ F }"
    ],
    commonTraps: [
      "In a DFA, forgetting to define transitions for EVERY symbol in Σ from EVERY state: Unlike NFAs, DFAs are completely deterministic and must have total transition functions (use dead/trap states when needed).",
      "Confusing Moore and Mealy output lengths: A Moore machine outputs λ(q0) initially, so string '101' yields 4 output symbols. A Mealy machine yields exactly 3 symbols.",
      "Assuming empty string ε is the same as empty language ∅: {ε} has size 1 and contains the empty word; ∅ has size 0 and contains no strings."
    ]
  },
  'toa-m2': {
    title: "Module 2: Finite Automata & Regular Expressions",
    hours: "9 Hours",
    bloom: "Bloom L1, L2, L3, L4",
    coreConcepts: [
      { name: "ε-Closure Computation", summary: "ε-closure(q) is the set of all states reachable from q by following zero or more ε-transitions. Used during subset construction to convert ε-NFA to DFA." },
      { name: "Subset Construction Algorithm", summary: "Converts NFA to equivalent DFA. New DFA states are subsets of NFA states. Start state is ε-closure(q0). DFA final states are any subset containing at least one NFA final state." },
      { name: "DFA Minimization (Table-Filling / Myhill-Nerode)", summary: "Removes unreachable states, then creates a lower-triangular table for all state pairs (p, q). Mark pairs where one is final and one is non-final. Iteratively mark (p, q) if (δ(p, a), δ(q, a)) is marked for any a ∈ Σ. Unmarked pairs are merged." },
      { name: "Thompson's Construction (RE → NFA)", summary: "Constructs ε-NFA with 1 start and 1 accept state for base symbols a, ε, ∅, and inductively connects them for union (R1 + R2), concatenation (R1 · R2), and Kleene star (R1*)." },
      { name: "Arden's Theorem (FA → RE)", summary: "If P and Q are regular expressions over Σ and P does not contain ε, then the equation R = Q + RP has a UNIQUE solution: R = QP*." },
      { name: "Decision Properties of Regular Languages", summary: "Emptiness (check if any final state is reachable from q0 via BFS/DFS), Finiteness (check for cycles in states leading to final state), Membership (simulate DFA in O(|w|) time)." }
    ],
    keyFormulas: [
      "Arden's Theorem: R = Q + RP ⟹ R = Q · P* (P must not contain ε)",
      "Distributive Law: R(S + T) = RS + RT and (S + T)R = SR + TR",
      "Kleene Star Identities: (R*)* = R* | ε + RR* = R* | (R + S)* = (R*S*)*",
      "Maximum states in DFA from n-state NFA: 2^n states"
    ],
    commonTraps: [
      "Applying Arden's theorem when P contains ε: If P contains ε, then R = QP* is not the unique solution (infinite solutions exist).",
      "Not checking reachability before minimizing DFA: Always eliminate unreachable states from q0 FIRST before filling the Myhill-Nerode distinguishability table.",
      "Assuming NFA accepts more languages than DFA: NFAs and DFAs have EQUAL computational expressiveness; both recognize precisely the class of regular languages."
    ]
  },
  'toa-m3': {
    title: "Module 3: Regular Languages & Pumping Lemma",
    hours: "6 Hours",
    bloom: "Bloom L1, L2, L3, L4",
    coreConcepts: [
      { name: "Pumping Lemma for Regular Languages", summary: "Let L be a regular language. Then there exists a pumping length p ≥ 1 such that every string s ∈ L with |s| ≥ p can be divided into three parts s = xyz satisfying: 1. |y| > 0, 2. |xy| ≤ p, 3. for all i ≥ 0, xy^i z ∈ L." },
      { name: "Proof by Adversary Technique", summary: "To prove L is NOT regular: Assume L is regular with pumping length p. Choose a clever string s ∈ L with |s| ≥ p expressed in terms of p (e.g. s = 0^p 1^p). Consider all decompositions s = xyz with |xy| ≤ p and |y| > 0. Find an integer i ≥ 0 such that xy^i z ∉ L. Contradiction!" },
      { name: "Closure Properties of Regular Languages", summary: "Closed under: Union, Intersection, Complement, Concatenation, Kleene Star, Reversal, Homomorphism, Inverse Homomorphism, Difference." },
      { name: "Myhill-Nerode Theorem", summary: "A language L is regular if and only if the number of equivalence classes of its right-invariant equivalence relation R_L is FINITE. The number of equivalence classes equals the number of states in the unique minimal DFA." }
    ],
    keyFormulas: [
      "Pumping Lemma Conditions: s = xyz | |y| ≥ 1 | |xy| ≤ p | ∀i ≥ 0, xy^i z ∈ L",
      "Pumping Down: Testing i = 0 (string xz must be in L)",
      "De Morgan's Closure for Intersection: L1 ∩ L2 = (L1' ∪ L2')'",
      "Myhill-Nerode Index: Index(R_L) = Number of states in minimal DFA"
    ],
    commonTraps: [
      "Choosing a specific value for pumping length p: You CANNOT choose p = 3 or p = 5. The adversary gives you p; your chosen string s must be parameterized in terms of p.",
      "Choosing a string that doesn't force y into a specific region: Choosing |xy| ≤ p ensures that y lies ENTIRELY within the first p characters of s.",
      "Attempting to use the Pumping Lemma to prove a language IS regular: The Pumping Lemma is a necessary condition, NOT a sufficient condition. It can only be used to prove NON-regularity."
    ]
  },
  'toa-m4': {
    title: "Module 4: Context-Free Grammars (CFG) & Context-Free Languages (CFL)",
    hours: "8 Hours",
    bloom: "Bloom L1, L2, L3, L4, L5",
    coreConcepts: [
      { name: "CFG Formal 4-Tuple", summary: "G = (V, T, P, S) where V = set of variables/non-terminals, T = set of terminals, P = set of production rules of the form A → α (where A ∈ V, α ∈ (V ∪ T)*), S ∈ V is start symbol." },
      { name: "Leftmost vs Rightmost Derivations", summary: "Leftmost Derivation (LMD): replace leftmost non-terminal at every derivation step. Rightmost Derivation (RMD): replace rightmost non-terminal at every step." },
      { name: "Ambiguous Grammars", summary: "A CFG is ambiguous if there exists at least one string w ∈ L(G) that has TWO OR MORE distinct parse trees (or distinct LMDs). Languages that only have ambiguous grammars are called inherently ambiguous (e.g. { a^i b^j c^k | i = j or j = k })." },
      { name: "CFG Simplification Steps", summary: "1. Eliminate Useless Symbols (eliminate non-generating variables, then non-reachable variables). 2. Eliminate ε-productions (find nullable variables). 3. Eliminate Unit Productions (A → B where B ∈ V)." },
      { name: "Chomsky Normal Form (CNF)", summary: "Every production is of the form A → BC or A → a (where A, B, C ∈ V and a ∈ T). If |w| = n, any derivation in CNF requires exactly 2n - 1 steps. Used in the CYK O(n³) parsing algorithm." },
      { name: "Pumping Lemma for CFLs (uvwxy Theorem)", summary: "If L is CFL, ∃ pumping length p such that any s ∈ L with |s| ≥ p can be written s = uvwxy with: 1. |vwx| ≤ p, 2. |vx| ≥ 1, 3. ∀i ≥ 0, uv^i wx^i y ∈ L. Proves { a^n b^n c^n | n ≥ 0 } is NOT context-free." }
    ],
    keyFormulas: [
      "CNF Rule Forms: A → BC or A → a",
      "CNF Derivation Length: Steps = 2n - 1 for string of length n",
      "GNF (Greibach Normal Form): A → aα (where a ∈ T, α ∈ V*)",
      "CFL Pumping Lemma: s = uvwxy | |vwx| ≤ p | |vx| ≥ 1 | ∀i ≥ 0, uv^i wx^i y ∈ L"
    ],
    commonTraps: [
      "Order of CFG simplification: Must eliminate ε-productions FIRST, then Unit productions, then Useless symbols. Reversing the order re-introduces useless or unit productions.",
      "Assuming CFLs are closed under intersection and complement: CFLs are NOT closed under intersection (e.g. L1 = a^n b^n c^m and L2 = a^m b^n c^n are CFL, but L1 ∩ L2 = a^n b^n c^n is NOT CFL) or complement.",
      "Assuming all unambiguous grammars are in CNF: CNF is a restricted syntactic normal form; ambiguity is a semantic property of multiple parse trees."
    ]
  },
  'toa-m5': {
    title: "Module 5: Pushdown Automata (PDA) & Context-Free Languages",
    hours: "8 Hours",
    bloom: "Bloom L1, L2, L3, L4, L5",
    coreConcepts: [
      { name: "PDA Formal 7-Tuple", summary: "M = (Q, Σ, Γ, δ, q0, Z0, F) where Q = states, Σ = input alphabet, Γ = stack alphabet, δ: Q × (Σ ∪ {ε}) × Γ → 2^(Q × Γ*), q0 = start state, Z0 ∈ Γ = initial stack bottom marker, F ⊆ Q = accepting states." },
      { name: "Instantaneous Description (ID)", summary: "(q, w, α) denotes current state q, remaining input string w, and current stack contents α (top of stack is leftmost symbol). Move relation ⊢ transitions between IDs." },
      { name: "Acceptance Modes", summary: "1. Acceptance by Final State: L(M) = { w | (q0, w, Z0) ⊢* (q_f, ε, γ) where q_f ∈ F }. 2. Acceptance by Empty Stack: N(M) = { w | (q0, w, Z0) ⊢* (q, ε, ε) }. Both acceptance modes are provably equivalent for NPDAs." },
      { name: "DPDA vs NPDA", summary: "DPDA has at most 1 choice: for any q ∈ Q, X ∈ Γ, if δ(q, a, X) is non-empty for some a ∈ Σ, then δ(q, ε, X) must be empty. DPDAs accept Deterministic CFLs (DCFLs). NPDAs are strictly MORE powerful than DPDAs (e.g. Palindromes { w w^R } requires NPDA)." },
      { name: "CFG to PDA Conversion", summary: "Top-Down Parser: Single-state PDA simulating leftmost derivation. δ(q, ε, A) = {(q, α)} for production A → α; δ(q, a, a) = {(q, ε)} for terminals." }
    ],
    keyFormulas: [
      "PDA Transition: δ(q, a, X) = { (p, γ) } (pop X, push string γ onto stack)",
      "Pushing symbol Y on top of X: Replace X with YX in transition",
      "Popping symbol X: Replace X with ε in transition",
      "Leaving X unchanged: Replace X with X in transition"
    ],
    commonTraps: [
      "Thinking DPDA is equivalent to NPDA: Unlike finite automata where DFA ≡ NFA, for pushdown automata NPDA is STRICTLY MORE POWERFUL than DPDA (DCFL ⊂ CFL).",
      "Forgetting the initial stack symbol Z0: Stack must be initialized with Z0 to avoid popping from an empty stack before input is finished.",
      "Confusing stack reading order: By standard convention in IDs (q, w, α), the LEFTMOST symbol of α represents the TOP of the stack."
    ]
  },
  'toa-m6': {
    title: "Module 6: Turing Machines & Recursively Enumerable Languages",
    hours: "9 Hours",
    bloom: "Bloom L1, L2, L3, L4, L5",
    coreConcepts: [
      { name: "Turing Machine Formal 7-Tuple", summary: "M = (Q, Σ, Γ, δ, q0, B, F) where Q = states, Σ = input alphabet, Γ = tape alphabet (Σ ⊂ Γ), B ∈ Γ \\ Σ is blank symbol, δ: Q × Γ → Q × Γ × {L, R, S} is partial transition function, q0 = start state, F = halt-accept states." },
      { name: "TM Acceptance & Classes of Languages", summary: "Recursively Enumerable (RE / Type 0): TM halts and accepts on strings in L; on strings not in L, TM may halt-reject or loop infinitely. Recursive (Decidable): TM always halts on every input (accepts or rejects)." },
      { name: "Church-Turing Thesis", summary: "Any algorithmic process that can be computed by a human or mechanical device can be simulated by a standard single-tape Turing Machine. All variants (Multitape, NDTM, Multitrack) have equal computational power." },
      { name: "The Halting Problem (Undecidable)", summary: "H = { (M, w) | TM M halts on input w }. Alan Turing proved by Cantor's diagonalization argument that H is UNDECIDABLE. No algorithm can determine whether an arbitrary program will halt or run forever." },
      { name: "Universal Turing Machine (UTM)", summary: "A single programmable TM that takes the encoded description ⟨M⟩ of another TM and input w, and simulates M's execution on w. The conceptual foundation of stored-program computers (von Neumann architecture)." },
      { name: "Reducibility Technique", summary: "To prove problem P2 is undecidable: Reduce known undecidable Halting Problem H ≤ P2. If a decider for P2 existed, it could solve H, which is impossible." }
    ],
    keyFormulas: [
      "TM Transition: δ(q, X) = (p, Y, D) (in state q reading X: write Y, move direction D ∈ {L, R}, enter state p)",
      "Instantaneous Description: X1 X2 ... X_{i-1} q X_i ... X_n (Head points to X_i, current state is q)",
      "Diagonalization: D(⟨M⟩) = Halt and Reject if M accepts ⟨M⟩; Loop forever if M rejects ⟨M⟩. Evaluating D(⟨D⟩) yields logical contradiction."
    ],
    commonTraps: [
      "Confusing Recursive (Decidable) with Recursively Enumerable (Turing Recognizable): Recursive languages ALWAYS halt (decider). RE languages may loop forever on non-member inputs.",
      "Thinking multitape TMs recognize more languages than single-tape TMs: A multitape TM can be simulated by a single-tape TM with quadratic time overhead O(T²); their language recognition capabilities are identical.",
      "Assuming the Halting Problem is undecidable because current computers are too slow: It is a fundamental MATHEMATICAL impossibility, independent of computer speed, memory, or architecture."
    ]
  }
}

export default function TOACheatSheet({ moduleId }: { moduleId: TOAModuleId }) {
  const mod = getTOAModule(moduleId)
  const sheet = TOA_CHEAT_SHEETS[moduleId] || TOA_CHEAT_SHEETS['toa-m1']

  if (!mod) return null

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">{mod.code} Formula Sheet</span>
            <span className="text-signal font-bold">{sheet.hours} · {sheet.bloom}</span>
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-ink">
            {sheet.title}
          </CardTitle>
          <p className="font-sans text-xs text-ink-soft mt-1">
            Condensed exam revision sheet: Formal definitions, state machine rules, theorems, equations, and common university exam traps.
          </p>
        </CardHeader>
      </Card>

      {/* 1. Core Concepts */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2 border-b border-rule pb-2">
          <BookOpen className="h-5 w-5 text-signal" />
          <span>1. Core Theorems &amp; Formal Definitions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sheet.coreConcepts.map((concept, idx) => (
            <div key={idx} className="p-4 border border-rule bg-card space-y-2">
              <div className="font-mono text-xs font-bold text-ink flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-paper border border-ink text-signal text-[10px]">§{idx + 1}</span>
                <span>{concept.name}</span>
              </div>
              <p className="font-sans text-xs text-ink-soft leading-relaxed">
                {concept.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Key Formulas & Equations */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2 border-b border-rule pb-2">
          <GitBranch className="h-5 w-5 text-ok" />
          <span>2. Transition Rules, Equations &amp; Proof Identities</span>
        </h3>
        <div className="p-5 border-2 border-ink bg-paper shadow-[4px_4px_0_var(--rule)] space-y-3 font-mono text-xs">
          {sheet.keyFormulas.map((formula, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 bg-card border border-rule">
              <span className="text-ok font-bold">►</span>
              <code className="text-ink font-semibold flex-1 overflow-x-auto">{formula}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Common Exam Traps */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-bad flex items-center gap-2 border-b border-bad/30 pb-2">
          <AlertTriangle className="h-5 w-5 text-bad" />
          <span>3. Examiner Traps &amp; Common Hall-Ticket Mistakes</span>
        </h3>
        <div className="space-y-3">
          {sheet.commonTraps.map((trap, idx) => (
            <div key={idx} className="p-4 border-l-4 border-bad bg-bad/5 border border-rule/50 space-y-1">
              <div className="font-mono text-xs font-bold text-bad flex items-center gap-1.5">
                <span>⚠ Trap #{idx + 1}</span>
              </div>
              <p className="font-sans text-xs text-ink leading-relaxed">
                {trap}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
