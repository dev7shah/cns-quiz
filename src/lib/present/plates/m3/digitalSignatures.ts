import { Plate, TopicPresentation } from "@/lib/present/types"

export const digitalSignaturesPlates: Plate[] = [
  // 1. Hook: The Sony PS3 Disaster
  {
    id: 'dig-sig-hook',
    kind: 'hook',
    title: 'The Sony PS3 Disaster (fail0verflow 2010)',
    subtitle: 'How a Hardcoded Number "k" Extracted Sony’s Master Signing Key',
    caption: 'In 2010, the fail0verflow hacker group completely broke the PlayStation 3’s digital signature system. Sony used a static constant instead of a random nonce k in ECDSA, exposing their master private key in seconds.',
    eli5Caption: 'A company locked the front door with an unbreakable digital lock, but used the exact same key code "4" every single time, giving away the master key to everyone.',
    speakerNotes: {
      script: 'Hook the audience with the Sony PS3 story: Sony spent hundreds of millions designing custom Cell processors and DRM. But whoever programmed their ECDSA signing forgot the "R" in random: k was hardcoded. Two game signatures with the same k allowed hackers to subtract the equations and recover Sony’s master root private key, allowing unauthorized homebrew on all PS3 consoles.',
      likelyQuestions: [
        {
          question: 'Did Sony have to replace hardware to fix this?',
          answer: 'Because the root public key was burned into read-only silicon on the Cell processor, Sony could not revoke the root key without bricking millions of consoles.'
        }
      ]
    }
  },

  // 2. Process: Hash-Then-Sign Paradigm
  {
    id: 'dig-sig-hash-then-sign',
    kind: 'process',
    title: 'The Hash-Then-Sign Paradigm',
    subtitle: 'Why Cryptographers Never Sign Plaintext Directly',
    caption: 'Raw messages are hashed to a compact fixed-size digest before signing to prevent mathematical forgeries and optimize signing performance.',
    eli5Caption: 'Instead of signing every page of a 10,000-page book, we stamp the single-page summary.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Explain the two critical reasons for Hash-then-Sign: 1. Performance: Signing a 4 GB ISO image with RSA would take hours; hashing it with SHA-256 takes seconds, then signing only the 256-bit digest takes milliseconds. 2. Security: Raw RSA is multiplicatively homomorphic: S1 * S2 = (M1 * M2)^d mod n. Hashing breaks this algebraic structure completely.',
      likelyQuestions: [
        {
          question: 'What is existential forgery on raw RSA?',
          answer: 'An attacker chooses an arbitrary signature S and computes M = S^e mod n. The pair (M, S) is a valid signature without knowing private key d!'
        }
      ]
    }
  },

  // 3. Comparison: RSA Signatures vs ECDSA
  {
    id: 'dig-sig-compare',
    kind: 'compare',
    title: 'Signature Schemes Comparison',
    subtitle: 'RSA-PSS / PKCS#1 vs ECDSA (secp256r1 / Ed25519)',
    caption: 'Comparing key lengths, signature sizes, mathematical foundations, and implementation pitfalls.',
    eli5Caption: 'RSA has huge keys and fast verification; ECDSA has tiny keys and tiny signatures, but demands perfect random numbers.',
    comparison: {
      leftTitle: 'RSA Signatures (RSA-PSS / PKCS#1v1.5)',
      rightTitle: 'ECDSA / Ed25519 (Elliptic Curve)',
      differences: [
        {
          feature: 'Key Length for 128-Bit Security',
          left: '3072 bits (large public and private keys)',
          right: '256 bits (compact keys, fits in QR codes and NFC chips)'
        },
        {
          feature: 'Signature Size',
          left: '384 bytes (large overhead in packets and certificates)',
          right: '64 bytes (r, s pair of 32 bytes each; very compact)'
        },
        {
          feature: 'Verification Speed',
          left: 'Extremely Fast (e = 65537 requires only 17 squarings)',
          right: 'Moderate (requires two curve scalar multiplications u1*G + u2*Q)'
        },
        {
          feature: 'Vulnerability to Bad RNG',
          left: 'Low (deterministic signing requires no ephemeral nonce)',
          right: 'Catastrophic (reusing nonce k reveals private key immediately)'
        }
      ],
      summaryTakeaway: 'RSA remains widely used on web servers where fast verification is paramount; ECDSA and EdDSA dominate IoT, Bitcoin, TLS 1.3, and mobile devices due to compact keys.'
    },
    speakerNotes: {
      script: 'Point out the verification speed row: On busy HTTPS servers handling 100,000 handshakes a second, RSA signature verification is actually faster than ECDSA because e = 65537 is tiny! However, ECDSA signing is much faster than RSA signing.',
      likelyQuestions: []
    }
  },

  // 4. Attack & Defense: The Sony PS3 Nonce Reuse Exploit
  {
    id: 'dig-sig-attack-defense',
    kind: 'attack-defense',
    title: 'The ECDSA Nonce Reuse Catastrophe',
    subtitle: 'Extracting Master Private Key d in 2 Linear Equations',
    caption: 'When an attacker observes two signatures (r, s1) and (r, s2) with identical r, the ephemeral nonce k and private key d are algebraically exposed.',
    eli5Caption: 'Using the same random number twice lets the attacker solve for the secret master key using high school algebra.',
    attackDefense: {
      attackName: 'ECDSA Ephemeral Nonce Reuse (Sony PS3 Exploit)',
      normalFlowDescription: 'Signer generates fresh cryptographically secure random nonce k for each message: s = k^-1 * (z + r*d) mod n.',
      attackFlowDescription: 'Signer reuses k on two messages z1 and z2. Since r = (k*G).x is identical, attacker computes k = (z1 - z2)/(s1 - s2) mod n, then d = (s1*k - z1)/r mod n.',
      defenseFlowDescription: 'Use RFC 6979 Deterministic ECDSA: derive k deterministically from HMAC(private_key, message_hash) so k is unique and unpredictable.'
    },
    speakerNotes: {
      script: 'Walk through the two-line algebra: s1 - s2 = k^-1 * (z1 - z2). Multiply both sides by k and divide by (s1 - s2): k = (z1 - z2) * (s1 - s2)^-1 mod n. Once you have k, plug into s1 = k^-1 * (z1 + r*d) to get d = (s1*k - z1)*r^-1 mod n. Every student should be able to do this derivation.',
      likelyQuestions: [
        {
          question: 'What is RFC 6979?',
          answer: 'RFC 6979 defines deterministic ECDSA: instead of using a random number generator, k is generated as HMAC-SHA256(private_key || message_hash). It is 100% immune to RNG failure!'
        }
      ]
    }
  },

  // 5. Worked Example: RSA Signature Generation & Verification
  {
    id: 'dig-sig-worked',
    kind: 'worked-example',
    title: 'Worked Example: RSA Signature Computation',
    subtitle: 'Signing and Verifying a Hash Digest with Small Primes',
    caption: 'Tracing RSA signing S = h^d mod n and public verification V = S^e mod n with concrete small numbers.',
    eli5Caption: 'Watch how Alice signs a hash value with her secret key d, and Bob verifies it with her public key e.',
    workedExample: {
      problem: 'Demonstrate RSA digital signature generation and verification for message digest h = 1234 using small primes p = 61, q = 53.',
      given: {
        'Primes (p, q)': 'p = 61, q = 53',
        'Modulus (n)': 'n = p * q = 3233',
        'Totient phi(n)': '(60)(52) = 3120',
        'Public Exponent (e)': 17,
        'Private Exponent (d)': 2753,
        'Message Digest (h)': 1234
      },
      steps: [
        {
          label: 'Alice Signs Digest with Private Key d',
          formula: 'S = h^d mod n',
          substitution: 'S = 1234^2753 mod 3233',
          result: 'S = 3081',
          note: 'Alice uses square-and-multiply with secret exponent d.'
        },
        {
          label: 'Alice Transmits (Message M, Signature S)',
          formula: 'Transmit (M, S)',
          substitution: 'Deliver S = 3081 alongside message M',
          result: 'S = 3081 in transit',
          note: 'Eve cannot forge S for another message without private key d.'
        },
        {
          label: 'Bob Verifies Signature with Public Key e',
          formula: 'V = S^e mod n',
          substitution: 'V = 3081^17 mod 3233',
          result: 'V = 1234',
          note: 'Bob computes modular exponentiation with public exponent e.'
        },
        {
          label: 'Compare Recovered Digest V with Expected Digest h',
          formula: 'V === h',
          substitution: '1234 === 1234',
          result: 'Signature VERIFIED',
          note: 'Euler totient theorem guarantees (h^d)^e ≡ h^(de) ≡ h^1 ≡ h mod n.'
        }
      ],
      finalAnswer: 'Signature verified successfully: authentic source and uncorrupted data proven.',
      checkVerification: 'Check: e * d = 17 * 2753 = 46801 = 15 * 3120 + 1 ≡ 1 mod 3120.'
    },
    speakerNotes: {
      script: 'Point out Euler’s totient theorem: e * d ≡ 1 mod phi(n). Therefore (h^d)^e = h^(ed) = h^(k*phi(n) + 1) = h^1 = h mod n. This proves mathematically why verification always restores the exact original digest.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'dig-sig-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Digital Signatures',
    caption: 'Core formulas, security requirements, and standards for examinations.',
    eli5Caption: 'The exact formulas examiners demand in digital signature questions.',
    speakerNotes: {
      script: 'Drill students on the 3 fundamental requirements of digital signatures: 1. It must depend on the message signed. 2. It must use information unique to the sender to prevent forgery. 3. It must be verifiable by anyone without exposing the private key.',
      likelyQuestions: [
        {
          question: 'What is the Digital Signature Standard (DSS)?',
          answer: 'FIPS PUB 186 specifies the Digital Signature Standard, adopting three algorithms: DSA, RSA, and ECDSA, using SHA-2/SHA-3 hashes.'
        }
      ]
    },
    examWords: {
      term: 'Digital Signature Scheme',
      definition: 'A mathematical scheme for verifying the authenticity of digital messages or documents, providing authentication, data integrity, and legal non-repudiation.',
      keywords: [
        'Hash-then-Sign Paradigm',
        'RSA Signature (S = H(M)^d mod n)',
        'ECDSA (r, s)',
        'Ephemeral Nonce (k)',
        'Sony PS3 Exploit',
        'RFC 6979 Deterministic Signatures',
        'Non-Repudiation'
      ],
      mustRememberPoints: [
        'In RSA signatures, Alice signs with her private key d (S = H(M)^d mod n) and Bob verifies with her public key e (V = S^e mod n).',
        'In ECDSA, a signature is a pair (r, s) where r = (k*G).x mod n and s = k^-1 * (H(M) + r*d) mod n.',
        'Reusing an ephemeral nonce k in ECDSA allows an attacker to compute k = (z1 - z2)/(s1 - s2) mod n and immediately extract private key d.'
      ],
      typicalMarks: 5
    }
  }
]

export const digitalSignaturesPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'digital-signatures',
  topicTitle: 'Digital Signatures (RSA & ECDSA)',
  targetDurationMinutes: 12,
  plates: digitalSignaturesPlates
}
