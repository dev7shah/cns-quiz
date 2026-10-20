import { Plate, TopicPresentation } from "@/lib/present/types"

export const rsaPlates: Plate[] = [
  // 1. Hook
  {
    id: 'rsa-hook',
    kind: 'hook',
    title: 'The Cornerstone of Modern Trust',
    subtitle: 'RSA (1977): Factoring Composite Primes',
    caption: 'Conceived over Passover wine by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT, RSA turned number theory from an abstract branch of pure mathematics into the bedrock of global digital commerce.',
    eli5Caption: 'Multiplying two huge prime numbers takes a millisecond. Factoring their product back into primes takes millennia.',
    speakerNotes: {
      script: 'In 1977, Rivest, Shamir, and Adleman realized that the Euler totient function creates a natural trapdoor. Anyone can compute n = p × q, but only someone who knows p and q can compute phi(n) = (p-1)(q-1), which is needed to calculate the private decryption key d.',
      likelyQuestions: [
        {
          question: 'What is the current minimum safe key length for RSA?',
          answer: 'NIST recommends a minimum of 2048 bits for general use, with 3072 or 4096 bits recommended for long-term security beyond 2030.'
        }
      ]
    }
  },

  // 2. Concept: Mathematical Foundation
  {
    id: 'rsa-math',
    kind: 'concept',
    title: 'The Mathematical Architecture of RSA',
    subtitle: 'Euler’s Totient Theorem: M^(ed) ≡ M (mod n)',
    caption: 'RSA’s correctness rests upon Euler’s Totient Theorem: for any integer M coprime to n, M^phi(n) ≡ 1 (mod n). Therefore, M^(k·phi(n)+1) ≡ M (mod n).',
    eli5Caption: 'Because e × d = k · phi(n) + 1, raising a ciphertext to power d cancels out the power e, giving back the original message.',
    comparison: {
      leftTitle: 'Public Parameters (Shared Openly)',
      rightTitle: 'Private Parameters (Kept Secret)',
      differences: [
        {
          feature: 'Modulus n',
          left: 'n = p × q (published so anyone can perform mod n operations)',
          right: 'Factors p and q are erased or kept top-secret'
        },
        {
          feature: 'Totient phi(n)',
          left: 'Impossible to determine without factoring n into p and q',
          right: 'phi(n) = (p - 1)(q - 1), known only to key creator'
        },
        {
          feature: 'Exponent',
          left: 'Public Exponent e: usually small Fermat prime e = 65537 (2^16 + 1)',
          right: 'Private Exponent d: d = e⁻¹ mod phi(n), computed via Extended Euclidean'
        },
        {
          feature: 'Operation',
          left: 'Encryption: C = M^e mod n (fast modular exponentiation)',
          right: 'Decryption: M = C^d mod n (slow exponentiation or CRT acceleration)'
        }
      ],
      summaryTakeaway: 'The public key is (e, n); the private key is (d, n). Breaking RSA means finding d, which requires factoring n to compute phi(n).'
    },
    speakerNotes: {
      script: 'Walk through Euler’s Totient: phi(n) is the count of positive integers less than n that are coprime to n. For primes p and q, phi(pq) = (p-1)(q-1). This is the secret trapdoor knowledge.',
      likelyQuestions: [
        {
          question: 'Why is e almost always chosen as 65537 (0x10001)?',
          answer: '65537 is the 4th Fermat prime. In binary it has only two set bits (10000000000000001), allowing square-and-multiply modular exponentiation to finish in just 17 multiplications.'
        }
      ]
    }
  },

  // 3. Worked Example: Small Numbers
  {
    id: 'rsa-worked-example',
    kind: 'concept',
    title: 'Worked Numerical Example with Small Primes',
    subtitle: 'Step-by-Step Calculation: p=7, q=11, e=7, M=9',
    caption: 'Observe exact numerical execution: p=7, q=11 -> n=77, phi(n)=60. Pick e=7, derive d=43. Encrypt M=9 -> C=37. Decrypt C=37 -> M=9.',
    eli5Caption: 'Small numbers show every calculation step so you can verify the math by hand.',
    comparison: {
      leftTitle: 'Key Generation & Encryption Steps',
      rightTitle: 'Decryption Verification Steps',
      differences: [
        {
          feature: '1. Modulus n & Totient',
          left: 'n = 7 × 11 = 77 | phi(n) = (7 - 1)(11 - 1) = 6 × 10 = 60',
          right: 'Bob stores private parameters: p=7, q=11, phi(n)=60, d=43'
        },
        {
          feature: '2. Exponent Derivation',
          left: 'Choose e=7 (gcd(7, 60) = 1). Public Key = (e=7, n=77)',
          right: 'Solve: 7d ≡ 1 mod 60 -> Extended Euclidean gives d=43 (7 × 43 = 301 = 5×60 + 1)'
        },
        {
          feature: '3. Message & Operation',
          left: 'Plaintext M = 9 (ensure 0 <= M < n)',
          right: 'Ciphertext C = 37 received over public channel'
        },
        {
          feature: '4. Mathematical Power',
          left: 'C = 9^7 mod 77 = 4,782,969 mod 77 = 37',
          right: 'M = 37^43 mod 77 = 9 (exact original plaintext restored!)'
        }
      ],
      summaryTakeaway: 'Decryption perfectly recovers M because (9^7)^43 = 9^301 = 9^(5×60+1) ≡ 1^5 × 9 = 9 (mod 77).'
    },
    speakerNotes: {
      script: 'Have students verify 301 mod 60 in their heads: 5 × 60 = 300, remainder 1. This is the exact condition e × d ≡ 1 (mod phi(n)). Stress that in practice, p and q are 1024-bit primes generated via Miller-Rabin primality tests.',
      likelyQuestions: [
        {
          question: 'What if gcd(M, n) != 1?',
          answer: 'RSA still works even if M and n are not coprime (Euler’s theorem generalizes via Chinese Remainder Theorem), as long as 0 <= M < n.'
        }
      ]
    }
  },

  // 4. Process: Keygen and Transmission Scene
  {
    id: 'rsa-process',
    kind: 'process',
    title: 'RSA Key Generation & Message Exchange Flow',
    subtitle: 'Trapdoor Inversion over Public Insecure Channels',
    caption: 'Alice encrypts message M with public key (e, n); only Bob’s private key d can compute C^d mod n.',
    eli5Caption: 'Alice computes C = M^e mod n. Eve cannot take the e-th root modulo n without factoring n.',
    scene: {
      id: 'scene-rsa-flow',
      title: 'RSA Cryptosystem Execution',
      viewBox: '0 0 900 360',
      legend: ['Alice (Sender)', 'Bob (Receiver)', 'Eve (Eavesdropper)', 'Public Key (e, n)', 'Private Key (d, n)'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 120, y: 160 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Passive)', pos: { x: 450, y: 270 } },
        { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 780, y: 160 } }
      ],
      objects: [
        { id: 'plain', kind: 'plain', label: 'M = 9', at: { x: 120, y: 160 }, tone: 'info' },
        { id: 'pubKey', kind: 'key-pub', label: 'PK = (e=7, n=77)', at: { x: 780, y: 90 }, tone: 'info' },
        { id: 'privKey', kind: 'key-priv', label: 'SK = (d=43, n=77)', at: { x: 780, y: 220 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Bob picks primes p=7, q=11, computes n=77, phi(n)=60, chooses e=7, and calculates d=43.',
          eli5: 'Bob generates his public key (7, 77) and keeps d=43 secret.',
          actions: [
            { do: 'pulse', target: 'pubKey' },
            { do: 'say', actor: 'bob', text: 'n=77, e=7, d=43' }
          ]
        },
        {
          caption: 'Bob publishes public key (e=7, n=77). Alice receives the public key.',
          eli5: 'Alice gets Bob’s public key from the network.',
          actions: [
            { do: 'move', obj: 'pubKey', to: { x: 120, y: 90 } },
            { do: 'highlight', target: ['alice', 'pubKey'], tone: 'info' }
          ]
        },
        {
          caption: 'Alice encrypts message M=9: C = 9^7 mod 77 = 37. Plain text transforms into ciphertext 37.',
          eli5: 'Alice calculates 9 to the power 7 mod 77 = 37.',
          actions: [
            { do: 'transform', obj: 'plain', into: { kind: 'cipher', label: 'C = 37', tone: 'bad' } },
            { do: 'pulse', target: 'plain' },
            { do: 'say', actor: 'alice', text: 'C = 9^7 mod 77 = 37' }
          ]
        },
        {
          caption: 'Alice sends C=37 across public internet. Eve intercepts C=37 but cannot compute 37^(1/7) mod 77 without phi(n).',
          eli5: 'Eve sees 37, but finding the 7th root mod 77 is impossible without factoring 77.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 450, y: 160 } },
            { do: 'zone', id: 'eavesdrop', show: true },
            { do: 'say', actor: 'eve', text: 'Factoring n is hard!' }
          ]
        },
        {
          caption: 'Bob computes M = 37^43 mod 77 = 9. Plaintext message 9 is flawlessly restored!',
          eli5: 'Bob uses his private key 43 to decrypt: 37^43 mod 77 = 9.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 780, y: 160 } },
            { do: 'transform', obj: 'plain', into: { kind: 'plain', label: 'Plaintext M = 9', tone: 'ok' } },
            { do: 'highlight', target: ['bob', 'plain', 'privKey'], tone: 'ok' },
            { do: 'say', actor: 'bob', text: 'Recovered M = 9' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Emphasize that "textbook RSA" without padding is insecure due to multiplicative homomorphic properties: E(m1) * E(m2) mod n = E(m1 * m2 mod n). Modern standards mandate OAEP (Optimal Asymmetric Encryption Padding).',
      likelyQuestions: [
        {
          question: 'What is OAEP padding?',
          answer: 'OAEP uses hash functions to pad and randomize plaintext before exponentiation, preventing chosen-ciphertext and small message attacks.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'rsa-ask',
    kind: 'ask-the-room',
    title: 'Check Your Mathematical Understanding',
    subtitle: 'Euler Totient and Modular Inverses',
    caption: 'Suppose an RSA key generator selects primes p = 5 and q = 11, and chooses public exponent e = 3.',
    eli5Caption: 'What is the private decryption key d?',
    askTheRoom: {
      question: 'Given p = 5, q = 11, and e = 3, what is the private key exponent d?',
      options: [
        'A. d = 7',
        'B. d = 27',
        'C. d = 13',
        'D. d = 19'
      ],
      correctIndex: 1,
      explanation: 'Correct! phi(n) = (5 - 1)(11 - 1) = 4 × 10 = 40. We must find d such that 3d ≡ 1 mod 40. Testing 3 × 27 = 81 = 2 × 40 + 1 ≡ 1 mod 40. Thus d = 27.'
    },
    speakerNotes: {
      script: 'Walk through candidates: 3 × 7 = 21 != 1 mod 40; 3 × 13 = 39 ≡ -1 mod 40; 3 × 27 = 81 ≡ 1 mod 40. Emphasize how Extended Euclidean algorithm automates this in logarithmic time.',
      likelyQuestions: [
        {
          question: 'Can d be negative?',
          answer: 'Extended Euclidean can output negative numbers; in modular arithmetic, we add phi(n) until d is positive (e.g., -13 + 40 = 27).'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'rsa-exam',
    kind: 'exam-words',
    title: 'RSA Algorithm Key Terminology & Exam Reference',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these definitions, formulas, and conditions for full marks in cryptography exams.',
    eli5Caption: 'The three must-know bullet points for university RSA derivation questions.',
    examWords: {
      term: 'RSA Cryptosystem (Rivest-Shamir-Adleman)',
      definition: 'A public-key asymmetric cryptosystem whose security relies on the computational difficulty of factoring the product of two large prime numbers (the Integer Factorization Problem).',
      keywords: [
        'Prime generation p, q',
        'Euler totient phi(n) = (p-1)(q-1)',
        'Public key (e, n), Private key (d, n)',
        'Modular exponentiation C = M^e mod n',
        'Optimal Asymmetric Encryption Padding (OAEP)'
      ],
      mustRememberPoints: [
        'Key Generation: Select primes p, q; calculate n = pq and phi(n) = (p-1)(q-1). Choose e coprime to phi(n) (gcd(e, phi(n))=1). Calculate d = e⁻¹ mod phi(n).',
        'Encryption & Decryption: Encryption is C = M^e mod n (0 <= M < n); Decryption is M = C^d mod n.',
        'Vulnerabilities of Textbook RSA: Multiplicative homomorphic malleability and small exponent attacks necessitate OAEP padding before exponentiation.'
      ],
      typicalMarks: 7
    },
    speakerNotes: {
      script: 'Advise students to ALWAYS state the condition 0 <= M < n and gcd(e, phi(n)) = 1 when writing the RSA algorithm in exams. Professors deduct marks if these conditions are omitted.',
      likelyQuestions: [
        {
          question: 'What is Wiener’s attack?',
          answer: 'If the private exponent d is chosen too small (d < (1/3) * n^(1/4)) to speed up decryption, continued fractions can factor n and recover d in polynomial time.'
        }
      ]
    }
  }
]

export const rsaPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'rsa',
  topicTitle: 'RSA Algorithm',
  targetDurationMinutes: 10,
  plates: rsaPlates
}
