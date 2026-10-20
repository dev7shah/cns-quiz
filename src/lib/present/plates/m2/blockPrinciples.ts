import { Plate, TopicPresentation } from "@/lib/present/types"

export const blockPrinciplesPlates: Plate[] = [
  // 1. Hook
  {
    id: 'block-principles-hook',
    kind: 'hook',
    title: 'Stream vs Block: The Architecture of Modern Ciphers',
    subtitle: 'From Continuous Keystreams to Rigid Fixed Blocks',
    caption: 'Stream ciphers encrypt bit-by-bit in real time; block ciphers transform fixed-size chunks of data as a single unit.',
    eli5Caption: 'Stream is like a garden hose spraying paint letter-by-letter; block is like a printing press stamping a whole page.',
    speakerNotes: {
      script: 'Welcome to Module 2. Modern symmetric cryptography splits into two core paradigms: stream ciphers (like RC4 or ChaCha20) which operate on single bits or bytes using pseudorandom keystreams, and block ciphers (like DES and AES) which process fixed blocks of data, typically 64 or 128 bits.',
      likelyQuestions: [
        {
          question: 'Which is faster: stream ciphers or block ciphers?',
          answer: 'Stream ciphers are generally faster in software and have lower hardware gate requirements, but block ciphers provide greater versatility across modes of operation.'
        }
      ]
    }
  },

  // 2. Analogy / Concept
  {
    id: 'block-principles-analogy',
    kind: 'analogy',
    title: 'The Assembly Line vs The Freight Container',
    subtitle: 'Stream vs Block Intuition',
    caption: 'Stream ciphers process items on a conveyor belt; block ciphers fill a standard shipping container before sealing.',
    eli5Caption: 'A conveyor belt inspects each apple one-by-one; a container must be packed full before it can be locked and shipped.',
    comparison: {
      leftTitle: 'Stream Ciphers (e.g. ChaCha20)',
      rightTitle: 'Block Ciphers (e.g. AES)',
      differences: [
        {
          feature: 'Processing Unit',
          left: 'Continuous bit or byte at a time',
          right: 'Fixed-size block (typically 64 or 128 bits)'
        },
        {
          feature: 'Memory / Buffer Requirement',
          left: 'Minimal; no buffer needed before transmission',
          right: 'Must buffer the entire block before encryption'
        },
        {
          feature: 'Error Propagation',
          left: '1-bit channel error corrupts only that 1 bit in plaintext',
          right: '1-bit channel error corrupts entire block in ECB/CBC'
        },
        {
          feature: 'Padding Requirement',
          left: 'No padding needed; matches exact message length',
          right: 'Mandatory padding (PKCS#7) to reach full block size'
        }
      ],
      summaryTakeaway: 'Choose stream for low-latency streaming audio/video; choose block for authenticated files and databases.'
    },
    speakerNotes: {
      script: 'Notice the architectural difference. A stream cipher requires no padding and has no latency because it XORs bits immediately. A block cipher must wait for 128 bits to accumulate and requires padding if the input length is not a multiple of 16 bytes.',
      likelyQuestions: [
        {
          question: 'What happens if a message has 15 bytes in AES-128?',
          answer: 'It must be padded with 1 byte of value 0x01 according to PKCS#7 to complete the 16-byte block.'
        }
      ]
    }
  },

  // 3. Process: Block Cipher Design Criteria Scene
  {
    id: 'block-principles-process',
    kind: 'process',
    title: 'Block Cipher Design Criteria',
    subtitle: 'Claude Shannon’s Twin Pillars in Hardware',
    caption: 'A secure block cipher combines non-linear S-boxes (confusion) with bit transpositions (diffusion) across multiple rounds.',
    eli5Caption: 'Each round stirs the pot and swaps the ingredients so every single output bit depends on every single input bit.',
    scene: {
      id: 'scene-block-design-criteria',
      title: 'Block Cipher Round Composition',
      viewBox: '0 0 900 360',
      legend: ['Input Block (128-bit)', 'Round Function F', 'Subkey Injection', 'Output Block'],
      actors: [
        { id: 'client', kind: 'client', label: 'Plaintext (128b)', pos: { x: 100, y: 180 } },
        { id: 'router', kind: 'router', label: 'Round 1 (S-P)', pos: { x: 340, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'Round N (S-P)', pos: { x: 580, y: 180 } },
        { id: 'server', kind: 'server', label: 'Ciphertext (128b)', pos: { x: 800, y: 180 } }
      ],
      objects: [
        { id: 'b1', kind: 'bits', label: '128-bit Block', at: { x: 100, y: 180 }, tone: 'info' },
        { id: 'k1', kind: 'key-shared', label: 'Round Key K1', at: { x: 340, y: 80 }, tone: 'warn' },
        { id: 'kN', kind: 'key-shared', label: 'Round Key Kn', at: { x: 580, y: 80 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'A 128-bit plaintext block enters the cipher pipeline.',
          eli5: 'A fixed 16-byte block arrives at the entrance of the cipher.',
          actions: [
            { do: 'highlight', target: ['b1'], tone: 'info' },
            { do: 'say', actor: 'client', text: '128-bit chunk ready' }
          ]
        },
        {
          caption: 'Round 1 injects Subkey K1 and applies non-linear substitution (confusion) followed by permutation (diffusion).',
          eli5: 'First round mixes the secret key and shuffles all bits.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 340, y: 180 } },
            { do: 'transform', obj: 'b1', into: { label: 'Round 1 State', tone: 'signal' } },
            { do: 'pulse', target: 'b1' }
          ]
        },
        {
          caption: 'Multiple rounds repeat this transformation, creating the Strict Avalanche Criterion (SAC).',
          eli5: 'Every round multiplies the scrambling effect exponentially.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 580, y: 180 } },
            { do: 'transform', obj: 'b1', into: { label: 'Round N State', tone: 'warn' } },
            { do: 'pulse', target: 'b1' }
          ]
        },
        {
          caption: 'The final 128-bit ciphertext block is produced. Flipping any 1 input bit flips 50% of these output bits.',
          eli5: 'The output looks like pure random noise with zero trace of the input.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 800, y: 180 } },
            { do: 'transform', obj: 'b1', into: { kind: 'cipher', label: 'Ciphertext Block', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'b1'], tone: 'ok' },
            { do: 'say', actor: 'server', text: '50% bits flipped!' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Emphasize the design criteria: 1) Block size: 64-bit is obsolete (vulnerable to Birthday collision attacks like Sweet32), 128-bit is current standard. 2) Key size: 128 bits minimum. 3) Number of rounds: enough to achieve complete avalanche.',
      likelyQuestions: [
        {
          question: 'Why is 64-bit block size considered obsolete today?',
          answer: 'By the Birthday Paradox, after encrypting 2^32 blocks (only 32 GB of data), block collisions occur with probability 50%, enabling collision attacks like Sweet32 on 3DES and Blowfish.'
        }
      ]
    }
  },

  // 4. Ask the room
  {
    id: 'block-principles-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Stream vs Block Cipher Trade-offs',
    caption: 'An embedded microcontroller in a pacemaker has only 2 KB of RAM and must stream vital signs in real time.',
    eli5Caption: 'Which cipher type would you pick for a tiny heart sensor with almost no memory?',
    askTheRoom: {
      question: 'Which cipher architecture is best suited for an ultra-low-latency sensor with minimal RAM buffer capacity?',
      options: [
        'A. Block cipher in ECB mode with 128-bit blocks, because ECB needs no IV.',
        'B. Stream cipher (or a block cipher in CTR mode), because it encrypts byte-by-byte with zero buffering delay.',
        'C. 3DES in CBC mode with 3 keys.',
        'D. RSA-4096 public key encryption.'
      ],
      correctIndex: 1,
      explanation: 'Stream ciphers (or block ciphers operating in CTR mode as stream ciphers) eliminate block buffering and padding delays, making them ideal for constrained real-time sensors.'
    },
    speakerNotes: {
      script: 'Students should realize that operating modes like CTR transform block ciphers into stream ciphers, combining block security with stream efficiency.',
      likelyQuestions: []
    }
  },

  // 5. Exam Words
  {
    id: 'block-principles-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Block Cipher Principles',
    caption: 'Definitions of block size, key length, round functions, and the birthday bound.',
    eli5Caption: 'The exact definitions and comparisons needed for full marks.',
    speakerNotes: {
      script: 'Review these bullet points with the class. Examiners frequently ask for a 5-mark comparison between stream and block ciphers.',
      likelyQuestions: [
        {
          question: 'What is the Sweet32 attack?',
          answer: 'A birthday attack exploiting 64-bit block ciphers (like 3DES and Blowfish) in CBC mode to recover plaintext after 2^32 blocks.'
        }
      ]
    },
    examWords: {
      term: 'Block Cipher Design Principles',
      definition: 'A symmetric cryptosystem that maps an n-bit plaintext block to an n-bit ciphertext block under a k-bit key via an iterated sequence of substitution-permutation rounds.',
      keywords: [
        'Block Cipher',
        'Stream Cipher',
        'Block Size (64-bit vs 128-bit)',
        'Key Length (128, 192, 256 bits)',
        'Strict Avalanche Criterion (SAC)',
        'Bit Independence Criterion (BIC)',
        'Birthday Bound (2^(n/2))'
      ],
      mustRememberPoints: [
        'Block ciphers process fixed-size chunks (typically 128 bits in modern ciphers like AES) and require padding (PKCS#7).',
        'Stream ciphers generate a pseudorandom keystream and XOR it bit-by-bit or byte-by-byte with zero buffering delay.',
        'A 64-bit block size is obsolete due to the Birthday collision bound at 2^32 blocks (Sweet32 attack); modern standards mandate 128-bit blocks.'
      ],
      typicalMarks: 5
    }
  }
]

export const blockPrinciplesPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'block-principles',
  topicTitle: 'Block Cipher Design Principles',
  targetDurationMinutes: 10,
  plates: blockPrinciplesPlates
}
