import { Plate, TopicPresentation } from "@/lib/present/types"

export const feistelPlates: Plate[] = [
  // 1. Hook
  {
    id: 'feistel-hook',
    kind: 'hook',
    title: 'Horst Feistel’s Reversibility Genius',
    subtitle: 'How to Build an Invertible Cipher from a One-Way Function',
    caption: 'How can you decrypt a message if the encryption engine uses non-invertible, lossy mathematical functions?',
    eli5Caption: 'You lock a box with a complicated knot that cannot be untied, yet the receiver opens it effortlessly.',
    speakerNotes: {
      script: 'In the early 1970s at IBM, Horst Feistel solved a fundamental problem: how to create a mathematically reversible block cipher while using arbitrary, highly complex, non-linear round functions that might lose information and cannot be inverted mathematically.',
      likelyQuestions: [
        {
          question: 'Does the round function F need to have an inverse function F⁻¹?',
          answer: 'No! The round function F can be completely one-way (e.g. hash-like, non-invertible S-boxes). The Feistel architecture guarantees reversibility through the XOR operation alone.'
        }
      ]
    }
  },

  // 2. Analogy / Concept
  {
    id: 'feistel-analogy',
    kind: 'analogy',
    title: 'The Two-Handed Juggling Act',
    subtitle: 'Left and Right Halves in Harmony',
    caption: 'Left hand holds the data; right hand calculates a mask with the key and XORs it onto the left hand.',
    eli5Caption: 'Right hand looks at the key and writes a riddle; Left hand blends with the riddle; then the two hands swap.',
    speakerNotes: {
      script: 'Think of two partners. Bob holds the right half and whispers a clue calculated with his key. Alice holds the left half and XORs the clue onto her number. Then they swap places. In the next round, Alice whispers and Bob XORs.',
      likelyQuestions: [
        {
          question: 'Why is there a swap on every round?',
          answer: 'Without the swap, only one half of the block would ever be modified. Swapping ensures both halves are repeatedly scrambled by diffusion.'
        }
      ]
    }
  },

  // 3. Process: Specialized Interactive Feistel Diagram
  {
    id: 'feistel-process',
    kind: 'process',
    title: 'Feistel Cipher Round Structure',
    subtitle: 'Interactive Round-by-Round Visualizer',
    caption: 'Step through rounds 1 to 16. Toggle Encrypt vs Decrypt to observe reversed subkey injection.',
    eli5Caption: 'Watch the left and right wires cross over and get scrambled with the round key.',
    customFigure: 'FeistelDiagram',
    speakerNotes: {
      script: 'Look closely at the diagram. In encryption, Round 1 applies Subkey K1 to the right half, XORs with the left, and swaps. In decryption, we feed the ciphertext into the exact same hardware, but we inject Subkey K16 first, down to K1.',
      likelyQuestions: [
        {
          question: 'Why is the swap omitted after the final round 16?',
          answer: 'Omitting the swap on round 16 allows the exact same hardware circuit or software routine to be used for decryption without extra un-swapping logic.'
        }
      ]
    }
  },

  // 4. Concept: Mathematical Proof of Reversibility
  {
    id: 'feistel-concept',
    kind: 'concept',
    title: 'The Mathematical Proof of Reversibility',
    subtitle: 'Why Decryption Uses the Forward Round Function F',
    caption: 'Because A ⊕ B ⊕ B = A, XOR cancels itself out regardless of what F produces.',
    eli5Caption: 'Adding a secret number then subtracting the exact same secret number returns your original message.',
    comparison: {
      leftTitle: 'Encryption Round i',
      rightTitle: 'Decryption Round (n - i + 1)',
      differences: [
        {
          feature: 'Left Output',
          left: 'L_i = R_{i-1}',
          right: 'R_{i-1} = L_i (Direct wire transfer)'
        },
        {
          feature: 'Right Output',
          left: 'R_i = L_{i-1} ⊕ F(R_{i-1}, K_i)',
          right: 'L_{i-1} = R_i ⊕ F(L_i, K_i) (XOR cancellation)'
        },
        {
          feature: 'Round Function F',
          left: 'Evaluated in forward direction: F(R, K)',
          right: 'Evaluated in forward direction: F(R, K) (No F⁻¹ needed!)'
        },
        {
          feature: 'Hardware Benefit',
          left: 'Identical datapath for encryption and decryption',
          right: 'Subkey schedule runs in reverse order only'
        }
      ],
      summaryTakeaway: 'Feistel ciphers cut silicon footprint in half because encryption and decryption engines share 100% of the logic.'
    },
    speakerNotes: {
      script: 'Walk students through the proof: L_{i-1} = R_i ⊕ F(R_{i-1}, K_i). Since L_i = R_{i-1}, we substitute to get R_i ⊕ F(L_i, K_i). The F function output is identical, so XORing it again perfectly cancels it out.',
      likelyQuestions: [
        {
          question: 'Name three famous ciphers that use Feistel networks.',
          answer: 'DES, Blowfish, Twofish, RC5, and TEA.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'feistel-ask',
    kind: 'ask-the-room',
    title: 'Check Your Feistel Intuition',
    subtitle: 'The Role of Round Function F',
    caption: 'Suppose a student claims that if F is a hash function that destroys half its input bits, decryption is mathematically impossible.',
    eli5Caption: 'If the round function loses information, can the receiver still decode the message?',
    askTheRoom: {
      question: 'Is the student’s claim correct that a non-invertible round function F breaks Feistel decryption?',
      options: [
        'A. Yes, because any information lost during round F cannot be recovered during decryption.',
        'B. No, because F is never inverted; its output is merely re-generated and cancelled out via XOR.',
        'C. Only if the block size is less than 64 bits.',
        'D. Yes, unless the key schedule uses prime numbers.'
      ],
      correctIndex: 1,
      explanation: 'Correct! The beauty of the Feistel structure is that F is only ever evaluated in the forward direction. Decryption regenerates the exact same mask F(L_i, K_i) and cancels it with XOR.'
    },
    speakerNotes: {
      script: 'This is one of the most celebrated concepts in cryptography. Ensure every student understands that XOR cancellation makes F invertibility completely irrelevant.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'feistel-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Feistel Architecture',
    caption: 'Formula equations, reversibility proof points, and typical semester exam questions.',
    eli5Caption: 'The exact equations to write in your paper for full marks.',
    speakerNotes: {
      script: 'Students must write the two Feistel round equations and state that decryption applies subkeys in reverse order. This is a standard 5-mark question in almost every CNS university syllabus.',
      likelyQuestions: [
        {
          question: 'Does AES use a Feistel structure?',
          answer: 'No! AES uses a Substitution-Permutation Network (SPN), where every transformation must be individually invertible.'
        }
      ]
    },
    examWords: {
      term: 'Feistel Cipher Network',
      definition: 'A symmetric block cipher structure where the data block is divided into two halves (L, R) and processed iteratively such that encryption and decryption are identical except for reversing the subkey schedule.',
      keywords: [
        'Feistel Network',
        'Horst Feistel (IBM)',
        'Left and Right Halves (L_i, R_i)',
        'Round Function F',
        'XOR Cancellation Property',
        'Reversibility without F Inversion',
        'Subkey Schedule Reversal'
      ],
      mustRememberPoints: [
        'Round equations: L_i = R_{i-1} and R_i = L_{i-1} ⊕ F(R_{i-1}, K_i).',
        'Decryption is identical to encryption, with subkeys injected in reverse order (K_N down to K_1).',
        'The round function F does NOT need to be invertible because XOR cancellation (A ⊕ B ⊕ B = A) restores the plaintext.'
      ],
      typicalMarks: 5
    }
  }
]

export const feistelPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'feistel',
  topicTitle: 'Feistel Cipher Structure',
  targetDurationMinutes: 10,
  plates: feistelPlates
}
