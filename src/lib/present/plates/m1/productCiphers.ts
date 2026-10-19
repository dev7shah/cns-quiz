import { Plate, TopicPresentation } from "@/lib/present/types"

export const productCiphersPlates: Plate[] = [
  // 1. Hook
  {
    id: 'product-hook',
    kind: 'hook',
    title: 'Why Classical Ciphers Failed & How Modern Ones Survived',
    subtitle: 'Claude Shannon’s Breakthrough: Confusion and Diffusion',
    caption: 'Substitution alone preserves statistical structure. Transposition alone preserves letter counts. What happens when you alternate them?',
    eli5Caption: 'Mixing colors makes a pattern; stirring it blurs the pattern. Alternate mixing and stirring until nothing can be traced.',
    speakerNotes: {
      script: 'In 1949, Claude Shannon published "Communication Theory of Secrecy Systems", introducing the twin concepts that form the architectural backbone of every modern cipher from DES and AES to SHA: Confusion and Diffusion.',
      likelyQuestions: [
        {
          question: 'Can you achieve high security by repeating substitution multiple times in a row?',
          answer: 'No. Cascading multiple simple substitutions simply yields another single substitution (closure under composition). You must alternate between substitution and permutation.'
        }
      ]
    }
  },

  // 2. Analogy / Concept: Confusion and Diffusion
  {
    id: 'product-analogy',
    kind: 'analogy',
    title: 'The Recipe: Dice, Then Stir',
    subtitle: 'Physical Intuition for S-P Networks',
    caption: 'Substitution replaces letters (dicing the ingredients). Permutation shuffles their positions (stirring the pot thoroughly).',
    eli5Caption: 'Substitution hides what each letter means; permutation scatters them so they are no longer together.',
    speakerNotes: {
      script: 'Think of baking. Substitution replaces an ingredient with something unexpected (like salt with sugar). Permutation stirs the bowl so that every teaspoon contains traces of every ingredient. Repeating this produces a homogeneous, unbreakable mixture.',
      likelyQuestions: [
        {
          question: 'Which component provides non-linearity?',
          answer: 'Substitution boxes (S-boxes) provide non-linearity (confusion). Permutation boxes (P-boxes) provide linear bit diffusion.'
        }
      ]
    }
  },

  // 3. Concept: Shannon's Definitions
  {
    id: 'product-concept',
    kind: 'concept',
    title: 'Shannon’s Dual Principles: Confusion vs Diffusion',
    subtitle: 'Mathematical Definitions and Mechanisms',
    caption: 'Confusion obscures the link between Key and Ciphertext. Diffusion spreads plaintext statistics across all ciphertext bits.',
    eli5Caption: 'Confusion confuses the key detective; diffusion diffuses the letter frequency clues across the whole sentence.',
    comparison: {
      leftTitle: 'Confusion (S-Box)',
      rightTitle: 'Diffusion (P-Box)',
      differences: [
        {
          feature: 'Definition',
          left: 'Makes the relationship between ciphertext and the secret key as complex and non-linear as possible.',
          right: 'Spreads the statistical influence of each plaintext symbol across many ciphertext symbols.'
        },
        {
          feature: 'Primary Mechanism',
          left: 'Substitution (S-boxes, non-linear algebraic mappings, modular arithmetic).',
          right: 'Permutation (P-boxes, bit rotation, shift rows, matrix mixing).'
        },
        {
          feature: 'Attack Defeated',
          left: 'Deters algebraic solving of the secret key bits from observed ciphertext.',
          right: 'Eliminates frequency analysis, digraph tracking, and statistical profiling.'
        },
        {
          feature: 'Ideal Metric',
          left: 'Each ciphertext bit depends on every key bit in a complex, unpredictable way.',
          right: 'Changing 1 plaintext bit flips approximately 50% of the output ciphertext bits.'
        }
      ],
      summaryTakeaway: 'Confusion frustrates key search; diffusion dissolves plaintext statistical redundancy.'
    },
    speakerNotes: {
      script: 'Every student must memorize these exact definitions: Confusion frustrates attempts to discover the key. Diffusion dissipates the statistical structure of plaintext across the entire message.',
      likelyQuestions: [
        {
          question: 'What is the avalanche effect?',
          answer: 'The strict avalanche criterion (SAC) states that whenever a single input bit is complemented, each output bit must change with probability 0.5.'
        }
      ]
    }
  },

  // 4. Process: The S-P Product Cascade Scene
  {
    id: 'product-process',
    kind: 'process',
    title: 'The Substitution-Permutation Network (SPN)',
    subtitle: 'Cascading Rounds to Achieve the Avalanche Effect',
    caption: 'Round 1 substitutes then permutes; Round 2 repeats with a subkey; by Round 3, a 1-bit input change affects every output bit.',
    eli5Caption: 'Watch one tiny red dot spread out across all wires as it passes through the substitution and shuffle boxes.',
    scene: {
      id: 'scene-product-cipher-cascade',
      title: 'Substitution-Permutation Round Cascade',
      viewBox: '0 0 900 360',
      legend: ['Input Bits', 'S-Box (Confusion)', 'P-Box (Diffusion)', 'Round Subkey'],
      actors: [
        { id: 'client', kind: 'client', label: 'Plaintext Input', pos: { x: 100, y: 180 } },
        { id: 'router', kind: 'router', label: 'Round 1 (S-P)', pos: { x: 340, y: 180 } },
        { id: 'switch', kind: 'switch', label: 'Round 2 (S-P)', pos: { x: 580, y: 180 } },
        { id: 'server', kind: 'server', label: 'Ciphertext Out', pos: { x: 800, y: 180 } }
      ],
      objects: [
        { id: 'b1', kind: 'bits', label: '0110 1001', at: { x: 100, y: 180 }, tone: 'info' },
        { id: 'k1', kind: 'key-shared', label: 'Subkey K1', at: { x: 340, y: 80 }, tone: 'warn' },
        { id: 'k2', kind: 'key-shared', label: 'Subkey K2', at: { x: 580, y: 80 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Plaintext input block of bits enters the first round of the product cipher.',
          eli5: '8 bits of data arrive at the first processing stage.',
          actions: [
            { do: 'highlight', target: ['b1'], tone: 'info' },
            { do: 'say', actor: 'client', text: 'Input: 0110 1001' }
          ]
        },
        {
          caption: 'Stage 1 (Confusion): Bits pass through parallel non-linear S-boxes parameterized by Round Key K1.',
          eli5: 'Each nibble is swapped for another using a secret table.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 340, y: 180 } },
            { do: 'transform', obj: 'b1', into: { label: 'S-Box Out: 1101 0010', tone: 'signal' } },
            { do: 'pulse', target: 'b1' }
          ]
        },
        {
          caption: 'Stage 2 (Diffusion): The bits are passed into a Permutation Box (P-Box), crossing wires across positions.',
          eli5: 'The wire paths criss-cross so each bit goes to a different place.',
          actions: [
            { do: 'transform', obj: 'b1', into: { label: 'P-Box Out: 1010 1100', tone: 'warn' } },
            { do: 'say', actor: 'router', text: 'Wires crossed & shuffled!' }
          ]
        },
        {
          caption: 'Round 2 repeats the process: Subkey K2 is injected, followed by a second non-linear S-box substitution.',
          eli5: 'Second round substitutes and mixes again with key 2.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 580, y: 180 } },
            { do: 'transform', obj: 'b1', into: { label: 'Round 2 Out: 1001 0111', tone: 'signal' } },
            { do: 'pulse', target: 'b1' }
          ]
        },
        {
          caption: 'Final Ciphertext is output. Shannon\'s product construction guarantees that every bit depends on every input bit.',
          eli5: 'The output bits are completely scrambled with no statistical pattern.',
          actions: [
            { do: 'move', obj: 'b1', to: { x: 800, y: 180 } },
            { do: 'transform', obj: 'b1', into: { kind: 'cipher', label: 'Cipher: 1001 0111', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'b1'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Avalanche achieved!' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Observe how a product cipher works. If you only perform substitution, an attacker can analyze frequency. If you only permute, the count of each symbol remains identical. Alternating S and P boxes across multiple rounds dissolves all statistical redundancy.',
      likelyQuestions: [
        {
          question: 'How many rounds are typically needed in modern ciphers?',
          answer: 'DES uses 16 Feistel rounds. AES uses 10, 12, or 14 rounds depending on key length (128, 192, 256 bits).'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'product-ask',
    kind: 'ask-the-room',
    title: 'Check Your Understanding: Pure Substitution Product',
    subtitle: 'Mathematical Properties of Ciphers',
    caption: 'Suppose a developer builds a "super cipher" by chaining 5 Caesar ciphers in series: C = E_k5(E_k4(E_k3(E_k2(E_k1(P))))). How strong is it?',
    eli5Caption: 'If you shift the alphabet by 3, then shift by 5, then shift by 2, is it five times safer?',
    askTheRoom: {
      question: 'What is the effective keyspace of a system composed of 5 consecutive Caesar ciphers with keys k1, k2, k3, k4, k5?',
      options: [
        'A. 25⁵ = 9,765,625 possible keys, making brute-force attack impossible by hand.',
        'B. Only 25 distinct effective keys! The set of Caesar shifts forms an algebraic group under composition.',
        'C. Exactly 5 × 25 = 125 keys.',
        'D. Unbreakable because it forms a 5-round Feistel product network.'
      ],
      correctIndex: 1,
      explanation: 'Correct! Chaining substitutions without intermediate permutations or non-linear mixing collapses to a single Caesar cipher with key K_eff = (∑ k_i) mod 26.'
    },
    speakerNotes: {
      script: 'This is a favorite university exam question. It tests whether students understand why product ciphers must interleave DIFFERENT types of transformations (substitution AND permutation), rather than repeating the same operation.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'product-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Product Ciphers',
    caption: 'Definitions of confusion, diffusion, S-box, P-box, SPN, and the avalanche effect.',
    eli5Caption: 'The exact phrasing professors look for on semester exams.',
    speakerNotes: {
      script: 'Emphasize to students that confusion and diffusion are Claude Shannon’s two foundational principles. In exams, questions regularly ask for their definitions and mechanisms (S-box vs P-box).',
      likelyQuestions: [
        {
          question: 'What is the most common student error on product ciphers?',
          answer: 'Confusing the roles of S-boxes (which provide non-linear confusion) and P-boxes (which provide linear bit diffusion).'
        }
      ]
    },
    examWords: {
      term: 'Product Cipher (Confusion & Diffusion)',
      definition: 'A cipher that cascades alternating stages of substitution (confusion) and permutation (diffusion) across multiple rounds to defeat statistical and algebraic cryptanalysis.',
      keywords: [
        'Product Cipher',
        'Claude Shannon (1949)',
        'Confusion (S-Box)',
        'Diffusion (P-Box)',
        'Substitution-Permutation Network (SPN)',
        'Strict Avalanche Criterion (SAC)',
        'Bit Permutation',
        'Round Function',
        'Algebraic Closure Under Composition'
      ],
      mustRememberPoints: [
        'Confusion hides the relationship between the key and the ciphertext, achieved primarily through non-linear substitution (S-boxes).',
        'Diffusion hides the statistical structure of the plaintext, achieved through transposition or bit permutations (P-boxes).',
        'A product cipher chains alternating stages of substitution and permutation across multiple rounds so that every ciphertext bit depends on every plaintext bit and every key bit (Avalanche effect).'
      ],
      typicalMarks: 5
    }
  }
]

export const productCiphersPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'product-ciphers',
  topicTitle: 'Product Ciphers (Confusion & Diffusion)',
  targetDurationMinutes: 10,
  plates: productCiphersPlates
}
