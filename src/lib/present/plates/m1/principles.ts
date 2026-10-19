import { Plate, TopicPresentation } from "@/lib/present/types"

export const principlesPlates: Plate[] = [
  // 1. Hook
  {
    id: 'principles-hook',
    kind: 'hook',
    title: 'The Pillars That Guard the Digital World',
    subtitle: 'From Bank UPI Wire Transfers to Medical Records',
    caption: 'When money is transferred or medical records stored, what guarantees it is secret, unaltered, and available?',
    eli5Caption: 'Security is about three simple promises: keeping secrets, stopping changes, and keeping things running.',
    speakerNotes: {
      script: 'Welcome to the foundational principles of computer security. Every defense mechanism, cipher, or protocol we study in this course exists to enforce one of three fundamental pillars: Confidentiality, Integrity, or Availability.',
      likelyQuestions: [
        {
          question: 'Which of the three CIA pillars is most critical?',
          answer: 'None is universally most critical; priority depends on domain. Banks prioritize integrity and availability, military intelligence prioritizes confidentiality.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'principles-analogy',
    kind: 'analogy',
    title: 'The Vault, The Wax Seal, The Open Door',
    subtitle: 'Physical Metaphors of the CIA Triad',
    caption: 'Confidentiality is an armored vault; Integrity is an unbroken wax seal; Availability is a 24/7 unlocked gate.',
    eli5Caption: 'Vault hides the letter; seal proves nobody tampered; gate means you can read it anytime.',
    speakerNotes: {
      script: 'To build intuition, think of Confidentiality as a locked opaque envelope. Integrity is the unbroken wax seal on the flap. Availability is the certainty that the mail carrier delivers the letter when needed.',
      likelyQuestions: [
        {
          question: 'Can you have integrity without confidentiality?',
          answer: 'Yes! A public government gazette or Wikipedia article has public contents (no confidentiality), but cryptographic signatures verify it has not been tampered with (integrity).'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'principles-concept',
    kind: 'concept',
    title: 'The CIA Triad & AAA Framework',
    subtitle: 'Confidentiality, Integrity, Availability + AuthN, AuthZ, Accounting',
    caption: 'CIA defines the goals of information protection; AAA defines the identity controls to enforce them.',
    eli5Caption: 'CIA is what you want to protect; AAA is who you are, what you can do, and keeping a receipt.',
    speakerNotes: {
      script: 'Distinguish clearly between security goals (CIA) and operational security functions (AAA). Authentication verifies identity, Authorization checks permissions, and Accountability logs actions.',
      likelyQuestions: [
        {
          question: 'Where does Non-repudiation fit in?',
          answer: 'Non-repudiation bridges Integrity and Accountability: it prevents a sender from falsely denying they sent a message, achieved via asymmetric digital signatures.'
        }
      ]
    }
  },

  // 4. Compare
  {
    id: 'principles-compare',
    kind: 'compare',
    title: 'Authentication vs Authorization vs Non-Repudiation',
    subtitle: 'Clarifying the Core Identity & Trust Concepts',
    caption: 'Authentication confirms "Who you are"; Authorization decides "What you can do"; Non-repudiation proves "You did it".',
    eli5Caption: 'Showing your passport is authentication; your boarding pass class is authorization; your signed customs form is non-repudiation.',
    speakerNotes: {
      script: 'Students frequently confuse authentication with authorization. Stress this comparison table. Logging into an AWS portal is authentication; IAM role permissions are authorization.',
      likelyQuestions: [
        {
          question: 'Can symmetric encryption provide non-repudiation?',
          answer: 'No! Because both Alice and Bob share the exact same symmetric key, either party could have generated the ciphertext. Only asymmetric private keys provide non-repudiation.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Authentication (AuthN)',
      rightTitle: 'Authorization (AuthZ)',
      differences: [
        { feature: 'Core Question', left: 'Are you truly who you claim to be?', right: 'What computing resources are you allowed to access?', diffTone: 'signal' },
        { feature: 'Primary Mechanism', left: 'Passwords, biometric scan, TOTP, FIDO2', right: 'Access Control Lists (ACL), RBAC policies', diffTone: 'info' },
        { feature: 'Failure Consequence', left: 'Masquerade / identity theft', right: 'Privilege escalation / unauthorized modification', diffTone: 'bad' },
        { feature: 'Execution Order', left: 'Must occur first before access', right: 'Evaluated continuously upon each request', diffTone: 'ok' }
      ],
      summaryTakeaway: 'Authentication establishes verified identity; authorization enforces least privilege upon that verified identity.'
    }
  },

  // 5. Ask the Room
  {
    id: 'principles-ask-room',
    kind: 'ask-the-room',
    title: 'Ask the Room: Classifying the Security Breach',
    subtitle: 'Scenario Identification Poll',
    caption: 'Vote with show of hands (1-4). Press Enter to verify the compromised CIA pillar.',
    eli5Caption: 'An attacker launches a massive traffic flood taking down an online banking portal. What broke?',
    speakerNotes: {
      script: 'Ask the class which pillar fails when a DDoS attack floods a website with junk packets. Have them raise hands for 1 through 4.',
      likelyQuestions: [
        {
          question: 'Did confidentiality break during a DDoS?',
          answer: 'No data was leaked or decrypted; only legitimate users were denied service. Hence, strictly Availability is violated.'
        }
      ]
    },
    askTheRoom: {
      question: 'A botnet unleashes a 50 Gbps UDP flood that saturates an online banking server, causing all customer logins to time out. Which security principle is primarily violated?',
      options: [
        'A. Confidentiality (customers cannot view their statements privately)',
        'B. Integrity (the bank’s database records have been modified)',
        'C. Availability (authorized users are prevented from timely and reliable access)',
        'D. Non-repudiation (the bank cannot prove who launched the traffic)'
      ],
      correctIndex: 2,
      explanation: 'Availability ensures timely and reliable access to computing resources. A volumetric flood denies service to legitimate authorized users without altering data or breaching secrecy.',
      replayStep: 0,
      replayTopicId: 'principles'
    }
  },

  // 6. Exam Words
  {
    id: 'principles-exam',
    kind: 'exam-words',
    title: 'Exam Words: Security Principles (CIA, AAA, Non-Repudiation)',
    subtitle: 'Standard University Exam Definition & Criteria',
    caption: 'Memorize the formal ISO/IEC definitions and the 3 core principles examiners test for.',
    eli5Caption: 'The exact definitions of Confidentiality, Integrity, and Availability to write on the exam paper.',
    speakerNotes: {
      script: 'State the formal ISO definitions verbatim. Highlight that Non-repudiation requires asymmetric digital signatures and cannot be achieved with symmetric keys alone.',
      likelyQuestions: [
        {
          question: 'What marks are typically awarded for this?',
          answer: 'Typically a 5-mark question asking to define CIA triad with real-world examples, or differentiate passive vs active threats.'
        }
      ]
    },
    examWords: {
      term: 'The CIA Triad & Non-Repudiation',
      definition: 'The foundational security triad comprising: Confidentiality (preserving authorized restrictions on information access and disclosure), Integrity (guarding against improper information modification or destruction), and Availability (ensuring timely and reliable access to and use of information). Non-repudiation provides proof of the origin and integrity of data such that the sender cannot deny sending it.',
      keywords: [
        'Confidentiality (Secrecy)',
        'Integrity (Unmodified)',
        'Availability (Timely Access)',
        'Non-Repudiation',
        'AAA Framework (AuthN, AuthZ, Accounting)'
      ],
      mustRememberPoints: [
        'Passive attacks threaten Confidentiality; Active attacks threaten Integrity and Availability.',
        'Symmetric cryptography provides confidentiality and integrity, but CANNOT provide non-repudiation.',
        'Accountability requires logging and auditing so that security events can be traced definitively to a verified entity.'
      ],
      typicalMarks: 5
    }
  }
]

export const principlesPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'principles',
  topicTitle: 'Principles of Security (CIA & AAA)',
  targetDurationMinutes: 10,
  plates: principlesPlates
}
