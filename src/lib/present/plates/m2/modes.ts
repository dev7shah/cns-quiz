import { Plate, TopicPresentation } from "@/lib/present/types"

export const modesPlates: Plate[] = [
  // 1. Hook: The ECB Penguin
  {
    id: 'modes-hook',
    kind: 'hook',
    title: 'The Ghost in the Cipher: Why ECB Fails',
    subtitle: 'The Famous Linux "ECB Penguin" Vulnerability',
    caption: 'When identical plaintext blocks encrypt to identical ciphertext blocks, visual and statistical patterns survive completely intact.',
    eli5Caption: 'If every white pixel always turns into red, and every black pixel turns into blue, you can still see the whole picture!',
    speakerNotes: {
      script: 'In Electronic Codebook (ECB) mode, each 128-bit block is encrypted independently. If a document or image has repeating patterns (like empty space or repeated headers), identical plaintext blocks produce identical ciphertext blocks. The outline of the Tux penguin remains completely visible.',
      likelyQuestions: [
        {
          question: 'Is AES-128 in ECB mode secure for a single 16-byte password?',
          answer: 'For a single isolated block, yes. But for any message longer than one block, ECB leaks data patterns and structural relationships.'
        }
      ]
    }
  },

  // 2. Process: Interactive Mode Diagram
  {
    id: 'modes-process',
    kind: 'process',
    title: 'Block Cipher Modes of Operation',
    subtitle: 'Interactive Block-by-Block Chaining Engine',
    caption: 'Switch between ECB, CBC, CFB, OFB, and CTR modes. Toggle Encrypt vs Decrypt and trace IV propagation.',
    eli5Caption: 'See how chaining blocks together mixes the past into the present so patterns disappear.',
    customFigure: 'ModeDiagram',
    speakerNotes: {
      script: 'Demonstrate each mode with the selector. In CBC, note how Ciphertext 0 is the IV, and each block XORs with the previous ciphertext block. In CTR mode, notice that the block cipher encrypts a Counter, turning the block cipher into a parallel stream cipher.',
      likelyQuestions: [
        {
          question: 'Why must the IV in CBC mode be unpredictable?',
          answer: 'If the IV is predictable, an attacker can launch chosen-plaintext attacks to test if a block matches a guess.'
        }
      ]
    }
  },

  // 3. Comparison: All 5 Modes of Operation
  {
    id: 'modes-compare',
    kind: 'compare',
    title: 'Comprehensive Modes Comparison',
    subtitle: 'ECB vs CBC vs CFB vs OFB vs CTR',
    caption: 'Trade-offs between chaining, parallel execution, random access, and error propagation.',
    eli5Caption: 'Some modes can run across multiple CPU cores simultaneously; others must wait for each step to finish.',
    comparison: {
      leftTitle: 'Chaining Modes (CBC / CFB)',
      rightTitle: 'Counter / Stream Modes (OFB / CTR)',
      differences: [
        {
          feature: 'Parallel Encryption',
          left: 'Impossible (sequential dependency on previous block)',
          right: 'Fully parallelizable in CTR mode across all CPU cores'
        },
        {
          feature: 'Parallel Decryption',
          left: 'Parallelizable in CBC (since all C_i are already known)',
          right: 'Fully parallelizable in CTR mode'
        },
        {
          feature: '1-Bit Ciphertext Error Impact',
          left: 'Corrupts current block + flips 1 bit in next block (CBC)',
          right: 'Flips exact 1 bit in current block only (zero error spread)'
        },
        {
          feature: 'Padding Requirement',
          left: 'Mandatory (message must pad to block multiple)',
          right: 'Zero padding required (CTR operates as a stream cipher)'
        }
      ],
      summaryTakeaway: 'Modern systems universally favor CTR mode (often paired with GHASH as AES-GCM) for parallel speed and zero padding.'
    },
    speakerNotes: {
      script: 'Go through this table line-by-line. University exams frequently ask: "Which mode allows random access reading of encrypted files?" Answer: CTR mode, because the counter for any block i can be computed directly without decrypting earlier blocks.',
      likelyQuestions: [
        {
          question: 'Can you reuse a (Nonce, Key) pair in CTR mode?',
          answer: 'Never! Reusing a nonce with the same key produces the two-time pad catastrophe: C1 ⊕ C2 = P1 ⊕ P2, leaking the plaintexts.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Padding Oracle Attack
  {
    id: 'modes-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: The CBC Padding Oracle Attack',
    subtitle: 'From Error Messages to Complete Decryption (POODLE / Vaudenay)',
    caption: 'When a server returns different errors for "invalid padding" vs "bad decryption", an attacker decrypts ciphertext without the key.',
    eli5Caption: 'The guard says "wrong password format" instead of just "access denied", letting the spy guess letter-by-letter.',
    attackDefense: {
      attackName: 'Padding Oracle Attack (Vaudenay 2002 / POODLE)',
      normalFlowDescription: 'Client sends CBC ciphertext; Server decrypts, checks PKCS#7 padding, and processes valid request.',
      attackFlowDescription: 'Attacker modifies the last byte of C_{n-1} and observes server error responses to deduce the intermediate plaintext byte.',
      defenseFlowDescription: 'Use Authenticated Encryption with Associated Data (AEAD) like AES-GCM or Encrypt-then-MAC (HMAC-SHA256).'
    },
    speakerNotes: {
      script: 'Explain the mechanism: In PKCS#7, padding bytes indicate the number of pad bytes (e.g., 0x01 or 0x02, 0x02). By sending 256 variations of the second-to-last ciphertext block and watching if the server says "Bad Padding", the attacker recovers the exact plaintext byte-by-byte in 256 attempts per byte.',
      likelyQuestions: [
        {
          question: 'How does AES-GCM prevent padding oracle attacks?',
          answer: 'AES-GCM verifies the GMAC authentication tag before attempting any decryption, rejecting tampered ciphertexts immediately.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'modes-ask',
    kind: 'ask-the-room',
    title: 'Check Your Mode Selection Judgment',
    subtitle: 'Real-World System Architecture',
    caption: 'You are designing the encrypted storage layer for a high-performance database where threads read and write 4 KB sectors at random offsets.',
    eli5Caption: 'Which mode lets you jump straight to byte 5,000 without reading bytes 0 to 4,999 first?',
    askTheRoom: {
      question: 'Which block cipher mode is best suited for encrypting random-access disk blocks with zero read latency and multi-threaded parallel execution?',
      options: [
        'A. CBC mode, because each sector is chained securely.',
        'B. CTR mode (or XTS mode), because block i can be computed directly as Nonce + i in parallel.',
        'C. ECB mode, because it requires no IV.',
        'D. CFB mode with 8-bit shift registers.'
      ],
      correctIndex: 1,
      explanation: 'CTR mode (and its disk-encryption derivative XTS-AES) enables O(1) random-access seeking because keystream blocks are generated directly from the block index counter.'
    },
    speakerNotes: {
      script: 'Highlight that full-disk encryption systems like BitLocker, FileVault, and dm-crypt use XTS-AES (based on CTR principles) for this exact random-access reason.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'modes-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Modes of Operation',
    caption: 'Formulas for ECB, CBC, CFB, OFB, CTR, and error propagation rules.',
    eli5Caption: 'The exact formulas and bullet points examiners look for.',
    speakerNotes: {
      script: 'Ensure students memorize the equations: CBC encryption C_i = E_K(P_i ⊕ C_{i-1}) and decryption P_i = D_K(C_i) ⊕ C_{i-1}. This is the most frequently tested formula in CNS exams.',
      likelyQuestions: [
        {
          question: 'What is the error propagation in OFB mode?',
          answer: 'A 1-bit error in ciphertext C_i corrupts only the corresponding 1 bit in plaintext P_i. Zero error propagation.'
        }
      ]
    },
    examWords: {
      term: 'Block Cipher Modes of Operation',
      definition: 'Standard algorithms (NIST SP 800-38A) for applying a fixed-length symmetric block cipher to arbitrary-length data streams: ECB, CBC, CFB, OFB, and CTR.',
      keywords: [
        'Electronic Codebook (ECB)',
        'Cipher Block Chaining (CBC)',
        'Cipher Feedback (CFB)',
        'Output Feedback (OFB)',
        'Counter Mode (CTR)',
        'Initialization Vector (IV)',
        'Error Propagation',
        'Padding Oracle Attack (PKCS#7)'
      ],
      mustRememberPoints: [
        'ECB mode leaks statistical patterns (the ECB penguin) because identical plaintext blocks produce identical ciphertext blocks.',
        'CBC requires a random, unpredictable IV and chains blocks: C_i = E(K, P_i ⊕ C_{i-1}); decryption: P_i = D(K, C_i) ⊕ C_{i-1}.',
        'CTR mode converts a block cipher into a stream cipher via C_i = P_i ⊕ E(K, Nonce || i); it supports parallel encryption, parallel decryption, and random access.'
      ],
      typicalMarks: 5
    }
  }
]

export const modesPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'modes',
  topicTitle: 'Modes of Operation (ECB, CBC, CFB, OFB, CTR)',
  targetDurationMinutes: 10,
  plates: modesPlates
}
