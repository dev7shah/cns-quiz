import { Plate, TopicPresentation } from "@/lib/present/types"

export const passwordSecurityPlates: Plate[] = [
  // 1. Hook: The 2012 LinkedIn Breach
  {
    id: 'pwd-hook',
    kind: 'hook',
    title: 'The LinkedIn & Adobe Breaches',
    subtitle: 'Why Unsalted Hashes Led to 117 Million Decrypted Passwords',
    caption: 'In 2012, hackers dumped 117 million LinkedIn password hashes. Because LinkedIn stored them as raw, unsalted SHA-1 hashes, over 90% were cracked within days using precomputed rainbow tables.',
    eli5Caption: 'Saving everyone’s passwords in plain fingerprints without a unique secret sprinkle: one stolen cookbook unlocked millions of accounts instantly.',
    speakerNotes: {
      script: 'Hook the room with the LinkedIn breach: In 2012, 117 million user hashes were leaked on the dark web. LinkedIn made two fatal architectural mistakes: 1. They used SHA-1 (a fast message digest designed for file checksums, not password storage). 2. They used NO salt! Attackers simply looked up the hashes in free online rainbow tables.',
      likelyQuestions: [
        {
          question: 'What is a salt?',
          answer: 'A random string of bytes (typically 16+ bytes) generated uniquely for each user upon account creation and stored alongside the password hash in the database.'
        }
      ]
    }
  },

  // 2. Process: Rainbow Tables & The Power of Salt
  {
    id: 'pwd-rainbow-tables',
    kind: 'process',
    title: 'Rainbow Tables & The Salt Defense',
    subtitle: 'Time-Memory Trade-Off Chains Defeated by Random Salts',
    caption: 'Rainbow tables use alternating hash and reduction functions to store gigabytes of precomputed password hashes in megabytes of disk space.',
    eli5Caption: 'A compressed shortcut map that connects words to hashes; adding a unique salt burns the map and forces the thief to walk every step on foot.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Explain the mechanism of a rainbow table: Storing every 8-character password hash would take terabytes. Instead, a rainbow table stores chains: Password P0 -> Hash H -> Reduction R1 -> Password P1 -> ... -> Password Pn. Only P0 and Pn are stored in the table! When an attacker gets a hash, they apply reductions until they find an endpoint. Adding a unique salt completely breaks this because the attacker would have to build a new rainbow table for every single user!',
      likelyQuestions: [
        {
          question: 'Does the salt need to be secret?',
          answer: 'No! The salt is stored in plaintext in the database next to the username. Its purpose is not secrecy, but uniqueness: to ensure that two users with the identical password have completely different hashes.'
        }
      ]
    }
  },

  // 3. Comparison: Password Hashing Algorithms
  {
    id: 'pwd-algos-compare',
    kind: 'compare',
    title: 'Password Hashing Functions Comparison',
    subtitle: 'Fast Hashes (SHA-256) vs Memory-Hard Functions (Argon2id)',
    caption: 'Why general-purpose cryptographic hashes fail for passwords, and how memory-hard key stretching functions defend against GPU/ASIC clusters.',
    eli5Caption: 'Fast hashes let a supercomputer guess billions of words a second; slow memory-hard hashes force the computer to pause and use heavy RAM on every single guess.',
    comparison: {
      leftTitle: 'Fast Message Digests (SHA-256 / MD5)',
      rightTitle: 'Slow / Memory-Hard (bcrypt / Argon2id)',
      differences: [
        {
          feature: 'Design Objective',
          left: 'Ultra-fast throughput for files and packet verification',
          right: 'Deliberately slow and resource-intensive to penalize attackers'
        },
        {
          feature: 'Cracking Speed on 8x RTX 4090 GPU',
          left: '100 Billion hashes per second (10^11 H/s)',
          right: 'Argon2id: ~100 to 1,000 hashes per second'
        },
        {
          feature: 'Memory Hardness',
          left: 'Zero RAM required (fits entirely in GPU registers)',
          right: 'Argon2id requires 64 MB of RAM per hash, starving GPU threads'
        },
        {
          feature: 'Current Industry Standard',
          left: 'Deprecated for passwords; strictly forbidden by NIST',
          right: 'Argon2id (Winner of Password Hashing Competition 2015)'
        }
      ],
      summaryTakeaway: 'Never use raw SHA-256 or MD5 for passwords. Always use modern key-stretching algorithms: Argon2id is standard; bcrypt and PBKDF2 are legacy acceptable.'
    },
    speakerNotes: {
      script: 'Make sure students understand why fast is bad for passwords: For digital signatures, you want SHA-256 to take 1 microsecond. But for password verification, 1 microsecond allows an attacker with a GPU rig to test 100 billion passwords a second! A password hashing function must take 100 milliseconds (0.1s) and require 64 MB of RAM.',
      likelyQuestions: []
    }
  },

  // 4. Concept: NIST SP 800-63B Guidelines
  {
    id: 'pwd-nist-guidelines',
    kind: 'concept',
    title: 'Modern Password Criteria: NIST SP 800-63B',
    subtitle: 'Debunking 20 Years of Bad Password Rules',
    caption: 'NIST guidelines abolish forced periodic rotation and arbitrary symbol rules, prioritizing password length and screening against breached password blacklists.',
    eli5Caption: 'Stop forcing users to change "Spring2025!" into "Summer2025!"; encourage long 4-word passphrases instead.',
    customFigure: 'TopologyDiagram',
    speakerNotes: {
      script: 'Review the landmark shifts in NIST SP 800-63B: 1. NO forced periodic expiration (e.g. 90-day resets lead to predictable patterns like Password123! -> Password124!). 2. NO arbitrary character composition rules (e.g. at least 1 digit, 1 symbol). 3. Length over complexity (minimum 8 chars, recommend 12-64 chars; passphrases like "correct-horse-battery-staple"). 4. Mandatory screening against compromised breach databases.',
      likelyQuestions: [
        {
          question: 'Why did NIST remove the 90-day password expiration rule?',
          answer: 'Studies proved that frequent expiration causes users to choose weaker, predictable variations rather than genuinely strong, memorable passphrases.'
        }
      ]
    }
  },

  // 5. Worked Example: Calculating Password Entropy & Cracking Time
  {
    id: 'pwd-worked',
    kind: 'worked-example',
    title: 'Worked Example: Password Entropy & GPU Cracking Speed',
    subtitle: 'Comparing an 8-Char Complex Password vs a 20-Char Passphrase',
    caption: 'Calculating information entropy E = L * log2(R) and comparing real-world cracking times on an RTX 4090 GPU cluster.',
    eli5Caption: 'Watch the math prove why four simple dictionary words beat an impossible-to-remember 8-character symbol soup.',
    workedExample: {
      problem: 'Compare the information entropy and GPU offline cracking resistance of complex 10-char password "Tr0ub4dor&" against 21-char passphrase "correct-horse-battery".',
      given: {
        'Password A': '"Tr0ub4dor&" (Length L = 10, Charset R = 95 ASCII)',
        'Password B': '"correct-horse-battery" (Length L = 21, Lowercase letters R = 26)',
        'Attacker Hardware': '8x RTX 4090 GPU cluster testing 10^11 SHA-256 hashes/sec'
      },
      steps: [
        {
          label: 'Calculate Entropy for Password A ("Tr0ub4dor&")',
          formula: 'E_A = L * log2(R)',
          substitution: '10 * log2(95) = 10 * 6.57',
          result: 'E_A ≈ 65.7 bits of entropy',
          note: 'Hard for humans to memorize; total keyspace = 2^65.7 ≈ 5.9 * 10^19 combinations.'
        },
        {
          label: 'Calculate Entropy for Password B ("correct-horse-battery")',
          formula: 'E_B = L * log2(R)',
          substitution: '21 * log2(26) = 21 * 4.70',
          result: 'E_B ≈ 98.7 bits of entropy',
          note: 'Easy for humans to memorize; total keyspace = 2^98.7 ≈ 4.7 * 10^29 combinations.'
        },
        {
          label: 'Compute Average Offline Search Space (50% of keyspace)',
          formula: 'Avg_Guesses = 2^E / 2',
          substitution: 'Password A: 2.95 * 10^19; Password B: 2.35 * 10^29',
          result: 'Keyspace gap of 10 orders of magnitude',
          note: 'Password B has 8 billion times more security margin than Password A.'
        },
        {
          label: 'Calculate Cracking Time on 100 GH/s GPU Cluster',
          formula: 'Time = Avg_Guesses / (10^11 guesses/sec)',
          substitution: 'Password A: 2.95 * 10^8 sec; Password B: 2.35 * 10^18 sec',
          result: 'Password A: ~9.3 years; Password B: ~74 billion years',
          note: 'If unsalted or weak, Password A is cracked quickly; Password B outlives the universe.'
        }
      ],
      finalAnswer: 'Password B ("correct-horse-battery") provides 98.7 bits of entropy vs 65.7 bits, taking 74 billion years to crack.',
      checkVerification: 'Check: Entropy scales linearly with length L but only logarithmically with character pool R. Length always wins!'
    },
    speakerNotes: {
      script: 'Emphasize the core lesson: Length beats complexity every single time! Doubling the character pool R only adds 1 bit of entropy per character. But doubling the length L doubles the total entropy! This is the fundamental math behind XKCD #936 and NIST SP 800-63B.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'pwd-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Password Security',
    caption: 'Entropy formulas, attack types, salting mechanics, and NIST guidelines for examinations.',
    eli5Caption: 'The exact terms required for maximum marks on password security questions.',
    speakerNotes: {
      script: 'Review the key terms: Entropy (E = L * log2(R)), Salt (random per-user byte string), Key Stretching (PBKDF2, bcrypt, Argon2id), Rainbow Table, Dictionary Attack, NIST SP 800-63B. Explain why Argon2 won the Password Hashing Competition (memory hardness prevents ASIC/GPU parallelization).',
      likelyQuestions: [
        {
          question: 'What is pepper in password security?',
          answer: 'A secret key stored outside the database (e.g. in a Hardware Security Module) that is combined with the password and salt before hashing, protecting hashes even if the SQL database is dumped.'
        }
      ]
    },
    examWords: {
      term: 'Password Security & Key Stretching',
      definition: 'Cryptographic techniques used to protect user authentication credentials, transforming user passphrases into high-entropy, brute-force-resistant cryptographic keys.',
      keywords: [
        'Password Entropy (L * log2(R))',
        'Cryptographic Salt (Uniqueness)',
        'Key Stretching (Argon2id / bcrypt / PBKDF2)',
        'Rainbow Table Reduction Chains',
        'Memory-Hard Algorithms',
        'NIST SP 800-63B Guidelines',
        'Credential Stuffing Attack',
        'Dictionary Permutation Attacks'
      ],
      mustRememberPoints: [
        'A salt is a unique random byte string stored alongside the password hash; it prevents precomputed rainbow table lookups and makes identical passwords hash differently.',
        'Modern password storage requires slow, memory-hard key stretching functions like Argon2id or bcrypt to neutralize high-speed GPU cluster attacks.',
        'NIST SP 800-63B recommends long passphrases (length over complexity), screening against breached credential blacklists, and eliminating forced periodic expiration.'
      ],
      typicalMarks: 5
    }
  }
]

export const passwordSecurityPresentation: TopicPresentation = {
  moduleId: 'm4',
  moduleTitle: 'Protection of Computing Resources and Security Features',
  topicId: 'password-security',
  topicTitle: 'Password Attacks & Selection Criteria',
  targetDurationMinutes: 10,
  plates: passwordSecurityPlates
}
