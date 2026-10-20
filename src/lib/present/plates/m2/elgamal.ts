import { Plate, TopicPresentation } from "@/lib/present/types"

export const elgamalPlates: Plate[] = [
  // 1. Hook
  {
    id: 'elgamal-hook',
    kind: 'hook',
    title: 'The Power of Probabilistic Encryption',
    subtitle: 'ElGamal (1985): Discrete Logarithm & Randomized Ciphertexts',
    caption: 'Designed by Egyptian cryptographer Taher Elgamal, this system adapted Diffie-Hellman into full encryption. Encrypting the exact same message twice generates completely different ciphertexts every time.',
    eli5Caption: 'Every time you send a message, you roll a secret die to disguise it. Identical messages look completely different to eavesdroppers.',
    speakerNotes: {
      script: 'In 1985, Taher Elgamal solved a key weakness of basic RSA: RSA is deterministic, meaning encrypting "YES" always produces the same ciphertext. ElGamal introduced ephemeral keys to provide randomized, probabilistic encryption directly.',
      likelyQuestions: [
        {
          question: 'What is the trade-off of ElGamal encryption?',
          answer: 'Message expansion: ElGamal produces a ciphertext pair (c1, c2), meaning the ciphertext is exactly twice the size of the original plaintext.'
        }
      ]
    }
  },

  // 2. Concept: Mathematical Foundation & DLP
  {
    id: 'elgamal-math',
    kind: 'concept',
    title: 'The Discrete Logarithm Problem in Z_p*',
    subtitle: 'Given y = g^x mod p, finding x is Computationally Infeasible',
    caption: 'Computing modular powers (g^x mod p) is easy using square-and-multiply. Finding the secret exponent x from (g, y, p) is the intractable Discrete Logarithm Problem.',
    eli5Caption: 'Mixing colors is easy; separating the mixed color back into its original pigment drops is impossible.',
    comparison: {
      leftTitle: 'Deterministic Cipher (Basic RSA)',
      rightTitle: 'Probabilistic Cipher (ElGamal)',
      differences: [
        {
          feature: 'Ciphertext Uniqueness',
          left: 'Fixed: The same message M always encrypts to the exact same ciphertext C',
          right: 'Randomized: Fresh random ephemeral key k generates a unique (c1, c2) every time'
        },
        {
          feature: 'Ciphertext Size',
          left: '1:1 ratio (a 256-bit message produces a 256-bit ciphertext block)',
          right: '2:1 expansion (a 256-bit message produces two 256-bit elements: c1 and c2)'
        },
        {
          feature: 'Underlying Hardness',
          left: 'Integer Factorization Problem (finding prime factors p and q from n = pq)',
          right: 'Discrete Logarithm Problem (DLP) over the multiplicative group of integers mod p'
        },
        {
          feature: 'Dictionary Attack Defense',
          left: 'Vulnerable without external padding: Attacker can pre-encrypt dictionary guesses',
          right: 'Immune: Attacker cannot compare ciphertexts because k randomizes each output'
        }
      ],
      summaryTakeaway: 'ElGamal naturally provides semantic security against ciphertext-only dictionary matching.'
    },
    speakerNotes: {
      script: 'Emphasize that the security of ElGamal rests entirely on the Discrete Logarithm Problem. The ephemeral key k MUST be discarded immediately after encryption; reusing k across two messages allows Eve to deduce their plaintext ratio.',
      likelyQuestions: [
        {
          question: 'What happens if the ephemeral key k is predictable or reused?',
          answer: 'If k is reused for messages M1 and M2, then c2_A / c2_B = (M1 * y^k) / (M2 * y^k) = M1 / M2 mod p. An attacker immediately learns the relationship between both plaintexts.'
        }
      ]
    }
  },

  // 3. Worked Example: Small Numbers
  {
    id: 'elgamal-worked-example',
    kind: 'concept',
    title: 'Worked Numerical Example with Small Numbers',
    subtitle: 'p = 23, g = 5, Private x = 6 -> y = 8. Plaintext M = 9',
    caption: 'Trace the complete mathematics: Bob generates public key (23, 5, 8). Alice picks ephemeral k=15 to produce (c1=19, c2=18). Bob unmasks M=9.',
    eli5Caption: 'Follow step-by-step numbers to see how the ephemeral key k creates the mask and cancels out during decryption.',
    comparison: {
      leftTitle: 'Alice: Key Setup & Encryption',
      rightTitle: 'Bob: Decryption & Unmasking',
      differences: [
        {
          feature: '1. Key Generation',
          left: 'Bob: p=23, g=5, private x=6 -> y = 5^6 mod 23 = 15,625 mod 23 = 8',
          right: 'Bob publishes (p=23, g=5, y=8). Keeps x=6 secret'
        },
        {
          feature: '2. Ephemeral Key & c1',
          left: 'Alice picks random k=15 -> c1 = 5^15 mod 23 = 19',
          right: 'Bob receives c1 = 19'
        },
        {
          feature: '3. Mask Calculation & c2',
          left: 'Mask K = y^k = 8^15 mod 23 = 2 -> c2 = (M × K) mod 23 = (9 × 2) mod 23 = 18',
          right: 'Bob receives c2 = 18'
        },
        {
          feature: '4. Decryption Recovery',
          left: 'Alice transmits ciphertext pair: (c1 = 19, c2 = 18)',
          right: 'Shared secret K = c1^x = 19^6 mod 23 = 2. Inv(2) mod 23 = 12. M = 18 × 12 mod 23 = 9!'
        }
      ],
      summaryTakeaway: 'The shared secret K = 2 is computed by Alice as y^k and by Bob as c1^x, identical to Diffie-Hellman!'
    },
    speakerNotes: {
      script: 'Highlight why Bob’s shared secret calculation works: c1^x = (g^k)^x = g^(kx) = (g^x)^k = y^k mod p. It is the exact mathematical identity of Diffie-Hellman key agreement wrapped into a public-key message mask.',
      likelyQuestions: [
        {
          question: 'How do we compute modular inverse of 2 mod 23?',
          answer: 'Find an integer inv such that 2 * inv ≡ 1 mod 23. Since 2 * 12 = 24 = 23 + 1 ≡ 1, inv = 12.'
        }
      ]
    }
  },

  // 4. Process: Encryption and Decryption Flow Scene
  {
    id: 'elgamal-process',
    kind: 'process',
    title: 'ElGamal Message Transmission & Decryption Flow',
    subtitle: 'Ephemeral Key Masking & Private Exponent Unmasking',
    caption: 'Alice generates ephemeral key k, computes (c1, c2), and Bob uses private exponent x to recover mask K and restore plaintext M.',
    eli5Caption: 'Alice sends the padlock key in disguise (c1) and the locked box (c2). Only Bob’s secret master key can decipher c1.',
    scene: {
      id: 'scene-elgamal-flow',
      title: 'ElGamal Probabilistic Encryption Protocol',
      viewBox: '0 0 900 360',
      legend: ['Alice (Sender)', 'Bob (Receiver)', 'Ephemeral Key k', 'Ciphertext Pair (c1, c2)', 'Private Key x'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 120, y: 160 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Passive)', pos: { x: 450, y: 270 } },
        { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 780, y: 160 } }
      ],
      objects: [
        { id: 'plain', kind: 'plain', label: 'Plaintext M = 9', at: { x: 120, y: 160 }, tone: 'info' },
        { id: 'ephem', kind: 'key-shared', label: 'k = 15 (Random)', at: { x: 120, y: 80 }, tone: 'warn' },
        { id: 'pair', kind: 'cipher', label: '(c1=19, c2=18)', at: { x: 260, y: 160 }, tone: 'bad' }
      ],
      steps: [
        {
          caption: 'Alice selects a fresh, unguessable ephemeral key k=15 and computes c1 = g^k mod p = 5^15 mod 23 = 19.',
          eli5: 'Alice picks a random secret number 15 and turns it into c1 = 19.',
          actions: [
            { do: 'pulse', target: 'ephem' },
            { do: 'say', actor: 'alice', text: 'Fresh ephemeral k=15' }
          ]
        },
        {
          caption: 'Alice computes the masking key K = y^k mod p = 8^15 mod 23 = 2, and multiplies: c2 = (M × K) mod p = 18.',
          eli5: 'Multiply message 9 by mask 2 to get 18 mod 23.',
          actions: [
            { do: 'transform', obj: 'plain', into: { kind: 'cipher', label: '(c1=19, c2=18)', tone: 'bad' } },
            { do: 'pulse', target: 'plain' },
            { do: 'say', actor: 'alice', text: 'c2 = M * y^k mod p' }
          ]
        },
        {
          caption: 'Alice sends the pair (c1=19, c2=18) across the insecure network. Eve cannot deduce k or x due to DLP.',
          eli5: 'Send the pair over the internet. Eve cannot solve the discrete log to read either number.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 450, y: 160 } },
            { do: 'zone', id: 'eavesdrop', show: true },
            { do: 'say', actor: 'eve', text: 'Cannot find x or k!' }
          ]
        },
        {
          caption: 'Bob computes shared mask K = c1^x mod p = 19^6 mod 23 = 2, using his private key x=6.',
          eli5: 'Bob uses his private key 6 on c1 to recreate mask 2.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 780, y: 160 } },
            { do: 'highlight', target: ['bob', 'plain'], tone: 'info' },
            { do: 'say', actor: 'bob', text: 'K = c1^x = 2' }
          ]
        },
        {
          caption: 'Bob multiplies c2 by the modular inverse of K: M = 18 × 12 mod 23 = 9. Plaintext is flawlessly recovered!',
          eli5: 'Multiply 18 by inverse of 2 mod 23 (12) to get back original 9.',
          actions: [
            { do: 'transform', obj: 'plain', into: { kind: 'plain', label: 'Plaintext M = 9', tone: 'ok' } },
            { do: 'highlight', target: ['bob', 'plain'], tone: 'ok' },
            { do: 'say', actor: 'bob', text: 'Plaintext M = 9 restored' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Emphasize the modular inverse step: Because division is undefined in modular arithmetic, we must multiply by the multiplicative modular inverse: M = c2 * (c1^x)^(-1) mod p.',
      likelyQuestions: [
        {
          question: 'Can ElGamal be adapted for digital signatures?',
          answer: 'Yes! The ElGamal signature scheme served as the direct basis for the NIST Digital Signature Algorithm (DSA).'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'elgamal-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Ephemeral Key Reuse Vulnerability',
    caption: 'Suppose Alice encrypts two different messages M1 and M2 to Bob using the exact same ephemeral key k, resulting in ciphertexts (c1, c2_A) and (c1, c2_B).',
    eli5Caption: 'What fatal security failure occurs if you use the same random dice roll twice in ElGamal?',
    askTheRoom: {
      question: 'What catastrophic vulnerability occurs if the same ephemeral key k is reused across two ElGamal encryptions?',
      options: [
        'A. Bob will fail to decrypt either message.',
        'B. The adversary discovers Bob’s private key x.',
        'C. The ratio of ciphertexts c2_A / c2_B equals the ratio of plaintexts M1 / M2 mod p, exposing message relationships or plaintexts.',
        'D. The prime p is immediately factored.'
      ],
      correctIndex: 2,
      explanation: 'Correct! Since c2_A = M1 × y^k and c2_B = M2 × y^k mod p, dividing them cancels out y^k: c2_A / c2_B ≡ M1 / M2 mod p. If Eve knows or guesses one plaintext, she instantly learns the other!'
    },
    speakerNotes: {
      script: 'Point out that Sony famously reused ephemeral keys in the PlayStation 3 ECDSA implementation in 2010, which leaked Sony’s master root signing key to hackers.',
      likelyQuestions: [
        {
          question: 'Does ephemeral key reuse break DSA / ECDSA even worse?',
          answer: 'Yes! In DSA and ECDSA, reusing the ephemeral nonce k allows the attacker to algebraically extract the private signing key x directly.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'elgamal-exam',
    kind: 'exam-words',
    title: 'ElGamal Cryptosystem Key Terminology & Exam Reference',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these definitions, formulas, and security properties for university exams.',
    eli5Caption: 'The three essential concepts examiners grade for ElGamal questions.',
    examWords: {
      term: 'ElGamal Cryptosystem',
      definition: 'A public-key asymmetric cryptosystem based on the Discrete Logarithm Problem in finite cyclic groups, featuring randomized (probabilistic) encryption and ciphertext expansion.',
      keywords: [
        'Discrete Logarithm Problem (DLP)',
        'Cyclic group Z_p* and generator g',
        'Ephemeral random key k',
        'Probabilistic encryption (semantic security)',
        'Message expansion factor (2:1 ratio)'
      ],
      mustRememberPoints: [
        'Mathematical Hardness: Security is founded on the intractability of computing discrete logarithms: given y = g^x mod p, finding x is computationally infeasible for large primes.',
        'Probabilistic Encryption: Alice chooses a fresh random ephemeral key k for each message; encrypting the same plaintext twice produces distinct ciphertexts (c1, c2).',
        'Ciphertext Expansion & Ephemeral Nonce: Produces ciphertext pair (c1 = g^k mod p, c2 = M·y^k mod p). The nonce k must NEVER be reused, otherwise c2_A / c2_B = M1 / M2 mod p.'
      ],
      typicalMarks: 7
    },
    speakerNotes: {
      script: 'Advise students to write both parts of the ciphertext (c1, c2) clearly and specify that c1 is the ephemeral key representation and c2 is the masked message.',
      likelyQuestions: [
        {
          question: 'What is the message size limit in ElGamal?',
          answer: 'The message M must be encoded as an integer in the range 1 <= M <= p - 1.'
        }
      ]
    }
  }
]

export const elgamalPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'elgamal',
  topicTitle: 'ElGamal Cryptosystem',
  targetDurationMinutes: 10,
  plates: elgamalPlates
}
