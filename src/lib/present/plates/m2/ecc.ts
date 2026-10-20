import { Plate, TopicPresentation } from "@/lib/present/types"

export const eccPlates: Plate[] = [
  // 1. Hook
  {
    id: 'ecc-hook',
    kind: 'hook',
    title: 'The Geometric Revolution in Cryptography',
    subtitle: 'ECC (1985): Neal Koblitz & Victor Miller',
    caption: 'By replacing modular exponentiation with the geometry of cubic curves over finite fields, Elliptic Curve Cryptography delivers 3072-bit RSA security with only 256-bit keys, unlocking mobile chips, crypto hardware, and TLS 1.3.',
    eli5Caption: 'Instead of multiplying giant numbers that choke small chips, we bounce lines across a mathematical curve.',
    speakerNotes: {
      script: 'In 1985, Neal Koblitz and Victor Miller independently proposed using the algebraic geometry of elliptic curves for public-key cryptography. Because there is no known sub-exponential algorithm (like index calculus or GNFS) to solve the Elliptic Curve Discrete Logarithm Problem on prime curves, keys can be dramatically smaller than RSA.',
      likelyQuestions: [
        {
          question: 'Why does Bitcoin use secp256k1 (an elliptic curve)?',
          answer: 'Because a 256-bit ECC key fits into 32 bytes, fits cleanly in transaction blocks, verifies in microseconds, and provides 128 bits of symmetric security equivalence.'
        }
      ]
    }
  },

  // 2. Concept: Weierstrass Equation & Non-Singularity
  {
    id: 'ecc-equation',
    kind: 'concept',
    title: 'The Weierstrass Equation & Group Axioms',
    subtitle: 'y² ≡ x³ + ax + b (mod p) where 4a³ + 27b² ≢ 0 (mod p)',
    caption: 'Over a finite prime field F_p, an elliptic curve forms an abelian group consisting of discrete integer points (x, y) plus an identity element: the Point at Infinity (O).',
    eli5Caption: 'The curve looks like a smooth symmetric loop in real numbers, but turns into a scatter of integer dots when wrapped modulo a prime.',
    comparison: {
      leftTitle: 'RSA (Integer Factorization)',
      rightTitle: 'ECC (Curve Discrete Logarithm)',
      differences: [
        {
          feature: 'Key Size for 128-bit Security',
          left: '3,072 bits (massive integers, slow key generation)',
          right: '256 bits (fits in 32 bytes, tiny storage footprint)'
        },
        {
          feature: 'Best Known Classical Attack',
          left: 'Sub-exponential: General Number Field Sieve (GNFS) in O(exp(c (ln n)^(1/3)...))',
          right: 'Fully exponential: Pollard’s rho in O(sqrt(n)) steps'
        },
        {
          feature: 'Power & Bandwidth Consumption',
          left: 'High: large signature payloads and intense power drain on mobile/IoT',
          right: 'Ultra-low: minimal bandwidth in TLS certificates and low battery draw'
        },
        {
          feature: 'Primary Industry Curves',
          left: 'PKCS#1 v1.5 / PSS (2048 to 4096-bit primes)',
          right: 'NIST P-256 (secp256r1), Bitcoin secp256k1, Curve25519 (Ed25519)'
        }
      ],
      summaryTakeaway: 'ECC’s exponential attack barrier allows it to match RSA security at less than one-tenth the key size.'
    },
    speakerNotes: {
      script: 'Point out the non-singularity condition: 4a^3 + 27b^2 != 0. If this equals zero, the cubic curve has a cusp or self-intersection, which breaks the abelian group structure and renders the cipher completely insecure.',
      likelyQuestions: [
        {
          question: 'What is the Point at Infinity O?',
          answer: 'O is the identity element of the group, analogous to zero in addition. Adding O to any point P yields P: P + O = P.'
        }
      ]
    }
  },

  // 3. Interactive Figure: CurvePlot (Point Addition and Doubling)
  {
    id: 'ecc-curve-plot',
    kind: 'concept',
    title: 'Interactive Curve Plot over Finite Field F_p',
    subtitle: 'Visualizing Points on y² ≡ x³ + x + 6 (mod 11)',
    caption: 'Explore discrete points on a finite field elliptic curve. Notice horizontal reflection symmetry: if (x, y) is on the curve, (x, -y mod p) is also on the curve.',
    eli5Caption: 'Points come in mirror pairs across the horizontal axis.',
    customFigure: 'CurvePlot',
    speakerNotes: {
      script: 'Walk students through the geometric group law: To add P and Q, draw a straight line through P and Q. It intersects the curve at a third point, -R. Reflect -R across the x-axis to find the resulting sum R = P + Q.',
      likelyQuestions: [
        {
          question: 'What if we add a point to itself: P + P (Point Doubling)?',
          answer: 'We draw the tangent line to the curve at point P. The tangent intersects the curve at a third point -R; reflect across the x-axis to obtain 2P.'
        }
      ]
    }
  },

  // 4. Process: Point Addition and Scalar Multiplication Scene
  {
    id: 'ecc-process',
    kind: 'process',
    title: 'Scalar Multiplication: Q = k · P',
    subtitle: 'The Elliptic Curve Discrete Logarithm Problem (ECDLP)',
    caption: 'Given base point G and integer private key d, calculating public key Q = d·G using double-and-add is fast. Finding d from (G, Q) is computationally impossible.',
    eli5Caption: 'Alice hops along the curve d times. Everyone sees where she landed (Q), but no one can count how many hops she took (d).',
    scene: {
      id: 'scene-ecc-scalar',
      title: 'Double-and-Add Point Traversal',
      viewBox: '0 0 900 360',
      legend: ['Base Generator G', 'Private Scalar d', 'Point Addition (P+Q)', 'Public Point Q = d·G'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Scalar Multiplier', pos: { x: 120, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'Curve Double & Add', pos: { x: 450, y: 180 } },
        { id: 'server', kind: 'server', label: 'Public Key Point Q', pos: { x: 780, y: 180 } }
      ],
      objects: [
        { id: 'baseG', kind: 'text', label: 'Generator G(x, y)', at: { x: 120, y: 180 }, tone: 'info' },
        { id: 'scalarD', kind: 'key-priv', label: 'Private d = 256 bits', at: { x: 120, y: 90 }, tone: 'warn' },
        { id: 'pubQ', kind: 'key-pub', label: 'Public Q = (x_q, y_q)', at: { x: 780, y: 180 }, tone: 'ok' }
      ],
      steps: [
        {
          caption: 'Standard domain parameters fix the prime p, curve constants a and b, and the generator point G of order n.',
          eli5: 'Everyone agrees on the curve formula and the starting point G.',
          actions: [
            { do: 'pulse', target: 'baseG' },
            { do: 'say', actor: 'alice', text: 'Domain: (p, a, b, G, n)' }
          ]
        },
        {
          caption: 'Alice chooses a 256-bit random private key integer d in the range [1, n-1].',
          eli5: 'Alice picks a secret giant number d.',
          actions: [
            { do: 'highlight', target: ['scalarD'], tone: 'warn' },
            { do: 'say', actor: 'alice', text: 'd = secret scalar' }
          ]
        },
        {
          caption: 'Alice computes Q = d · G by repeating Point Doubling and Point Addition operations.',
          eli5: 'Double and add points along the curve in logarithmic steps.',
          actions: [
            { do: 'move', obj: 'baseG', to: { x: 450, y: 180 } },
            { do: 'transform', obj: 'baseG', into: { label: 'Repeated 2P + P iterations', tone: 'signal' } },
            { do: 'say', actor: 'switch', text: 'O(log d) doublings' }
          ]
        },
        {
          caption: 'Resulting coordinate Q = (x_q, y_q) is Alice’s Public Key. Inverting Q back to d requires O(sqrt(n)) steps.',
          eli5: 'The final destination is the public key. Finding the number of hops is completely intractable.',
          actions: [
            { do: 'move', obj: 'baseG', to: { x: 780, y: 180 } },
            { do: 'transform', obj: 'baseG', into: { kind: 'key-pub', label: 'Public Q = d·G', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'baseG'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Public key published' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Review the Double-and-Add algorithm: It is the elliptic curve equivalent of the Square-and-Multiply algorithm in modular exponentiation. For a 256-bit scalar d, it requires at most 256 doublings and 128 point additions on average.',
      likelyQuestions: [
        {
          question: 'Are there side-channel attacks on double-and-add?',
          answer: 'Yes! If an attacker can measure execution time or power consumption, they can detect when an addition step occurs, leaking bits of d. Constant-time algorithms like the Montgomery Ladder are used to prevent side-channel leakage.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'ecc-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Curve Non-Singularity Condition',
    caption: 'When defining a short Weierstrass elliptic curve y² = x³ + ax + b over a field, why must 4a³ + 27b² ≢ 0?',
    eli5Caption: 'Why must that strange formula (4a³ + 27b²) never equal zero?',
    askTheRoom: {
      question: 'What catastrophic geometric defect happens to an elliptic curve if 4a³ + 27b² = 0?',
      options: [
        'A. The curve has no points over the prime field.',
        'B. The curve becomes singular (possessing a sharp cusp or self-intersecting loop), destroying the unique tangent lines and group structure.',
        'C. The curve coordinates become irrational numbers.',
        'D. The order of the curve becomes odd.'
      ],
      correctIndex: 1,
      explanation: 'Correct! The discriminant of the cubic is proportional to -(4a³ + 27b²). If it equals zero, the curve has a singular point (a node or cusp) where tangents are undefined or non-unique, breaking the abelian group law and rendering it useless for cryptography.'
    },
    speakerNotes: {
      script: 'Draw a cusp (y^2 = x^3) and a self-intersection (y^2 = x^3 - 3x + 2) on the board to visually demonstrate singularity.',
      likelyQuestions: [
        {
          question: 'What is Curve25519?',
          answer: 'Designed by Daniel J. Bernstein, Curve25519 is a Montgomery curve (By^2 = x^3 + Ax^2 + x) over 2^255 - 19 that avoids singularities, resists side channels, and provides immune point multiplication.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'ecc-exam',
    kind: 'exam-words',
    title: 'Elliptic Curve Cryptography Key Terminology',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these definitions, formulas, and group laws for university exams.',
    eli5Caption: 'The three essential concepts for any ECC question on university papers.',
    examWords: {
      term: 'Elliptic Curve Cryptography (ECC)',
      definition: 'A public-key asymmetric cryptographic approach based on the algebraic structure of elliptic curves over finite fields, offering high security with short key lengths.',
      keywords: [
        'Short Weierstrass equation y² = x³ + ax + b',
        'Non-singularity discriminant 4a³ + 27b² ≠ 0',
        'Point Addition and Point Doubling formulas',
        'Point at Infinity (O) identity element',
        'Elliptic Curve Discrete Logarithm Problem (ECDLP)'
      ],
      mustRememberPoints: [
        'Weierstrass Equation & Condition: y² = x³ + ax + b (mod p) where 4a³ + 27b² ≢ 0 (mod p) to prevent singular cusps and self-intersections.',
        'Group Law: Abelian group operations consist of Point Addition (P + Q = R via secant line) and Point Doubling (2P = R via tangent line), with O serving as the neutral identity element.',
        'Key Efficiency Advantage: 256-bit ECC provides equivalent security to 3072-bit RSA because the best known attack on ECDLP (Pollard’s rho) takes fully exponential O(√n) time, whereas RSA factoring has sub-exponential algorithms (GNFS).'
      ],
      typicalMarks: 7
    },
    speakerNotes: {
      script: 'Advise students to memorize the slope formulas for point addition and doubling: Point addition slope lambda = (y2 - y1) / (x2 - x1) mod p; Point doubling slope lambda = (3*x1^2 + a) / (2*y1) mod p.',
      likelyQuestions: [
        {
          question: 'What are the main protocols using ECC?',
          answer: 'ECDH (Elliptic Curve Diffie-Hellman) for key exchange, and ECDSA / EdDSA (Edwards-curve DSA) for digital signatures.'
        }
      ]
    }
  }
]

export const eccPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'ecc',
  topicTitle: 'Elliptic Curve Cryptography (ECC)',
  targetDurationMinutes: 10,
  plates: eccPlates
}
