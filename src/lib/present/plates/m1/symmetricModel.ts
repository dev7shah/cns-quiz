import { Plate, TopicPresentation } from "@/lib/present/types"

export const symmetricModelPlates: Plate[] = [
  // 1. Hook
  {
    id: 'symmetric-hook',
    kind: 'hook',
    title: 'The Shared Secret Dilemma',
    subtitle: 'From Caesar’s Legions to AES-256',
    caption: 'How can two parties exchange messages secretly across a hostile wire if they must first agree on a secret?',
    eli5Caption: 'Both people have identical keys to the same padlock. But how do you give the other person the key safely?',
    speakerNotes: {
      script: 'Symmetric cryptography is the workhorse of digital security. It is fast, mathematically robust, and encrypts petabytes of internet traffic every day. But its entire foundation rests on one premise: both sender and receiver must share a single secret key before transmission begins.',
      likelyQuestions: [
        {
          question: 'Why do we still use symmetric encryption if public-key encryption exists?',
          answer: 'Speed and efficiency. Symmetric ciphers like AES are roughly 1,000 to 10,000 times faster than asymmetric ciphers like RSA or ECC.'
        }
      ]
    }
  },

  // 2. Analogy / Concept
  {
    id: 'symmetric-analogy',
    kind: 'analogy',
    title: 'The Double-Locked Strongbox',
    subtitle: 'Identical Keys & The Insecure Channel',
    caption: 'A locked briefcase that only two identical physical keys can open. The public mail carrier carries the locked case.',
    eli5Caption: 'Alice puts a note in a safe, locks it with her key, sends the safe. Bob opens it with his identical copy of the key.',
    speakerNotes: {
      script: 'Imagine a physical safe. Alice and Bob each have an exact copy of the key. Alice puts her document inside, locks it, and hands the safe to an untrusted courier. Even if Eve intercepts the courier, she cannot open the safe without the key.',
      likelyQuestions: [
        {
          question: 'What happens if the courier steals the key during distribution?',
          answer: 'This is the fundamental Key Distribution Problem of symmetric cryptography. If the key is intercepted, total compromise occurs.'
        }
      ]
    }
  },

  // 3. Concept: The 5 Essential Ingredients
  {
    id: 'symmetric-concept',
    kind: 'concept',
    title: 'The Five Ingredients of Symmetric Encryption',
    subtitle: 'Plaintext, Encryption Algorithm, Secret Key, Ciphertext, Decryption Algorithm',
    caption: 'Security depends on two mathematical equations: C = E(K, P) and P = D(K, C).',
    eli5Caption: 'Original text + secret key + cipher recipe = scrambled text. Scrambled text + same key + reverse recipe = original text.',
    speakerNotes: {
      script: 'Every symmetric system consists of five distinct components: the original Plaintext P, the Encryption Algorithm E, the shared Secret Key K, the resulting Ciphertext C, and the Decryption Algorithm D such that D(K, E(K, P)) = P.',
      likelyQuestions: [
        {
          question: 'What are the two core security requirements for symmetric encryption?',
          answer: '1. A strong encryption algorithm that resists cryptanalysis even when known. 2. A secure channel for exchanging the secret key.'
        }
      ]
    }
  },

  // 4. Process: Declarative Animated Flow
  {
    id: 'symmetric-process',
    kind: 'process',
    title: 'Symmetric Transmission Pipeline',
    subtitle: 'End-to-End Flow Across an Insecure Channel',
    caption: 'Alice encrypts plaintext with shared key K. Eve observes only ciphertext C. Bob decrypts C with K to recover plaintext.',
    eli5Caption: 'Watch the note turn into scrambled letters as it moves past the spy, then turn back into words at the receiver.',
    scene: {
      id: 'scene-symmetric-flow',
      title: 'Symmetric Encryption & Decryption Pipeline',
      viewBox: '0 0 900 360',
      legend: ['Plaintext (P)', 'Ciphertext (C)', 'Secret Key (K)', 'Secure vs Insecure Channels'],
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice (Sender)', pos: { x: 120, y: 180 } },
        { id: 'bob', kind: 'bob', label: 'Bob (Receiver)', pos: { x: 780, y: 180 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Eavesdropper)', pos: { x: 450, y: 300 } }
      ],
      objects: [
        { id: 'keyA', kind: 'key-shared', label: 'Key K', at: { x: 120, y: 90 }, tone: 'info' },
        { id: 'keyB', kind: 'key-shared', label: 'Key K', at: { x: 780, y: 90 }, tone: 'info' },
        { id: 'plain1', kind: 'plain', label: 'P: "ATTACK"', at: { x: 60, y: 180 } }
      ],
      steps: [
        {
          caption: 'Alice and Bob already possess identical copies of the shared secret key K via a secure out-of-band channel.',
          eli5: 'Alice and Bob met earlier and copied the same secret key.',
          actions: [
            { do: 'highlight', target: ['keyA', 'keyB'], tone: 'info' },
            { do: 'say', actor: 'alice', text: 'We both share Key K!' }
          ]
        },
        {
          caption: 'Alice feeds Plaintext P and Secret Key K into the encryption function: C = E(K, P).',
          eli5: 'Alice locks the message with the key.',
          actions: [
            { do: 'move', obj: 'plain1', to: { x: 230, y: 180 } },
            { do: 'transform', obj: 'plain1', into: { kind: 'cipher', label: 'C: "DWWDFN"', tone: 'signal' } },
            { do: 'pulse', target: 'plain1' }
          ]
        },
        {
          caption: 'Ciphertext C travels over the public, insecure network. Eve intercepts and records the transmission.',
          eli5: 'The scrambled note passes right under the spy\'s nose.',
          actions: [
            { do: 'move', obj: 'plain1', to: { x: 450, y: 180 } },
            { do: 'say', actor: 'eve', text: 'Only garbled letters!' },
            { do: 'highlight', target: ['eve'], tone: 'bad' }
          ]
        },
        {
          caption: 'Ciphertext reaches Bob. Without Key K, Eve cannot deduce P even though she knows algorithm E.',
          eli5: 'Bob receives the locked message.',
          actions: [
            { do: 'move', obj: 'plain1', to: { x: 670, y: 180 } },
            { do: 'say', actor: 'bob', text: 'Applying Key K...' }
          ]
        },
        {
          caption: 'Bob inputs Ciphertext C and Key K into decryption function D(K, C), perfectly restoring Plaintext P.',
          eli5: 'Bob uses his key to unlock the original message.',
          actions: [
            { do: 'move', obj: 'plain1', to: { x: 840, y: 180 } },
            { do: 'transform', obj: 'plain1', into: { kind: 'plain', label: 'P: "ATTACK"', tone: 'ok' } },
            { do: 'highlight', target: ['bob', 'plain1'], tone: 'ok' }
          ]
        }
      ]
    },
    speakerNotes: {
      script: 'Trace the lifecycle: Key distribution happens first over a secure channel. Then encryption occurs locally at Alice. The ciphertext traverses an unshielded public medium where Eve has full read access. Finally, Bob decrypts.',
      likelyQuestions: [
        {
          question: 'Can Eve modify C in transit?',
          answer: 'Yes! Symmetric encryption alone provides Confidentiality, NOT Integrity. To prevent tampering, we must add a MAC or use Authenticated Encryption (AEAD).'
        }
      ]
    }
  },

  // 5. Compare: Kerckhoffs's Principle vs Security by Obscurity
  {
    id: 'symmetric-compare',
    kind: 'compare',
    title: 'Kerckhoffs’s Principle vs Security through Obscurity',
    subtitle: 'The Golden Rule of Modern Cryptographic Engineering',
    caption: 'A cryptosystem must be secure even if everything about the system, except the key, is public knowledge.',
    eli5Caption: 'Don\'t try to hide how your lock works; make a lock that is unbreakable even if a burglar reads the blueprint.',
    comparison: {
      leftTitle: 'Kerckhoffs’s Principle',
      rightTitle: 'Security Through Obscurity',
      differences: [
        {
          feature: 'Algorithm Design',
          left: 'Public, open-source, peer-reviewed by global cryptanalysts',
          right: 'Proprietary, secret, hidden inside closed firmware'
        },
        {
          feature: 'Security Anchor',
          left: 'Secrecy and entropy of the Key K alone',
          right: 'Hiding algorithm details from attackers'
        },
        {
          feature: 'Compromise Recovery',
          left: 'Generate a new key instantly; algorithm remains valid',
          right: 'Entire system must be rewritten if code leaks'
        },
        {
          feature: 'Industry Standard',
          left: 'AES, RSA, ChaCha20, SHA-256 (Universally proven)',
          right: 'DVD CSS, MIFARE Classic (Repeatedly broken)'
        }
      ],
      summaryTakeaway: 'Never rely on algorithm obscurity; security must rest solely in the secrecy and entropy of the key.'
    },
    speakerNotes: {
      script: 'Auguste Kerckhoffs stated in 1883: "Il faut qu\'il n\'exige pas le secret, et qu\'il puisse sans inconvénient tomber entre les mains de l\'ennemi." Shannon reformulated it as: "The enemy knows the system." Never hide the algorithm; keep only the key secret.',
      likelyQuestions: [
        {
          question: 'Why does keeping an algorithm secret make it less secure?',
          answer: 'Secret algorithms bypass peer review by the international mathematical community. Flaws remain hidden from the creator until discovered and weaponized by adversaries.'
        }
      ]
    }
  },

  // 6. Ask the room
  {
    id: 'symmetric-ask',
    kind: 'ask-the-room',
    title: 'Check Your Intuition: The Stolen Safe',
    subtitle: 'Kerckhoffs in Practice',
    caption: 'An attacker reverse-engineers a proprietary banking app and extracts the exact encryption algorithm. What determines if account data is safe?',
    eli5Caption: 'The burglar stole the lock design manual. Can they open your safe?',
    askTheRoom: {
      question: 'Under Kerckhoffs’s Principle, does the attacker obtaining the complete source code of the encryption algorithm compromise security?',
      options: [
        'A. Yes, because once the mathematical algorithm is known, any ciphertext can be reversed immediately without a key.',
        'B. No, provided the secret encryption key remains protected with sufficient entropy and secure key storage.',
        'C. It depends on whether the cipher is a block cipher or a stream cipher.',
        'D. Yes, because open-source algorithms always contain built-in backdoors.'
      ],
      correctIndex: 1,
      explanation: 'Correct! The entire mathematical foundation of symmetric cryptography assumes the adversary has complete knowledge of E and D.'
    },
    speakerNotes: {
      script: 'Give students 30 seconds to vote. Many students instinctively think that keeping the code secret helps security. Emphasize that in modern cryptography, secrecy of the algorithm is considered zero security value.',
      likelyQuestions: []
    }
  },

  // 7. Exam Words
  {
    id: 'symmetric-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Symmetric Model',
    caption: 'Key definitions, 5-ingredient diagram checklist, and typical semester exam questions.',
    eli5Caption: 'The bullet points you write in your answer sheet to get full marks.',
    speakerNotes: {
      script: 'Review these bullet points with your students. Make sure they can draw the 5-ingredient diagram from memory and state Kerckhoffs’s principle verbatim for 5 marks.',
      likelyQuestions: [
        {
          question: 'What is the most common exam mistake on symmetric cipher model?',
          answer: 'Forgetting that symmetric cryptography CANNOT provide non-repudiation because both parties share the exact same key.'
        }
      ]
    },
    examWords: {
      term: 'Symmetric Cipher Model & Kerckhoffs’s Principle',
      definition: 'A symmetric encryption scheme where both communicating parties share an identical secret key K. Security must depend exclusively on the secrecy and entropy of the key, not the algorithm.',
      keywords: [
        'Plaintext (P)',
        'Ciphertext (C)',
        'Secret Key (K)',
        'Encryption Algorithm E(K, P)',
        'Decryption Algorithm D(K, C)',
        'Kerckhoffs’s Principle',
        'Shannon’s Maxim ("The enemy knows the system")',
        'Key Distribution Problem',
        'Computational Security'
      ],
      mustRememberPoints: [
        'A symmetric encryption scheme has 5 ingredients: Plaintext, Encryption Algorithm, Secret Key, Ciphertext, and Decryption Algorithm.',
        'Two fundamental requirements: 1) Strong encryption algorithm, 2) Secure distribution and secrecy of the shared key.',
        'Kerckhoffs’s Principle states that a cryptosystem must remain secure even if everything about the system except the key is public knowledge.'
      ],
      typicalMarks: 5
    }
  }
]

export const symmetricModelPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'symmetric-model',
  topicTitle: 'Symmetric Cipher Model & Kerckhoffs’s Principle',
  targetDurationMinutes: 10,
  plates: symmetricModelPlates
}
