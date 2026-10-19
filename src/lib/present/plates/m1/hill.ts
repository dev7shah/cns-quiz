import { Plate, TopicPresentation } from "@/lib/present/types"

export const hillPlates: Plate[] = [
  // 1. Hook
  {
    id: 'hill-hook',
    kind: 'hook',
    title: 'Linear Algebra Meets Cryptography',
    subtitle: 'Lester Hill (1929) and Multiletter Substitution',
    caption: 'Hill cipher was the first polygraphic block cipher operated completely by linear algebra over finite fields.',
    eli5Caption: 'Instead of encrypting one or two letters, Hill multiplies whole blocks of letters by a secret matrix.',
    speakerNotes: {
      script: 'Invented in 1929 by mathematician Lester S. Hill, this was the first cipher to use linear matrix multiplication. It operates simultaneously on blocks of n letters, completely disguising single-letter frequencies.',
      likelyQuestions: [
        {
          question: 'Can any matrix be used as a key?',
          answer: 'No! The matrix must have a non-zero determinant that is coprime to 26 (i.e. gcd(det, 26) = 1) so that a modular inverse matrix exists.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'hill-analogy',
    kind: 'analogy',
    title: 'The Linear Vector Rotation in Z_26',
    subtitle: 'Transforming Letter Vectors in 2D Space',
    caption: 'Plaintext letters form a coordinate vector [p0, p1]; the matrix rotates and shears it to a new coordinate [c0, c1].',
    eli5Caption: 'Imagine your two letters are a point on graph paper. The matrix moves that point to a new secret location.',
    speakerNotes: {
      script: 'Think of two plaintext letters as coordinates on a 26x26 grid. The key matrix acts as a linear geometric transformation, mixing both coordinates together.',
      likelyQuestions: [
        {
          question: 'Why does this hide letter frequencies?',
          answer: 'Because each ciphertext letter depends on all n plaintext letters in the block. Changing just one plaintext letter alters every ciphertext character in that block!'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'hill-concept',
    kind: 'concept',
    title: 'Matrix Formulation & Inversion Condition',
    subtitle: 'C = K · P mod 26 and P = K^-1 · C mod 26',
    caption: 'A 2x2 matrix K is invertible if and only if gcd(det(K), 26) = 1.',
    eli5Caption: 'To decrypt, you must calculate the inverse matrix using the modular inverse of the determinant.',
    speakerNotes: {
      script: 'To invert a 2x2 matrix: det = (k00*k11 - k01*k10) mod 26. Compute det^-1 mod 26. The adjugate matrix swaps diagonal elements and negates off-diagonal elements. Multiply adjugate by det^-1 mod 26.',
      likelyQuestions: [
        {
          question: 'What is the formula for the adjugate of [[a, b], [c, d]]?',
          answer: 'The adjugate is [[d, -b], [-c, a]]. In mod 26, -b becomes (26 - b).'
        }
      ]
    }
  },

  // 4. Worked Example
  {
    id: 'hill-worked',
    kind: 'worked-example',
    title: 'Worked Numerical: Encrypting "HELP" with Key [[3, 3], [2, 5]]',
    subtitle: 'Block Matrix Multiplication Modulo 26',
    caption: 'Split "HELP" into vectors [H, E]=[7, 4] and [L, P]=[11, 15], multiply by key matrix mod 26.',
    eli5Caption: 'Take 2 letters at a time, multiply rows by columns, reduce mod 26, convert back to letters.',
    speakerNotes: {
      script: 'Let us multiply the first block [7, 4]: Row 1 is 3*7 + 3*4 = 21 + 12 = 33. 33 mod 26 = 7 (H). Row 2 is 2*7 + 5*4 = 14 + 20 = 34. 34 mod 26 = 8 (I). First block encrypts to "HI"!',
      likelyQuestions: [
        {
          question: 'Is the determinant coprime to 26 for [[3, 3], [2, 5]]?',
          answer: 'Det = 3*5 - 3*2 = 15 - 6 = 9. gcd(9, 26) = 1. Yes, 9 is coprime to 26 (9^-1 = 3 mod 26).'
        }
      ]
    },
    workedExample: {
      problem: 'Encrypt plaintext "HELP" using Hill cipher with key matrix K = [[3, 3], [2, 5]].',
      given: {
        'Plaintext (P)': '"HELP"',
        'Key Matrix (K)': '[[3, 3], [2, 5]]',
        'Block Size (n)': 2,
        'Modulus (m)': 26
      },
      steps: [
        {
          label: 'Verify key matrix invertibility (gcd(det, 26) = 1)',
          formula: 'det(K) = (k00 * k11 - k01 * k10) mod 26',
          substitution: '3*5 - 3*2 = 15 - 6 = 9. gcd(9, 26) = 1',
          result: 'det = 9 (Coprime, Invertible! 9^-1 = 3 mod 26)'
        },
        {
          label: 'Split plaintext into column vectors of size 2',
          formula: 'Letter -> Index (0..25)',
          substitution: 'Block 1 "HE": [H=7, E=4]^T; Block 2 "LP": [L=11, P=15]^T',
          result: 'Two column vectors: [7, 4]^T and [11, 15]^T'
        },
        {
          label: 'Encrypt Block 1 "HE": C1 = K · [7, 4]^T mod 26',
          formula: 'c0 = (3*7 + 3*4) mod 26; c1 = (2*7 + 5*4) mod 26',
          substitution: 'c0 = (21+12)=33 ≡ 7(H); c1 = (14+20)=34 ≡ 8(I)',
          result: 'Block 1 Cipher: "HI"'
        },
        {
          label: 'Encrypt Block 2 "LP": C2 = K · [11, 15]^T mod 26',
          formula: 'c0 = (3*11 + 3*15) mod 26; c1 = (2*11 + 5*15) mod 26',
          substitution: 'c0 = (33+45)=78 ≡ 0(A); c1 = (22+75)=97 ≡ 19(T)',
          result: 'Block 2 Cipher: "AT"'
        }
      ],
      finalAnswer: 'Ciphertext C = "HIAT"',
      checkVerification: 'Decryption: K^-1 = 3 * [[5, 23], [24, 3]] = [[15, 17], [20, 9]] mod 26. Multiplying K^-1 by "HIAT" faithfully restores "HELP". Verified.'
    }
  },

  // 5. Compare
  {
    id: 'hill-compare',
    kind: 'compare',
    title: 'Hill Cipher vs Playfair vs Modern Block Ciphers',
    subtitle: 'The Power of Linear Diffusion and Its Fatal Flaw',
    caption: 'Hill achieves strong diffusion across characters, but its linear nature falls easily to Known-Plaintext Attack.',
    eli5Caption: 'Hill scrambles letters together very well, but because it is simple algebra, an attacker with a few known words can solve the matrix.',
    speakerNotes: {
      script: 'Highlight Shannon’s diffusion: Hill provides excellent diffusion because one plaintext letter affects the entire block. However, because it is purely linear (C = KP), an attacker with n known plaintext-ciphertext block pairs can set up C = KP and solve K = C * P^-1 mod 26 directly!',
      likelyQuestions: [
        {
          question: 'How many known letters are required to break an n x n Hill cipher?',
          answer: 'Exactly n plaintext-ciphertext blocks (i.e. n^2 letters) with a linearly independent plaintext matrix P.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Hill Cipher (Linear Polygraphic)',
      rightTitle: 'Modern AES Block Cipher',
      differences: [
        { feature: 'Mathematical Operation', left: 'Linear matrix multiplication mod 26', right: 'Non-linear S-boxes (GF(2^8)) + matrix diffusion', diffTone: 'signal' },
        { feature: 'Diffusion', left: 'Complete diffusion across n-letter block', right: 'Complete diffusion across 128-bit block', diffTone: 'ok' },
        { feature: 'Known-Plaintext Vulnerability', left: 'Completely broken by n known blocks via matrix inversion', right: 'Resistant to all known-plaintext attacks', diffTone: 'bad' },
        { feature: 'Non-Linearity', left: 'Zero non-linearity (affine system)', right: 'High non-linearity via multiplicative inverse in GF(2^8)', diffTone: 'info' }
      ],
      summaryTakeaway: 'Linearity is the death of cryptography: Hill provides diffusion, but without non-linear confusion, matrix algebra inverts the key.'
    }
  },

  // 6. Exam Words
  {
    id: 'hill-exam',
    kind: 'exam-words',
    title: 'Exam Words: Hill Cipher & Matrix Cryptanalysis',
    subtitle: 'Standard University Exam Definition & Solving Steps',
    caption: 'Remember matrix inversion formula K^-1 = det^-1 · adj(K) mod 26 and known-plaintext vulnerability.',
    eli5Caption: 'The formulas for matrix inverse, determinant condition, and how to answer Hill cipher numericals.',
    speakerNotes: {
      script: 'Make sure students remember that det must be non-zero and coprime to 26. Always write down the adjugate matrix calculation on the exam sheet.',
      likelyQuestions: [
        {
          question: 'What is the most common student calculation error in Hill?',
          answer: 'Forgetting to take modulo 26 on negative numbers in the adjugate matrix (e.g. -3 mod 26 = 23).'
        }
      ]
    },
    examWords: {
      term: 'Hill Polygraphic Cipher & Matrix Inversion',
      definition: 'A polygraphic substitution cipher that maps blocks of n plaintext characters into column vectors and encrypts via matrix multiplication modulo 26: C = K · P mod 26 and P = K^-1 · C mod 26, where K is an n×n key matrix such that gcd(det(K), 26) = 1. The inverse is K^-1 = (det(K))^-1 · adj(K) mod 26.',
      keywords: [
        'Polygraphic Block Cipher',
        'Matrix Multiplication mod 26',
        'gcd(det(K), 26) = 1',
        'Adjugate Matrix mod 26',
        'Known-Plaintext Attack (K = C · P^-1 mod 26)'
      ],
      mustRememberPoints: [
        'An n×n Hill key matrix is valid if and only if gcd(det(K), 26) = 1, ensuring a modular inverse exists.',
        'Negative entries in the adjugate matrix must be converted to positive residues mod 26 (e.g. -b mod 26 = 26 - b).',
        'Hill cipher is completely vulnerable to a known-plaintext attack: an attacker with n known pairs can solve for K directly.'
      ],
      typicalMarks: 5
    }
  }
]

export const hillPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'hill',
  topicTitle: 'Hill Polygraphic Matrix Cipher',
  targetDurationMinutes: 10,
  plates: hillPlates
}
