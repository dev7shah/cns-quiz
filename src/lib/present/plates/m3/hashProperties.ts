import { Plate, TopicPresentation } from "@/lib/present/types"

export const hashPropertiesPlates: Plate[] = [
  // 1. Hook: The Birthday Paradox
  {
    id: 'hash-prop-hook',
    kind: 'hook',
    title: 'The Room of 23 People',
    subtitle: 'The Birthday Paradox and the Collapse of 50% Security',
    caption: 'In a room of just 23 people, there is a greater than 50% chance that two share the exact same birthday. In cryptography, this cuts collision search time in half.',
    eli5Caption: 'You don’t need someone to share YOUR birthday; any two people sharing ANY birthday counts as a match!',
    speakerNotes: {
      script: 'Start by posing the classic puzzle: There are 365 days in a year. How many people do you need in a room before the probability of a shared birthday exceeds 50%? Most students guess 183 (half of 365). The mathematical answer is only 23! Why? Because with 23 people, there are (23 * 22) / 2 = 253 pairs of people who could match.',
      likelyQuestions: [
        {
          question: 'Why does this matter for cryptographic hashes?',
          answer: 'Because an attacker finding ANY two documents with the same hash needs only ~2^(n/2) operations, not 2^n operations.'
        }
      ]
    }
  },

  // 2. Concept: The Three Security Pillars
  {
    id: 'hash-prop-pillars',
    kind: 'concept',
    title: 'The Three Pillars of Cryptographic Hashes',
    subtitle: 'Pre-image, Second Pre-image, and Collision Resistance',
    caption: 'A cryptographic hash must satisfy three distinct resistance criteria against an adversary.',
    eli5Caption: '1. Can’t un-bake the cake. 2. Can’t bake a different cake that tastes identical to mine. 3. Can’t find ANY two recipes that taste identical.',
    customFigure: 'MathBlock',
    speakerNotes: {
      script: 'Distinguish these three rigorously: 1. Pre-image resistance (One-way): Given digest Y, find M such that H(M) = Y. Cost: O(2^n). 2. Second pre-image resistance (Weak collision resistance): Given fixed M1, find M2 != M1 such that H(M2) = H(M1). Cost: O(2^n). 3. Collision resistance (Strong collision resistance): Find ANY pair M1 != M2 such that H(M1) = H(M2). Cost: O(2^(n/2)).',
      likelyQuestions: [
        {
          question: 'Does collision resistance imply second pre-image resistance?',
          answer: 'Yes. If you cannot find ANY two messages that collide, you certainly cannot find a collision against a specific pre-selected message.'
        }
      ]
    }
  },

  // 3. Comparison: Pre-Image vs Collision Resistance
  {
    id: 'hash-prop-compare',
    kind: 'compare',
    title: 'Pre-Image vs Collision Resistance',
    subtitle: 'Why the Attack Complexities Differ So Radically',
    caption: 'Comparing target specificity, mathematical bounds, and real-world attack costs.',
    eli5Caption: 'Finding a needle matching YOUR specific color takes 2^n tries; finding ANY two needles of the same color takes only 2^(n/2) tries.',
    comparison: {
      leftTitle: 'Pre-Image / 2nd Pre-Image Resistance',
      rightTitle: 'Collision Resistance (Birthday Bound)',
      differences: [
        {
          feature: 'Adversary Goal',
          left: 'Match a specific fixed digest Y = H(M)',
          right: 'Find any two arbitrary messages M1, M2 with H(M1) = H(M2)'
        },
        {
          feature: 'Theoretical Complexity',
          left: 'O(2^n) brute force operations',
          right: 'O(2^(n/2)) operations via Birthday Paradox'
        },
        {
          feature: 'Effort for 128-bit Hash (MD5)',
          left: '2^128 operations (computationally impossible)',
          right: '2^64 operations (practical on modern GPU clusters)'
        },
        {
          feature: 'Effort for 256-bit Hash (SHA-256)',
          left: '2^256 operations (exceeds atoms in universe)',
          right: '2^128 operations (permanently secure against all supercomputers)'
        }
      ],
      summaryTakeaway: 'To provide k bits of security against collision attacks, a hash function must produce at least 2k output bits (e.g., 256-bit hash for 128-bit security).'
    },
    speakerNotes: {
      script: 'Walk through the math: For 128-bit MD5, 2^64 is ~18 quintillion operations. In 2004, Professor Xiaoyun Wang demonstrated practical MD5 collisions in minutes using analytical differential attacks, not just brute force.',
      likelyQuestions: []
    }
  },

  // 4. Process: The Avalanche Effect
  {
    id: 'hash-prop-avalanche',
    kind: 'process',
    title: 'The Avalanche Effect & Bit Dispersion',
    subtitle: 'Ensuring High Confusion and Complete Diffusion',
    caption: 'A single flipped bit in the input message must cause approximately 50% of all output digest bits to invert unpredictably.',
    eli5Caption: 'Change a comma into a period, and every single character of the fingerprint scrambles completely.',
    customFigure: 'BitStrip',
    speakerNotes: {
      script: 'Demonstrate the avalanche effect: Compare SHA256("The quick brown fox jumps over the lazy dog") with SHA256("The quick brown fox jumps over the lazy cog"). Despite only a 1-bit ASCII difference, 128 out of 256 bits in the resulting hash flip.',
      likelyQuestions: [
        {
          question: 'What happens if a hash function lacks the avalanche effect?',
          answer: 'Attackers can perform differential cryptanalysis, tracing how small input changes affect intermediate rounds to find collisions rapidly.'
        }
      ]
    }
  },

  // 5. Worked Example: Birthday Attack Derivation
  {
    id: 'hash-prop-worked',
    kind: 'worked-example',
    title: 'Worked Example: Birthday Collision Mathematics',
    subtitle: 'Deriving the 50% Collision Threshold for n-Bit Hashes',
    caption: 'Mathematical derivation of why k ≈ 1.1774 * 2^(n/2) trials yield a collision with probability 0.5.',
    eli5Caption: 'The exact formula that explains why 64 bits of security requires a 128-bit hash.',
    workedExample: {
      problem: 'Derive the number of trials k required to find at least one collision in an n-bit hash function with probability P = 0.50 (50%).',
      given: {
        'Hash Output Size (n)': 'n bits',
        'Total Possibilities (N)': '2^n buckets',
        'Target Probability (P)': 0.50
      },
      steps: [
        {
          label: 'Probability of Zero Collisions',
          formula: 'P(no collision) = prod_{i=1}^{k-1} (1 - i / N)',
          substitution: '(1 - 1/N) * (1 - 2/N) * ... * (1 - (k-1)/N)',
          result: 'Joint probability',
          note: 'Each trial must land in a previously unoccupied hash bucket.'
        },
        {
          label: 'Taylor Series Exponential Approximation',
          formula: '1 - x ≈ exp(-x) for small x',
          substitution: 'exp( - sum_{i=1}^{k-1} i / N ) ≈ exp( - k^2 / (2N) )',
          result: 'P(no collision) ≈ exp(-k^2 / (2N))',
          note: 'Sum of integers from 1 to k-1 is k(k-1)/2 ≈ k^2 / 2.'
        },
        {
          label: 'Set Collision Probability to 0.50',
          formula: 'P(collision) = 1 - exp(-k^2 / (2N)) = 0.50',
          substitution: 'exp(-k^2 / (2N)) = 0.50  =>  -k^2 / (2N) = ln(0.50) = -0.69315',
          result: 'k^2 / (2N) = 0.69315',
          note: 'Taking natural log on both sides.'
        },
        {
          label: 'Solve for Number of Trials k',
          formula: 'k = sqrt(2 * ln(2) * N) = sqrt(1.3863) * 2^(n/2)',
          substitution: 'sqrt(1.3863) ≈ 1.1774',
          result: 'k ≈ 1.1774 * 2^(n/2)',
          note: 'For 128-bit MD5: k ≈ 1.177 * 2^64 trials. For 256-bit SHA: k ≈ 1.177 * 2^128 trials.'
        }
      ],
      finalAnswer: 'Collision search complexity is strictly O(2^(n/2)), proving that hash size must be double the required security level.',
      checkVerification: 'Check: 16-bit hash (N=65536) requires 1.1774 * 256 ≈ 301 trials for 50% collision probability.'
    },
    speakerNotes: {
      script: 'This derivation is one of the most prestigious theory questions in postgraduate and undergraduate computer security exams. Emphasize the step 1 - x ≈ e^(-x).',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'hash-prop-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Cryptographic Hash Properties',
    caption: 'Definitions, complexity bounds, and required exam terminology.',
    eli5Caption: 'Key terms to score full marks on hash function properties.',
    speakerNotes: {
      script: 'Review the distinction between weak collision resistance (second pre-image) and strong collision resistance (collision resistance). Examiners penalize confusing the two.',
      likelyQuestions: [
        {
          question: 'What are the general requirements of a cryptographic hash function according to Stalling?',
          answer: '1. Variable input size. 2. Fixed output size. 3. Efficiency/ease of computation. 4. Pre-image resistance. 5. Second pre-image resistance. 6. Collision resistance. 7. Pseudorandomness.'
        }
      ]
    },
    examWords: {
      term: 'Cryptographic Hash Function Properties',
      definition: 'A mathematical algorithm that maps arbitrary-length data to a fixed-size bit string, satisfying pre-image resistance, second pre-image resistance, and collision resistance.',
      keywords: [
        'Pre-Image Resistance (One-Way)',
        'Second Pre-Image Resistance (Weak Collision)',
        'Collision Resistance (Strong Collision)',
        'Birthday Paradox (O(2^(n/2)))',
        'Avalanche Effect',
        'Fixed Output Length',
        'Deterministic Compression'
      ],
      mustRememberPoints: [
        'Pre-image resistance (O(2^n)): Given hash y, it is computationally infeasible to find x such that H(x) = y.',
        'Second pre-image resistance (O(2^n)): Given message x, it is computationally infeasible to find x’ ≠ x such that H(x’) = H(x).',
        'Collision resistance (O(2^(n/2))): It is computationally infeasible to find any pair (x, x’) such that H(x) = H(x’).'
      ],
      typicalMarks: 5
    }
  }
]

export const hashPropertiesPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'hash-functions',
  topicTitle: 'Cryptographic Hash Properties',
  targetDurationMinutes: 10,
  plates: hashPropertiesPlates
}
