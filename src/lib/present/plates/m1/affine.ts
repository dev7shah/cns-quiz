import { Plate, TopicPresentation } from "@/lib/present/types"

export const affinePlates: Plate[] = [
  // 1. Hook
  {
    id: 'affine-hook',
    kind: 'hook',
    title: 'Beyond the Simple Shift',
    subtitle: 'Multiplying the Alphabet: E(x) = (ax + b) mod 26',
    caption: 'Caesar only added a shift; Affine scales each position by a multiplier "a" before shifting by "b".',
    eli5Caption: 'Instead of just shifting letters forward, multiply the letter position first, then add a shift.',
    speakerNotes: {
      script: 'In Caesar cipher, we only added a shift k. But what if we multiply the index by a factor a first? That gives the Affine cipher: E(x) = (ax + b) mod 26. However, this introduces a deep mathematical trap: modular invertibility.',
      likelyQuestions: [
        {
          question: 'Why can’t we choose any number for "a"?',
          answer: 'If "a" shares a common factor with 26 (like 2 or 13), different plaintext letters collide and map to the exact same ciphertext letter, making decryption mathematically impossible.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'affine-analogy',
    kind: 'analogy',
    title: 'The Stride on the 26-Tooth Clock Gear',
    subtitle: 'Geometric Intuition of Coprimality',
    caption: 'Taking strides of size "a" around a 26-hour clock only visits all 26 teeth if gcd(a, 26) = 1.',
    eli5Caption: 'If your step size is 2 on a 26-step circle, you will only hit even numbers and skip all odd numbers.',
    speakerNotes: {
      script: 'Imagine walking around a 26-step circular track in steps of size a. If a=2, you step on 0, 2, 4, 6... and you will never visit the odd numbers. To visit every letter exactly once, gcd(a, 26) must be 1.',
      likelyQuestions: [
        {
          question: 'What is a collision?',
          answer: 'When two distinct plaintexts P1 and P2 produce the exact same ciphertext C: (a * P1) mod 26 = (a * P2) mod 26.'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'affine-concept',
    kind: 'concept',
    title: 'The 12 Coprime Multipliers & Keyspace',
    subtitle: 'Euler’s Totient φ(26) = 12 Valid Values',
    caption: 'The key space of Affine is exactly 12 × 26 = 312 keys (excluding trivial identity a=1, b=0 leaves 311).',
    eli5Caption: 'Only 12 numbers are coprime to 26: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, and 25.',
    speakerNotes: {
      script: 'Because 26 = 2 x 13, any even number or multiple of 13 is invalid. By Euler’s totient function, phi(26) = 12. Combined with 26 possible additive shifts b, the keyspace is 312 keys.',
      likelyQuestions: [
        {
          question: 'How do you find the decryption formula?',
          answer: 'Solve C = ax + b mod 26 for x: C - b = ax mod 26, so x = a^-1 * (C - b) mod 26, where a^-1 is the modular multiplicative inverse.'
        }
      ]
    }
  },

  // 4. Worked Example
  {
    id: 'affine-worked',
    kind: 'worked-example',
    title: 'Worked Numerical: Encrypting "HOT" with a=7, b=3',
    subtitle: 'Step-by-Step Modular Multiplication and Inversion',
    caption: 'Verify gcd(7, 26) = 1, encrypt "HOT" to "AXG", find modular inverse 7^-1 = 15, and decrypt.',
    eli5Caption: 'Multiply each letter by 7, add 3, mod 26. Then reverse by subtracting 3 and multiplying by 15.',
    speakerNotes: {
      script: 'Walk through each letter step by step. Have the class calculate 7 * 7 + 3 = 52. 52 mod 26 = 0, which corresponds to A! For decryption, demonstrate that 7 * 15 = 105 = 4*26 + 1.',
      likelyQuestions: [
        {
          question: 'How was 7^-1 = 15 calculated?',
          answer: 'Using the Extended Euclidean Algorithm: 26 = 3(7) + 5, 7 = 1(5) + 2, 5 = 2(2) + 1. Back-substituting yields (-11)*26 + 15(7) = 1, so 15 mod 26 is the inverse.'
        }
      ]
    },
    workedExample: {
      problem: 'Encrypt plaintext "HOT" using Affine cipher with a = 7, b = 3. Then compute a^-1 mod 26 and verify decryption.',
      given: {
        'Plaintext (P)': '"HOT"',
        'Multiplier (a)': 7,
        'Shift (b)': 3,
        'Modulus (m)': 26
      },
      steps: [
        {
          label: 'Map characters to numerical indices in Z_26',
          formula: 'Letter -> Index (0..25)',
          substitution: 'H=7, O=14, T=19',
          result: '[7, 14, 19]'
        },
        {
          label: 'Apply encryption C_i = (7 * P_i + 3) mod 26',
          formula: 'C_i = (a * P_i + b) mod 26',
          substitution: 'H: (7*7+3)=52 mod 26 = 0; O: (7*14+3)=101 mod 26 = 23; T: (7*19+3)=136 mod 26 = 6',
          result: '[0, 23, 6] -> "AXG"'
        },
        {
          label: 'Find modular multiplicative inverse a^-1 mod 26',
          formula: 'Find x such that (7 * x) mod 26 = 1',
          substitution: '7 * 15 = 105 = 4(26) + 1 -> 7^-1 ≡ 15 mod 26',
          result: 'a^-1 = 15'
        },
        {
          label: 'Decrypt "AXG" using P_i = 15 * (C_i - 3) mod 26',
          formula: 'P_i = a^-1 * (C_i - b) mod 26',
          substitution: 'A(0): 15*(0-3)=-45 ≡ 7(H); X(23): 15*(23-3)=300 ≡ 14(O); G(6): 15*(6-3)=45 ≡ 19(T)',
          result: '"HOT"'
        }
      ],
      finalAnswer: 'Ciphertext C = "AXG"; Decryption verified to "HOT".',
      checkVerification: 'Check: 7 * 15 = 105 ≡ 1 mod 26. Bijection verified across all characters.'
    }
  },

  // 5. Compare
  {
    id: 'affine-compare',
    kind: 'compare',
    title: 'Affine vs Caesar vs General Monoalphabetic',
    subtitle: 'Algebraic Structure and Cryptanalytic Vulnerability',
    caption: 'Affine expands keys from 25 to 312, but remains a monoalphabetic substitution vulnerable to frequency analysis.',
    eli5Caption: 'More keys than Caesar, but every H still turns into the same letter every time.',
    speakerNotes: {
      script: 'Notice that despite multiplying and adding, Affine is still strictly a monoalphabetic substitution. Two intercepted ciphertext letters are sufficient to solve for a and b via two linear equations.',
      likelyQuestions: [
        {
          question: 'How many known plaintext letters break Affine?',
          answer: 'Just two letters! For example, knowing that "E" encrypts to "C" and "T" encrypts to "K" gives two linear equations in two unknowns mod 26.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Affine Cipher',
      rightTitle: 'Caesar Cipher',
      differences: [
        { feature: 'Formula', left: 'C = (ax + b) mod 26', right: 'C = (x + k) mod 26', diffTone: 'info' },
        { feature: 'Key Space', left: '12 × 26 = 312 keys', right: '25 keys', diffTone: 'ok' },
        { feature: 'Known-Plaintext Attack', left: '2 known letters break entire key', right: '1 known letter breaks key', diffTone: 'warn' },
        { feature: 'Brute Force Time', left: '312 trials (under 1 millisecond on CPU)', right: '25 trials (seconds by hand)', diffTone: 'bad' }
      ],
      summaryTakeaway: 'Affine increases keyspace by a factor of 12 but remains broken by frequency analysis and 2-letter known plaintext.'
    }
  },

  // 6. Exam Words
  {
    id: 'affine-exam',
    kind: 'exam-words',
    title: 'Exam Words: Affine Cipher & Modular Inverse',
    subtitle: 'Mathematical Definitions and Necessary Conditions',
    caption: 'Memorize the coprimality condition gcd(a, 26) = 1, Euler’s totient φ(26) = 12, and the decryption formula.',
    eli5Caption: 'The exact mathematical conditions required for the Affine cipher to work.',
    speakerNotes: {
      script: 'Examiners always test the condition gcd(a, 26) = 1. If a student chooses an even multiplier, they lose all marks because the mapping is not bijective.',
      likelyQuestions: [
        {
          question: 'What happens if gcd(a, 26) != 1?',
          answer: 'The function is not one-to-one (not bijective); multiple plaintexts map to the same ciphertext letter, rendering unambiguous decryption impossible.'
        }
      ]
    },
    examWords: {
      term: 'Affine Cipher & Modular Multiplicative Inverse',
      definition: 'A monoalphabetic substitution cipher that combines modular multiplication and addition: E(x) = (ax + b) mod 26 and D(y) = a^-1(y - b) mod 26, where gcd(a, 26) = 1 and a^-1 is the modular multiplicative inverse of a such that (a * a^-1) ≡ 1 mod 26.',
      keywords: [
        'gcd(a, 26) = 1 (Coprimality Condition)',
        'Modular Multiplicative Inverse (Extended Euclid)',
        'Euler’s Totient φ(26) = 12',
        'Key Space = 312 keys',
        'Bijective Mapping'
      ],
      mustRememberPoints: [
        'The multiplier "a" MUST be coprime to 26; exactly 12 valid values exist: {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}.',
        'If a is even or a=13, the cipher suffers collisions and cannot be decrypted uniquely.',
        'Known-plaintext cryptanalysis requires only 2 letters to form a system of two linear modular equations.'
      ],
      typicalMarks: 5
    }
  }
]

export const affinePresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'affine',
  topicTitle: 'Affine Cipher & Modular Arithmetic',
  targetDurationMinutes: 10,
  plates: affinePlates
}
