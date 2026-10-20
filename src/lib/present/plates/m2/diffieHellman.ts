import { Plate, TopicPresentation } from "@/lib/present/types"

export const diffieHellmanPlates: Plate[] = [
  // 1. Hook
  {
    id: 'dh-hook',
    kind: 'hook',
    title: 'The Handshake That Built the Internet',
    subtitle: 'Diffie-Hellman Key Exchange (1976)',
    caption: 'Before two computers can encrypt their traffic with AES, they must share a secret key. Whitfield Diffie and Martin Hellman proved that two strangers can agree on a secret number in broad daylight, while the whole world listens.',
    eli5Caption: 'Two people mix secret paint colors with a public paint in front of a spy, yet only the two of them know the resulting mixed shade.',
    speakerNotes: {
      script: 'Diffie-Hellman was the first published asymmetric algorithm. It is not an encryption scheme (you cannot encrypt an arbitrary message directly with DH), but a Key Agreement Protocol. Today, through ECDHE, it powers every HTTPS connection on earth.',
      likelyQuestions: [
        {
          question: 'What is the paint-mixing analogy for Diffie-Hellman?',
          answer: 'Alice and Bob agree on a common yellow paint. Alice adds secret red; Bob adds secret blue. They exchange their muddy mixtures over the wire. Alice adds her secret red to Bob’s mix, and Bob adds his secret blue to Alice’s mix. Both arrive at the exact same brown paint, which Eve cannot separate.'
        }
      ]
    }
  },

  // 2. Concept: Protocol Mathematics
  {
    id: 'dh-math',
    kind: 'concept',
    title: 'The Diffie-Hellman Key Exchange Protocol',
    subtitle: 'Shared Secret K = (Y_B)^X_A ≡ (Y_A)^X_B ≡ g^(X_A · X_B) (mod p)',
    caption: 'Both parties independently compute the exact same value g^(ab) mod p without ever sending exponents a or b across the network.',
    eli5Caption: 'Alice raises Bob’s public number to her secret power. Bob raises Alice’s public number to his secret power. The results match perfectly.',
    comparison: {
      leftTitle: 'Alice’s Computations',
      rightTitle: 'Bob’s Computations',
      differences: [
        {
          feature: '1. Shared Domain Parameters',
          left: 'Agreed publicly: Large prime p and primitive root generator g',
          right: 'Agreed publicly: Large prime p and primitive root generator g'
        },
        {
          feature: '2. Private Key Selection',
          left: 'Selects random private key X_A < p (kept strictly secret)',
          right: 'Selects random private key X_B < p (kept strictly secret)'
        },
        {
          feature: '3. Public Key Transmission',
          left: 'Computes Y_A = g^X_A mod p -> Transmits Y_A to Bob',
          right: 'Computes Y_B = g^X_B mod p -> Transmits Y_B to Alice'
        },
        {
          feature: '4. Secret Key Derivation',
          left: 'Computes K = (Y_B)^X_A mod p = (g^X_B)^X_A = g^(X_A · X_B) mod p',
          right: 'Computes K = (Y_A)^X_B mod p = (g^X_A)^X_B = g^(X_A · X_B) mod p'
        }
      ],
      summaryTakeaway: 'Alice and Bob hold the identical symmetric session key K = g^(X_A · X_B) mod p. An eavesdropper sees (p, g, Y_A, Y_B) and must solve the Discrete Logarithm Problem to find K.'
    },
    speakerNotes: {
      script: 'Stress the mathematical equivalence: (g^b)^a = g^(ba) = g^(ab) = (g^a)^b. Because exponent multiplication is commutative, Alice and Bob arrive at the exact same number without exchanging their secret exponents.',
      likelyQuestions: [
        {
          question: 'What is a primitive root modulo p?',
          answer: 'A generator g whose successive powers g^1, g^2, ..., g^(p-1) mod p generate all non-zero integers from 1 to p-1 without repeating.'
        }
      ]
    }
  },

  // 3. Worked Example: Small Numbers
  {
    id: 'dh-worked-example',
    kind: 'concept',
    title: 'Worked Numerical Example with Small Numbers',
    subtitle: 'Prime p = 23, Generator g = 5, Alice X_A = 4, Bob X_B = 3',
    caption: 'Trace the small-number arithmetic: Alice computes Y_A = 4; Bob computes Y_B = 10. Both derive shared secret K = 18.',
    eli5Caption: 'Watch how both parties independently compute 18 using their own secret numbers.',
    comparison: {
      leftTitle: 'Alice (X_A = 4)',
      rightTitle: 'Bob (X_B = 3)',
      differences: [
        {
          feature: 'Public Values',
          left: 'p = 23, g = 5 (known to all including Eve)',
          right: 'p = 23, g = 5 (known to all including Eve)'
        },
        {
          feature: 'Public Key Calculation',
          left: 'Y_A = 5^4 mod 23 = 625 mod 23 = 4 (Alice transmits 4)',
          right: 'Y_B = 5^3 mod 23 = 125 mod 23 = 10 (Bob transmits 10)'
        },
        {
          feature: 'Received Message',
          left: 'Alice receives Y_B = 10 from Bob over the wire',
          right: 'Bob receives Y_A = 4 from Alice over the wire'
        },
        {
          feature: 'Shared Secret K',
          left: 'K = 10^4 mod 23 = 10,000 mod 23 = 18',
          right: 'K = 4^3 mod 23 = 64 mod 23 = 18 (Perfect Match!)'
        }
      ],
      summaryTakeaway: 'Both arrive at K = 18. Eve sees p=23, g=5, Y_A=4, Y_B=10, but cannot compute 18 without knowing X_A or X_B.'
    },
    speakerNotes: {
      script: 'Have students calculate 64 mod 23: 23 × 2 = 46, 64 - 46 = 18. And 10,000 mod 23: 10,000 / 23 = 434 remainder 18. Both sides arrive at 18 independently.',
      likelyQuestions: [
        {
          question: 'What is the Diffie-Hellman Problem (DHP)?',
          answer: 'Given (g, g^a, g^b), compute g^(ab). It is closely related to the DLP, and no efficient classical solution exists for large primes.'
        }
      ]
    }
  },

  // 4. Process: Man-in-the-Middle Attack & Defense Scene
  {
    id: 'dh-process',
    kind: 'process',
    title: 'The Man-in-the-Middle (MitM) Vulnerability',
    subtitle: 'Why Unauthenticated Diffie-Hellman Fails Against Active Attackers',
    caption: 'Because raw Diffie-Hellman does not authenticate the parties, Mallory intercepts public keys, creating two separate sessions (K_AM and K_MB).',
    eli5Caption: 'Mallory stands in the middle, pretending to be Bob to Alice, and pretending to be Alice to Bob.',
    scene: {
      id: 'scene-dh-mitm',
      title: 'Active Man-in-the-Middle Interception',
      viewBox: '0 0 900 360',
      legend: ['Alice (Sender)', 'Bob (Receiver)', 'Mallory (Active MitM)', 'Key K1 (Alice-Mallory)', 'Key K2 (Mallory-Bob)'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 120, y: 160 } },
        { id: 'mallory', kind: 'mallory', label: 'Mallory (MitM)', pos: { x: 450, y: 160 } },
        { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 780, y: 160 } }
      ],
      objects: [
        { id: 'ya', kind: 'key-pub', label: 'Y_A = g^a', at: { x: 120, y: 160 }, tone: 'info' },
        { id: 'ym', kind: 'key-pub', label: 'Y_M = g^m', at: { x: 450, y: 80 }, tone: 'bad' },
        { id: 'yb', kind: 'key-pub', label: 'Y_B = g^b', at: { x: 780, y: 160 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Alice sends her public value Y_A to Bob. Mallory intercepts Y_A and blocks it from reaching Bob.',
          eli5: 'Alice tries to send her public key to Bob, but Mallory snatches it off the wire.',
          actions: [
            { do: 'move', obj: 'ya', to: { x: 450, y: 160 } },
            { do: 'highlight', target: ['mallory', 'ya'], tone: 'bad' },
            { do: 'say', actor: 'mallory', text: 'Intercepted Y_A!' }
          ]
        },
        {
          caption: 'Mallory generates her own secret key m and transmits fake public key Y_M to both Alice and Bob.',
          eli5: 'Mallory gives her own fake key to both sides.',
          actions: [
            { do: 'move', obj: 'ym', to: { x: 780, y: 160 } },
            { do: 'pulse', target: 'ym' },
            { do: 'say', actor: 'bob', text: 'Received key (thinks it is Alice)' }
          ]
        },
        {
          caption: 'Bob sends his public value Y_B. Mallory intercepts Y_B and computes two distinct shared keys: K1 with Alice, K2 with Bob.',
          eli5: 'Bob replies with his key, which Mallory also steals. Mallory now holds keys to both conversations.',
          actions: [
            { do: 'move', obj: 'yb', to: { x: 450, y: 220 } },
            { do: 'highlight', target: ['mallory'], tone: 'bad' },
            { do: 'say', actor: 'mallory', text: 'K1=(Y_A)^m, K2=(Y_B)^m' }
          ]
        },
        {
          caption: 'Alice encrypts with K1. Mallory decrypts, alters the message, re-encrypts with K2, and forwards to Bob unnoticed!',
          eli5: 'Mallory reads the message in the clear, changes the text, and forwards it to Bob.',
          actions: [
            { do: 'say', actor: 'alice', text: 'Encrypted with K1' },
            { do: 'say', actor: 'bob', text: 'Decrypted with K2' },
            { do: 'highlight', target: ['alice', 'bob'], tone: 'signal' }
          ]
        },
        {
          caption: 'Defense: Station-to-Station protocol & TLS 1.3 digitally sign public keys with RSA/ECDSA certificates to prevent spoofing.',
          eli5: 'To prevent this, Alice and Bob sign their keys with verified digital ID cards.',
          actions: [
            { do: 'transform', obj: 'ya', into: { kind: 'cert', label: 'Signed Y_A [CA Cert]', tone: 'ok' } },
            { do: 'highlight', target: ['alice', 'bob', 'ya'], tone: 'ok' },
            { do: 'say', actor: 'mallory', text: 'Cannot forge digital signature!' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Make sure students understand: Diffie-Hellman alone provides secrecy against passive eavesdroppers, but ZERO authentication against active attackers. That is why DH must always be combined with digital signatures (PKI) or pre-shared keys.',
      likelyQuestions: [
        {
          question: 'What is Perfect Forward Secrecy (PFS)?',
          answer: 'Using Ephemeral Diffie-Hellman (DHE or ECDHE). A new key pair is generated for every single session. Even if the server’s master long-term private key is stolen years later, past recorded sessions cannot be decrypted.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'dh-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Diffie-Hellman Vulnerability & Defense',
    caption: 'Why is standard unauthenticated Diffie-Hellman vulnerable to Man-in-the-Middle attacks, whereas RSA public-key encryption with CA certificates is not?',
    eli5Caption: 'What is missing from raw Diffie-Hellman that allows Mallory to trick both Alice and Bob?',
    askTheRoom: {
      question: 'What fundamental security service does basic Diffie-Hellman lack that enables Man-in-the-Middle attacks?',
      options: [
        'A. Confidentiality (anyone can read the shared secret)',
        'B. Mutual Entity Authentication (no cryptographic proof of who generated the public values)',
        'C. Mathematical non-linearity',
        'D. Key randomness'
      ],
      correctIndex: 1,
      explanation: 'Correct! Basic Diffie-Hellman provides secrecy against passive eavesdropping, but has zero entity authentication. Neither Alice nor Bob can verify that the public value received originated from each other rather than Mallory.'
    },
    speakerNotes: {
      script: 'Reinforce the CIA triad and authentication. Diffie-Hellman gives confidentiality, but fails without authentication.',
      likelyQuestions: [
        {
          question: 'What is ECDHE-RSA?',
          answer: 'A cipher suite where ECDHE negotiates the ephemeral session key, and an RSA certificate authenticates the server’s identity to prevent MitM.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'dh-exam',
    kind: 'exam-words',
    title: 'Diffie-Hellman Key Exchange Key Terminology',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these definitions, formulas, and protocol steps for university exams.',
    eli5Caption: 'The three must-know points for Diffie-Hellman on any CNS exam.',
    examWords: {
      term: 'Diffie-Hellman Key Exchange',
      definition: 'A cryptographic protocol that enables two communicating parties to establish a shared secret key over an insecure, untrusted communication channel based on the Discrete Logarithm Problem.',
      keywords: [
        'Discrete Logarithm Problem (DLP)',
        'Global parameters: Prime p, Primitive root g',
        'Public keys: Y_A = g^X_A mod p, Y_B = g^X_B mod p',
        'Shared secret: K = g^(X_A · X_B) mod p',
        'Man-in-the-Middle (MitM) & Perfect Forward Secrecy (PFS)'
      ],
      mustRememberPoints: [
        'Protocol Steps: Alice sends Y_A = g^X_A mod p; Bob sends Y_B = g^X_B mod p. Both compute shared secret K = (Y_B)^X_A = (Y_A)^X_B = g^(X_A · X_B) mod p.',
        'Hardness Assumption: Security relies on the intractability of the Discrete Logarithm Problem (DLP) and the Computational Diffie-Hellman (CDH) problem in cyclic groups.',
        'MitM Vulnerability & Mitigation: Unauthenticated DH is vulnerable to active Man-in-the-Middle attacks; mitigation requires digital signatures (Station-to-Station protocol or TLS certificates).'
      ],
      typicalMarks: 7
    },
    speakerNotes: {
      script: 'Encourage students to always write the derivation showing why both arrive at the exact same key: K_A = (Y_B)^X_A = (g^X_B)^X_A = g^(X_A * X_B) = (g^X_A)^X_B = (Y_A)^X_B = K_B mod p.',
      likelyQuestions: [
        {
          question: 'Why is static DH rarely used in modern TLS?',
          answer: 'Static DH reuses the same key pair across connections, losing Perfect Forward Secrecy. TLS 1.3 exclusively mandates Ephemeral Diffie-Hellman (DHE/ECDHE).'
        }
      ]
    }
  }
]

export const diffieHellmanPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'diffie-hellman',
  topicTitle: 'Diffie-Hellman Key Exchange',
  targetDurationMinutes: 10,
  plates: diffieHellmanPlates
}
