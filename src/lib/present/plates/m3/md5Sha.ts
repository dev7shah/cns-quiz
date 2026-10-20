import { Plate, TopicPresentation } from "@/lib/present/types"

export const md5ShaPlates: Plate[] = [
  // 1. Hook: The Flame Cyber-Weapon
  {
    id: 'md5-sha-hook',
    kind: 'hook',
    title: 'The Flame Malware & The Death of MD5',
    subtitle: 'How an MD5 Collision Forged Microsoft Code-Signing Certificates',
    caption: 'In 2012, state-sponsored malware "Flame" used an MD5 chosen-prefix collision to forge a fake Microsoft Terminal Server certificate, turning rogue computers into trusted Windows Update servers.',
    eli5Caption: 'Spies found two different digital papers with the exact same stamp, tricking millions of computers into installing viruses thinking they were official Windows updates.',
    speakerNotes: {
      script: 'Start with the history: MD5 was designed by Ron Rivest in 1991. In 2004, Xiaoyun Wang published practical differential collision attacks. In 2008, security researchers used MD5 collisions to create a rogue CA certificate. In 2012, Flame weaponized it in the wild.',
      likelyQuestions: [
        {
          question: 'Is MD5 still safe for checksums or password storage?',
          answer: 'Never! For passwords, use Argon2 or bcrypt. For checksums, use SHA-256 or BLAKE3. MD5 collisions can be generated in seconds on a laptop.'
        }
      ]
    }
  },

  // 2. Process: Merkle-Damgård Construction
  {
    id: 'md5-sha-merkle-damgard',
    kind: 'process',
    title: 'The Merkle-Damgård Construction',
    subtitle: 'The Classic Architecture of MD5, SHA-1, and SHA-2',
    caption: 'Arbitrary-length messages are padded, split into fixed 512-bit blocks, and fed sequentially into an iterative compression function f.',
    eli5Caption: 'Chop the bread into uniform slices, mix slice 1 with the starter, mix the result with slice 2, until you have the final crust.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Explain the 3 steps: 1. Padding: Append a single 1-bit (0x80), follow with zeros until message length ≡ 448 mod 512, then append 64-bit original message length. 2. Initialization vector IV. 3. Iterative compression function f(H_{i-1}, M_i) using Davies-Meyer feedforward.',
      likelyQuestions: [
        {
          question: 'What is the Davies-Meyer construction?',
          answer: 'It uses a block cipher E: H_i = E(M_i, H_{i-1}) ⊕ H_{i-1}. The XOR feedforward ensures the compression function is non-invertible.'
        }
      ]
    }
  },

  // 3. Process: SHA-3 Sponge Construction (Keccak)
  {
    id: 'md5-sha-sponge',
    kind: 'process',
    title: 'SHA-3: The Sponge Revolution (Keccak)',
    subtitle: 'Departing from Merkle-Damgård to Sponge Architecture',
    caption: 'NIST selected Keccak as SHA-3 to introduce architectural diversity: data is absorbed into a bitrate state (r), permuted by Keccak-f[1600], and squeezed out.',
    eli5Caption: 'A sponge: soak up (absorb) all the message juice, squeeze out only the exact number of flavor drops you want.',
    customFigure: 'BitStrip',
    speakerNotes: {
      script: 'Explain why SHA-3 is completely different: It does not use Merkle-Damgård or Davies-Meyer. State is 1600 bits arranged as a 5x5 array of 64-bit lanes. Bitrate r is absorbed; capacity c provides security against length extension. Because capacity c is never exposed to output, SHA-3 is immune to length extension by design without needing HMAC!',
      likelyQuestions: [
        {
          question: 'Does SHA-3 require HMAC for message authentication?',
          answer: 'No! You can simply compute KMAC(Key, Message) because sponge functions are naturally immune to length extension.'
        }
      ]
    }
  },

  // 4. Comparison: MD5 vs SHA-1 vs SHA-2 vs SHA-3
  {
    id: 'md5-sha-compare',
    kind: 'compare',
    title: 'Hash Families Comprehensive Comparison',
    subtitle: 'MD5 vs SHA-1 vs SHA-2 (SHA-256) vs SHA-3 (Keccak-256)',
    caption: 'Evolution of digest sizes, internal constructions, collision security, and current status.',
    eli5Caption: 'MD5 and SHA-1 are broken relics of the 1990s; SHA-256 and SHA-3 are the impenetrable standards protecting the modern internet.',
    comparison: {
      leftTitle: 'Legacy Hashes (MD5 / SHA-1)',
      rightTitle: 'Modern Standards (SHA-256 / SHA3-256)',
      differences: [
        {
          feature: 'Output Digest Length',
          left: 'MD5: 128 bits; SHA-1: 160 bits',
          right: 'SHA-256: 256 bits; SHA3-256: 256 bits'
        },
        {
          feature: 'Internal Construction',
          left: 'Merkle-Damgård with custom compression',
          right: 'SHA-256: Merkle-Damgård; SHA-3: Keccak Sponge (r=1088, c=512)'
        },
        {
          feature: 'Collision Resistance Status',
          left: 'Completely Broken (Wang 2004, Google SHAttered 2017)',
          right: 'Secure (Theoretical & practical collision resistance intact)'
        },
        {
          feature: 'Length Extension Vulnerability',
          left: 'Vulnerable on naive H(K || M)',
          right: 'SHA-256: Vulnerable (use HMAC); SHA-3: Naturally immune'
        }
      ],
      summaryTakeaway: 'Never use MD5 or SHA-1 in new applications. Use SHA-256 for standard TLS and crypto; use SHA-3 when sponge capabilities or non-M-D design are beneficial.'
    },
    speakerNotes: {
      script: 'Review the SHAttered attack (2017): Google and CWI Amsterdam produced two valid PDF documents with completely different contents that produced the exact same SHA-1 hash, costing ~9 quintillion SHA-1 computations (equivalent to 110 GPU-years).',
      likelyQuestions: []
    }
  },

  // 5. Worked Example: Merkle-Damgård 512-Bit Block Padding
  {
    id: 'md5-sha-worked',
    kind: 'worked-example',
    title: 'Worked Example: SHA-256 Message Padding',
    subtitle: 'Padding "abc" into Exactly One 512-Bit Block',
    caption: 'Calculating the exact hex representation of message bytes, 0x80 pad bit, zero bytes, and 64-bit big-endian length.',
    eli5Caption: 'Watch how three small letters "a-b-c" are expanded to fill a complete 64-byte block.',
    workedExample: {
      problem: 'Trace Merkle-Damgård block padding for message "abc" (3 ASCII characters = 24 bits) into a 512-bit block for SHA-256.',
      given: {
        'Message (M)': '"abc" (0x61, 0x62, 0x63)',
        'Bit Length (L)': '24 bits (3 bytes)',
        'Block Size (B)': '512 bits (64 bytes)',
        'Target Pad Bound': '448 bits (56 bytes)'
      },
      steps: [
        {
          label: 'Append Pad Bit (0x80)',
          formula: 'M || 1-bit',
          substitution: '0x61 0x62 0x63 || 0x80 (10000000 in binary)',
          result: '4 bytes (32 bits)',
          note: 'A single 1-bit is appended immediately after message data.'
        },
        {
          label: 'Append Zero Bytes up to 448 Bits',
          formula: 'Pad with 0x00 until length ≡ 448 mod 512 bits (56 bytes)',
          substitution: '56 bytes - 4 bytes = 52 zero bytes',
          result: 'Append 52 zero bytes (0x00...0x00)',
          note: 'Leaves exactly 64 bits (8 bytes) at end of block for length field.'
        },
        {
          label: 'Append 64-Bit Message Length Field',
          formula: 'Original length L as 64-bit big-endian integer',
          substitution: '24 bits = 0x0000000000000018',
          result: '8 bytes (64 bits)',
          note: 'Stored as unsigned 64-bit big-endian integer.'
        },
        {
          label: 'Assemble Complete 512-Bit Block',
          formula: 'Block = Data (3B) + 0x80 (1B) + Zeros (52B) + Length (8B)',
          substitution: '3 + 1 + 52 + 8 = 64 bytes = 512 bits',
          result: 'Exactly 1 block of 64 bytes (512 bits)',
          note: 'Ready for round processing in SHA-256 compression function.'
        }
      ],
      finalAnswer: 'Exactly 1 block of 512 bits (64 bytes) produced with deterministic padding.',
      checkVerification: 'Check: 3 + 1 + 52 + 8 = 64 bytes = 512 bits ≡ 0 mod 512.'
    },
    speakerNotes: {
      script: 'This exact padding calculation appears in almost every university CNS examination. Make sure students know: 1. Why 448 bits? Because 512 - 64 = 448. 2. What if message is 448 bits? An entire extra 512-bit block is added!',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'md5-sha-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for MD5 and SHA Algorithms',
    caption: 'Essential technical specifications, round counts, and block sizes tested in exams.',
    eli5Caption: 'The exact numbers and block sizes needed for full marks.',
    speakerNotes: {
      script: 'Ensure students memorize the numbers: MD5 has 4 rounds of 16 steps (64 total), 128-bit digest. SHA-1 has 4 rounds of 20 steps (80 total), 160-bit digest. SHA-256 has 64 rounds, 256-bit digest. SHA-3 uses 24 rounds of Keccak-f[1600].',
      likelyQuestions: [
        {
          question: 'What is the role of W_t in SHA-256?',
          answer: 'The message schedule expands the sixteen 32-bit words of the 512-bit block into sixty-four 32-bit words (W_0 to W_63) using sigma functions.'
        }
      ]
    },
    examWords: {
      term: 'Secure Hash Algorithms (SHA Families)',
      definition: 'A family of cryptographic hash functions published by NIST: SHA-1 (160 bits, deprecated), SHA-2 (SHA-224/256/384/512, Merkle-Damgård), and SHA-3 (Keccak sponge function).',
      keywords: [
        'Merkle-Damgård Construction',
        'Davies-Meyer Feedforward',
        'Sponge Construction (Keccak)',
        'Bitrate (r) & Capacity (c)',
        'Padding (448 mod 512)',
        'SHAttered Collision Attack',
        'Message Schedule (W_t)'
      ],
      mustRememberPoints: [
        'MD5 produces a 128-bit digest from 512-bit blocks (4 rounds of 16 operations); it is broken by differential collision attacks.',
        'SHA-256 produces a 256-bit digest using 64 rounds with 512-bit blocks and Davies-Meyer feedforward: H_i = f(M_i, H_{i-1}) + H_{i-1}.',
        'SHA-3 uses a 1600-bit sponge state (Bitrate r + Capacity c); it operates in absorb and squeeze phases and is naturally immune to length extension.'
      ],
      typicalMarks: 5
    }
  }
]

export const md5ShaPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'md5-sha',
  topicTitle: 'MD5, SHA-1, SHA-2, SHA-3',
  targetDurationMinutes: 10,
  plates: md5ShaPlates
}
