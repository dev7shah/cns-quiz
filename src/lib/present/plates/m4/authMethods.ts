import { Plate, TopicPresentation } from "@/lib/present/types"

export const authMethodsPlates: Plate[] = [
  // 1. Hook: The Death of SMS 2FA
  {
    id: 'auth-mth-hook',
    kind: 'hook',
    title: 'The SIM Swap Disaster',
    subtitle: 'Why SMS Verification Codes are Not True 2-Factor Security',
    caption: 'By bribing or tricking a mobile telecom clerk into reassigning a victim’s phone number (SIM Swap), attackers intercept SMS codes in seconds, hijacking Twitter, bank, and crypto accounts.',
    eli5Caption: 'A thief convinces the mail carrier to forward all your letters to their house, catching every security code your bank sends you.',
    speakerNotes: {
      script: 'Start by deconstructing SMS two-factor authentication: NIST formally deprecated SMS as an out-of-band authenticator in SP 800-63B. Why? Because SMS is unencrypted over SS7 cellular networks, easily intercepted, and vulnerable to SIM-swapping. Real MFA requires app-based TOTP or hardware FIDO2 keys.',
      likelyQuestions: [
        {
          question: 'Why do so many banks still use SMS codes?',
          answer: 'Convenience and zero deployment friction: every phone has SMS capability without requiring users to install an authenticator app or buy a hardware key.'
        }
      ]
    }
  },

  // 2. Concept: The Three Fundamental Factors
  {
    id: 'auth-mth-factors',
    kind: 'concept',
    title: 'The Three Factors of Authentication',
    subtitle: 'Knowledge, Possession, and Inherence',
    caption: 'True Multi-Factor Authentication requires combining at least two distinct categories of authentication factors.',
    eli5Caption: 'Something you know in your head, something you hold in your hand, and something you are on your body.',
    customFigure: 'TopologyDiagram',
    speakerNotes: {
      script: 'Review the three categories: 1. Knowledge (Something you know: Password, PIN, Secret passphrase). 2. Possession (Something you have: Physical smartcard, FIDO2 hardware key, TOTP mobile app). 3. Inherence (Something you are: Fingerprint, Retina/Iris scan, Facial geometry). Emphasize: using a password AND a PIN is NOT two-factor auth—both are knowledge factors!',
      likelyQuestions: [
        {
          question: 'Is providing an ATM card and a PIN two-factor authentication?',
          answer: 'Yes! The ATM card is possession (something you have) and the PIN is knowledge (something you know).'
        }
      ]
    }
  },

  // 3. Process: Biometric Performance (FAR, FRR, CER)
  {
    id: 'auth-mth-biometrics',
    kind: 'process',
    title: 'Biometric Evaluation: The FAR vs FRR Trade-off',
    subtitle: 'Understanding the Crossover Error Rate (CER / EER)',
    caption: 'Tuning biometric sensitivity creates an inverse trade-off: high sensitivity causes legitimate users to be rejected (FRR); low sensitivity allows imposters to be accepted (FAR).',
    eli5Caption: 'Make the face scanner too strict and you can’t unlock your phone with sunglasses; make it too loose and your sibling can unlock it.',
    customFigure: 'GrowthChart',
    speakerNotes: {
      script: 'Explain the curves: False Acceptance Rate (FAR) is Type I error (imposter accepted). False Rejection Rate (FRR) is Type II error (authorized user rejected). As the sensitivity threshold increases, FAR drops to near zero, but FRR skyrockets! The point where FAR equals FRR is the Crossover Error Rate (CER). The lower the CER, the more accurate the biometric sensor.',
      likelyQuestions: [
        {
          question: 'What is a typical CER for modern commercial fingerprint scanners?',
          answer: 'Capacitive and ultrasonic smartphone fingerprint sensors achieve a CER between 0.1% and 0.001%.'
        }
      ]
    }
  },

  // 4. Comparison: 2FA & Passwordless Evolution
  {
    id: 'auth-mth-compare',
    kind: 'compare',
    title: 'Authentication Mechanisms Evolution',
    subtitle: 'SMS Codes vs App TOTP vs FIDO2 / WebAuthn Passkeys',
    caption: 'Evaluating phishing resistance, network dependencies, and security architectures across modern authenticators.',
    eli5Caption: 'From insecure text messages, to timed rolling codes on your phone, to unphishable cryptographic hardware keys.',
    comparison: {
      leftTitle: 'Traditional MFA (SMS & App TOTP)',
      rightTitle: 'Passwordless Standard (FIDO2 / WebAuthn)',
      differences: [
        {
          feature: 'Phishing Resistance',
          left: 'Vulnerable (Reverse proxies like Evilginx steal TOTP codes in real time)',
          right: 'Immune (Hardware signs the browser origin, e.g. cns-lab.edu)'
        },
        {
          feature: 'Shared Secrets on Server',
          left: 'Yes (Server stores password hash and TOTP seed secret)',
          right: 'Zero (Server stores ONLY the user’s public key)'
        },
        {
          feature: 'Network Dependency',
          left: 'SMS requires cellular carrier; TOTP requires no network to generate',
          right: 'Zero network dependency on client device'
        },
        {
          feature: 'Underlying Cryptography',
          left: 'Symmetric HMAC-SHA1 on time counter (RFC 6238)',
          right: 'Asymmetric Public-Key Cryptography (ECDSA P-256 / Ed25519)'
        }
      ],
      summaryTakeaway: 'FIDO2 / WebAuthn is the only modern authentication standard that is mathematically immune to credential stuffing, database leaks, and reverse-proxy phishing attacks.'
    },
    speakerNotes: {
      script: 'Highlight the phishing resistance row: Tools like Evilginx2 set up a proxy between the user and the real site. When the user types their TOTP code, Evilginx passes it to the real server, logs in, and steals the session cookie! FIDO2 defeats this because the browser cryptographically signs the origin domain.',
      likelyQuestions: []
    }
  },

  // 5. Worked Example: Step-by-Step RFC 6238 TOTP Derivation
  {
    id: 'auth-mth-worked',
    kind: 'worked-example',
    title: 'Worked Example: Generating an RFC 6238 TOTP Code',
    subtitle: 'Tracing Google Authenticator Time Counter and Dynamic Truncation',
    caption: 'Calculating the time step counter T, HMAC generation, and dynamic truncation to produce a 6-digit one-time code.',
    eli5Caption: 'Watch how your phone turns the current second on the clock into the rolling 6-digit code.',
    workedExample: {
      problem: 'Derive a 6-digit RFC 6238 TOTP code from shared secret "JBSWY3DPEHPK3PXP" at Unix timestamp 1,700,000,000 using 30-second time windows.',
      given: {
        'Current Unix Timestamp (T_now)': '1,700,000,000 seconds',
        'Time Step Window (T_X)': '30 seconds',
        'Epoch Start (T_0)': '0 seconds',
        'Shared Base32 Secret': '"JBSWY3DPEHPK3PXP"'
      },
      steps: [
        {
          label: 'Calculate 64-Bit Time Counter T',
          formula: 'T = floor((T_now - T_0) / T_X)',
          substitution: 'floor((1,700,000,000 - 0) / 30)',
          result: 'T = 56,666,666 (in hex: 0x000000000360BCAE)',
          note: 'Counter advances by 1 every 30 seconds worldwide.'
        },
        {
          label: 'Compute Keyed Hash: HMAC-SHA1(Secret, T)',
          formula: 'HS = HMAC-SHA1(Secret, 8-byte big-endian T)',
          substitution: 'HMAC-SHA1(K, 0x000000000360BCAE)',
          result: '20-byte HMAC digest',
          note: 'Produces a 160-bit pseudorandom byte array.'
        },
        {
          label: 'Dynamic Truncation (RFC 4226 Section 5.4)',
          formula: 'Offset = HS[19] & 0x0F; Extract 4 bytes from HS[Offset]',
          substitution: 'Lowest 4 bits of last byte select byte offset in digest',
          result: 'Binary integer P (31 bits, ignoring high bit)',
          note: 'High bit is masked to 0 to avoid signed integer ambiguity.'
        },
        {
          label: 'Compute 6-Digit Decimal Code',
          formula: 'Code = (P mod 10^6).padStart(6, "0")',
          substitution: 'P mod 1,000,000',
          result: '6-digit code (e.g. "482910")',
          note: 'Valid for exactly 30 seconds before counter T increments.'
        }
      ],
      finalAnswer: 'Generated 6-digit TOTP code is deterministic and verifiable by any server sharing secret K.',
      checkVerification: 'Check: Server computes identical counter T from UTC clock; verifies match within ±1 window drift.'
    },
    speakerNotes: {
      script: 'Review why time synchronization matters: If client and server clocks differ by more than 30 seconds, the counter T differs. Servers typically allow ±1 time window drift (checking T-1, T, T+1) to absorb minor clock skews.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'auth-mth-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for User Authentication and MFA',
    caption: 'Authentication factors, biometric curves, and standard protocols for examinations.',
    eli5Caption: 'The exact terms required for full marks on authentication questions.',
    speakerNotes: {
      script: 'Drill students on the 3 factors (Knowledge, Possession, Inherence), the definition of CER, the formula for TOTP (T = floor(time/30)), and the advantages of FIDO2 WebAuthn over shared-secret passwords.',
      likelyQuestions: [
        {
          question: 'What is WebAuthn?',
          answer: 'A W3C web standard that enables browsers to authenticate users via public-key cryptography using platform authenticators (TouchID, Windows Hello) or roaming security keys (YubiKey).'
        }
      ]
    },
    examWords: {
      term: 'Multi-Factor Authentication (MFA)',
      definition: 'An electronic authentication method that grants access only after a user successfully presents two or more independent credentials across different factor categories: Knowledge, Possession, and Inherence.',
      keywords: [
        'Authentication Factors (Know / Have / Are)',
        'False Acceptance Rate (FAR)',
        'False Rejection Rate (FRR)',
        'Crossover Error Rate (CER / EER)',
        'Time-Based One-Time Password (TOTP RFC 6238)',
        'Dynamic Truncation (RFC 4226)',
        'FIDO2 / WebAuthn',
        'Origin-Bound Phishing Resistance'
      ],
      mustRememberPoints: [
        'True Multi-Factor Authentication requires credentials from at least two different categories (e.g. Password + Hardware Key).',
        'The Crossover Error Rate (CER) is the operating point where FAR equals FRR, serving as the standard metric for comparing biometric sensor accuracy.',
        'FIDO2 / WebAuthn provides origin binding, ensuring that hardware security keys only sign challenges for the authentic domain, defeating phishing attacks.'
      ],
      typicalMarks: 5
    }
  }
]

export const authMethodsPresentation: TopicPresentation = {
  moduleId: 'm4',
  moduleTitle: 'Protection of Computing Resources and Security Features',
  topicId: 'auth-methods',
  topicTitle: 'User Authentication & Multi-Factor Auth',
  targetDurationMinutes: 10,
  plates: authMethodsPlates
}
