// Theory of Automata (TOA) Syllabus
// Based on CBCGS-HME 2023 syllabus, University of Mumbai
// Department of Information Technology, TCET
// Total Hours: 45

export type TOAModuleId = 'toa-m1' | 'toa-m2' | 'toa-m3' | 'toa-m4' | 'toa-m5' | 'toa-m6'
export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
export type ContentStatus = 'ready' | 'soon'

export interface TOATopicInfo {
  id: string
  title: string
  hours: number
  bloom: BloomLevel
  status: ContentStatus
  description: string
  tags: string[]
  isSelfLearning?: boolean
}

export interface TOAModuleInfo {
  id: TOAModuleId
  code: string
  title: string
  hours: number
  bloomRange: string
  status: ContentStatus
  description: string
  slug: string
  topics: TOATopicInfo[]
}

export const TOA_SYLLABUS: TOAModuleInfo[] = [
  {
    id: 'toa-m1',
    code: 'TOA-M1',
    slug: 'toa-introduction',
    title: 'Introduction to Automata Theory',
    hours: 5,
    bloomRange: 'L1, L2',
    status: 'soon',
    description: 'Mathematical preliminaries: Alphabets, Strings, Languages, Operations on Languages. Sets, Introduction to Chomsky Hierarchy. Overview of automata theory and formal languages. Types of automata: finite, pushdown, Turing machines. Finite Automata (FA) behavior, Distinguishable States, Equivalent States. State Equivalence Theorem. DFA formal definition, simplified notations, state transition diagram, transition table. Language of a DFA. NFA formal definition, Language of an NFA. Finite automata with output (Moore and Mealy Machines). Applications in IT: lexical analysis, protocol design, Text Search, Traffic light control, Medical diagnosis. Introduction to JFLAP software.',
    topics: [
      {
        id: 'toa-math-preliminaries',
        title: 'Mathematical Preliminaries: Strings, Languages & Operations',
        hours: 0.5,
        bloom: 'L1',
        status: 'soon',
        description: 'Alphabets, strings, language definitions, concatenation, union, Kleene closure, and positive closure operations.',
        tags: ['strings', 'alphabet', 'language', 'kleene-star'],
      },
      {
        id: 'toa-chomsky-hierarchy',
        title: 'Chomsky Hierarchy & Types of Formal Languages',
        hours: 0.5,
        bloom: 'L1',
        status: 'soon',
        description: 'Four levels of Chomsky hierarchy: regular (Type 3), context-free (Type 2), context-sensitive (Type 1), recursively enumerable (Type 0).',
        tags: ['chomsky', 'hierarchy', 'formal-languages'],
      },
      {
        id: 'toa-dfa',
        title: 'Deterministic Finite Automata (DFA): Definition & State Diagrams',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'Formal 5-tuple definition (Q, Σ, δ, q0, F), state transition diagram, transition table, simplified notations, and State Equivalence Theorem.',
        tags: ['dfa', 'transition-diagram', 'state-machine'],
      },
      {
        id: 'toa-nfa',
        title: 'Non-Deterministic Finite Automata (NFA) & Language Recognition',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'NFA formal definition, epsilon transitions, NFA language recognition, distinguishable and equivalent states.',
        tags: ['nfa', 'epsilon-nfa', 'state-equivalence'],
      },
      {
        id: 'toa-fa-output',
        title: 'Finite Automata with Output: Moore & Mealy Machines',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'Moore machine: output on states; Mealy machine: output on transitions. State diagrams, equivalence and conversion between Moore and Mealy models.',
        tags: ['moore', 'mealy', 'transducer'],
      },
      {
        id: 'toa-fa-applications',
        title: 'Applications of FA in IT & Introduction to JFLAP',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'Lexical analysis in compilers, protocol design, text search patterns, traffic light control, medical diagnosis systems, and hands-on JFLAP software.',
        tags: ['jflap', 'lexical-analysis', 'applications'],
      },
    ],
  },
  {
    id: 'toa-m2',
    code: 'TOA-M2',
    slug: 'toa-fa-regular-expressions',
    title: 'Finite Automata & Regular Expressions',
    hours: 9,
    bloomRange: 'L1, L2, L3, L4',
    status: 'soon',
    description: 'DFA & NFA Problems. FA with epsilon-transitions, eliminating epsilon-transitions, NFAs into DFAs Conversion, Equivalence of DFAs and NFAs. DFA Minimization. Finite automata with output (Moore and Mealy Machine), Equivalence of Moore and Mealy Machine. Regular expressions (RE): Definition, Regular expressions (RE) Definition, Algebraic laws for RE, applications of Res, FA and RE, RE to FA, FA to RE, Regular grammars and FA, FA for regular grammar, Regular grammar for FA. Equivalence between two FAs. Some decision properties of Regular languages: emptiness, finiteness, membership. RegEx in Python and JFLAP. Designing of FAs and Conversion of RE into FA and Vice versa.',
    topics: [
      {
        id: 'toa-epsilon-nfa',
        title: 'ε-NFA: Epsilon Transitions & Elimination',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'ε-closure computation, eliminating epsilon transitions, converting ε-NFA to plain NFA and to DFA via subset construction.',
        tags: ['epsilon-nfa', 'epsilon-closure', 'subset-construction'],
      },
      {
        id: 'toa-nfa-to-dfa',
        title: 'NFA to DFA Conversion & Equivalence Proof',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Subset construction algorithm, power set of states, equivalence proof that DFAs and NFAs accept the same class of languages.',
        tags: ['nfa-to-dfa', 'subset-construction', 'equivalence'],
      },
      {
        id: 'toa-dfa-minimization',
        title: 'DFA Minimization (Table-Filling Algorithm)',
        hours: 1.0,
        bloom: 'L3',
        status: 'soon',
        description: 'Myhill-Nerode distinguishability table, dead state removal, merge equivalent state pairs, construct minimized DFA.',
        tags: ['dfa-minimization', 'table-filling', 'myhill-nerode'],
      },
      {
        id: 'toa-regular-expressions',
        title: 'Regular Expressions: Syntax, Algebraic Laws & Applications',
        hours: 1.5,
        bloom: 'L2',
        status: 'soon',
        description: 'Kleene operators (*, +, ?), union, concatenation, algebraic identities. Practical use in Python regex and JFLAP.',
        tags: ['regex', 'regular-expression', 'python-regex'],
      },
      {
        id: 'toa-re-to-fa',
        title: 'RE ↔ FA Conversion: Thompson\'s Construction & Arden\'s Theorem',
        hours: 2.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Thompson\'s construction (RE to NFA), Arden\'s lemma for FA to RE, regular grammar equivalence (Type 3 Chomsky).',
        tags: ['thompson', 'ardens-lemma', 're-to-nfa', 'fa-to-re'],
      },
      {
        id: 'toa-decision-properties',
        title: 'Decision Properties of Regular Languages',
        hours: 1.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Algorithms to decide emptiness, finiteness, and membership for regular languages. Equivalence testing of two FAs.',
        tags: ['decision-properties', 'emptiness', 'membership', 'finiteness'],
      },
      {
        id: 'toa-regex-python-jflap',
        title: 'RegEx in Python & JFLAP Practical Design',
        hours: 1.0,
        bloom: 'L3',
        status: 'soon',
        description: 'Python re module for pattern matching, JFLAP simulator for FA design, conversion exercises.',
        tags: ['python', 'jflap', 'practical', 'regex'],
        isSelfLearning: true,
      },
    ],
  },
  {
    id: 'toa-m3',
    code: 'TOA-M3',
    slug: 'toa-regular-languages-pumping-lemma',
    title: 'Regular Languages & Pumping Lemma',
    hours: 6,
    bloomRange: 'L1, L2, L3, L4',
    status: 'soon',
    description: 'Regular languages and their properties. Proving languages to be non-regular using the Pumping Lemma and its applications. Some closure properties of Regular languages: Closure under Boolean operations, reversal, homomorphism, inverse homomorphism, etc. Myhill-Nerode Theorem.',
    topics: [
      {
        id: 'toa-regular-languages-properties',
        title: 'Properties of Regular Languages',
        hours: 1.0,
        bloom: 'L2',
        status: 'soon',
        description: 'Definition of regular language, closure under union, intersection, complementation, concatenation, and Kleene star.',
        tags: ['regular-languages', 'closure', 'boolean-operations'],
      },
      {
        id: 'toa-pumping-lemma',
        title: 'Pumping Lemma for Regular Languages: Proof & Application',
        hours: 2.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Statement and proof of Pumping Lemma. Using it to prove languages non-regular (e.g., aⁿbⁿ, palindromes). Common pumping lemma strategies.',
        tags: ['pumping-lemma', 'non-regular', 'proof'],
      },
      {
        id: 'toa-closure-properties',
        title: 'Closure Properties: Reversal, Homomorphism & Inverse Homomorphism',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Proving closure of regular languages under reversal, (inverse) homomorphism, quotient, and substitution operations.',
        tags: ['homomorphism', 'reversal', 'closure-properties'],
      },
      {
        id: 'toa-myhill-nerode',
        title: 'Myhill-Nerode Theorem & Minimization Connection',
        hours: 1.5,
        bloom: 'L4',
        status: 'soon',
        description: 'Right-invariant equivalence classes, index of a language, Myhill-Nerode theorem, its use to prove non-regularity and to establish minimum DFA uniqueness.',
        tags: ['myhill-nerode', 'equivalence-classes', 'minimum-dfa'],
      },
    ],
  },
  {
    id: 'toa-m4',
    code: 'TOA-M4',
    slug: 'toa-cfg-cfl',
    title: 'Context-Free Grammars & Context-Free Languages',
    hours: 8,
    bloomRange: 'L1, L2, L3, L4, L5',
    status: 'soon',
    description: 'Chomsky Hierarchy. Context-free Grammar: Formal definition, sentential forms, leftmost and rightmost derivations, the language of a CFG. Derivation tree or Parse tree: Definition, Relationship between parse trees and derivations. Parsing and ambiguity, Application of CFGs, Ambiguity in grammars and Languages. Simplification of CFGs: Removing useless symbols, epsilon-Productions, and unit productions, Normal forms - CNF and GNF. Proving that some languages are not context free using Pumping lemma for CFLs, applications. Some closure properties of CFLs: Closure under union, concatenation, Kleene closure, substitution, Inverse homomorphism, reversal, intersection with regular set, etc. Some more decision properties of CFLs. Review of some undecidable CFL problems. Context-sensitive Grammar and linear bounded Automata. Applications of CFG (Sentiment Analysis, NLP, etc.)',
    topics: [
      {
        id: 'toa-cfg-definition',
        title: 'CFG: Formal Definition, Sentential Forms & Derivations',
        hours: 1.0,
        bloom: 'L1',
        status: 'soon',
        description: 'CFG 4-tuple (V, Σ, P, S), sentential forms, leftmost derivation (LMD), rightmost derivation (RMD), language of a CFG.',
        tags: ['cfg', 'grammar', 'derivation', 'sentential-forms'],
      },
      {
        id: 'toa-parse-trees-ambiguity',
        title: 'Parse Trees, Leftmost/Rightmost Derivations & Ambiguity',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Derivation tree construction, yield of a parse tree. Ambiguous grammars, inherently ambiguous languages, unambiguous grammar design.',
        tags: ['parse-tree', 'ambiguity', 'yield', 'leftmost'],
      },
      {
        id: 'toa-cfg-simplification',
        title: 'Simplification of CFGs: Useless Symbols, ε-Productions & Unit Rules',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Removing useless symbols (generating + reachable), eliminating ε-productions (nullable sets), eliminating unit productions (unit pairs).',
        tags: ['cfg-simplification', 'epsilon-productions', 'unit-productions', 'useless-symbols'],
      },
      {
        id: 'toa-cnf-gnf',
        title: 'Normal Forms: Chomsky Normal Form (CNF) & Greibach Normal Form (GNF)',
        hours: 1.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Converting any CFG to CNF (all rules A → BC or A → a) and GNF (all rules A → aα). CYK parsing algorithm using CNF.',
        tags: ['cnf', 'gnf', 'normal-form', 'cyk'],
      },
      {
        id: 'toa-pumping-lemma-cfl',
        title: 'Pumping Lemma for CFLs & Proving Non-Context-Freeness',
        hours: 1.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Pumping lemma for context-free languages (Uvwxy theorem), applications to show aⁿbⁿcⁿ, {ww} non-CFLs.',
        tags: ['pumping-lemma-cfl', 'non-context-free', 'uvwxy'],
      },
      {
        id: 'toa-cfl-closure-decision',
        title: 'CFL Closure Properties, Undecidable Problems & CSG/LBA',
        hours: 2.0,
        bloom: 'L5',
        status: 'soon',
        description: 'CFL closure under union, concatenation, Kleene*, intersection with regular set. Undecidable CFL problems. Context-sensitive grammar and Linear Bounded Automata (LBA). NLP/sentiment analysis applications.',
        tags: ['cfl-closure', 'undecidability', 'context-sensitive', 'lba', 'nlp'],
      },
    ],
  },
  {
    id: 'toa-m5',
    code: 'TOA-M5',
    slug: 'toa-pushdown-automata',
    title: 'Pushdown Automata & Context-Free Language',
    hours: 8,
    bloomRange: 'L1, L2, L3, L4, L5',
    status: 'soon',
    description: 'Formal definition, behavior and graphical notation, Instantaneous descriptions (IDs), Types of PDA, Problems on PDA. Equivalence of PDAs and CFGs: CFG to PDA, PDA to CFG. Languages of DPDAs and NPDAs. DPDA vs NPDA comparison. Applications of PDA (Tower of Hanoi Problem, Syntax Analysis, etc.). JFLAP software to design PDAs.',
    topics: [
      {
        id: 'toa-pda-definition',
        title: 'PDA: Formal Definition, ID Notation & Graphical Representation',
        hours: 1.5,
        bloom: 'L2',
        status: 'soon',
        description: 'PDA 7-tuple (Q, Σ, Γ, δ, q0, Z0, F), instantaneous descriptions (ID), move relation ⊢, types of acceptance (final state vs empty stack).',
        tags: ['pda', 'instantaneous-description', 'formal-definition'],
      },
      {
        id: 'toa-pda-types',
        title: 'Deterministic vs Non-Deterministic PDA (DPDA & NPDA)',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Definition of DPDA, languages accepted by DPDA vs NPDA. NPDA is strictly more powerful than DPDA. Comparison with DFA/NFA analogy.',
        tags: ['dpda', 'npda', 'deterministic', 'non-deterministic'],
      },
      {
        id: 'toa-cfg-to-pda',
        title: 'CFG ↔ PDA Equivalence: Conversions in Both Directions',
        hours: 2.0,
        bloom: 'L4',
        status: 'soon',
        description: 'Constructing PDA from CFG (top-down leftmost derivation simulation), extracting CFG from PDA (Aho-Ullman triple construction).',
        tags: ['cfg-to-pda', 'pda-to-cfg', 'equivalence'],
      },
      {
        id: 'toa-pda-problems',
        title: 'PDA Design Problems & Languages of DPDAs',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'Design PDAs for aⁿbⁿ, balanced parentheses, palindromes, {ww^R}, and other canonical CFL examples. Languages accepted only by DPDA vs NPDA.',
        tags: ['pda-problems', 'dpda-languages', 'examples'],
      },
      {
        id: 'toa-pda-applications',
        title: 'Applications of PDA: Tower of Hanoi, Syntax Analysis & JFLAP',
        hours: 1.5,
        bloom: 'L5',
        status: 'soon',
        description: 'Stack-based algorithms (Tower of Hanoi), LL/LR parsing using stack automaton, JFLAP PDA simulation and design exercises.',
        tags: ['tower-of-hanoi', 'syntax-analysis', 'jflap', 'applications'],
        isSelfLearning: true,
      },
    ],
  },
  {
    id: 'toa-m6',
    code: 'TOA-M6',
    slug: 'toa-turing-machines',
    title: 'Turing Machines & Recursively Enumerable Languages',
    hours: 9,
    bloomRange: 'L1, L2, L3, L4, L5',
    status: 'soon',
    description: 'Formal definition and behavior, Transitions (diagrams, Functions and Tables). Language of a TM. Design of TM as generator, decider and acceptor. Variants of TM: Non-deterministic, Multitrack, Multitape, Universal TM. Design of TMs as a computer of simple functions: Unary, Binary (Logical and Arithmetic), String operations (Length, Concat, Match, Substring Check, etc.). The Halting Problem. Advanced Topics: Probabilistic Automata, Quantum automata, Applications in AI and machine learning.',
    topics: [
      {
        id: 'toa-tm-definition',
        title: 'Turing Machine: Formal Definition, Transitions & Instantaneous Descriptions',
        hours: 1.5,
        bloom: 'L1',
        status: 'soon',
        description: 'TM 7-tuple (Q, Σ, Γ, δ, q0, B, F), transition function diagrams and tables, ID notation, moves (left, right, stay).',
        tags: ['turing-machine', 'formal-definition', 'transition-table'],
      },
      {
        id: 'toa-tm-design',
        title: 'Designing TMs as Generators, Deciders & Acceptors',
        hours: 1.5,
        bloom: 'L3',
        status: 'soon',
        description: 'TM as language acceptor (halt-accept/halt-reject), TM as decider (always halts), TM as generator of a language. Language of a TM.',
        tags: ['tm-design', 'acceptor', 'decider', 'generator'],
      },
      {
        id: 'toa-tm-variants',
        title: 'TM Variants: Non-Deterministic, Multitrack, Multitape & Universal TM',
        hours: 1.5,
        bloom: 'L2',
        status: 'soon',
        description: 'Equivalence of NDTM and DTM, efficiency gains of multitrack and multitape TMs, Universal Turing Machine (UTM) as interpreter, Church-Turing Thesis.',
        tags: ['ndtm', 'multitape', 'utm', 'church-turing'],
      },
      {
        id: 'toa-tm-functions',
        title: 'TMs as Computers: Arithmetic, String Operations',
        hours: 1.5,
        bloom: 'L4',
        status: 'soon',
        description: 'Design TMs for unary/binary addition, multiplication, logical AND/OR, string length, concatenation, substring matching, palindrome check.',
        tags: ['tm-arithmetic', 'string-operations', 'computation', 'examples'],
      },
      {
        id: 'toa-halting-problem',
        title: 'The Halting Problem & Undecidability',
        hours: 2.0,
        bloom: 'L5',
        status: 'soon',
        description: 'Proof by diagonalization that the Halting Problem is undecidable. Reduction technique. Implications for recursive and recursively enumerable languages.',
        tags: ['halting-problem', 'undecidability', 'diagonalization', 'reduction'],
      },
      {
        id: 'toa-advanced-topics',
        title: 'Advanced: Probabilistic & Quantum Automata, AI/ML Applications',
        hours: 1.0,
        bloom: 'L5',
        status: 'soon',
        description: 'Probabilistic TM, Quantum automata basics, connections to AI/ML: parsing in NLP, automata-based verification, model checking.',
        tags: ['quantum-automata', 'probabilistic-tm', 'ai-ml', 'nlp'],
        isSelfLearning: true,
      },
    ],
  },
]


export function getTOAModule(idOrSlug: string): TOAModuleInfo | undefined {
  return TOA_SYLLABUS.find(m =>
    m.id === idOrSlug ||
    m.slug === idOrSlug ||
    m.code.toLowerCase() === idOrSlug.toLowerCase() ||
    m.code.toLowerCase().replace('-', '') === idOrSlug.toLowerCase()
  )
}
