import { Plate, TopicPresentation } from "@/lib/present/types"

export const cryptanalysisPlates: Plate[] = [
  // 1. Hook
  {
    id: 'cryptanalysis-hook',
    kind: 'hook',
    title: 'Breaking the Unbreakable',
    subtitle: 'From Al-Kindi’s Manuscript to the Enigma Bletchley Park Bombe',
    caption: 'How do codebreakers recover messages without possessing the key? What information does an adversary actually need?',
    eli5Caption: 'A codebreaker is like a detective looking for patterns, clues, and slip-ups left behind by the sender.',
    speakerNotes: {
      script: 'Cryptanalysis is the art and science of deciphering encoded messages without access to the secret key. The 9th-century Arab polymath Al-Kindi pioneered cryptanalysis by discovering that natural language letters appear with predictable statistical frequencies.',
      likelyQuestions: [
        {
          question: 'Is cryptanalysis the same as hacking or exploiting bugs?',
          answer: 'No. Cryptanalysis attacks the mathematical structure, statistics, and algebraic properties of the cipher itself, independent of implementation bugs or social engineering.'
        }
      ]
    }
  },

  // 2. Analogy / Concept: Attack Models
  {
    id: 'cryptanalysis-analogy',
    kind: 'analogy',
    title: 'The Four Attack Tiers',
    subtitle: 'Adversary Knowledge & Access Hierarchy',
    caption: 'From intercepting radio chatter (Ciphertext Only) to having temporary access to the encoder machine (Chosen Plaintext).',
    eli5Caption: 'Level 1: You only find the locked letter. Level 2: You find an old letter and its copy. Level 3: You trick the sender into locking your own sentence.',
    comparison: {
      leftTitle: 'Passive Interception (COA / KPA)',
      rightTitle: 'Active Oracle Access (CPA / CCA)',
      differences: [
        {
          feature: 'Adversary Capability',
          left: 'Intercepts ciphertext transmissions C; may possess historical (P, C) pairs.',
          right: 'Can submit chosen plaintexts or ciphertexts to encryption/decryption oracle.'
        },
        {
          feature: 'Classical Vulnerability',
          left: 'Caesar (25 keys), Monoalphabetic (frequency), Hill cipher (linear solver).',
          right: 'All classical ciphers collapse immediately under oracle testing.'
        },
        {
          feature: 'Modern Standard',
          left: 'Sufficient for basic confidentiality against passive sniffers.',
          right: 'Modern ciphers must resist adaptive Chosen-Ciphertext attacks (IND-CCA2).'
        }
      ],
      summaryTakeaway: 'Adversary power grows monotonically: COA < KPA < CPA < CCA.'
    },
    speakerNotes: {
      script: 'Emphasize the hierarchy of attack models. A cipher that is secure against Ciphertext-Only attacks might fall instantly to a Known-Plaintext attack. A secure modern cipher must resist Chosen-Ciphertext attacks (IND-CCA2).',
      likelyQuestions: [
        {
          question: 'Why is Hill cipher especially vulnerable to Known-Plaintext attacks?',
          answer: 'Because Hill cipher is a linear transformation C = P * K mod 26. Given m known plaintext-ciphertext pairs, K can be solved directly via K = P⁻¹ * C mod 26 using basic linear algebra.'
        }
      ]
    }
  },

  // 3. Process: Letter Frequency Distribution Scene
  {
    id: 'cryptanalysis-process',
    kind: 'process',
    title: 'Frequency Analysis in Action',
    subtitle: 'Cracking Monoalphabetic Substitution via English Statistics',
    caption: 'Eve tallies character occurrences in the intercepted text, aligns the top peak with "E", second with "T", and peels the substitution.',
    eli5Caption: 'Watch the tallest bar in the spy\'s chart match up with the most common letter E.',
    scene: {
      id: 'scene-frequency-analysis',
      title: 'Statistical Frequency Attack on Substitution Cipher',
      viewBox: '0 0 900 360',
      legend: ['Ciphertext Stream', 'Frequency Histogram', 'English Reference', 'Recovered Plaintext'],
      actors: [
        { id: 'eve', kind: 'eve', label: 'Eve (Cryptanalyst)', pos: { x: 120, y: 180 } },
        { id: 'app', kind: 'app', label: 'Frequency Counter', pos: { x: 450, y: 180 } },
        { id: 'server', kind: 'server', label: 'Plaintext Output', pos: { x: 780, y: 180 } }
      ],
      objects: [
        { id: 'cStream', kind: 'cipher', label: 'C: "WKH TXLFN EURZQ..."', at: { x: 120, y: 180 }, tone: 'signal' },
        { id: 'hist', kind: 'matrix', label: 'Peak: "K" (12.7%)', at: { x: 450, y: 180 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Eve intercepts a long monoalphabetic ciphertext string transmitted over an open channel.',
          eli5: 'Eve grabs a large pile of encrypted text.',
          actions: [
            { do: 'highlight', target: ['cStream'], tone: 'signal' },
            { do: 'say', actor: 'eve', text: '500 characters intercepted!' }
          ]
        },
        {
          caption: 'Eve runs statistical unigram counting: Letter "K" appears 12.7% of the time, followed by "H" at 9.1%.',
          eli5: 'The computer counts which encrypted letter appears most often.',
          actions: [
            { do: 'move', obj: 'cStream', to: { x: 450, y: 180 } },
            { do: 'highlight', target: ['hist'], tone: 'warn' },
            { do: 'say', actor: 'app', text: 'Top Peak: Letter K' }
          ]
        },
        {
          caption: 'Comparing with Standard English distribution (E=12.7%, T=9.1%), Eve hypothesizes that Cipher "K" = Plain "E".',
          eli5: 'Since E is the most common English letter, K must stand for E!',
          actions: [
            { do: 'transform', obj: 'hist', into: { label: 'Hypothesis: K -> E (Shift 6)', tone: 'info' } },
            { do: 'pulse', target: 'hist' }
          ]
        },
        {
          caption: 'Eve tests the shift across common trigraphs (THE, AND, ING). All words cleanly resolve into readable English.',
          eli5: 'Once K is E, all the other words quickly snap into place.',
          actions: [
            { do: 'move', obj: 'cStream', to: { x: 780, y: 180 } },
            { do: 'transform', obj: 'cStream', into: { kind: 'plain', label: 'P: "THE QUICK BROWN..."', tone: 'ok' } },
            { do: 'highlight', target: ['server', 'cStream'], tone: 'ok' },
            { do: 'say', actor: 'server', text: 'Plaintext Recovered!' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'In any natural language, letter distributions are non-uniform. English has high-frequency letters (E, T, A, O, I, N) accounting for over 50% of text, and low-frequency letters (J, K, Q, X, Z). Monoalphabetic substitution preserves these frequency fingerprints exactly.',
      likelyQuestions: [
        {
          question: 'How much ciphertext is needed to crack a monoalphabetic cipher via frequency analysis?',
          answer: 'Around 25 to 50 characters for an experienced cryptanalyst, and fewer than 100 characters for automated solver tools.'
        }
      ]
    }
  },

  // 4. Compare: Unconditional vs Computational Security
  {
    id: 'cryptanalysis-compare',
    kind: 'compare',
    title: 'Unconditional vs Computational Security',
    subtitle: 'The Shannon Limit: Can Any Cipher Be Unbreakable?',
    caption: 'Unconditional security withstands infinite computing power. Computational security withstands all practical supercomputers.',
    eli5Caption: 'One-Time Pad is mathematically impossible to break forever. AES would take billions of years for all computers on Earth.',
    comparison: {
      leftTitle: 'Unconditionally Secure (OTP)',
      rightTitle: 'Computationally Secure (AES / RSA)',
      differences: [
        {
          feature: 'Adversary Power',
          left: 'Infinite computing power and infinite time cannot break the cipher.',
          right: 'Broken in theory given infinite time; unbreakable within practical limits.'
        },
        {
          feature: 'Key Requirement',
          left: 'Key must be truly random, as long as the message, and used only ONCE.',
          right: 'Fixed short key (e.g. 128 or 256 bits) used to encrypt gigabytes of data.'
        },
        {
          feature: 'Information Theoretic Proof',
          left: 'P(Plaintext | Ciphertext) = P(Plaintext); Ciphertext reveals zero information.',
          right: 'Cost to break exceeds value of information, or time required exceeds data lifetime.'
        },
        {
          feature: 'Practicality',
          left: 'Extremely difficult key distribution; restricted to military red phones.',
          right: 'Universal: Powers HTTPS, VPNs, banking, cloud storage, smartphones.'
        }
      ],
      summaryTakeaway: 'OTP provides information-theoretic security; modern ciphers provide computational security.'
    },
    speakerNotes: {
      script: 'Shannon proved in 1949 that the Vernam One-Time Pad is the ONLY cipher with perfect secrecy. Its condition is severe: key length must equal or exceed message length, and keys can never be reused. Modern security relies instead on Computational Security.',
      likelyQuestions: [
        {
          question: 'What happens if a One-Time Pad key is reused twice?',
          answer: 'If C1 = P1 ⊕ K and C2 = P2 ⊕ K, then C1 ⊕ C2 = P1 ⊕ P2. The key cancels out completely, and the plaintexts can be separated using frequency analysis.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'cryptanalysis-ask',
    kind: 'ask-the-room',
    title: 'Check Your Cryptanalytic Judgment',
    subtitle: 'Classifying the Attack Scenario',
    caption: 'During WWII, the Allied codebreakers sent planes to drop sea mines at specific ocean coordinates. The German commanders radioed encrypted warning coordinates back to their fleet.',
    eli5Caption: 'The Allies provoked the enemy into sending an encrypted message about a specific location they chose.',
    askTheRoom: {
      question: 'By deliberately causing the Germans to encrypt known coordinates ("gardening"), which attack model did the Bletchley Park cryptanalysts utilize?',
      options: [
        'A. Ciphertext-Only Attack (COA), because they only had the radio receiver antennas.',
        'B. Chosen-Plaintext Attack (CPA), because the attackers planted specific words/coordinates knowing the enemy would encrypt them.',
        'C. Brute-force Key Enumeration Attack, because Enigma keys were small.',
        'D. Chosen-Ciphertext Attack (CCA), using a captured decryption machine.'
      ],
      correctIndex: 1,
      explanation: 'Correct! This historical technique known as "gardening" allowed Allied cryptanalysts to force specific plaintext cribs into Enigma transmissions.'
    },
    speakerNotes: {
      script: 'This famous historical anecdote vividly teaches the concept of Chosen-Plaintext attacks. Attackers do not need access to the cipher machine; they can influence real-world events to force specific plaintexts to be transmitted.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'cryptanalysis-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Cryptanalysis',
    caption: 'Definitions of attack models, frequency analysis, unconditional security, and Shannon’s perfect secrecy.',
    eli5Caption: 'The exact terms you need to write for full marks in the cryptanalysis questions.',
    speakerNotes: {
      script: 'Remind students of the 4 attack tiers (COA, KPA, CPA, CCA) and the strict conditions under which Shannon proved the One-Time Pad is unconditionally secure. These are recurring semester exam questions.',
      likelyQuestions: [
        {
          question: 'Which classical cipher is most severely broken by a Known-Plaintext Attack?',
          answer: 'The Hill cipher, because linear equations in modulo 26 can be inverted directly: K = P⁻¹ · C mod 26.'
        }
      ]
    },
    examWords: {
      term: 'Cryptanalysis & Attack Models',
      definition: 'The mathematical study and reverse-engineering of cryptosystems to deduce plaintexts or secret keys. Evaluated under standard attack models from COA to CCA.',
      keywords: [
        'Cryptanalysis',
        'Ciphertext-Only Attack (COA)',
        'Known-Plaintext Attack (KPA)',
        'Chosen-Plaintext Attack (CPA)',
        'Chosen-Ciphertext Attack (CCA)',
        'Frequency Analysis (Unigrams, Digraphs, Trigraphs)',
        'Unconditional / Perfect Secrecy',
        'Computational Security',
        'One-Time Pad (Vernam Cipher)',
        'Entropy and Redundancy'
      ],
      mustRememberPoints: [
        'The four fundamental attack models in order of adversary advantage: COA < KPA < CPA < CCA.',
        'Frequency analysis breaks monoalphabetic substitution because natural language letter frequency distributions are preserved unchanged.',
        'The One-Time Pad is the only cipher that achieves unconditional security (perfect secrecy), provided the key is truly random, as long as the message, and never reused.'
      ],
      typicalMarks: 5
    }
  }
]

export const cryptanalysisPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'cryptanalysis',
  topicTitle: 'Cryptanalysis of Classical Ciphers & Attack Models',
  targetDurationMinutes: 10,
  plates: cryptanalysisPlates
}
