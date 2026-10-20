import { Plate, TopicPresentation } from "@/lib/present/types"

export const lightweightTeaPlates: Plate[] = [
  // 1. Hook
  {
    id: 'tea-hook',
    kind: 'hook',
    title: 'Minimalism in Silicon',
    subtitle: 'TEA (1994): David Wheeler & Roger Needham [Self-Learning]',
    caption: 'Designed at Cambridge University to fit into a tiny handful of C code lines, the Tiny Encryption Algorithm (TEA) showed how IoT sensors and smart devices can encrypt data with zero S-box tables.',
    eli5Caption: 'A cipher so small and simple you could write its entire program on a postage stamp.',
    speakerNotes: {
      script: 'In 1994, David Wheeler and Roger Needham presented TEA at the Fast Software Encryption workshop. Their goal was extreme simplicity and low memory footprint for embedded controllers where AES or DES tables would exceed available RAM.',
      likelyQuestions: [
        {
          question: 'What modern devices use lightweight ciphers?',
          answer: 'RFID tags, medical pacemakers, automotive tire pressure sensors (TPMS), smart utility meters, and resource-constrained microcontrollers.'
        }
      ]
    }
  },

  // 2. Concept: IoT Constraints & TEA Architecture
  {
    id: 'tea-concept',
    kind: 'concept',
    title: 'Lightweight Cryptography vs Standard AES',
    subtitle: 'Parameters: 64-bit Block, 128-bit Key, 32 Cycles (64 Rounds)',
    caption: 'TEA dispenses with S-boxes, permutations, and key expansion matrices entirely. It relies strictly on shifts, additions, and XORs (ARX-like primitive).',
    eli5Caption: 'No lookup tables in memory. Just shifts, additions, and XORs that execute on any 50-cent microcontroller.',
    comparison: {
      leftTitle: 'Standard AES-128',
      rightTitle: 'Tiny Encryption Algorithm (TEA)',
      differences: [
        {
          feature: 'Memory Footprint',
          left: 'Requires 256-byte S-box tables and expanded key schedules in RAM/ROM',
          right: 'Zero S-boxes: runs entirely within CPU registers with tiny code size'
        },
        {
          feature: 'Block Size',
          left: '128 bits (16 bytes)',
          right: '64 bits (8 bytes: two 32-bit halves v0 and v1)'
        },
        {
          feature: 'Round Complexity',
          left: 'SubBytes, ShiftRows, MixColumns over Galois Field GF(2^8)',
          right: 'Shifts (<< 4, >> 5), modular additions (+), and bitwise XORs (^)'
        },
        {
          feature: 'Subkey Generation',
          left: 'Complex Rcon key schedule expansion into 11 round keys',
          right: 'Zero expansion: four 32-bit words (k0, k1, k2, k3) fed cyclically with delta'
        }
      ],
      summaryTakeaway: 'TEA prioritizes minimal transistor count and zero-RAM overhead over mathematical margin against advanced cryptanalysis.'
    },
    speakerNotes: {
      script: 'Highlight the trade-off. Standard cryptographic algorithms optimize for maximum mathematical safety margins at high throughput. Lightweight ciphers optimize for milliwatts of battery life, gate counts (< 2000 GE), and zero cache memory.',
      likelyQuestions: [
        {
          question: 'What does the golden ratio constant delta represent?',
          answer: 'delta = (sqrt(5) - 1) * 2^31 = 0x9E3779B9. It is a "nothing-up-my-sleeve" constant derived from the golden ratio to prevent symmetry across rounds.'
        }
      ]
    }
  },

  // 3. Process: TEA Cycle Step-by-Step Scene
  {
    id: 'tea-process',
    kind: 'process',
    title: 'TEA Feistel Cycle Execution',
    subtitle: 'v0 += ((v1<<4)+k0) ^ (v1+sum) ^ ((v1>>5)+k1)  |  sum += delta',
    caption: 'In each of the 32 cycles (64 rounds), constant delta (0x9E3779B9) accumulates into sum to introduce asymmetric round mixing.',
    eli5Caption: 'Each cycle shifts the right half left by 4 and right by 5, blends with keys and sum, and adds to the left half.',
    scene: {
      id: 'scene-tea-cycle',
      title: 'TEA Feistel Cycle Operation',
      viewBox: '0 0 900 360',
      legend: ['Half v0 (32 bits)', 'Half v1 (32 bits)', 'Accumulator sum += delta', 'Key Words (k0, k1, k2, k3)'],
      actors: [
        { id: 'client', kind: 'client', label: 'Left Half (v0)', pos: { x: 120, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'Shift-XOR-Add Box', pos: { x: 450, y: 180 } },
        { id: 'server', kind: 'server', label: 'Right Half (v1)', pos: { x: 780, y: 180 } }
      ],
      objects: [
        { id: 'tokV0', kind: 'bits', label: 'v0 (32b)', at: { x: 120, y: 180 }, tone: 'info' },
        { id: 'tokV1', kind: 'bits', label: 'v1 (32b)', at: { x: 780, y: 180 }, tone: 'warn' },
        { id: 'tokSum', kind: 'text', label: 'sum += 0x9E3779B9', at: { x: 450, y: 80 }, tone: 'signal' }
      ],
      steps: [
        {
          caption: 'Initialization: Plaintext is split into two 32-bit registers (v0, v1). The 128-bit key is split into four 32-bit words (k0, k1, k2, k3).',
          eli5: 'Slice the 64-bit data in two halves, and slice the key into four words.',
          actions: [
            { do: 'highlight', target: ['tokV0', 'tokV1', 'tokSum'], tone: 'info' },
            { do: 'say', actor: 'switch', text: 'sum = 0 at start' }
          ]
        },
        {
          caption: 'Cycle starts: sum is incremented by golden ratio delta = 0x9E3779B9.',
          eli5: 'Add the magic delta number to the accumulator.',
          actions: [
            { do: 'pulse', target: 'tokSum' },
            { do: 'say', actor: 'switch', text: 'sum += delta' }
          ]
        },
        {
          caption: 'Half v0 update: v0 += ((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1 >> 5) + k1). Modular addition mod 2^32 mixes the halves.',
          eli5: 'Shift v1 left and right, blend with keys and sum, and add into v0.',
          actions: [
            { do: 'move', obj: 'tokV1', to: { x: 450, y: 180 } },
            { do: 'transform', obj: 'tokV0', into: { label: 'v0 updated', tone: 'signal' } },
            { do: 'say', actor: 'client', text: 'v0 updated' }
          ]
        },
        {
          caption: 'Half v1 update: v1 += ((v0 << 4) + k2) ^ (v0 + sum) ^ ((v0 >> 5) + k3). Cycle complete (repeat for 32 cycles).',
          eli5: 'Do the same shift-blend for v1 using the new v0 and keys k2 and k3.',
          actions: [
            { do: 'move', obj: 'tokV1', to: { x: 780, y: 180 } },
            { do: 'transform', obj: 'tokV1', into: { label: 'v1 updated', tone: 'ok' } },
            { do: 'highlight', target: ['tokV0', 'tokV1'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Cycle 1 / 32 complete' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Observe the mathematical elegance: Because all additions are modulo 2^32, decryption simply subtracts the identical terms in reverse order while decrementing sum by delta.',
      likelyQuestions: [
        {
          question: 'What is the weakness in original TEA?',
          answer: 'Equivalent keys: For any given key K, there are 3 other equivalent keys because the most significant bit of each subkey word can be flipped without changing the encryption output.'
        }
      ]
    }
  },

  // 4. Comparison: Evolution to XTEA and XXTEA
  {
    id: 'tea-evolution',
    kind: 'concept',
    title: 'Vulnerabilities & Evolution: XTEA & XXTEA',
    subtitle: 'Fixing Equivalent Keys & Related-Key Cryptanalysis',
    caption: 'TEA suffered from related-key attacks and equivalent keys. Needham and Wheeler developed XTEA and XXTEA to eliminate these structural flaws.',
    eli5Caption: 'Engineers fixed TEA’s flaws by changing how the secret key blends with the delta counter.',
    comparison: {
      leftTitle: 'Original TEA (1994)',
      rightTitle: 'Enhanced XTEA (1997)',
      differences: [
        {
          feature: 'Key Schedule Structure',
          left: 'Static assignment: round always pairs (k0, k1) for v0 and (k2, k3) for v1',
          right: 'Dynamic key indexing: uses (sum & 3) and ((sum >> 11) & 3) to select key words'
        },
        {
          feature: 'Equivalent Keys',
          left: 'Suffers from 4 equivalent keys (effective keyspace 2^126 instead of 2^128)',
          right: 'Eliminated: no equivalent keys exist in XTEA'
        },
        {
          feature: 'Related-Key Attacks',
          left: 'Vulnerable in known-key settings and hash function mode',
          right: 'Substantially more resistant due to non-linear key word indexing'
        },
        {
          feature: 'Code Overhead',
          left: 'Smallest possible (10 lines of C code)',
          right: 'Virtually identical footprint (only index expressions change)'
        }
      ],
      summaryTakeaway: 'XTEA preserves the zero-table footprint of TEA while eradicating the equivalent-key vulnerability.'
    },
    speakerNotes: {
      script: 'Explain the index formula in XTEA: key[(sum >> 11) & 3]. By shifting sum by 11 bits before masking with 3 (binary 11), different key words are selected dynamically each cycle.',
      likelyQuestions: [
        {
          question: 'What is XXTEA?',
          answer: 'XXTEA (Corrected Block TEA) operates on arbitrary-length arrays of 32-bit words, turning TEA into a variable-block-length cipher.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'tea-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'TEA Golden Ratio Delta Constant',
    caption: 'In the Tiny Encryption Algorithm, what is the exact derivation and purpose of the constant delta = 0x9E3779B9?',
    eli5Caption: 'Where did the number 0x9E3779B9 come from and what does it do?',
    askTheRoom: {
      question: 'What is the cryptographic purpose and mathematical derivation of the TEA constant delta = 0x9E3779B9?',
      options: [
        'A. It is an arbitrary prime number that ensures invertibility modulo 2^32.',
        'B. It is derived from the golden ratio (sqrt(5)-1) * 2^31 as a "nothing-up-my-sleeve" number to prevent symmetry across rounds.',
        'C. It is the DES S-box constant in hexadecimal.',
        'D. It is the modular inverse of 2^32.'
      ],
      correctIndex: 1,
      explanation: 'Correct! Wheeler and Needham defined delta = floor((sqrt(5) - 1) * 2^31) = 0x9E3779B9, based on the golden ratio conjugate (phi - 1). Its fractional bits ensure pseudo-randomness across rounds with no structural symmetries.'
    },
    speakerNotes: {
      script: 'Mention that the golden ratio is famous for being the "most irrational" number, minimizing resonance or periodic cycle collisions across multiple rounds.',
      likelyQuestions: [
        {
          question: 'Can delta be any number?',
          answer: 'Any odd integer with high entropy would prevent symmetry, but using the golden ratio proved the designers did not embed a trapdoor.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'tea-exam',
    kind: 'exam-words',
    title: 'Lightweight Cryptography & TEA Key Terminology',
    subtitle: 'Core Definitions for Academic Evaluation [Self-Learning]',
    caption: 'Memorize these definitions, parameters, and vulnerabilities for university exams.',
    eli5Caption: 'The three essential concepts for any question on lightweight cryptography and TEA.',
    examWords: {
      term: 'Tiny Encryption Algorithm (TEA)',
      definition: 'A lightweight Feistel block cipher developed by David Wheeler and Roger Needham characterized by minimal code size, zero S-box memory overhead, and 32 cycles of shift-XOR-add operations.',
      keywords: [
        'Lightweight cryptography for IoT',
        '64-bit block size & 128-bit key',
        '32 Feistel cycles (64 rounds)',
        'Delta constant 0x9E3779B9 (golden ratio)',
        'Equivalent keys weakness & XTEA'
      ],
      mustRememberPoints: [
        'Specifications: Operates on 64-bit blocks (two 32-bit halves v0, v1) using a 128-bit key (four 32-bit words k0..k3) across 32 cycles (64 Feistel rounds).',
        'Mathematical Operations: Strictly uses 32-bit additions (+), bitwise XORs (^), and logical shifts (<< 4, >> 5) with golden ratio constant delta = 0x9E3779B9; requires zero lookup tables in memory.',
        'Vulnerability & XTEA: Original TEA has 4 equivalent keys per master key (reducing keyspace to 2^126) and related-key weaknesses; solved by XTEA via dynamic key-word indexing.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students that TEA is a Self-Learning topic in the syllabus, meaning examiners love asking 5-mark short notes on its parameterization (64-bit block, 128-bit key, 32 cycles) and the golden ratio delta constant.',
      likelyQuestions: [
        {
          question: 'What is the NIST lightweight standard?',
          answer: 'In 2023, NIST selected Ascon as the new standard for lightweight authenticated encryption (AEAD) and hashing in IoT.'
        }
      ]
    }
  }
]

export const lightweightTeaPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'lightweight-tea',
  topicTitle: 'Lightweight Cryptography & TEA [SL]',
  targetDurationMinutes: 10,
  plates: lightweightTeaPlates
}
