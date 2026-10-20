import { Plate, TopicPresentation } from "@/lib/present/types"

export const blowfishPlates: Plate[] = [
  // 1. Hook
  {
    id: 'blowfish-hook',
    kind: 'hook',
    title: 'Bruce Schneier’s Unpatented Rebel',
    subtitle: 'Blowfish (1993): Variable Keys & Key-Dependent S-Boxes',
    caption: 'Designed as a fast, license-free alternative to DES, Blowfish introduced key-dependent S-boxes and variable key lengths up to 448 bits.',
    eli5Caption: 'Instead of using fixed tables, the key builds its own secret substitution tables before encrypting anything.',
    speakerNotes: {
      script: 'In 1993, Bruce Schneier created Blowfish as a public-domain cipher. At a time when software encryption was slow or patented (like IDEA and RC4), Blowfish ran blazingly fast on 32-bit microprocessors because its round operations are simple 32-bit additions and XORs.',
      likelyQuestions: [
        {
          question: 'What is the biggest modern drawback of Blowfish?',
          answer: 'Its 64-bit block size. Like 3DES, it is vulnerable to Sweet32 birthday collision attacks in TLS or long data streams.'
        }
      ]
    }
  },

  // 2. Concept: Key-Dependent S-Boxes & Subkey Setup
  {
    id: 'blowfish-concept',
    kind: 'concept',
    title: 'The P-Array and Four Key-Dependent S-Boxes',
    subtitle: 'Heavy Key Schedule Initialization (4,168 Bytes)',
    caption: '18 subkeys in the P-array and four 256-entry S-boxes are repeatedly re-encrypted by the key itself.',
    eli5Caption: 'Setting up the key is slow and heavy, but once initialized, encrypting data is lightning fast.',
    comparison: {
      leftTitle: 'Fixed S-Boxes (DES / AES)',
      rightTitle: 'Key-Dependent S-Boxes (Blowfish)',
      differences: [
        {
          feature: 'S-Box Generation',
          left: 'Hardcoded mathematical constants (identical for every user)',
          right: 'Generated dynamically from digits of Pi (π) and the user secret key'
        },
        {
          feature: 'Key Setup Cost',
          left: 'Minimal (few bit shifts or array expansions)',
          right: 'High (encrypts all 18 P-array and 1024 S-box entries, 521 encryptions)'
        },
        {
          feature: 'Brute-Force Resistance',
          left: 'Attackers can precompute tables for all keys',
          right: 'High setup cost deters hardware-accelerated password cracking (bcrypt)'
        },
        {
          feature: 'Key Length Range',
          left: 'Fixed: 56 bits (DES), 128/256 bits (AES)',
          right: 'Variable: 32 bits up to 448 bits in 32-bit steps'
        }
      ],
      summaryTakeaway: 'Blowfish’s expensive key schedule made it the foundation of bcrypt, the gold-standard password hashing algorithm.'
    },
    speakerNotes: {
      script: 'Emphasize the bcrypt connection: bcrypt uses "Eksblowfish" (Expensive Key Schedule Blowfish). The fact that key setup takes 521 iterations is a bug for high-throughput packet routing, but a massive feature for password hashing against GPUs.',
      likelyQuestions: [
        {
          question: 'Why did Bruce Schneier initialize Blowfish with digits of Pi (π)?',
          answer: 'As "nothing up my sleeve" numbers, proving the designer did not insert a hidden algebraic backdoor in the initial tables.'
        }
      ]
    }
  },

  // 3. Process: Blowfish Feistel Round Function Scene
  {
    id: 'blowfish-process',
    kind: 'process',
    title: 'The Blowfish Round Function F',
    subtitle: 'Four S-Boxes Combined with Addition and XOR',
    caption: 'A 32-bit half is split into four 8-bit bytes (a, b, c, d): F(a,b,c,d) = ((S1[a] + S2[b]) ⊕ S3[c]) + S4[d].',
    eli5Caption: 'Split into four pieces, check four tables, add, XOR, and add again mod 2^32.',
    scene: {
      id: 'scene-blowfish-round',
      title: 'Blowfish F-Function Execution',
      viewBox: '0 0 900 360',
      legend: ['32-bit Half', '4× 8-bit S-Box Lookups', 'Modular Addition & XOR', 'Feistel XOR with Left'],
      actors: [
        { id: 'client', kind: 'client', label: 'Right Half (32b)', pos: { x: 100, y: 180 } },
        { id: 'router', kind: 'router', label: 'S1, S2, S3, S4', pos: { x: 380, y: 180 } },
        { id: 'switch', kind: 'switch', label: '(S1+S2) ^ S3 + S4', pos: { x: 620, y: 180 } },
        { id: 'server', kind: 'server', label: 'Feistel Out (32b)', pos: { x: 800, y: 180 } }
      ],
      objects: [
        { id: 'rHalf', kind: 'bits', label: '32-bit Right', at: { x: 100, y: 180 }, tone: 'info' },
        { id: 'pSub', kind: 'key-shared', label: 'P-Entry P_i', at: { x: 100, y: 80 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Before entering the round function, the left half is XORed with subkey P_i from the P-array.',
          eli5: 'XOR the left side with subkey number i.',
          actions: [
            { do: 'highlight', target: ['rHalf', 'pSub'], tone: 'info' },
            { do: 'say', actor: 'client', text: 'Left ^ P_i' }
          ]
        },
        {
          caption: 'The 32-bit right half is partitioned into four 8-bit bytes: a, b, c, and d.',
          eli5: 'Slice the 32-bit number into four 8-bit slices.',
          actions: [
            { do: 'move', obj: 'rHalf', to: { x: 380, y: 180 } },
            { do: 'transform', obj: 'rHalf', into: { label: '[a, b, c, d] (8b each)', tone: 'signal' } },
            { do: 'pulse', target: 'rHalf' }
          ]
        },
        {
          caption: 'Each byte indexes a 32-bit entry in S1, S2, S3, and S4. Results are combined: ((S1[a] + S2[b]) ⊕ S3[c]) + S4[d].',
          eli5: 'Look up all four tables and blend with addition and XOR.',
          actions: [
            { do: 'move', obj: 'rHalf', to: { x: 620, y: 180 } },
            { do: 'transform', obj: 'rHalf', into: { label: 'F Output (32b)', tone: 'warn' } },
            { do: 'say', actor: 'switch', text: '32-bit mask computed' }
          ]
        },
        {
          caption: 'The 32-bit F output is XORed with the left half, and the halves swap for the next round.',
          eli5: 'XOR with the other half and swap sides.',
          actions: [
            { do: 'move', obj: 'rHalf', to: { x: 800, y: 180 } },
            { do: 'transform', obj: 'rHalf', into: { kind: 'cipher', label: 'Next Left / Right', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'rHalf'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Round complete' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Observe the elegance of Blowfish: on 32-bit x86 processors, addition mod 2^32 is a native 1-cycle CPU instruction. S-box lookups are cache-friendly. It achieved remarkable speed without dedicated cryptographic hardware.',
      likelyQuestions: [
        {
          question: 'What is Twofish?',
          answer: 'The 128-bit successor to Blowfish created by Bruce Schneier for the AES competition, supporting 128, 192, and 256-bit keys with a 128-bit block.'
        }
      ]
    }
  },

  // 4. Ask the room
  {
    id: 'blowfish-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Why Blowfish Excelled in Password Hashing',
    caption: 'Modern password storage systems (like OpenBSD and Linux shadow files) universally preferred bcrypt over SHA-256 for password hashing.',
    eli5Caption: 'Why is Blowfish better for passwords than fast cryptographic hashes like SHA-256?',
    askTheRoom: {
      question: 'Why did bcrypt adopt Blowfish instead of SHA-256 for secure password storage?',
      options: [
        'A. Because SHA-256 is broken by collision attacks.',
        'B. Because Blowfish requires an expensive 4 KB memory key schedule, crippling GPU and ASIC parallel password cracking.',
        'C. Because Blowfish uses asymmetric public keys.',
        'D. Because Blowfish produces smaller hash strings.'
      ],
      correctIndex: 1,
      explanation: 'Correct! Blowfish’s memory-intensive key schedule requires 4 KB of high-speed RAM per instance, preventing hackers from running millions of parallel guesses on graphics cards (GPUs).'
    },
    speakerNotes: {
      script: 'This reinforces why algorithm efficiency depends on context. For bulk data transfer, you want cheap key setup (like AES). For password hashing, you want deliberately expensive key setup (like bcrypt/Blowfish or Argon2).',
      likelyQuestions: []
    }
  },

  // 5. Exam Words
  {
    id: 'blowfish-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Blowfish',
    caption: 'Block size, key length range, round function formula, and P-array structure.',
    eli5Caption: 'The exact specs and equations to write in your exam.',
    speakerNotes: {
      script: 'Students must memorize: 64-bit block, 32 to 448-bit variable key, 16 Feistel rounds, 4 key-dependent S-boxes, F formula: ((S1[a] + S2[b]) ^ S3[c]) + S4[d].',
      likelyQuestions: [
        {
          question: 'How many entries are in the Blowfish P-array?',
          answer: '18 entries of 32-bit subkeys (P1 through P18).'
        }
      ]
    },
    examWords: {
      term: 'Blowfish Symmetric Block Cipher',
      definition: 'A 16-round Feistel block cipher designed by Bruce Schneier with a 64-bit block size, variable key length (32 to 448 bits), and four 256-entry key-dependent S-boxes.',
      keywords: [
        'Blowfish (Bruce Schneier 1993)',
        '64-bit Block Size',
        'Variable Key (32 to 448 bits)',
        '16 Feistel Rounds',
        'P-Array (18 subkeys of 32 bits)',
        '4 Key-Dependent S-Boxes (256 entries each)',
        'F-Function Formula',
        'bcrypt Foundation'
      ],
      mustRememberPoints: [
        'Blowfish uses a 64-bit block, 16 Feistel rounds, and variable key length up to 448 bits.',
        'Round function: F(a, b, c, d) = ((S1[a] + S2[b]) ⊕ S3[c]) + S4[d] mod 2^32.',
        'Its heavy key setup (521 encryptions to initialize P-array and S-boxes) prevents fast GPU cracking, forming the basis of bcrypt.'
      ],
      typicalMarks: 5
    }
  }
]

export const blowfishPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'blowfish',
  topicTitle: 'Blowfish Block Cipher',
  targetDurationMinutes: 10,
  plates: blowfishPlates
}
