import { Plate, TopicPresentation } from "@/lib/present/types"

export const rc5Plates: Plate[] = [
  // 1. Hook
  {
    id: 'rc5-hook',
    kind: 'hook',
    title: 'Ronald Rivest’s Dynamic Rotator',
    subtitle: 'RC5 (1994): Data-Dependent Rotations',
    caption: 'RC5 introduced word-level parameterization (w/r/b) and made circular bit rotations dependent on the data itself, frustrating linear and differential cryptanalysis.',
    eli5Caption: 'Instead of shifting bits by a fixed amount, the numbers themselves tell the processor how many spaces to rotate.',
    speakerNotes: {
      script: 'Ronald Rivest designed RC5 in 1994 with three explicit goals: extreme simplicity, high software execution speed on modern microprocessors, and parameterized flexibility. It was among the first ciphers to use data-dependent rotations as the primary cryptographic primitive.',
      likelyQuestions: [
        {
          question: 'What do the parameters (w, r, b) signify in RC5?',
          answer: 'w is the word size in bits (usually 32 bits, making a 64-bit block). r is the number of rounds (usually 12 or 16). b is the key length in bytes (usually 16 bytes = 128 bits).'
        }
      ]
    }
  },

  // 2. Concept: Data-Dependent Rotations & Parameters
  {
    id: 'rc5-concept',
    kind: 'concept',
    title: 'The Trinity of Parameters: RC5-w/r/b',
    subtitle: 'Modularity, Word Sizes, and Magic Constants P & Q',
    caption: 'RC5 operates on two w-bit words (A, B) using subkeys expanded with the golden ratio and Euler constants: P_w and Q_w.',
    eli5Caption: 'You can adjust RC5 for tiny 16-bit microcontrollers, standard 32-bit PCs, or heavy 64-bit servers.',
    comparison: {
      leftTitle: 'Fixed-Shift Ciphers (DES / Blowfish)',
      rightTitle: 'Data-Dependent Shift (RC5)',
      differences: [
        {
          feature: 'Rotation Distance',
          left: 'Static shift count hardcoded into algorithm tables (e.g., 1 or 2 bits in DES)',
          right: 'Dynamic shift count: rotated by the lowest lg(w) bits of the companion register'
        },
        {
          feature: 'Cryptanalysis Defense',
          left: 'Requires complex S-boxes to break linearity and prevent differential attacks',
          right: 'Data-dependent shift destroys input-output linear approximations naturally'
        },
        {
          feature: 'Hardware / CPU Cost',
          left: 'Fast in dedicated silicon permutations, slower in general software registers',
          right: 'Executes in 1 CPU cycle on chips with barrel shifters (x86, ARM)'
        },
        {
          feature: 'Parameter Adaptability',
          left: 'Rigid: Fixed block size (64b) and fixed round count (16)',
          right: 'Fully parameterized: word size w (16/32/64b), rounds r (0-255), key bytes b (0-255)'
        }
      ],
      summaryTakeaway: 'Data-dependent rotations give RC5 strong cryptographic non-linearity without requiring any S-box tables in memory.'
    },
    speakerNotes: {
      script: 'Highlight the role of the barrel shifter. Modern RISC and CISC processors execute barrel rotation in a single clock cycle. By relying on barrel shifts instead of memory lookups, RC5 avoids cache-timing attacks entirely.',
      likelyQuestions: [
        {
          question: 'What are the magic constants P_w and Q_w?',
          answer: 'They are odd integer approximations derived from binary expansions of e - 2 and the golden ratio phi - 1, ensuring pseudo-random key array initialization without weak constants.'
        }
      ]
    }
  },

  // 3. Process: RC5 Encryption Round Scene
  {
    id: 'rc5-process',
    kind: 'process',
    title: 'RC5 Round Execution Step-by-Step',
    subtitle: 'A = ((A ⊕ B) <<< B) + S[2i]  |  B = ((B ⊕ A) <<< A) + S[2i+1]',
    caption: 'Each round updates word A using word B as a rotation count, then updates word B using updated word A.',
    eli5Caption: 'XOR A and B, spin A by B positions, add a subkey. Then do the reverse for B.',
    scene: {
      id: 'scene-rc5-round',
      title: 'RC5 Two-Half Iteration Cycle',
      viewBox: '0 0 900 360',
      legend: ['Word A (w bits)', 'Word B (w bits)', 'Data Rotation (<<<)', 'Subkey Addition (+)'],
      actors: [
        { id: 'client', kind: 'client', label: 'Word A (w bits)', pos: { x: 140, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'XOR & Barrel Rotate', pos: { x: 450, y: 180 } },
        { id: 'server', kind: 'server', label: 'Word B (w bits)', pos: { x: 760, y: 180 } }
      ],
      objects: [
        { id: 'tokA', kind: 'bits', label: 'A_prev', at: { x: 140, y: 180 }, tone: 'info' },
        { id: 'tokB', kind: 'bits', label: 'B_prev', at: { x: 760, y: 180 }, tone: 'warn' },
        { id: 'subKey', kind: 'key-shared', label: 'S[2i], S[2i+1]', at: { x: 450, y: 80 }, tone: 'signal' }
      ],
      steps: [
        {
          caption: 'Pre-whitening: At round 0, word A is added to S[0] and word B is added to S[1].',
          eli5: 'Add the first two subkeys before starting rounds.',
          actions: [
            { do: 'highlight', target: ['tokA', 'tokB', 'subKey'], tone: 'info' },
            { do: 'say', actor: 'switch', text: 'Pre-whitened with S[0], S[1]' }
          ]
        },
        {
          caption: 'Round step 1: A is XORed with B, cyclically shifted left by (B mod w) bits, and added to subkey S[2i].',
          eli5: 'XOR A with B, spin A left by B mod 32 bits, add subkey S[2i].',
          actions: [
            { do: 'move', obj: 'tokA', to: { x: 450, y: 180 } },
            { do: 'transform', obj: 'tokA', into: { label: 'A_new = ((A^B)<<<B)+S[2i]', tone: 'signal' } },
            { do: 'pulse', target: 'tokA' },
            { do: 'say', actor: 'switch', text: 'Rotate A by low bits of B' }
          ]
        },
        {
          caption: 'Round step 2: B is XORed with the new A, cyclically shifted left by (A mod w) bits, and added to subkey S[2i+1].',
          eli5: 'XOR B with new A, spin B left by A mod 32 bits, add subkey S[2i+1].',
          actions: [
            { do: 'move', obj: 'tokB', to: { x: 450, y: 240 } },
            { do: 'transform', obj: 'tokB', into: { label: 'B_new = ((B^A)<<<A)+S[2i+1]', tone: 'ok' } },
            { do: 'pulse', target: 'tokB' },
            { do: 'say', actor: 'switch', text: 'Rotate B by low bits of A' }
          ]
        },
        {
          caption: 'Both halves are updated. Decryption simply reverses operations in exact reverse order (subtract, rotate right, XOR).',
          eli5: 'To decrypt, subtract the subkey, spin right, and XOR back.',
          actions: [
            { do: 'move', obj: 'tokA', to: { x: 140, y: 180 } },
            { do: 'move', obj: 'tokB', to: { x: 760, y: 180 } },
            { do: 'highlight', target: ['tokA', 'tokB'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Round i complete' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Point out the symmetry and reversibility. Because addition modulo 2^w is undone by subtraction, and cyclical left shift is undone by cyclical right shift, every step is fully invertible without an S-box.',
      likelyQuestions: [
        {
          question: 'What is RC6?',
          answer: 'RC6 was Rivest’s AES finalist submission. It expanded RC5 to four 32-bit registers (128-bit block) and introduced quadratic modular multiplication (f(x) = x(2x+1)) to randomize rotation amounts further.'
        }
      ]
    }
  },

  // 4. Ask the room
  {
    id: 'rc5-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Data-Dependent Rotations',
    caption: 'In RC5-32/12/16 (word size w = 32 bits), when word A is rotated left by word B, how many bits of register B determine the shift distance?',
    eli5Caption: 'If your word has 32 bits, how many bits are needed to choose a shift distance between 0 and 31?',
    askTheRoom: {
      question: 'In RC5 with 32-bit words, how many bits of word B dictate the cyclical rotation of register A?',
      options: [
        'A. All 32 bits',
        'B. Exactly 5 bits (because 2^5 = 32)',
        'C. 8 bits (one byte)',
        'D. 1 bit (odd or even)'
      ],
      correctIndex: 1,
      explanation: 'Correct! Rotating a 32-bit word requires a shift amount between 0 and 31. This is uniquely specified by log2(32) = 5 bits (the lowest 5 bits of B).'
    },
    speakerNotes: {
      script: 'Make sure students remember that log2(w) bits determine the shift amount: 4 bits for w=16, 5 bits for w=32, and 6 bits for w=64.',
      likelyQuestions: [
        {
          question: 'Can an attacker predict the rotation if they know partial bits?',
          answer: 'If low-order bits can be controlled in known-plaintext scenarios, differential cryptanalysis can exploit low rotation amounts. This is why 16 or 20 rounds are recommended over 12.'
        }
      ]
    }
  },

  // 5. Exam words
  {
    id: 'rc5-exam',
    kind: 'exam-words',
    title: 'RC5 Key Terminology & Exam Reference',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these three key principles for university and certification exams.',
    eli5Caption: 'The three things examiners look for on RC5 answer sheets.',
    examWords: {
      term: 'RC5 Parameterized Block Cipher',
      definition: 'A symmetric block cipher developed by Ronald Rivest characterized by variable word size (w), variable round count (r), variable key length (b), and data-dependent rotations.',
      keywords: [
        'Data-dependent rotation',
        'Parameterization RC5-w/r/b',
        'Magic constants P_w and Q_w',
        'Pre-whitening',
        'Barrel shifter efficiency'
      ],
      mustRememberPoints: [
        'Parameters are defined as RC5-w/r/b, where w is word size in bits (block size is 2w), r is rounds, and b is key size in bytes.',
        'Data-dependent rotation: The rotation distance is determined by the lowest log2(w) bits of the data, eliminating the need for fixed S-boxes.',
        'Uses three basic operations: bitwise XOR, modular addition/subtraction (mod 2^w), and cyclical rotations (<<< and >>>).'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Emphasize naming conventions in university exams: RC5-32/12/16 is the standard 64-bit block, 12 rounds, 16-byte (128-bit) key configuration.',
      likelyQuestions: [
        {
          question: 'Why did RC5 lose to AES?',
          answer: 'Rijndael (AES) was chosen due to its faster 128-bit hardware/software performance, patent clarity, and superior resistance to differential attacks with fixed rounds.'
        }
      ]
    }
  }
]

export const rc5Presentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'rc5',
  topicTitle: 'RC5 Algorithm',
  targetDurationMinutes: 10,
  plates: rc5Plates
}
