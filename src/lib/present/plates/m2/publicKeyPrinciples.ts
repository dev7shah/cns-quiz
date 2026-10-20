import { Plate, TopicPresentation } from "@/lib/present/types"

export const publicKeyPrinciplesPlates: Plate[] = [
  // 1. Hook
  {
    id: 'pk-hook',
    kind: 'hook',
    title: 'The 1976 Revolution in Cryptography',
    subtitle: 'Diffie & Hellman: Solving the Key Distribution Dilemma',
    caption: 'For thousands of years, two parties could only communicate securely if they previously shared a secret key over a safe courier. Public-key cryptography shattered that limitation.',
    eli5Caption: 'You can now share an open padlock with the world; only you keep the key that unlocks it.',
    speakerNotes: {
      script: 'In 1976, Whitfield Diffie and Martin Hellman published "New Directions in Cryptography". They solved the fundamental problem that plagued symmetric systems: how can two people who have never met establish a secure channel over an untrusted public line?',
      likelyQuestions: [
        {
          question: 'Did GCHQ discover public key cryptography earlier?',
          answer: 'Yes, James Ellis, Clifford Cocks, and Malcolm Williamson at the UK intelligence agency GCHQ discovered non-secret encryption in the early 1970s, but their work was classified until 1997.'
        }
      ]
    }
  },

  // 2. Comparison: Symmetric vs Asymmetric
  {
    id: 'pk-comparison',
    kind: 'concept',
    title: 'The Key Scaling Problem: N(N-1)/2 vs 2N',
    subtitle: 'Symmetric Scalability Crisis vs Asymmetric Elegance',
    caption: 'In a network of N users, symmetric ciphers require N(N-1)/2 secret pairwise keys. Public-key cryptography requires only 2N keys in total.',
    eli5Caption: 'For 1,000 people, symmetric ciphers need nearly 500,000 secret keys. Public-key needs only 1,000 public and 1,000 private keys.',
    comparison: {
      leftTitle: 'Symmetric Cryptography (AES, DES)',
      rightTitle: 'Asymmetric Cryptography (RSA, ECC)',
      differences: [
        {
          feature: 'Key Pair Architecture',
          left: 'Single shared secret key used for both encryption and decryption',
          right: 'Mathematically linked key pair: Public Key (encrypt) and Private Key (decrypt)'
        },
        {
          feature: 'Key Count for N Users',
          left: 'N(N - 1) / 2 unique shared keys (499,500 keys for 1,000 users)',
          right: '2N keys: 1 public and 1 private key per user (2,000 keys for 1,000 users)'
        },
        {
          feature: 'Transmission Channel',
          left: 'Secret key must be delivered via an out-of-band secure channel beforehand',
          right: 'Public keys can be broadcast openly over untrusted networks (via PKI directories)'
        },
        {
          feature: 'Computational Speed',
          left: 'Blazing fast (gigabits/sec in hardware and software)',
          right: '1,000× slower (heavy modular arithmetic and point multiplications)'
        },
        {
          feature: 'Primary Role in TLS',
          left: 'Bulk data transport encryption (confidentiality stream)',
          right: 'Initial authentication, digital signatures, and ephemeral key exchange'
        }
      ],
      summaryTakeaway: 'Modern protocols use Hybrid Cryptography: asymmetric keys securely exchange a session key, then fast symmetric ciphers encrypt the payload.'
    },
    speakerNotes: {
      script: 'Emphasize that asymmetric encryption does NOT replace symmetric encryption. RSA is too slow to stream 4K video or encrypt a multi-gigabyte hard drive. Instead, asymmetric crypto acts as the initial door-opener.',
      likelyQuestions: [
        {
          question: 'What is hybrid encryption?',
          answer: 'A system where asymmetric cryptography exchanges a temporary 256-bit symmetric key (session key), and AES-GCM encrypts the actual communication stream.'
        }
      ]
    }
  },

  // 3. Concept: Trapdoor One-Way Functions
  {
    id: 'pk-trapdoor',
    kind: 'concept',
    title: 'The Trapdoor One-Way Function',
    subtitle: 'f(x) is Easy to Compute, but f⁻¹(y) is Intractable Without Trapdoor k',
    caption: 'A trapdoor one-way function is easy to calculate in one direction, computationally impossible to reverse, unless a specific secret trapdoor piece of information is known.',
    eli5Caption: 'Dropping a glass vase on concrete is a one-way function. Putting it back together requires the magic rewind button (the trapdoor).',
    speakerNotes: {
      script: 'Explain the three mathematical families that form the bedrock of asymmetric cryptography: 1) Integer Factorization (RSA), 2) Discrete Logarithms over finite fields (Diffie-Hellman, ElGamal), and 3) Elliptic Curve Discrete Logarithms (ECDSA, ECDH).',
      likelyQuestions: [
        {
          question: 'What happens to trapdoor one-way functions when quantum computers arrive?',
          answer: 'Shor’s algorithm solves both Integer Factorization and Discrete Logarithms in polynomial time, breaking RSA, DH, and ECC. Post-Quantum Cryptography (PQC) relies on lattice problems instead.'
        }
      ]
    }
  },

  // 4. Process: Asymmetric Encryption & Decryption Scene
  {
    id: 'pk-process',
    kind: 'process',
    title: 'Public Key Encryption Flow',
    subtitle: 'Confidentiality: Encrypt with Public Key, Decrypt with Private Key',
    caption: 'Alice retrieves Bob’s verified public key, encrypts plaintext M, and sends ciphertext C. Only Bob’s private key can invert the trapdoor.',
    eli5Caption: 'Alice locks a letter inside Bob’s open box and snaps the lock. Only Bob has the key to open his lock.',
    scene: {
      id: 'scene-pk-flow',
      title: 'Asymmetric Confidentiality Exchange',
      viewBox: '0 0 900 360',
      legend: ['Alice (Sender)', 'Bob (Receiver)', 'Eve (Eavesdropper)', 'Public Key PK_B', 'Private Key SK_B'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 120, y: 160 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Passive)', pos: { x: 450, y: 270 } },
        { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 780, y: 160 } }
      ],
      objects: [
        { id: 'plain', kind: 'plain', label: 'Plaintext "MEET AT DAWN"', at: { x: 120, y: 160 }, tone: 'info' },
        { id: 'pubKey', kind: 'key-pub', label: 'Bob PubKey (PK_B)', at: { x: 780, y: 90 }, tone: 'info' },
        { id: 'privKey', kind: 'key-priv', label: 'Bob PrivKey (SK_B)', at: { x: 780, y: 220 }, tone: 'warn' }
      ],
      steps: [
        {
          caption: 'Bob generates a mathematically linked key pair: Public Key (PK_B) and Private Key (SK_B).',
          eli5: 'Bob makes a public lock and keeps the private key hidden in his pocket.',
          actions: [
            { do: 'pulse', target: 'pubKey' },
            { do: 'say', actor: 'bob', text: 'Public key published' }
          ]
        },
        {
          caption: 'Bob broadcasts PK_B openly across the untrusted network. Alice obtains Bob’s public key.',
          eli5: 'Alice fetches Bob’s public lock over the internet.',
          actions: [
            { do: 'move', obj: 'pubKey', to: { x: 120, y: 90 } },
            { do: 'highlight', target: ['alice', 'pubKey'], tone: 'info' }
          ]
        },
        {
          caption: 'Alice encrypts plaintext M using Bob’s public key: C = E(PK_B, M). Plaintext becomes vermilion ciphertext.',
          eli5: 'Alice snaps Bob’s lock shut on the message.',
          actions: [
            { do: 'transform', obj: 'plain', into: { kind: 'cipher', label: 'Ciphertext C', tone: 'bad' } },
            { do: 'pulse', target: 'plain' },
            { do: 'say', actor: 'alice', text: 'C = E(PK_B, M)' }
          ]
        },
        {
          caption: 'Alice transmits ciphertext C over the public wire. Eve intercepts C, but cannot reverse the one-way function without SK_B.',
          eli5: 'Eve intercepts the box, but cannot pick the lock without the private key.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 450, y: 160 } },
            { do: 'zone', id: 'eavesdrop', show: true },
            { do: 'say', actor: 'eve', text: 'Cannot invert without SK_B!' }
          ]
        },
        {
          caption: 'Ciphertext reaches Bob. Bob unlocks it with his private key: M = D(SK_B, C). Ink-black plaintext is restored.',
          eli5: 'Bob uses his private key to unlock the box and read the message.',
          actions: [
            { do: 'move', obj: 'plain', to: { x: 780, y: 160 } },
            { do: 'transform', obj: 'plain', into: { kind: 'plain', label: 'Plaintext "MEET AT DAWN"', tone: 'ok' } },
            { do: 'highlight', target: ['bob', 'plain', 'privKey'], tone: 'ok' },
            { do: 'say', actor: 'bob', text: 'Decrypted successfully' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Walk through this sequence deliberately. Point out the inverse relationship: When Alice encrypts with Bob’s public key, it provides CONFIDENTIALITY. When Alice encrypts with her own private key, it provides AUTHENTICATION and NON-REPUDIATION (Digital Signature).',
      likelyQuestions: [
        {
          question: 'How does Alice know PK_B genuinely belongs to Bob and not Mallory?',
          answer: 'This is the Public Key Infrastructure (PKI) problem. Digital certificates signed by trusted Certificate Authorities (CAs) bind Bob’s identity to PK_B.'
        }
      ]
    }
  },

  // 5. Ask the room
  {
    id: 'pk-ask',
    kind: 'ask-the-room',
    title: 'Check Your Architectural Understanding',
    subtitle: 'Key Count Scaling',
    caption: 'Consider an enterprise organization with 500 internal employees who all need confidential peer-to-peer communication.',
    eli5Caption: 'How many total keys must be managed if they switch from symmetric keys to asymmetric key pairs?',
    askTheRoom: {
      question: 'How many keys are required for 500 users to communicate pairwise symmetrically vs asymmetrically?',
      options: [
        'A. Symmetric: 500 keys | Asymmetric: 250 keys',
        'B. Symmetric: 124,750 keys | Asymmetric: 1,000 keys',
        'C. Symmetric: 250,000 keys | Asymmetric: 500 keys',
        'D. Symmetric: 1,000 keys | Asymmetric: 124,750 keys'
      ],
      correctIndex: 1,
      explanation: 'Correct! Symmetrically, each pair requires a shared key: 500 × 499 / 2 = 124,750 keys. Asymmetrically, each user has exactly 1 public and 1 private key: 500 × 2 = 1,000 keys.'
    },
    speakerNotes: {
      script: 'Review the formula N(N-1)/2 on the whiteboard. As N grows to millions (e.g., internet scale), symmetric pairwise key distribution is physically impossible without a centralized KDC or public key cryptography.',
      likelyQuestions: [
        {
          question: 'Can Kerberos handle 500 users symmetrically?',
          answer: 'Yes, Kerberos uses a trusted third party (KDC) so each user only stores 1 symmetric key with the KDC. However, the KDC becomes a single point of failure and bottleneck.'
        }
      ]
    }
  },

  // 6. Exam words
  {
    id: 'pk-exam',
    kind: 'exam-words',
    title: 'Public-Key Cryptography Key Terminology',
    subtitle: 'Core Definitions for Academic Evaluation',
    caption: 'Memorize these foundational definitions and principles for university exams.',
    eli5Caption: 'Three essential definitions every security student must write accurately on exams.',
    examWords: {
      term: 'Public-Key Cryptosystem',
      definition: 'An asymmetric cryptographic system utilizing pairs of mathematically related keys (public and private) based on computationally intractable mathematical problems (trapdoor one-way functions).',
      keywords: [
        'Asymmetric key pair (Public / Private)',
        'Trapdoor one-way function',
        'Confidentiality vs Digital Signature duality',
        'Key distribution complexity N(N-1)/2 vs 2N',
        'Hybrid cryptosystem architecture'
      ],
      mustRememberPoints: [
        'Dual Functionality: Encryption with recipient’s public key guarantees Confidentiality; encryption with sender’s private key guarantees Authentication / Digital Signature.',
        'Trapdoor One-Way Function: A mathematical function f(x) easy to compute in polynomial time, but computationally infeasible to invert without knowledge of secret trapdoor k.',
        'Hybrid Architecture: Asymmetric ciphers (RSA/ECC) are computationally heavy and only used to establish symmetric session keys (AES) for bulk transmission.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Ensure students clearly understand the dual role: Public key encryption = privacy; Private key encryption = digital signature. Mixing these up is the most common exam blunder.',
      likelyQuestions: [
        {
          question: 'What are the three main mathematical hardness assumptions?',
          answer: '1. Factoring large composite integers (RSA). 2. Computing discrete logarithms in finite fields (DH, ElGamal). 3. Computing discrete logarithms on elliptic curves (ECDSA, ECDH).'
        }
      ]
    }
  }
]

export const publicKeyPrinciplesPresentation: TopicPresentation = {
  moduleId: 'm2',
  moduleTitle: 'Block Ciphers and Public Key Cryptography',
  topicId: 'public-key-principles',
  topicTitle: 'Public-Key Principles',
  targetDurationMinutes: 10,
  plates: publicKeyPrinciplesPlates
}
