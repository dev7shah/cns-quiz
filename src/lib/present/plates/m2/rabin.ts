import { Plate, TopicPresentation } from "@/lib/present/types"

export const rabinPlates: Plate[] = [
  // 1. Hook
  {
    id: 'rabin-hook',
    kind: 'hook',
    title: 'Provable Equivalence to Factoring',
    subtitle: 'Rabin Cryptosystem (1979): The 4-Root Asymmetric Cipher',
    caption: 'While RSA is believed to be as hard as factoring, Michael Rabin proved that cracking the Rabin cryptosystem is mathematically equivalent to factoring n. However, decryption yields four candidate roots.',
    eli5Caption: 'Encrypting is as simple as squaring a number. Decrypting produces 4 possible answers, and you have to pick the right one.',
    speakerNotes: {
      script: 'In 1979, Michael Rabin created the first asymmetric cryptosystem with provable security. For RSA, breaking ciphertext might conceivably be easier than factoring n (no one has proven they are equivalent). For Rabin, extracting square roots modulo n is mathematically proven to be as hard as factoring n.',
      likelyQuestions: [
        {
          question: 'If Rabin is provably secure and faster to encrypt than RSA, why isn’t it more popular?',
          answer: 'Because of the 4-to-1 decryption ambiguity. The receiver gets four candidate messages and needs extra redundancy bits to identify the authentic message.'
        }
      ]
    }
  },

  // 2. Concept: Mathematical Structure & Blum Primes
  {
    id: 'rabin-math',
    kind: 'concept',
    title: 'Blum Primes & Fast Square Root Extraction',
    subtitle: 'Primes p ≡ q ≡ 3 (mod 4) and Euler’s Criterion',
    caption: 'By choosing Blum primes (p ≡ 3 mod 4), computing square roots modulo p is instantaneous: m_p = C^((p+1)/4) mod p.',
    eli5Caption: 'Because (p+1) is divisible by 4, we can find square roots mod p with a single exponentiation.',
    comparison: {
      leftTitle: 'Rabin Cryptosystem',
      rightTitle: 'RSA Cryptosystem',
      differences: [
        {
          feature: 'Encryption Formula',
          left: 'C = M² mod n (single modular multiplication, exponent e = 2)',
          right: 'C = M^e mod n (requires square-and-multiply exponentiation, e=65537)'
        },
        {
          feature: 'Encryption Speed',
          left: 'Extremely fast: 1 modular squaring (fastest public-key encryption)',
          right: 'Moderate: 17 modular multiplications'
        },
        {
          feature: 'Security Proof',
          left: 'Provably equivalent to integer factoring (breaking Rabin = factoring n)',
          right: 'Factoring is sufficient to break RSA, but equivalence is unproven'
        },
        {
          feature: 'Decryption Output',
          left: 'Four candidate square roots in Z_n; requires padding redundancy to filter',
          right: 'Unique 1-to-1 decryption output: M = C^d mod n'
        }
      ],
      summaryTakeaway: 'Rabin trades decryption clarity for mathematical provability and ultra-fast encryption.'
    },
    speakerNotes: {
      script: 'Walk through Euler’s criterion: If p ≡ 3 mod 4, then (p+1)/4 is an integer. By Fermat’s Little Theorem, (C^((p+1)/4))^2 = C^((p+1)/2) = C × C^((p-1)/2) ≡ C × (+1) = C (mod p). That is why Blum primes make root-finding trivial.',
      likelyQuestions: [
        {
          question: 'How do we solve for roots modulo n from roots mod p and q?',
          answer: 'Using the Chinese Remainder Theorem (CRT) with Bézout coefficients: x = (a · q · c_p + b · p · c_q) mod n.'
        }
      ]
    }
  },

  // 3. Worked Example: Small Numbers
  {
    id: 'rabin-worked-example',
    kind: 'concept',
    title: 'Worked Numerical Example with Blum Primes',
    subtitle: 'p = 7, q = 11, n = 77, Plaintext M = 20',
    caption: 'Observe squaring and root extraction: C = 20² mod 77 = 400 mod 77 = 15. The CRT uncovers four roots: 13, 20, 57, 64.',
    eli5Caption: 'Four different numbers (13, 20, 57, 64) all produce 15 when squared mod 77. One of them is our original message.',
    comparison: {
      leftTitle: 'Encryption & Modular Roots',
      rightTitle: 'CRT Four-Root Synthesis',
      differences: [
        {
          feature: '1. Key Generation',
          left: 'p = 7 (7 ≡ 3 mod 4), q = 11 (11 ≡ 3 mod 4), n = 77',
          right: 'Public Key = 77 | Private Key = (7, 11)'
        },
        {
          feature: '2. Encryption',
          left: 'M = 20 -> C = 20² mod 77 = 400 mod 77 = 15',
          right: 'Alice transmits ciphertext C = 15'
        },
        {
          feature: '3. Roots mod p & q',
          left: 'm_p = 15^((7+1)/4) = 15² = 225 ≡ 1 mod 7 (roots: ±1 = {1, 6})',
          right: 'm_q = 15^((11+1)/4) = 15³ = 3375 ≡ 2 mod 11 (roots: ±2 = {2, 9})'
        },
        {
          feature: '4. Chinese Remainder Theorem',
          left: 'Combine (1, 2), (1, 9), (6, 2), (6, 9) mod 77',
          right: 'Candidate Plaintexts: {13, 20, 57, 64} -> M=20 contains valid padding!'
        }
      ],
      summaryTakeaway: 'Because 20² = 400 ≡ 15 mod 77 and 57² = 3249 ≡ 15 mod 77, squaring destroys sign information, creating 4 roots.'
    },
    speakerNotes: {
      script: 'Highlight the symmetry: 77 - 20 = 57, and 77 - 13 = 64. The roots always come in complementary pairs (r, n-r) and (s, n-s). To select the right message, Alice adds a known suffix before squaring.',
      likelyQuestions: [
        {
          question: 'What redundancy scheme is used in practice?',
          answer: 'Alice appends a 64-bit repetition or hash of the message: M’ = M || Hash(M). Only 1 of the 4 roots will match the valid hash.'
        }
      ]
    }
  },

  // 4. Process: Rabin Encryption & Ambiguity Resolution Scene
  {
    id: 'rabin-process',
    kind: 'process',
    title: 'Rabin Encryption & 4-Root Ambiguity Resolution',
    subtitle: 'From Single Multiplication to 4 Candidate Pre-images',
    caption: 'Bob uses Chinese Remainder Theorem to compute the four modular roots, filtering the authentic message via redundancy validation.',
    eli5Caption: 'Alice squares the message. Bob gets 4 candidate keys and tests which one has the correct checkmark.',
    scene: {
      id: 'scene-rabin-flow',
      title: 'Rabin 4-to-1 Decryption Resolution',
      viewBox: '0 0 900 360',
      legend: ['Alice (Sender)', 'Bob (Receiver)', 'Modular Squaring (C=M²)', 'CRT 4 Candidate Roots', 'Redundancy Filter'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 120, y: 160 } },
        { id: 'switch', kind: 'switch', label: 'CRT Solver (mod p, q)', pos: { x: 480, y: 160 } },
        { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 800, y: 160 } }
      ],
      objects: [
        { id: 'plain', kind: 'plain', label: 'M = 20 [PAD]', at: { x: 120, y: 160 }, tone: 'info' },
        { id: 'cipher', kind: 'cipher', label: 'C = 15', at: { x: 300, y: 160 }, tone: 'bad' },
        { id: 'roots', kind: 'text', label: 'Roots: [13, 20, 57, 64]', at: { x: 480, y: 240 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Alice appends redundancy padding to message M=20 and computes C = M² mod 77 = 15.',
          eli5: 'Alice attaches a stamp to her message and squares it mod 77.',
          actions: [
            { do: 'pulse', target: 'plain' },
            { do: 'say', actor: 'alice', text: 'C = 20² mod 77 = 15' }
          ]
        },
        {
          caption: 'Ciphertext C=15 travels to Bob across the untrusted network.',
          eli5: 'Send number 15 over the wire.',
          actions: [
            { do: 'move', obj: 'cipher', to: { x: 480, y: 160 } },
            { do: 'highlight', target: ['cipher'], tone: 'bad' }
          ]
        },
        {
          caption: 'Bob computes square roots modulo Blum primes 7 and 11, then combines them via Chinese Remainder Theorem.',
          eli5: 'Bob uses his private primes 7 and 11 to solve the roots.',
          actions: [
            { do: 'appear', obj: { id: 'roots', kind: 'text', label: 'Roots: {13, 20, 57, 64}', at: { x: 480, y: 240 }, tone: 'warn' } },
            { do: 'pulse', target: 'roots' },
            { do: 'say', actor: 'switch', text: '4 CRT roots found' }
          ]
        },
        {
          caption: 'Bob inspects all four candidates: only M=20 possesses the valid redundancy signature [PAD]!',
          eli5: 'Only candidate 20 has the valid stamp. The other three are discarded.',
          actions: [
            { do: 'move', obj: 'roots', to: { x: 800, y: 160 } },
            { do: 'transform', obj: 'roots', into: { kind: 'plain', label: 'Plaintext M = 20', tone: 'ok' } },
            { do: 'highlight', target: ['bob', 'roots'], tone: 'ok' },
            { do: 'say', actor: 'bob', text: 'Padding matches: M = 20' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Emphasize why finding square roots without factoring is hard: If an adversary could find square roots of random squares mod n, they could factor n in polynomial time by computing gcd(r1 - r2, n).',
      likelyQuestions: [
        {
          question: 'Can an attacker use Bob as a decryption oracle to factor n?',
          answer: 'Yes! If Bob decrypts a chosen ciphertext and returns whichever root he picked, and it differs from the sender’s root, gcd(root1 - root2, n) factors n immediately. Rabin is vulnerable to chosen-ciphertext attacks without CCA2 padding.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'rabin-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Rabin Decryption Ambiguity',
    caption: 'Why does the Rabin cryptosystem produce exactly four square roots for any quadratic residue modulo n = pq (where p and q are distinct odd primes)?',
    eli5Caption: 'Why are there four solutions instead of just two when working modulo pq?',
    askTheRoom: {
      question: 'Why does decrypting a quadratic residue modulo composite n = pq yield exactly four square roots?',
      options: [
        'A. Because n has four prime factors.',
        'B. Because there are 2 square roots modulo p and 2 modulo q; the CRT yields 2 × 2 = 4 combinations modulo n.',
        'C. Because the encryption exponent e = 4.',
        'D. Because the private key contains 4 Blum integers.'
      ],
      correctIndex: 1,
      explanation: 'Correct! By Euler’s criterion, any non-zero quadratic residue has two square roots modulo prime p (±m_p) and two modulo prime q (±m_q). Combining these pairwise via CRT produces 2 × 2 = 4 distinct roots modulo n.'
    },
    speakerNotes: {
      script: 'Remind students of basic number theory: A prime modulus has at most 2 square roots for any residue. A composite with k distinct odd prime factors has 2^k square roots.',
      likelyQuestions: [
        {
          question: 'What if n = p × q × r (three primes)?',
          answer: 'There would be 2^3 = 8 square roots modulo n.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'rabin-exam',
    kind: 'exam-words',
    title: 'Rabin Cryptosystem Key Terminology & Exam Reference',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these definitions, formulas, and proof concepts for university exams.',
    eli5Caption: 'Three essential bullet points for Rabin Cryptosystem exam questions.',
    examWords: {
      term: 'Rabin Cryptosystem',
      definition: 'An asymmetric public-key cryptosystem whose encryption consists of modular squaring (C = M² mod n), possessing provable security equivalence to the Integer Factorization problem.',
      keywords: [
        'Provable security equivalence',
        'Blum primes (p ≡ q ≡ 3 mod 4)',
        'Modular squaring C = M² mod n',
        'Chinese Remainder Theorem (CRT) 4 roots',
        'Redundancy / padding disambiguation'
      ],
      mustRememberPoints: [
        'Provable Security: Inverting Rabin ciphertext is computationally equivalent to factoring the composite modulus n (unlike RSA where equivalence is unproven).',
        'Blum Primes: Primes satisfying p ≡ 3 (mod 4) allow square root extraction via m_p = C^((p+1)/4) mod p.',
        'Decryption Ambiguity: Decryption yields four candidate roots (±m_p, ±m_q) mod n via CRT, requiring predefined message redundancy/padding to identify the authentic plaintext.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students to explicitly mention the phrase "provable security equivalence to integer factorization" in their answers. It is the defining feature of the Rabin cryptosystem.',
      likelyQuestions: [
        {
          question: 'What is a quadratic residue?',
          answer: 'An integer a is a quadratic residue modulo n if there exists some integer x such that x^2 ≡ a (mod n).'
        }
      ]
    }
  }
]

export const rabinPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'rabin',
  topicTitle: 'Rabin Cryptosystem',
  targetDurationMinutes: 10,
  plates: rabinPlates
}
