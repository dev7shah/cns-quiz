import { Plate, TopicPresentation } from "@/lib/present/types"

export const macHmacPlates: Plate[] = [
  // 1. Hook: The Naive Hashing Trap
  {
    id: 'mac-hmac-hook',
    kind: 'hook',
    title: 'The Naive Hashing Trap',
    subtitle: 'Why H(Key || Message) is Catastrophically Broken',
    caption: 'Appending a secret key to a message before hashing seems secure, but Merkle-Damgård constructions allow attackers to forge valid signatures via Length Extension Attacks.',
    eli5Caption: 'Like handing someone an unsealed envelope with a signature at the bottom: they can write whatever they want on the blank space above.',
    speakerNotes: {
      script: 'In 2009, Flickr’s API was hacked because they used Naive MAC: hash("secret_api_key" + "action=download"). Attackers exploited Merkle-Damgård state resumption to append "&admin=1" without knowing the secret key! This is why RFC 2104 invented HMAC.',
      likelyQuestions: [
        {
          question: 'Why does length extension work on naive H(Key || Message)?',
          answer: 'Because the hash output of a Merkle-Damgård hash (MD5, SHA-1, SHA-256) is exactly the internal state of the compression function after processing the final block. Anyone can initialize the engine with that state and feed in extra blocks!'
        }
      ]
    }
  },

  // 2. Process: HMAC RFC 2104 Architecture
  {
    id: 'mac-hmac-process',
    kind: 'process',
    title: 'HMAC Structure & The Nested Barrier',
    subtitle: 'RFC 2104 Nested Hashing Construction',
    caption: 'HMAC wraps the message in two layers of hashing using ipad (0x36) and opad (0x5C) to permanently defeat length extension attacks.',
    eli5Caption: 'Mix the key with pattern A, hash it with the letter; then mix the key with pattern B, and hash the first hash!',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Walk through the formula: HMAC(K, M) = H((K^+ ⊕ opad) || H((K^+ ⊕ ipad) || M)). K^+ is key padded with zeros to block size B (64 bytes for SHA-256). ipad is 0x36 repeated B times; opad is 0x5C repeated B times. The outer hash conceals the inner compression state.',
      likelyQuestions: [
        {
          question: 'Why 0x36 and 0x5C specifically?',
          answer: 'They have a Hamming distance of 4 bits (half their bits differ: 00110110 vs 01011100), ensuring the inner and outer keys are cryptographically uncorrelated.'
        }
      ]
    }
  },

  // 3. Comparison: HMAC vs CBC-MAC / CMAC
  {
    id: 'mac-hmac-compare',
    kind: 'compare',
    title: 'MAC Primitives Comparison',
    subtitle: 'HMAC (Hash-Based) vs CBC-MAC / CMAC (Block Cipher-Based)',
    caption: 'Choosing between hash-based and block cipher-based authenticators across hardware and software platforms.',
    eli5Caption: 'HMAC builds on fast hash engines like SHA-256; CMAC builds on AES block encryption hardware.',
    comparison: {
      leftTitle: 'HMAC (RFC 2104)',
      rightTitle: 'CMAC / AES-CBC-MAC (NIST SP 800-38B)',
      differences: [
        {
          feature: 'Underlying Cryptographic Engine',
          left: 'Cryptographic hash functions (SHA-256, SHA-512, SHA-3)',
          right: 'Symmetric block ciphers (AES-128, AES-256)'
        },
        {
          feature: 'Variable-Length Message Security',
          left: 'Secure against length extension by nested design',
          right: 'Naive CBC-MAC fails on variable lengths; CMAC fixes this via subkeys K1, K2'
        },
        {
          feature: 'Hardware Acceleration',
          left: 'Fast software speed; Intel SHA extensions',
          right: 'Fast hardware acceleration via AES-NI instructions'
        },
        {
          feature: 'Common Use Cases',
          left: 'TLS record layer, API tokens, JWT signatures, AWS S3 auth',
          right: 'Automotive CAN bus security, smart cards, banking EMV chips'
        }
      ],
      summaryTakeaway: 'Both provide provable message authentication; HMAC is the software standard for web APIs, while CMAC excels on embedded microcontrollers with AES hardware.'
    },
    speakerNotes: {
      script: 'Highlight the difference on variable length: Raw CBC-MAC is only secure for fixed-length messages. If variable length is permitted, CBC-MAC is trivially forgeable! NIST created CMAC (Cipher-based MAC) using subkeys K1 and K2 for the final block to solve this.',
      likelyQuestions: []
    }
  },

  // 4. Attack & Defense: Timing Attacks on MAC Verification
  {
    id: 'mac-hmac-timing-attack',
    kind: 'attack-defense',
    title: 'The Lethal Side-Channel: Timing Attacks on MACs',
    subtitle: 'Why if (receivedMac === computedMac) Destroys Security',
    caption: 'Standard string equality returns false on the very first mismatched byte. An attacker measuring execution time in nanoseconds guesses the MAC byte-by-byte.',
    eli5Caption: 'If a lock clicks 1 millisecond faster when the first digit is wrong, a thief can listen with a stopwatch and crack the combination.',
    attackDefense: {
      attackName: 'MAC Timing Side-Channel Attack (Crosby et al.)',
      normalFlowDescription: 'Server computes expected MAC and compares with client’s tag using normal string comparison (=== or strcmp).',
      attackFlowDescription: 'Attacker sends tags with varying first bytes. The byte that takes 5 microseconds longer was matched! Repeat for all 32 bytes.',
      defenseFlowDescription: 'Always use constant-time comparison (crypto.timingSafeEqual or bitwise OR accumulator across all bytes regardless of mismatches).'
    },
    speakerNotes: {
      script: 'Show students what constant-time comparison looks like: let diff = 0; for (let i = 0; i < len; i++) diff |= a[i] ^ b[i]; return diff === 0; Every security library (Node.js crypto.timingSafeEqual, Web Crypto) provides this primitive.',
      likelyQuestions: [
        {
          question: 'Can timing attacks really be executed over the internet?',
          answer: 'Yes! Crosby et al. demonstrated remote timing attacks over local and wide-area networks by statistical averaging over 100,000 queries.'
        }
      ]
    }
  },

  // 5. Worked Example: Step-by-Step HMAC Computation
  {
    id: 'mac-hmac-worked',
    kind: 'worked-example',
    title: 'Worked Example: HMAC-SHA256 Derivation',
    subtitle: 'Tracing RFC 2104 Operations with Byte Values',
    caption: 'Demonstrating key normalization, ipad/opad XOR masking, and nested hash passes.',
    eli5Caption: 'Watch how key "key" is stretched, masked, and hashed twice.',
    workedExample: {
      problem: 'Compute HMAC-SHA256 for key "secret" and message "hi" using block size B = 64 bytes (512 bits) and RFC 2104 constants.',
      given: {
        'Key (K)': '"secret" (6 bytes)',
        'Block Size (B)': '64 bytes (512 bits)',
        'Message (M)': '"hi" (2 bytes)',
        'Inner Pad (ipad)': '0x36 (repeated 64 times)',
        'Outer Pad (opad)': '0x5C (repeated 64 times)'
      },
      steps: [
        {
          label: 'Key Normalization & Zero-Padding (K+)',
          formula: 'len(K) <= B  =>  K+ = K || 0x00...00',
          substitution: '0x736563726574 followed by 58 zero bytes',
          result: 'K+ (64 bytes)',
          note: 'If len(K) > 64, key is pre-hashed: K+ = H(K) || zeros.'
        },
        {
          label: 'Inner Mask XOR: K+ ⊕ ipad',
          formula: 'S_i = K+ ⊕ (0x36 repeated 64 times)',
          substitution: '0x73^0x36, 0x65^0x36, 0x63^0x36, ..., 0x00^0x36',
          result: 'S_i = 0x4553554453423636...',
          note: 'ipad ensures inner key is bit-flipped by 00110110.'
        },
        {
          label: 'Inner Hash: H(S_i || Message)',
          formula: 'InnerDigest = SHA256(S_i || M)',
          substitution: 'SHA256(S_i || 0x6869)',
          result: '32-byte intermediate digest',
          note: 'Produces a fixed 256-bit intermediate digest.'
        },
        {
          label: 'Outer Mask XOR & Outer Hash',
          formula: 'Final HMAC = SHA256((K+ ⊕ opad) || InnerDigest)',
          substitution: 'SHA256((K+ ⊕ 0x5C...5C) || InnerDigest)',
          result: 'Final HMAC (32 bytes = 256 bits)',
          note: 'Outer hash seals the digest, completely concealing inner state.'
        }
      ],
      finalAnswer: 'Final HMAC is 32 bytes (256 bits) immune to length extension.',
      checkVerification: 'Check: Hamming distance(ipad, opad) = 4 bits per byte; outer wrap defeats Merkle-Damgård state resumption.'
    },
    speakerNotes: {
      script: 'Review these 4 steps thoroughly. A classic 10-mark university question is: "Describe the steps involved in computing HMAC with a diagram and explain the role of ipad and opad."',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'mac-hmac-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for MAC and HMAC',
    caption: 'Essential formulas, padding constants, and defense mechanisms for examinations.',
    eli5Caption: 'The exact answers examiners expect on HMAC papers.',
    speakerNotes: {
      script: 'Ensure students write down: ipad = 0x36, opad = 0x5C, B = block size (64 bytes for SHA-256, 128 bytes for SHA-512). These specific constants earn full marks.',
      likelyQuestions: [
        {
          question: 'What happens if the secret key is longer than the hash block size B?',
          answer: 'The key is pre-hashed: K = H(K), reducing it to L bytes (e.g. 32 bytes for SHA-256), then padded with zeros to B bytes.'
        }
      ]
    },
    examWords: {
      term: 'HMAC (Keyed-Hash Message Authentication Code)',
      definition: 'A cryptographic message authentication code utilizing a cryptographic hash function in combination with a shared secret key via nested hashing (RFC 2104).',
      keywords: [
        'RFC 2104',
        'Inner Pad (ipad = 0x36)',
        'Outer Pad (opad = 0x5C)',
        'Length Extension Attack',
        'Constant-Time Comparison',
        'Key Normalization (K+)',
        'Timing Side-Channel'
      ],
      mustRememberPoints: [
        'HMAC formula: HMAC(K, M) = H((K+ ⊕ opad) || H((K+ ⊕ ipad) || M)).',
        'Inner pad ipad is 0x36 repeated B times; outer pad opad is 0x5C repeated B times (B = 64 bytes for SHA-256).',
        'HMAC is provably immune to length extension attacks because the outer hash encapsulates and hides the internal compression state.'
      ],
      typicalMarks: 5
    }
  }
]

export const macHmacPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'mac-hmac',
  topicTitle: 'MAC and HMAC',
  targetDurationMinutes: 10,
  plates: macHmacPlates
}
