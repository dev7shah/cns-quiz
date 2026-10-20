import { Plate, TopicPresentation } from "@/lib/present/types"

export const aesPlates: Plate[] = [
  // 1. Hook
  {
    id: 'aes-hook',
    kind: 'hook',
    title: 'The Golden Standard of the Modern World',
    subtitle: 'NIST Competition (1997–2001): Rijndael Replaces DES',
    caption: 'Belgian cryptographers Joan Daemen and Vincent Rijmen beat IBM and RSA with an elegant algebraic cipher: AES.',
    eli5Caption: 'A worldwide tournament picked one champion cipher that now locks every smartphone, bank transaction, and secret file on Earth.',
    speakerNotes: {
      script: 'In 1997, NIST launched a 5-year global tournament to find a replacement for DES. Contestants included Mars (IBM), RC6 (RSA), Serpent, and Twofish. In 2001, Rijndael was selected as FIPS 197: Advanced Encryption Standard (AES). It is fast in hardware, resistant to all known cryptanalysis, and requires zero Feistel splitting.',
      likelyQuestions: [
        {
          question: 'What is the difference between Rijndael and AES?',
          answer: 'Rijndael supported variable block and key sizes in multiples of 32 bits (128, 160, 192, 224, 256 bits). AES standardized the block size strictly to 128 bits, with key sizes of 128, 192, or 256 bits.'
        }
      ]
    }
  },

  // 2. Concept: 4x4 Byte State Matrix & Round Count
  {
    id: 'aes-concept',
    kind: 'concept',
    title: 'The 4×4 Byte State Matrix',
    subtitle: '128 Bits Arranged as 16 Bytes in Column-Major Order',
    caption: '16 plaintext bytes are arranged into a 4×4 grid. Each round applies four distinct mathematical operations.',
    eli5Caption: '16 letters sit on a 4x4 chessboard. Every turn swaps, rotates, and blends them in four precise moves.',
    comparison: {
      leftTitle: 'Key Length (Bits)',
      rightTitle: 'Number of Rounds (Nr)',
      differences: [
        {
          feature: 'AES-128',
          left: '128 bits (16 bytes)',
          right: '10 rounds (1 initial + 9 standard + 1 final)'
        },
        {
          feature: 'AES-192',
          left: '192 bits (24 bytes)',
          right: '12 rounds (1 initial + 11 standard + 1 final)'
        },
        {
          feature: 'AES-256',
          left: '256 bits (32 bytes)',
          right: '14 rounds (1 initial + 13 standard + 1 final)'
        },
        {
          feature: 'Block Size (All Variants)',
          left: 'Always strictly 128 bits (16 bytes)',
          right: 'Organized as a 4×4 matrix of bytes in GF(2^8)'
        }
      ],
      summaryTakeaway: 'The block size is always 128 bits regardless of key length; only the round count increases.'
    },
    speakerNotes: {
      script: 'Make sure students remember the formula for round count: Nr = 10, 12, or 14 for 128, 192, and 256-bit keys. Notice that each round operates on all 128 bits simultaneously, unlike Feistel which only operates on 64 bits at a time.',
      likelyQuestions: [
        {
          question: 'Does AES-256 have a 256-bit block size?',
          answer: 'NO! This is the most common exam trap. AES block size is ALWAYS 128 bits. The 256 refers to the key size only.'
        }
      ]
    }
  },

  // 3. Process: The Four Round Transformations Scene
  {
    id: 'aes-process',
    kind: 'process',
    title: 'The Four AES Round Transformations',
    subtitle: 'SubBytes, ShiftRows, MixColumns, and AddRoundKey',
    caption: '1) Substitute bytes via S-box; 2) Shift rows cyclically; 3) Mix columns via GF(2^8) matrix; 4) XOR round key.',
    eli5Caption: '1) Replace each byte; 2) Shift the rows; 3) Mix the columns; 4) Add the secret key with XOR.',
    scene: {
      id: 'scene-aes-round-transformations',
      title: 'Four Transformations of an AES Round',
      viewBox: '0 0 900 360',
      legend: ['State (4x4)', 'SubBytes (S-Box)', 'ShiftRows (Diffusion)', 'MixColumns & AddRoundKey'],
      actors: [
        { id: 'client', kind: 'client', label: 'Input State', pos: { x: 100, y: 180 } },
        { id: 'router', kind: 'router', label: 'SubBytes & Shift', pos: { x: 340, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'MixColumns', pos: { x: 580, y: 180 } },
        { id: 'server', kind: 'server', label: 'AddRoundKey', pos: { x: 800, y: 180 } }
      ],
      objects: [
        { id: 'state', kind: 'matrix', label: '4x4 Plain State', at: { x: 100, y: 180 }, tone: 'info' },
        { id: 'rKey', kind: 'key-shared', label: 'Round Key K_i', at: { x: 800, y: 80 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Step 1 (SubBytes): Each byte of the 4x4 state is replaced independently using the non-linear S-box over GF(2^8).',
          eli5: 'Each byte looks up a secret replacement in a 256-byte table.',
          actions: [
            { do: 'highlight', target: ['state'], tone: 'info' },
            { do: 'move', obj: 'state', to: { x: 340, y: 180 } },
            { do: 'transform', obj: 'state', into: { label: 'SubBytes State', tone: 'signal' } },
            { do: 'pulse', target: 'state' }
          ]
        },
        {
          caption: 'Step 2 (ShiftRows): Row 0 shifts 0, Row 1 shifts 1 byte left, Row 2 shifts 2, Row 3 shifts 3 bytes left.',
          eli5: 'The four rows slide sideways by 0, 1, 2, and 3 steps.',
          actions: [
            { do: 'transform', obj: 'state', into: { label: 'ShiftRows State', tone: 'warn' } },
            { do: 'say', actor: 'router', text: 'Rows cyclically shifted' }
          ]
        },
        {
          caption: 'Step 3 (MixColumns): Each column is multiplied by a fixed 4x4 matrix over GF(2^8), diffusing each byte across 4 rows.',
          eli5: 'Each column is multiplied by a matrix so all 4 bytes blend together.',
          actions: [
            { do: 'move', obj: 'state', to: { x: 580, y: 180 } },
            { do: 'transform', obj: 'state', into: { label: 'MixColumns State', tone: 'signal' } },
            { do: 'say', actor: 'switch', text: 'GF(2^8) column matrix mix' }
          ]
        },
        {
          caption: 'Step 4 (AddRoundKey): The 128-bit state is XORed with the round key. (Note: Final round omits MixColumns).',
          eli5: 'The round subkey is XORed directly into the state.',
          actions: [
            { do: 'move', obj: 'state', to: { x: 800, y: 180 } },
            { do: 'transform', obj: 'state', into: { kind: 'cipher', label: 'Round Output State', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'state'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Round complete!' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Walk through the 4 steps: SubBytes provides non-linearity (confusion). ShiftRows and MixColumns provide linear bit diffusion across rows and columns. AddRoundKey injects the secret entropy. Why is MixColumns omitted in the final round? To allow the structure of encryption and decryption to match symmetrically.',
      likelyQuestions: [
        {
          question: 'Why is MixColumns omitted in the final round (round 10 in AES-128)?',
          answer: 'Omitting MixColumns in the final round makes the cipher reversible with symmetric hardware/software transformations, reducing execution overhead without sacrificing security.'
        }
      ]
    }
  },

  // 4. Comparison: Feistel (DES) vs SPN (AES)
  {
    id: 'aes-compare',
    kind: 'compare',
    title: 'Feistel Networks vs SPN Networks',
    subtitle: 'The Architectural Evolution from DES to AES',
    caption: 'DES splits data in half and leaves F non-invertible; AES transforms the entire block and inverts each step.',
    eli5Caption: 'Feistel scrambles half the block at a time; SPN scrambles the entire block at once but requires reversible math.',
    comparison: {
      leftTitle: 'Feistel Network (DES / Blowfish)',
      rightTitle: 'Substitution-Permutation Network (AES)',
      differences: [
        {
          feature: 'Data Processing per Round',
          left: 'Only 50% of the block is modified per round (Left/Right split)',
          right: '100% of the block is modified in every round'
        },
        {
          feature: 'Invertibility Requirement',
          left: 'Round function F does NOT need to be invertible',
          right: 'Every single component (SubBytes, ShiftRows, MixColumns) MUST be invertible'
        },
        {
          feature: 'Avalanche Speed',
          left: 'Requires 4 to 8 rounds for complete bit avalanche',
          right: 'Achieves complete bit avalanche in just 2 rounds'
        },
        {
          feature: 'Hardware Efficiency',
          left: 'Identical circuitry for encryption and decryption',
          right: 'Requires separate inverse circuits (InvSubBytes, InvMixColumns)'
        }
      ],
      summaryTakeaway: 'SPN networks achieve full avalanche in far fewer rounds at the cost of requiring invertible transformations.'
    },
    speakerNotes: {
      script: 'This comparison is one of the highest-yield theoretical concepts in cryptography. Be sure students understand why SPN requires fewer rounds: because all 128 bits are transformed simultaneously in every round.',
      likelyQuestions: [
        {
          question: 'Why does AES achieve avalanche faster than DES?',
          answer: 'In DES, only 32 bits are modified in round 1. In AES, all 128 bits are substituted and mixed in every round, achieving complete diffusion by round 2.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'aes-ask',
    kind: 'ask-the-room',
    title: 'Check Your AES Architectural Knowledge',
    subtitle: 'Final Round Exception',
    caption: 'A developer implementing AES-128 from scratch gets incorrect test vector results for round 10.',
    eli5Caption: 'Which step in the normal 4-step dance is skipped in the very last round?',
    askTheRoom: {
      question: 'Which of the four transformations is deliberately OMITTED in the final round of AES (Round 10 in AES-128)?',
      options: [
        'A. SubBytes is omitted because non-linear substitution is only needed in early rounds.',
        'B. MixColumns is omitted to ensure encryption and decryption architectures remain symmetric.',
        'C. ShiftRows is omitted because byte shifting does not affect the final byte values.',
        'D. AddRoundKey is omitted because the key has already been added 9 times.'
      ],
      correctIndex: 1,
      explanation: 'Correct! The final round of AES executes only SubBytes, ShiftRows, and AddRoundKey; MixColumns is omitted to make the cipher symmetric with the equivalent inverse cipher.'
    },
    speakerNotes: {
      script: 'Give the students 30 seconds to vote. Many will guess SubBytes or AddRoundKey. Emphasize that MixColumns is the omitted step.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'aes-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for AES (Rijndael)',
    caption: 'State matrix dimensions, 4 round operations, GF(2^8) math, and round counts.',
    eli5Caption: 'The exact table and step names to write down for full marks.',
    speakerNotes: {
      script: 'Students must list the 4 round transformations in order: SubBytes, ShiftRows, MixColumns, AddRoundKey. Emphasize that MixColumns is omitted in round Nr.',
      likelyQuestions: [
        {
          question: 'What irreducible polynomial is used in AES GF(2^8) field arithmetic?',
          answer: 'm(x) = x^8 + x^4 + x^3 + x + 1, represented in hex as 0x11B.'
        }
      ]
    },
    examWords: {
      term: 'Advanced Encryption Standard (AES / FIPS 197)',
      definition: 'A non-Feistel Substitution-Permutation Network (SPN) symmetric block cipher operating on a 128-bit block (4×4 byte matrix) with key sizes of 128 (10 rounds), 192 (12 rounds), or 256 bits (14 rounds).',
      keywords: [
        'Advanced Encryption Standard (AES)',
        'Rijndael Algorithm (Daemen & Rijmen)',
        '4×4 Byte State Matrix (128-bit)',
        'SubBytes (Non-linear S-box over GF(2^8))',
        'ShiftRows (Cyclic row permutation)',
        'MixColumns (Matrix multiplication in GF(2^8))',
        'AddRoundKey (Bitwise XOR with round subkey)',
        'Rounds: 10 (128b), 12 (192b), 14 (256b)'
      ],
      mustRememberPoints: [
        'AES uses an SPN structure on a 128-bit block (4×4 state matrix); it is NOT a Feistel cipher.',
        'The 4 round transformations are SubBytes (confusion), ShiftRows (diffusion), MixColumns (diffusion), and AddRoundKey (key injection).',
        'The final round (Round 10 in AES-128) omits MixColumns, executing only SubBytes, ShiftRows, and AddRoundKey.'
      ],
      typicalMarks: 5
    }
  }
]

export const aesPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'aes',
  topicTitle: 'Advanced Encryption Standard (AES / Rijndael)',
  targetDurationMinutes: 10,
  plates: aesPlates
}
