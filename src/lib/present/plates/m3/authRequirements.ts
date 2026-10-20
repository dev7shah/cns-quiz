import { Plate, TopicPresentation } from "@/lib/present/types"

export const authRequirementsPlates: Plate[] = [
  // 1. Hook
  {
    id: 'auth-req-hook',
    kind: 'hook',
    title: 'The Imposter’s Bank Slip',
    subtitle: 'Why Encryption Alone Does Not Equal Security',
    caption: 'Encryption protects secrecy (confidentiality), but does not guarantee who sent the data or whether it was altered in flight.',
    eli5Caption: 'A letter locked in a safe is confidential; but if someone swaps the safe, or flips random bits, you need a way to prove who wrote it.',
    speakerNotes: {
      script: 'Start by challenging a common student misconception: "If I encrypt a message with AES, is it authenticated?" The answer is no. Without integrity checks or authentication tags, an attacker can flip bits in stream ciphers or reorder ciphertext blocks without knowing the key.',
      likelyQuestions: [
        {
          question: 'Can an attacker modify an encrypted message without knowing the key?',
          answer: 'Yes! In CTR mode or stream ciphers, flipping bit i in the ciphertext flips bit i in the decrypted plaintext with 100% precision (bit-flipping attack).'
        }
      ]
    }
  },

  // 2. Concept: Security Architecture Attacks & Requirements
  {
    id: 'auth-req-threats',
    kind: 'concept',
    title: 'Authentication Threats & Requirements',
    subtitle: 'The 5 Fundamental Classes of Message Attacks',
    caption: 'Message authentication systems protect communication against five distinct active threats defined in RFC 2828 and ISO 7498-2.',
    eli5Caption: 'The five ways bad actors trick receivers: fake sender, altered words, mixed-up order, delayed replay, or lying about sending it.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Walk through the 5 classes: 1. Masquerade (insertion of messages from fraudulent source). 2. Content modification. 3. Sequence modification (insertion, deletion, reordering). 4. Timing modification (delay or replay). 5. Repudiation (denial of message transmission by sender or receipt by receiver).',
      likelyQuestions: [
        {
          question: 'What is the difference between message integrity and message authenticity?',
          answer: 'Integrity ensures data has not been altered; authenticity verifies that data originates from the genuine claimed sender.'
        }
      ]
    }
  },

  // 3. Comparison: Encryption vs MAC vs Digital Signatures
  {
    id: 'auth-req-compare',
    kind: 'compare',
    title: 'Authentication Primitives Comparison',
    subtitle: 'Symmetric Encryption vs MAC vs Digital Signatures',
    caption: 'Choosing the right security primitive for Confidentiality, Authenticity, and Non-Repudiation.',
    eli5Caption: 'Encryption hides; MAC proves it came from a shared secret friend; Digital Signatures prove it in a court of law to anyone.',
    comparison: {
      leftTitle: 'Symmetric Primitive (MAC / HMAC)',
      rightTitle: 'Asymmetric Primitive (Digital Signature)',
      differences: [
        {
          feature: 'Key Type Used',
          left: 'Single shared symmetric secret key K between Alice and Bob',
          right: 'Asymmetric key pair: Private key (signing), Public key (verification)'
        },
        {
          feature: 'Non-Repudiation',
          left: 'No (Bob shares key K, so Bob could have forged the MAC himself)',
          right: 'Yes (Only Alice possesses private key d; verifiable by third-party judge)'
        },
        {
          feature: 'Verification Audience',
          left: 'Only holders of secret key K (Private verification)',
          right: 'Anyone with Alice’s public key (Public verification)'
        },
        {
          feature: 'Computational Speed',
          left: 'Fast (symmetric hashing / block operations: gigabits/sec)',
          right: 'Slower (modular exponentiation / point scalar multiplication)'
        }
      ],
      summaryTakeaway: 'Use MAC/HMAC when communication is peer-to-peer and speed is vital; use Digital Signatures when non-repudiation and third-party auditability are required.'
    },
    speakerNotes: {
      script: 'Emphasize the Non-Repudiation row: this is an essential exam question. Why does a MAC NOT provide non-repudiation? Because both Alice and Bob have the symmetric key K. Alice can always tell a judge: "Bob generated that MAC himself to frame me!"',
      likelyQuestions: [
        {
          question: 'Can conventional encryption alone provide authentication?',
          answer: 'Only if the plaintext possesses recognizable internal structure or redundancy (e.g. valid checksum or syntax) that an attacker cannot forge randomly.'
        }
      ]
    }
  },

  // 4. Worked Example: Taxonomy of Authentication Functions
  {
    id: 'auth-req-worked',
    kind: 'worked-example',
    title: 'The Three Classes of Authentication Functions',
    subtitle: 'How Systems Compute Message Authentication',
    caption: 'Three mathematical approaches produce authenticators: Message Encryption, Message Authentication Code (MAC), and Hash Functions.',
    eli5Caption: 'Three recipes: encrypt the whole message, attach a small secret code tag, or hash the message together with a secret.',
    workedExample: {
      problem: 'Evaluate three different authentication mechanisms to secure a critical financial transaction: "Transfer $1,000,000 to Account 9876". Sender Alice, Receiver Bob.',
      given: {
        'Message (M)': '"Transfer $1,000,000 to Account 9876"',
        'Sender': 'Alice',
        'Receiver': 'Bob',
        'Shared Key': 'K_AB (for MAC)',
        'Alice Keypair': 'PR_A (Private), PU_A (Public)'
      },
      steps: [
        {
          label: 'Approach 1: Conventional Symmetric Encryption',
          formula: 'C = E(K_AB, M)',
          substitution: 'Encrypt entire message payload using AES-GCM or AES-CBC with pre-shared key',
          result: 'Ciphertext C',
          note: 'Provides confidentiality and authentication if structured redundancy exists; high compute overhead for large files.'
        },
        {
          label: 'Approach 2: Message Authentication Code (MAC / HMAC)',
          formula: 'T = MAC(K_AB, M); Transmit [M || T]',
          substitution: 'Compute compact 256-bit tag T = HMAC(K_AB, M) and send alongside plaintext',
          result: 'Tag T (32 bytes)',
          note: 'Very fast; verifies origin and integrity, but does NOT provide legal non-repudiation.'
        },
        {
          label: 'Approach 3: Hash-then-Sign Digital Signature',
          formula: 'S = E(PR_A, H(M)); Transmit [M || S]',
          substitution: 'Hash message to 256 bits with SHA-256, then sign digest with Alice’s private key',
          result: 'Signature S',
          note: 'Provides full non-repudiation and third-party auditability by any judge or regulator.'
        }
      ],
      finalAnswer: 'All three verify authenticity; Approach 2 is optimal for internal API speed; Approach 3 provides legal non-repudiation.',
      checkVerification: 'Check: Shared key K_AB enables symmetric verification; Alice private key PR_A binds legal non-repudiation.'
    },
    speakerNotes: {
      script: 'Explain the efficiency of Approach 3: instead of encrypting a 1 GB file with expensive RSA, we compute a 256-bit SHA-256 digest in milliseconds and sign only the 256-bit digest. This is the universal standard in TLS, code signing, and Bitcoin.',
      likelyQuestions: []
    }
  },

  // 5. Ask the room
  {
    id: 'auth-req-ask',
    kind: 'ask-the-room',
    title: 'Architecture Scenario: Real-Time Telemetry',
    subtitle: 'System Requirements Analysis',
    caption: 'You are securing public weather broadcast feeds from airport meteorological towers to incoming airplanes.',
    eli5Caption: 'The planes need to know the runway wind is authentic, but anyone is allowed to read it.',
    askTheRoom: {
      question: 'The wind speed and runway pressure readings are public public data. Which security service is REQUIRED, and which is UNNECESSARY?',
      options: [
        'A. Confidentiality is required; Authenticity and Integrity are unnecessary.',
        'B. Authenticity and Integrity are required; Confidentiality is unnecessary.',
        'C. Neither Confidentiality nor Integrity is needed.',
        'D. Only Non-repudiation is needed; Integrity can be ignored.'
      ],
      correctIndex: 1,
      explanation: 'Weather data is public information (no confidentiality needed), but pilots must be 100% certain it was not tampered with and comes from the airport tower (authenticity and integrity).'
    },
    speakerNotes: {
      script: 'Point out real-world analogues: DNS responses, NTP time synchronization, software package mirrors, and firmware updates all require integrity/authenticity without requiring confidentiality.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'auth-req-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Authentication Requirements',
    caption: 'Essential definitions and distinctions tested in CNS university examinations.',
    eli5Caption: 'The exact terms required for maximum exam marks.',
    speakerNotes: {
      script: 'Drill students on the definition of Non-Repudiation: protection against denial by one of the entities involved in a communication. A MAC does NOT provide non-repudiation because the secret key is shared.',
      likelyQuestions: [
        {
          question: 'What is message replay and how is it mitigated?',
          answer: 'Replay is when an attacker intercepts a valid authenticator and re-sends it later. Defense: sequence numbers, timestamps, or nonces.'
        }
      ]
    },
    examWords: {
      term: 'Message Authentication & Integrity',
      definition: 'A security mechanism that verifies message source authenticity, validates data integrity, and defends against active transmission attacks.',
      keywords: [
        'Message Authentication Code (MAC)',
        'Data Integrity',
        'Non-Repudiation',
        'Masquerade Attack',
        'Replay Attack',
        'Hash-then-Sign',
        'Symmetric vs Asymmetric Authenticator'
      ],
      mustRememberPoints: [
        'Confidentiality protects against passive eavesdropping; Authenticity protects against active forgery and masquerade.',
        'MAC uses a shared symmetric secret key and cannot provide non-repudiation because either party could generate the tag.',
        'Digital signatures use asymmetric private keys, providing source authentication, data integrity, and third-party verifiable non-repudiation.'
      ],
      typicalMarks: 5
    }
  }
]

export const authRequirementsPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'auth-requirements',
  topicTitle: 'Authentication Requirements & Functions',
  targetDurationMinutes: 8,
  plates: authRequirementsPlates
}
