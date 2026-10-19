import { Plate, TopicPresentation } from "@/lib/present/types"
import { Scene } from "@/components/scene/types"

const caesarScene: Scene = {
  id: 'caesar-process-scene',
  title: 'Caesar Cipher Encryption Flow',
  viewBox: '0 0 800 360',
  legend: [
    'Plaintext = Ink Chip',
    'Ciphertext = Scrambled Vermilion',
    'Key (k=3) = Outline Token',
    'Eve = Intercept Zone'
  ],
  actors: [
    { id: 'alice', kind: 'alice', label: 'Alice (Sender)', pos: { x: 120, y: 180 } },
    { id: 'eve', kind: 'eve', label: 'Eve (Eavesdropper)', pos: { x: 400, y: 70 } },
    { id: 'bob', kind: 'bob', label: 'Bob (Receiver)', pos: { x: 680, y: 180 } }
  ],
  objects: [
    { id: 'msg-plain', kind: 'plain', label: 'P: "MEET AT NOON"', value: 'MEET AT NOON', at: { actor: 'alice' } },
    { id: 'key-token', kind: 'key-pub', label: 'k = 3', value: '3', at: { x: 120, y: 80 } }
  ],
  steps: [
    {
      caption: 'Alice holds the plaintext message "MEET AT NOON" and the secret shift key k=3.',
      eli5: 'Alice has a secret note and agrees on a shift of 3 letters.',
      script: 'We begin with Alice preparing to send a tactical message. Both parties have pre-agreed on the secret numerical shift k=3.',
      actions: [
        { do: 'highlight', target: ['msg-plain', 'key-token'], tone: 'info' }
      ]
    },
    {
      caption: 'Each letter is mapped to its alphabet index (0..25) and shifted by (p + 3) mod 26.',
      eli5: 'Every letter moves forward by 3: M becomes P, E becomes H, T becomes W.',
      script: 'Every character undergoes modular addition: M at position 12 plus 3 yields 15, which corresponds to P. Modular wrap-around ensures Z wraps to C.',
      actions: [
        {
          do: 'transform',
          obj: 'msg-plain',
          into: {
            kind: 'cipher',
            label: 'C: "PHHW DW QRRQ"',
            value: 'PHHW DW QRRQ'
          }
        },
        { do: 'pulse', target: 'msg-plain' }
      ]
    },
    {
      caption: 'The ciphertext travels across the insecure public channel through Eve’s eavesdrop zone.',
      eli5: 'The scrambled note passes right through enemy territory, but only looks like gibberish.',
      script: 'The ciphertext is transmitted over the untrusted wire. Notice how Eve can intercept it, but cannot deduce the shift without brute-forcing the 25 possible keys.',
      actions: [
        { do: 'zone', id: 'eve-intercept-zone', show: true },
        { do: 'move', obj: 'msg-plain', to: { x: 400, y: 180 } },
        { do: 'say', actor: 'eve', text: 'Intercepted "PHHW DW QRRQ"!' }
      ]
    },
    {
      caption: 'Bob applies the reverse transformation D(C) = (c - 3) mod 26 to recover the plaintext.',
      eli5: 'Bob shifts each letter back by 3 steps and reads the original message.',
      script: 'Bob subtracts the shift modulo 26: P minus 3 recovers M. The plaintext is faithfully and deterministically restored.',
      actions: [
        { do: 'move', obj: 'msg-plain', to: { actor: 'bob' } },
        {
          do: 'transform',
          obj: 'msg-plain',
          into: {
            kind: 'plain',
            label: 'Recovered: "MEET AT NOON"',
            value: 'MEET AT NOON'
          }
        },
        { do: 'say', actor: 'bob', text: 'Decrypted: MEET AT NOON' }
      ]
    }
  ]
}

