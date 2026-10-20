import { Plate, TopicPresentation } from "@/lib/present/types"

export const desPlates: Plate[] = [
  // 1. Hook
  {
    id: 'des-hook',
    kind: 'hook',
    title: 'The Fall of the 56-Bit Fortress',
    subtitle: 'From NSA Standard (1977) to EFF Deep Crack (1998)',
    caption: 'Adopted as the US federal standard in 1977, DES protected global banking until a $250,000 custom machine broke it in 56 hours.',
    eli5Caption: 'A 56-bit lock seemed unbreakable in 1977, but by 1998 computers were fast enough to test every key in a single weekend.',
    speakerNotes: {
      script: 'In 1977, the National Bureau of Standards (now NIST) standardized DES, developed by IBM with NSA guidance. Its block size was 64 bits, but its key size was restricted to 56 bits. In 1998, the Electronic Frontier Foundation built "Deep Crack", cracking DES keys in 56 hours via exhaustive search.',
      likelyQuestions: [
        {
          question: 'Why did the key have 64 bits if only 56 were effective?',
          answer: 'Every 8th bit in a DES key is an odd parity bit used for error detection, leaving only 56 bits for actual cryptographic entropy (2^56 ≈ 7.2 × 10^16 keys).'
        }
      ]
    }
  },

  // 2. Concept: DES Architecture & S-Box Mechanism
  {
    id: 'des-concept',
    kind: 'concept',
    title: 'Inside the DES Round Function F',
    subtitle: 'Expansion, XOR, S-Boxes, and Permutation',
    caption: 'The heart of DES: 32 bits expand to 48, mix with subkey K_i, compress through 8 non-linear S-boxes to 32 bits.',
    eli5Caption: '32 bits stretch out to 48, mix with the key, get squeezed through 8 secret tables back down to 32, and scramble.',
    comparison: {
      leftTitle: 'Expansion P-Box (E)',
      rightTitle: 'Substitution Boxes (S1..S8)',
      differences: [
        {
          feature: 'Input / Output Size',
          left: '32 bits in → 48 bits out (Linear expansion)',
          right: '48 bits in (eight 6-bit chunks) → 32 bits out (eight 4-bit nibbles)'
        },
        {
          feature: 'Mathematical Nature',
          left: 'Purely linear bit duplication and permutation',
          right: 'Highly non-linear mapping (the ONLY non-linear part of DES)'
        },
        {
          feature: 'Addressing Logic',
          left: 'Fixed permutation table replicating boundary bits',
          right: 'Bits 0 & 5 select row (0..3); bits 1..4 select column (0..15)'
        },
        {
          feature: 'Cryptographic Role',
          left: 'Provides diffusion across adjacent S-box inputs',
          right: 'Provides confusion to defeat linear and differential cryptanalysis'
        }
      ],
      summaryTakeaway: 'Without the non-linear S-boxes, DES would collapse into a trivial system of linear equations mod 2.'
    },
    speakerNotes: {
      script: 'Emphasize how S-box indexing works: each 6-bit chunk b0 b1 b2 b3 b4 b5 uses b0 and b5 to select a row (0 to 3), and b1 b2 b3 b4 to select a column (0 to 15). The cell contains a 4-bit integer. This is the single non-linear component in DES.',
      likelyQuestions: [
        {
          question: 'How many S-boxes does DES have?',
          answer: 'DES has exactly 8 distinct S-boxes (S1 to S8), each mapping 6 input bits to 4 output bits.'
        }
      ]
    }
  },

  // 3. Process: 3DES and Meet-in-the-Middle Attack
  {
    id: 'des-process',
    kind: 'process',
    title: 'Why Double-DES Failed: Meet-in-the-Middle',
    subtitle: 'Why 2DES Gives 57 Bits of Security, Not 112 Bits',
    caption: 'Encrypting twice with two 56-bit keys yields only 2^57 work by matching forward and backward tables in memory.',
    eli5Caption: 'Meet-in-the-middle works like digging a tunnel from both ends simultaneously instead of digging all the way through.',
    scene: {
      id: 'scene-meet-in-the-middle',
      title: 'Meet-in-the-Middle Attack on Double-DES',
      viewBox: '0 0 900 360',
      legend: ['Plaintext P', 'Forward Table (E_K1)', 'Backward Table (D_K2)', 'Ciphertext C'],
      actors: [
        { id: 'client', kind: 'client', label: 'Plaintext P', pos: { x: 100, y: 180 } },
        { id: 'db', kind: 'db', label: 'Hash Table (2^56)', pos: { x: 450, y: 180 } },
        { id: 'server', kind: 'server', label: 'Ciphertext C', pos: { x: 800, y: 180 } }
      ],
      objects: [
        { id: 'pBlock', kind: 'plain', label: 'P: Known Block', at: { x: 100, y: 180 }, tone: 'info' },
        { id: 'cBlock', kind: 'cipher', label: 'C: Known Cipher', at: { x: 800, y: 180 }, tone: 'signal' }
      ],
      steps: [
        {
          caption: 'In Double-DES, C = E_{K2}(E_{K1}(P)). An attacker captures one known pair of (P, C).',
          eli5: 'The spy knows one input message and its double-encrypted output.',
          actions: [
            { do: 'highlight', target: ['pBlock', 'cBlock'], tone: 'info' },
            { do: 'say', actor: 'client', text: 'Known (P, C) pair' }
          ]
        },
        {
          caption: 'Step 1: Attacker computes E_{k1}(P) for all 2^56 possible K1 keys and stores (X, K1) in a hash table.',
          eli5: 'Attacker computes all possible first-step encryptions and saves them in a big index.',
          actions: [
            { do: 'move', obj: 'pBlock', to: { x: 450, y: 180 } },
            { do: 'transform', obj: 'pBlock', into: { kind: 'matrix', label: '2^56 Forward Hashes', tone: 'warn' } },
            { do: 'say', actor: 'db', text: 'Table filled: 2^56 values' }
          ]
        },
        {
          caption: 'Step 2: Attacker decrypts C with each candidate K2: Y = D_{k2}(C), checking if Y exists in the table.',
          eli5: 'Attacker steps backwards from the end until they find a match in the table.',
          actions: [
            { do: 'move', obj: 'cBlock', to: { x: 450, y: 180 } },
            { do: 'pulse', target: 'cBlock' }
          ]
        },
        {
          caption: 'A match E_{k1}(P) = D_{k2}(C) reveals the correct key pair (K1, K2) in 2^56 + 2^56 = 2^57 operations!',
          eli5: 'A match connects the tunnel from both sides, finding the two keys in 2^57 tries!',
          actions: [
            { do: 'transform', obj: 'pBlock', into: { kind: 'key-shared', label: 'Matched (K1, K2)', tone: 'ok' } },
            { do: 'highlight', target: ['db', 'pBlock'], tone: 'ok' },
            { do: 'say', actor: 'db', text: 'Total Work: 2^57 (Broken!)' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Ralph Merkle and Martin Hellman proved the Meet-in-the-Middle attack in 1981. This is why 2DES was never deployed and why Triple-DES (3DES) with 3 operations (EDE) became the standard.',
      likelyQuestions: [
        {
          question: 'What is the space complexity of the Meet-in-the-Middle attack on 2DES?',
          answer: 'It requires 2^56 entries of 64 bits, which is approximately 2^59 bytes = 576 Petabytes of storage.'
        }
      ]
    }
  },

  // 4. Comparison: DES vs 3DES (Triple DES)
  {
    id: 'des-compare',
    kind: 'compare',
    title: 'Triple-DES (3DES) Architecture',
    subtitle: 'Why Encrypt-Decrypt-Encrypt (EDE) Mode?',
    caption: '3DES applies E_{K3}(D_{K2}(E_{K1}(P))), offering backward compatibility with single DES when K1 = K2 = K3.',
    eli5Caption: 'Encrypt, then decrypt, then encrypt. If all three keys are the same, it turns right back into standard single DES.',
    comparison: {
      leftTitle: 'Single DES (FIPS 46-3)',
      rightTitle: 'Triple DES (3DES / TDEA)',
      differences: [
        {
          feature: 'Key Length',
          left: '56 effective bits (+ 8 parity bits = 64)',
          right: '112 effective bits (2 keys) or 168 bits (3 keys)'
        },
        {
          feature: 'Operations',
          left: 'Single 16-round Feistel pass',
          right: 'Three 16-round passes: E(K1) → D(K2) → E(K3)'
        },
        {
          feature: 'Brute-Force Security',
          left: '2^56 (Insecure, broken in minutes)',
          right: '2^112 against Meet-in-the-Middle (Deprecated by NIST in 2023)'
        },
        {
          feature: 'Backward Compatibility',
          left: 'N/A',
          right: 'Setting K1 = K2 = K3 cancels the middle D, yielding single DES'
        }
      ],
      summaryTakeaway: 'The EDE construction was an engineering triumph for backward compatibility, but 64-bit blocks doomed 3DES to obsolescence.'
    },
    speakerNotes: {
      script: 'Explain the backward compatibility feature: If a legacy system only supports single DES, you set K1 = K2 = K3. E_{K1}(D_{K1}(E_{K1}(P))) = E_{K1}(P) because the middle decryption undoes the first encryption.',
      likelyQuestions: [
        {
          question: 'Why did NIST deprecate 3DES in 2023?',
          answer: 'Because of the 64-bit block size and vulnerability to Sweet32 birthday attacks after 2^32 blocks.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'des-ask',
    kind: 'ask-the-room',
    title: 'Check Your Cryptanalytic Judgment',
    subtitle: 'Meet-in-the-Middle Attack on Double-DES',
    caption: 'A company proposes creating a cipher called "Double-AES-128" by encrypting twice with two independent 128-bit keys.',
    eli5Caption: 'If you double an AES-128 key, does it give you 256 bits of safety?',
    askTheRoom: {
      question: 'What is the effective computational security of Double-AES-128 under a Meet-in-the-Middle attack?',
      options: [
        'A. 2^256 operations, because the total key size is 256 bits.',
        'B. 2^129 operations (2 × 2^128) using a 2^128-entry table, giving 129 bits of effective security.',
        'C. Exactly 2^128 operations.',
        'D. Zero operations, because two AES encryptions cancel each other.'
      ],
      correctIndex: 1,
      explanation: 'Under Meet-in-the-Middle, Double-AES requires 2^128 forward encryptions + 2^128 backward decryptions = 2^129 operations, providing only 129 bits of effective security instead of 256 bits.'
    },
    speakerNotes: {
      script: 'Ensure students understand that double encryption never doubles effective security bits; it only adds 1 bit of exponent due to MitM.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'des-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for DES & 3DES',
    caption: 'Block sizes, round counts, S-box mechanisms, and 3DES EDE formulas.',
    eli5Caption: 'The exact numbers and definitions required for full marks.',
    speakerNotes: {
      script: 'Students must know: 64-bit block, 56-bit key, 16 rounds, 8 S-boxes (6-in to 4-out), 3DES EDE formula. These numbers are tested in every multiple-choice and short-answer exam.',
      likelyQuestions: [
        {
          question: 'How are subkeys generated in DES?',
          answer: 'From the 56-bit key using Permuted Choice 1 (PC-1), 16 round circular left shifts (1 or 2 bits per round), and Permuted Choice 2 (PC-2) producing sixteen 48-bit subkeys.'
        }
      ]
    },
    examWords: {
      term: 'Data Encryption Standard (DES) & 3DES',
      definition: 'A 16-round Feistel block cipher with a 64-bit block size and 56-bit effective key. 3DES applies EDE mode across three stages to achieve 112 or 168-bit security.',
      keywords: [
        'Data Encryption Standard (DES)',
        '64-bit Block Size',
        '56-bit Key (+ 8 parity bits)',
        '16 Feistel Rounds',
        'S-Box (6-bit in, 4-bit out)',
        'Expansion Permutation (32-bit to 48-bit)',
        'Meet-in-the-Middle Attack (2^57)',
        'Triple DES (3DES EDE Mode)'
      ],
      mustRememberPoints: [
        'DES uses a 64-bit block and 56-bit key across 16 Feistel rounds; S-boxes provide the only non-linear transformation.',
        'Double-DES is broken by the Meet-in-the-Middle attack in 2^57 operations using a 2^56 hash table.',
        '3DES uses Encrypt-Decrypt-Encrypt (EDE) mode: C = E_K3(D_K2(E_K1(P))), providing backward compatibility when K1 = K2 = K3.'
      ],
      typicalMarks: 5
    }
  }
]

export const desPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'des',
  topicTitle: 'Data Encryption Standard (DES) & 3DES',
  targetDurationMinutes: 10,
  plates: desPlates
}
