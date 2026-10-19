import { Question, NumericQuestion } from "../types"

export const m1Questions: Question[] = [
  // 1. MCQ
  {
    id: 'm1-mcq-caesar-keyspace',
    type: 'mcq',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'classical'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In the classical Caesar shift cipher over the 26-letter English alphabet, how many cryptographically effective (non-trivial) keys exist?',
    options: [
      '26 keys, because there are 26 letters in the alphabet',
      '25 keys, because a shift of 0 (or 26) leaves the plaintext unchanged',
      '24 keys, excluding shifts 0 and 13 (ROT13)',
      'Infinite keys, because any integer can be used as a shift'
    ],
    answerIndex: 1,
    explanation: 'A shift of k = 0 (or any multiple of 26) is the identity transformation C = P mod 26, which performs zero encryption. Hence, only shifts 1 through 25 are effective keys.',
    replayStep: 1
  },

  // 2. MULTI
  {
    id: 'm1-multi-mono-weakness',
    type: 'multi',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Which of the following properties are TRUE regarding monoalphabetic substitution ciphers? (Select all that apply)',
    options: [
      'The size of the key space is 26! ≈ 4.03 × 10^26 keys.',
      'They eliminate single-letter frequency analysis completely.',
      'Each plaintext letter always maps to the same ciphertext letter throughout the message.',
      'Digram and trigram frequency patterns from the plaintext are preserved in the ciphertext.'
    ],
    answerIndexes: [0, 2, 3],
    explanation: 'Options A, C, and D are true. Option B is false because monoalphabetic substitution is 1-to-1 invariant; it directly leaks the statistical distribution of letters (e.g. E being most frequent).',
    replayStep: 2
  },

  // 3. NUMERIC (with generator!)
  {
    id: 'm1-num-affine-coprime',
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'For an Affine cipher E(x) = (ax + b) mod 26, how many distinct valid values can the multiplicative key "a" take such that a modular inverse exists?',
    given: {
      'Modulus (m)': 26,
      'Condition': 'gcd(a, 26) = 1'
    },
    answer: 12,
    tolerance: 0,
    unit: 'values',
    steps: [
      '1. A multiplicative inverse a^-1 mod 26 exists if and only if gcd(a, 26) = 1.',
      '2. The prime factorization of 26 is 2 × 13.',
      '3. By Euler’s totient function: φ(26) = 26 × (1 - 1/2) × (1 - 1/13) = 26 × (1/2) × (12/13) = 12.',
      '4. The valid values in ℤ₂₆ are: {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}.'
    ],
    explanation: 'Only integers coprime to 26 have a multiplicative inverse mod 26. Since 26 = 2 × 13, eliminating even numbers and 13 leaves exactly 12 valid multipliers.',
    replayStep: 1
  },

  // 4. ORDER
  {
    id: 'm1-order-playfair-steps',
    type: 'order',
    module: 'M1',
    topicId: 'playfair',
    tags: ['crypto', 'classical'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 60,
    prompt: 'Place the following Playfair cipher preprocessing and encryption steps in the correct chronological order:',
    items: [
      'Construct the 5×5 matrix with the keyword and unused alphabet letters (merging I/J).',
      'Split plaintext into digraph pairs, inserting filler "X" between identical consecutive letters.',
      'If the final letter is unpaired, append a filler "X" to complete the last digraph.',
      'Apply row, column, or rectangle geometric rules to each digraph to produce ciphertext.'
    ],
    correctOrder: [0, 1, 2, 3],
    explanation: 'Matrix construction is step 1; splitting pairs with filler X for duplicates is step 2; padding an odd trailing letter is step 3; and applying geometric coordinate rules is step 4.',
    replayStep: 2
  },

  // 5. MATCH
  {
    id: 'm1-match-ciphers-keys',
    type: 'match',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match each classical cipher with its defining mathematical key structure or keyspace size:',
    pairs: [
      ['Caesar Cipher', '25 effective additive shifts in ℤ₂₆'],
      ['Affine Cipher', '12 valid multipliers × 26 shifts = 312 keys'],
      ['Monoalphabetic', '26! ≈ 4 × 10²⁶ permutation key mappings'],
      ['Hill Cipher', 'n × n invertible matrix modulo 26 with gcd(det, 26) = 1']
    ],
    explanation: 'Caesar has 25 shifts; Affine has φ(26)×26 = 12×26 = 312 keys; general monoalphabetic has 26! permutations; and Hill requires an invertible matrix mod 26.',
    replayStep: 1
  },

  // 6. LABEL
  {
    id: 'm1-label-symmetric-model',
    type: 'label',
    module: 'M1',
    topicId: 'symmetric-model',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 1,
    marks: 3,
    timeSec: 60,
    prompt: 'Label the 5 essential components in the classical Symmetric Cipher Model:',
    diagramType: 'symmetric-cipher',
    hotspots: [
      { id: 'h1', x: 15, y: 50, expected: 'Plaintext (X)' },
      { id: 'h2', x: 35, y: 50, expected: 'Encryption Algorithm' },
      { id: 'h3', x: 50, y: 15, expected: 'Secret Key (K)' },
      { id: 'h4', x: 65, y: 50, expected: 'Ciphertext (Y)' },
      { id: 'h5', x: 85, y: 50, expected: 'Decryption Algorithm' }
    ],
    labels: [
      'Plaintext (X)',
      'Encryption Algorithm',
      'Secret Key (K)',
      'Ciphertext (Y)',
      'Decryption Algorithm'
    ],
    explanation: 'The five ingredients defined by Stallings are: Plaintext, Encryption Algorithm, Secret Key, Ciphertext, and Decryption Algorithm.',
    replayStep: 0
  },

  // 7. SPOT
  {
    id: 'm1-spot-frequency-attack',
    type: 'spot',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['crypto', 'attacks'],
    bloom: 'L4',
    difficulty: 3,
    marks: 3,
    timeSec: 45,
    prompt: 'Observe the animated cryptanalysis scene. Which attack technique is the analyst using to deduce the plaintext without knowing the key?',
    sceneSnippetId: 'caesar-process-scene',
    options: [
      'Frequency analysis of single letters matching the peak of English "E"',
      'Differential cryptanalysis targeting round permutations',
      'Known-plaintext linear equation solving mod 26',
      'Meet-in-the-middle key collision attack'
    ],
    answerIndex: 0,
    explanation: 'Because Caesar is a monoalphabetic shift, the shape of the letter frequency histogram is merely shifted along the x-axis. Matching the highest peak to English "E" immediately reveals the shift key.',
    replayStep: 2
  },

  // 8. FILL
  {
    id: 'm1-fill-caesar-math',
    type: 'fill',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Complete the encryption calculation for letter "T" (index 19) using Caesar key k = 5:',
    template: 'C = (19 + 5) mod 26 = {{b1}}, which maps to the ciphertext letter {{b2}}.',
    blanks: ['24', 'Y'],
    explanation: '19 + 5 = 24. Position 24 in the zero-indexed alphabet (A=0, ..., Y=24, Z=25) is letter "Y".',
    replayStep: 1
  },

  // 9. TF-WHY
  {
    id: 'm1-tf-kerckhoffs',
    type: 'tf-why',
    module: 'M1',
    topicId: 'principles',
    tags: ['crypto', 'principles'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate Kerckhoffs’s principle and its underlying cryptographic justification:',
    statement: 'According to Kerckhoffs’s principle, a cryptographic system remains secure even if the attacker knows everything about the algorithm and design, provided the key remains secret.',
    isTrue: true,
    whyOptions: [
      'Because keeping mathematical algorithms secret against reverse-engineering and espionage is practically impossible at scale.',
      'Because public algorithms run faster on modern CPUs with AES-NI instructions.',
      'Because proprietary algorithms cannot be implemented in hardware chips.',
      'Because secret algorithms always violate Shannon’s theorem of confusion.'
    ],
    whyIndex: 0,
    explanation: 'True. Auguste Kerckhoffs established that secrecy of the algorithm (security through obscurity) inevitably fails. Security must reside entirely in the randomness and secrecy of the key.',
    replayStep: 0
  }
]

export function generateAffineVariation(): NumericQuestion {
  const moduli = [26, 27, 28]
  const chosenMod = moduli[Math.floor(Math.random() * moduli.length)]
  let count = 0
  for (let i = 1; i < chosenMod; i++) {
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
    if (gcd(i, chosenMod) === 1) count++
  }
  return {
    id: `m1-num-affine-${chosenMod}`,
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: `For an Affine cipher over an alphabet of size ${chosenMod}, how many distinct valid values can the multiplicative key "a" take?`,
    given: {
      'Modulus (m)': chosenMod,
      'Condition': `gcd(a, ${chosenMod}) = 1`
    },
    answer: count,
    steps: [
      `1. Valid values must be coprime to ${chosenMod}.`,
      `2. Applying Euler totient φ(${chosenMod}) yields ${count} coprime integers.`
    ],
    explanation: `Only integers coprime to ${chosenMod} have a multiplicative inverse.`
  }
}