export const caesarPlates: Plate[] = [
  // 1. Hook Plate
  {
    id: 'caesar-hook',
    kind: 'hook',
    title: 'The Shift That Began Cryptography',
    subtitle: 'From Julius Caesar (44 BC) to Modern ROT13',
    caption: 'Caesar used a shift of 3 to communicate military orders past illiterate scouts and hostile messengers.',
    eli5Caption: 'A 2,000-year-old trick to turn military plans into scrambled gibberish.',
    speakerNotes: {
      script: 'Welcome to classical cryptography. We start with the oldest documented cipher in Western military history: Julius Caesar’s shift cipher. Suetonius recorded that Caesar used a shift of 3 to protect confidential dispatches.',
      likelyQuestions: [
        {
          question: 'Why did Caesar use a shift of 3 specifically?',
          answer: 'Historical accounts suggest it was simple enough for his generals to compute mentally without written conversion tables that could be captured.'
        }
      ]
    },
    customFigure: 'CaesarWheelAnalogy',
    customFigureProps: { shift: 3 }
  },

  // 2. Analogy / Picture-it Plate
  {
    id: 'caesar-analogy',
    kind: 'analogy',
    title: 'Concentric Alphabet Disks',
    subtitle: 'Mechanical Analogy of Modular Rotation',
    caption: 'Rotating the inner disc by k positions creates a 1-to-1 geometric mapping for all 26 characters.',
    eli5Caption: 'Think of two paper plates: turn the inner plate by 3 clicks to read off encrypted letters.',
    speakerNotes: {
      script: 'Imagine two nested disks with the alphabet stamped around the rim. By locking the disks at an offset of three positions, every letter on the outer ring aligns with its encrypted substitute on the inner ring.',
      likelyQuestions: [
        {
          question: 'What happens when we reach Z?',
          answer: 'The circle naturally wraps around: X maps to A, Y to B, and Z to C. That circular topology is exactly modular arithmetic modulo 26.'
        }
      ]
    },
    customFigure: 'CaesarConcentricDisks',
    customFigureProps: { shift: 3 }
  },

  // 3. Concept Plate
  {
    id: 'caesar-concept',
    kind: 'concept',
    title: 'Formal Shift Cipher Model',
    subtitle: 'Modular Arithmetic Over Finite Ring Z_26',
    caption: 'Encryption is modular addition C = (P + k) mod 26; Decryption is modular subtraction P = (C - k) mod 26.',
    eli5Caption: 'Turn letters into numbers 0 to 25, add the secret shift, and wrap around 26.',
    speakerNotes: {
      script: 'In modern notation, we map A to 0 through Z to 25. Encryption is a bijective function on the ring Z_26. Notice that the key space size is bounded by 26, leaving only 25 non-trivial transformations.',
      likelyQuestions: [
        {
          question: 'Why are there 25 keys and not 26?',
          answer: 'A shift of 0 (or 26) leaves the plaintext unchanged, producing no encryption.'
        }
      ]
    },
    customFigure: 'CaesarModularFormula'
  },

  // 4. Process Plate
  {
    id: 'caesar-process',
    kind: 'process',
    title: 'Step-by-Step Encryption & Decryption',
    subtitle: 'Interactive Animated Scene',
    caption: 'Step through the transformation of plaintext to ciphertext across the insecure channel to Bob.',
    eli5Caption: 'Watch Alice scramble the note with key 3, pass it through Eve, and Bob unscramble it.',
    speakerNotes: {
      script: 'Let us run the animated scene. Observe the state transitions from plaintext token to vermilion ciphertext, transmission through the eavesdrop zone, and Bob’s inverse modular subtraction.',
      likelyQuestions: [
        {
          question: 'Can Eve read the message on the wire?',
          answer: 'Eve reads the exact ciphertext string, but without knowledge of k she must deduce which of the 25 shifts produces meaningful syntax.'
        }
      ]
    },
    scene: caesarScene
  },

  // 5. Worked Example Plate
  {
    id: 'caesar-worked',
    kind: 'worked-example',
    title: 'Worked Numerical: Encrypting "ATTACK"',
    subtitle: 'Step Reveal with Your Turn Blanks',
    caption: 'Given shift key k = 4, encrypt "ATTACK" character-by-character using arithmetic modulo 26.',
    eli5Caption: 'Convert each letter to its number, add 4, and convert back to a letter.',
    speakerNotes: {
      script: 'Have the room compute the values before pressing Next. We take each letter index, add 4 modulo 26, and substitute. Notice that A at index 0 maps cleanly to E at index 4.',
      likelyQuestions: [
        {
          question: 'How do we handle negative numbers during decryption?',
          answer: 'In modular arithmetic, if (c - k) is negative, add 26: (-3) mod 26 = 23.'
        }
      ]
    },
    workedExample: {
      problem: 'Encrypt the plaintext "ATTACK" using Caesar cipher with key k = 4.',
      given: {
        'Plaintext (P)': '"ATTACK"',
        'Shift Key (k)': 4,
        'Modulus (m)': 26
      },
      steps: [
        {
          label: 'Map characters to numerical indices in Z_26',
          formula: 'Letter -> Index (0..25)',
          substitution: 'A=0, T=19, T=19, A=0, C=2, K=10',
          result: '[0, 19, 19, 0, 2, 10]'
        },
        {
          label: 'Apply encryption formula C_i = (P_i + 4) mod 26',
          formula: 'C_i = (P_i + k) mod 26',
          substitution: '(0+4)=4, (19+4)=23, (19+4)=23, (0+4)=4, (2+4)=6, (10+4)=14',
          result: '[4, 23, 23, 4, 6, 14]'
        },
        {
          label: 'Convert resulting indices back to alphabetic characters',
          formula: 'Index -> Letter',
          substitution: '4=E, 23=X, 23=X, 4=E, 6=G, 14=O',
          result: '"EXXEGO"'
        }
      ],
      finalAnswer: 'Ciphertext C = "EXXEGO"',
      checkVerification: 'Verification: D("EXXEGO") with k=4 -> (4-4)=0(A), (23-4)=19(T), (23-4)=19(T), (4-4)=0(A), (6-4)=2(C), (14-4)=10(K) -> "ATTACK". Verified.'
    }
  },

  // 6. Attack & Defense Plate
  {
    id: 'caesar-attack',
    kind: 'attack-defense',
    title: 'Vulnerabilities: Brute Force & Frequency Analysis',
    subtitle: 'Why Caesar Fails Against Real Adversaries',
    caption: 'With only 25 possible keys, an exhaustive search completes in seconds; letter frequencies remain intact.',
    eli5Caption: 'An attacker tests all 25 shifts in 10 seconds or spots that E is still the most common letter.',
    speakerNotes: {
      script: 'Caesar has two fatal structural flaws. First, the key space is trivial: 25 shifts can be tested by hand in two minutes. Second, because it is monoalphabetic, the most frequent letter in the ciphertext directly correlates with English E.',
      likelyQuestions: [
        {
          question: 'Can longer keys fix Caesar?',
          answer: 'No, because shifting by any integer n is equivalent to n mod 26. The key space is permanently bounded by 25.'
        }
      ]
    },
    attackDefense: {
      attackName: 'Exhaustive Key Search & English Frequency Analysis',
      normalFlowDescription: 'Sender shifts letters by k=3 -> Receiver unshifts by k=3.',
      attackFlowDescription: 'Attacker creates a 25-row brute-force ladder or overlays letter frequency histogram.',
      defenseFlowDescription: 'Polyalphabetic substitution (e.g. Vigenère) or block ciphers with large key spaces (AES-128).'
    }
  },

  // 7. Compare Plate
  {
    id: 'caesar-compare',
    kind: 'compare',
    title: 'Caesar vs General Monoalphabetic vs Vigenère',
    subtitle: 'Evolution of Substitution Complexity',
    caption: 'Caesar has 25 keys; Monoalphabetic has 26! keys but retains frequency; Vigenère flattens frequencies.',
    eli5Caption: 'Fixed shift is trivial, random alphabet is harder but predictable, multi-shift changes the rules.',
    speakerNotes: {
      script: 'Compare these three paradigms. Notice that expanding the key space from 25 to 26! in a general monoalphabetic cipher still does not stop frequency analysis, because every P maps to the exact same C.',
      likelyQuestions: [
        {
          question: 'Why does 26! (4 x 10^26) keys fail against frequency analysis?',
          answer: 'Because the mapping is 1-to-1 and invariant. The most frequent ciphertext letter will still be E regardless of the key.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Caesar / Shift Cipher',
      rightTitle: 'General Monoalphabetic Substitution',
      differences: [
        { feature: 'Key Space Size', left: '25 valid keys', right: '26! ≈ 4.03 × 10^26 keys', diffTone: 'signal' },
        { feature: 'Brute Force Feasibility', left: 'Trivial (seconds by hand)', right: 'Infeasible by brute force', diffTone: 'ok' },
        { feature: 'Frequency Distribution', left: 'Shifted identical distribution', right: 'Permuted identical distribution', diffTone: 'bad' },
        { feature: 'Cryptanalysis Method', left: 'Brute force all 25 shifts', right: 'Frequency analysis & digraph counts', diffTone: 'warn' },
        { feature: 'Key Representation', left: 'Single integer k ∈ [1, 25]', right: 'Permutation array of 26 letters', diffTone: 'info' }
      ],
      summaryTakeaway: 'Expanding the key space alone is insufficient; frequency leakage requires polyalphabetic or product diffusion.'
    }
  },

  // 8. Ask The Room Plate
  {
    id: 'caesar-ask-room',
    kind: 'ask-the-room',
    title: 'Ask the Room: The Key Space Paradox',
    subtitle: 'Show-of-Hands Class Engagement Poll',
    caption: 'Vote with show of hands (keys 1-4). Press Enter to reveal the definitive cryptographic answer.',
    eli5Caption: 'Which explanation correctly explains why having trillions of keys still leaves you vulnerable?',
    speakerNotes: {
      script: 'Ask the students to raise their hands for options 1 through 4. Enter the counts directly on the numeric keys. Then hit Enter to reveal the answer.',
      likelyQuestions: [
        {
          question: 'What is the difference between brute-force resistance and statistical resistance?',
          answer: 'Brute force targets the key directly; statistical cryptanalysis targets the deterministic relationship between plaintext and ciphertext distributions.'
        }
      ]
    },
    askTheRoom: {
      question: 'A general monoalphabetic cipher has a huge key space of 26! ≈ 4 × 10^26 keys. Why can an analyst easily break it in minutes?',
      options: [
        'A. The key generation algorithm is deterministic and uses small primes.',
        'B. Each plaintext letter always maps to the same ciphertext letter, preserving the language frequency profile.',
        'C. Modern computers can brute-force 4 × 10^26 keys within 3 seconds.',
        'D. Modular arithmetic mod 26 has too many zero divisors.'
      ],
      correctIndex: 1,
      explanation: 'Monoalphabetic substitution is 1-to-1 invariant: the statistical frequency of single letters (E, T, A, O, I, N) and digraphs (TH, HE, IN) passes directly into the ciphertext.',
      replayStep: 2,
      replayTopicId: 'caesar'
    }
  },

  // 9. Exam Words Plate
  {
    id: 'caesar-exam',
    kind: 'exam-words',
    title: 'Exam Words: Caesar & Monoalphabetic Ciphers',
    subtitle: 'Syllabus Keyword Reference for University Examinations',
    caption: 'Memorize the formal definition, 4 mandatory keywords, and the 3 core exam concepts.',
    eli5Caption: 'The exact definition and points to write down to earn full marks on this question.',
    speakerNotes: {
      script: 'Review these bullet points with your students before concluding. These represent the grading rubric keywords examiners look for in university written tests.',
      likelyQuestions: [
        {
          question: 'What marks are typically allocated for this topic?',
          answer: 'Typically 2 to 5 marks as a short definition or a 5-mark numerical with encryption and brute-force explanation.'
        }
      ]
    },
    examWords: {
      term: 'Shift / Caesar Cipher & Monoalphabetic Substitution',
      definition: 'A Caesar cipher is a monoalphabetic substitution cipher where each character in the plaintext is replaced by a letter found a fixed number of positions k down the alphabet over the algebraic ring Z_26: C = (P + k) mod 26 and P = (C - k) mod 26.',
      keywords: [
        'Monoalphabetic Substitution',
        'Modular Arithmetic (mod 26)',
        'Key Space = 25',
        'Kerckhoffs’s Principle',
        'Frequency Analysis'
      ],
      mustRememberPoints: [
        'A shift of 0 or 26 is identity and produces no encryption; hence exactly 25 effective keys exist.',
        'Kerckhoffs’s principle states security must depend solely on the secrecy of the key, not the algorithm.',
        'Monoalphabetic ciphers preserve the unigram frequency distribution of the underlying natural language.'
      ],
      typicalMarks: 5
    }
  }
]

export const caesarPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'caesar',
  topicTitle: 'Caesar & Monoalphabetic Ciphers',
  targetDurationMinutes: 10,
  plates: caesarPlates
}
