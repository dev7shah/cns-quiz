import { Plate, TopicPresentation } from "@/lib/present/types"

export const transpositionPlates: Plate[] = [
  // 1. Hook
  {
    id: 'transposition-hook',
    kind: 'hook',
    title: 'Scrambling the Order, Not the Letters',
    subtitle: 'From Spartan Scytale (400 BC) to Modern P-Boxes',
    caption: 'Substitution changed what letters were; Transposition changes where letters sit.',
    eli5Caption: 'Instead of disguising letters as other letters, shuffle their positions like a deck of cards.',
    speakerNotes: {
      script: 'In substitution, letter identities changed while positions remained fixed. In transposition or permutation ciphers, the exact reverse happens: every character retains its original identity, but their temporal order is rearranged.',
      likelyQuestions: [
        {
          question: 'What happens to the letter frequency distribution in a transposition cipher?',
          answer: 'The frequency distribution is 100% identical to normal English! The count of E, T, A, O, I, N is completely unchanged, which is the immediate signature of a transposition cipher.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'transposition-analogy',
    kind: 'analogy',
    title: 'The Zigzag Rail Fence and The Spartan Rod',
    subtitle: 'Geometric Permutations',
    caption: 'Letters bounce down and up across wooden fence rails; reading horizontally scrambles the sequence.',
    eli5Caption: 'Write your message along a zigzag wave, then read off row by row.',
    speakerNotes: {
      script: 'The simplest keyless transposition is the rail fence cipher: write the plaintext diagonally downwards and upwards on imaginary rails, then read along each horizontal row to produce ciphertext.',
      likelyQuestions: [
        {
          question: 'Why is rail fence called "keyless"?',
          answer: 'Because the trajectory is a fixed geometric path determined solely by the depth parameter (number of rails), without an alphanumeric secret key.'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'transposition-concept',
    kind: 'concept',
    title: 'Keyed Columnar Transposition',
    subtitle: 'Write Row-by-Row, Read Column-by-Column',
    caption: 'Message is written in rows of width m; columns are read out in alphabetical order of the secret keyword.',
    eli5Caption: 'Fill a grid left to right. Read down the columns in the alphabetical order of your keyword.',
    speakerNotes: {
      script: 'In columnar transposition, the keyword determines column reading order. If the key is "ZEBRA", alphabetical sorting gives A(4), B(2), E(1), R(3), Z(0). We read column 4 first, then column 2, and so forth.',
      likelyQuestions: [
        {
          question: 'What is double transposition?',
          answer: 'Applying columnar transposition twice using two different keys. It provides significantly stronger diffusion and was used extensively in WWII military communications.'
        }
      ]
    }
  },

  // 4. Worked Example
  {
    id: 'transposition-worked',
    kind: 'worked-example',
    title: 'Worked Numerical: Columnar Transposition with Key "HACK"',
    subtitle: 'Grid Construction and Column Read-Out',
    caption: 'Encrypt "DEFENDTHEWALL" using keyword "HACK" (Alphabetical column order: A=1, C=2, H=0, K=3).',
    eli5Caption: 'Arrange letters into 4 columns under H-A-C-K, then read columns in order A, C, H, K.',
    speakerNotes: {
      script: 'Keyword "HACK" has length 4. Sorted alphabetically: A is col 1, C is col 2, H is col 0, K is col 3. Write rows: [D,E,F,E], [N,D,T,H], [E,W,A,L], [L,X,X,X]. Read columns in order 1, 2, 0, 3.',
      likelyQuestions: [
        {
          question: 'How do you handle padding in the final row?',
          answer: 'Standard padding uses filler letters like "X" to ensure all columns have identical length.'
        }
      ]
    },
    workedExample: {
      problem: 'Encrypt plaintext "DEFENDTHEWALL" using columnar transposition with keyword "HACK". Pad with "X".',
      given: {
        'Plaintext (P)': '"DEFENDTHEWALL"',
        'Keyword (K)': '"HACK"',
        'Col Order': 'A(col 1), C(col 2), H(col 0), K(col 3)'
      },
      steps: [
        {
          label: 'Determine grid dimensions and column reading order',
          formula: 'Col width = 4; Sorted HACK -> A=col 1, C=col 2, H=col 0, K=col 3',
          substitution: 'Order: Column 1, Column 2, Column 0, Column 3',
          result: 'Reading order: [1, 2, 0, 3]'
        },
        {
          label: 'Write plaintext row-by-row into 4 columns (pad with X to 16 letters)',
          formula: '4 rows of 4 letters',
          substitution: 'Row 0: [D, E, F, E]\nRow 1: [N, D, T, H]\nRow 2: [E, W, A, L]\nRow 3: [L, X, X, X]',
          result: '4x4 Matrix Filled'
        },
        {
          label: 'Read out columns in alphabetical order [1, 2, 0, 3]',
          formula: 'Col 1 + Col 2 + Col 0 + Col 3',
          substitution: 'Col 1: "EDWX"; Col 2: "FTAX"; Col 0: "DNEL"; Col 3: "EHLX"',
          result: '"EDWXFTAXDNELEHLX"'
        }
      ],
      finalAnswer: 'Ciphertext C = "EDWXFTAXDNELEHLX"',
      checkVerification: 'Decryption: reconstruct 4x4 matrix from column slices in order [1,2,0,3], read row-by-row -> "DEFENDTHEWALLXXX". Verified.'
    }
  },

  // 5. Compare
  {
    id: 'transposition-compare',
    kind: 'compare',
    title: 'Substitution vs Transposition (Confusion vs Diffusion)',
    subtitle: 'Claude Shannon’s Two Fundamental Cryptographic Operations',
    caption: 'Substitution provides Confusion (obscuring key relation); Transposition provides Diffusion (spreading redundancy).',
    eli5Caption: 'Substitution hides what letters are; transposition scatters where letters are across the message.',
    speakerNotes: {
      script: 'This is the most important theoretical bridge in M1. Claude Shannon proved that neither substitution alone nor transposition alone produces unbreakable ciphers. Modern block ciphers like AES cascade substitution and transposition in alternating rounds!',
      likelyQuestions: [
        {
          question: 'What is Shannon’s Confusion?',
          answer: 'Confusion makes the relationship between the key and the ciphertext as complex and non-linear as possible (achieved via substitution S-boxes).'
        },
        {
          question: 'What is Shannon’s Diffusion?',
          answer: 'Diffusion spreads the statistical redundancy of the plaintext across the entire ciphertext (achieved via transposition and permutation).'
        }
      ]
    },
    comparison: {
      leftTitle: 'Substitution Ciphers',
      rightTitle: 'Transposition Ciphers',
      differences: [
        { feature: 'Core Operation', left: 'Character identities replaced', right: 'Character positions permuted', diffTone: 'signal' },
        { feature: 'Frequency Profile', left: 'Spikes shifted or flattened', right: '100% identical to plaintext language', diffTone: 'warn' },
        { feature: 'Shannon Property', left: 'Provides Confusion', right: 'Provides Diffusion', diffTone: 'ok' },
        { feature: 'Modern Equivalent', left: 'S-Box (Non-linear lookup)', right: 'P-Box / ShiftRows / Permutations', diffTone: 'info' }
      ],
      summaryTakeaway: 'Cascading Substitution (Confusion) and Transposition (Diffusion) creates Product Ciphers, the basis of DES and AES.'
    }
  },

  // 6. Exam Words
  {
    id: 'transposition-exam',
    kind: 'exam-words',
    title: 'Exam Words: Transposition Ciphers (Rail Fence & Columnar)',
    subtitle: 'Standard University Exam Definition & Key Characteristics',
    caption: 'Recall the definition of permutation, frequency invariance, and column permutation rules.',
    eli5Caption: 'The definition, rail fence formula, and difference between substitution and permutation for exams.',
    speakerNotes: {
      script: 'Emphasize that unigram frequency is invariant under transposition. If an examiner asks "How do you identify a transposition ciphertext?", the answer is "It has identical letter frequencies to natural English".',
      likelyQuestions: [
        {
          question: 'How do you detect a transposition cipher vs substitution cipher?',
          answer: 'Compute the letter frequency histogram: if the frequencies match English frequencies (E~12.7%, T~9.1%), it is a transposition cipher; if frequencies are shifted or scrambled, it is substitution.'
        }
      ]
    },
    examWords: {
      term: 'Transposition (Permutation) Ciphers',
      definition: 'A cryptographic cipher that preserves the identity of plaintext characters but rearranges their positions according to a permutation rule. Keyless transposition (e.g. Rail Fence) follows fixed geometric paths, while Keyed transposition (e.g. Columnar) writes plaintext row-by-row and reads column-by-column in alphabetical key order.',
      keywords: [
        'Permutation vs Substitution',
        'Rail Fence (Zigzag Depth)',
        'Keyed Columnar Transposition',
        'Frequency Distribution Invariance',
        'Diffusion (Shannon Principle)'
      ],
      mustRememberPoints: [
        'Transposition ciphers do NOT change letter identities; the unigram letter frequencies remain 100% identical to English.',
        'In columnar transposition, the column read-out sequence is determined by sorting the letters of the keyword alphabetically.',
        'Combining substitution and transposition iteratively creates a Product Cipher (Confusion + Diffusion).'
      ],
      typicalMarks: 5
    }
  }
]

export const transpositionPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'transposition',
  topicTitle: 'Transposition: Keyless & Keyed Ciphers',
  targetDurationMinutes: 10,
  plates: transpositionPlates
}
