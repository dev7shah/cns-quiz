import { Plate, TopicPresentation } from "@/lib/present/types"

export const accessControlPlates: Plate[] = [
  // 1. Hook: The Confused Deputy
  {
    id: 'ac-hook',
    kind: 'hook',
    title: 'The Confused Deputy Problem (Hardy 1988)',
    subtitle: 'When Authorized Programs are Tricked into Misusing Privilege',
    caption: 'A compiler with root access to a central billing file was tricked by an ordinary user into compiling output directly into the billing file, overwriting company records.',
    eli5Caption: 'A bank guard with the keys is tricked by a thief into opening the vault door because the thief said "the boss ordered an inspection".',
    speakerNotes: {
      script: 'Start with the classic "Confused Deputy" problem introduced by Norm Hardy in 1988. Discretionary access control (DAC) checks if the running process has permission. Because the Fortran compiler ran with root privilege to record billing statistics in a file named "BILL", any user who asked the compiler to write debug logs to "BILL" caused the compiler to overwrite the system accounting log!',
      likelyQuestions: [
        {
          question: 'How do Capability-Based systems prevent Confused Deputy attacks?',
          answer: 'By passing an unforgeable capability token that explicitly designates both the authority and the resource, rather than relying on ambient process identity.'
        }
      ]
    }
  },

  // 2. Concept: The Reference Monitor & ACM
  {
    id: 'ac-reference-monitor',
    kind: 'concept',
    title: 'The Reference Monitor & Access Matrix',
    subtitle: 'The Three Absolute Pillars of Access Mediation',
    caption: 'Every access request from Subject to Object must pass through a Reference Monitor satisfying Complete Mediation, Tamper Resistance, and Verifiability.',
    eli5Caption: 'An unbribable, bulletproof security booth through which every single visitor must pass.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Review the three properties of a Reference Monitor defined in the Anderson 1972 report: 1. Complete Mediation: Every single access request must be checked (no caching bypass). 2. Tamper Resistance: The reference monitor code and data structures cannot be modified by users. 3. Verifiable: The security kernel must be small enough to be analyzed and mathematically proven correct.',
      likelyQuestions: [
        {
          question: 'What is the difference between an ACL and a Capability List?',
          answer: 'An Access Control List (ACL) is attached to the Object (listing allowed users per file); a Capability List is attached to the Subject (a ticket ring of resources the user can open).'
        }
      ]
    }
  },

  // 3. Comparison: Bell-LaPadula vs Biba Models
  {
    id: 'ac-models-compare',
    kind: 'compare',
    title: 'Mandatory Access Control (MAC) Models',
    subtitle: 'Bell-LaPadula (Confidentiality) vs Biba (Integrity)',
    caption: 'Comparing the dual mathematical models governing multi-level security classifications in government and commercial environments.',
    eli5Caption: 'Bell-LaPadula stops secrets from leaking out; Biba stops dirty data from corrupting the crown jewels.',
    comparison: {
      leftTitle: 'Bell-LaPadula Model (Confidentiality)',
      rightTitle: 'Biba Model (Integrity)',
      differences: [
        {
          feature: 'Core Security Objective',
          left: 'Confidentiality (Prevent unauthorized disclosure of classified intel)',
          right: 'Integrity (Prevent unauthorized alteration or contamination of critical data)'
        },
        {
          feature: 'Read Axiom (Simple Property)',
          left: 'No Read Up (NRU): Subject can only read at or below its clearance level',
          right: 'No Read Down (NRD): Subject can only read at or above its integrity level'
        },
        {
          feature: 'Write Axiom (*-Property)',
          left: 'No Write Down (NWD): Subject cannot write secrets into lower classifications',
          right: 'No Write Up (NWU): Subject cannot write dirty data into higher integrity targets'
        },
        {
          feature: 'Primary Application',
          left: 'Military & Defense intelligence (Top Secret, Secret, Confidential)',
          right: 'Financial ledgers, nuclear reactor controllers, medical dosage databases'
        }
      ],
      summaryTakeaway: 'Bell-LaPadula protects secrecy by preventing data from flowing downward; Biba protects integrity by preventing dirty data from flowing upward.'
    },
    speakerNotes: {
      script: 'Go through the axioms carefully. Students often ask: "Why does Bell-LaPadula forbid writing down?" Answer: To prevent a malicious or compromised Top Secret process (like a trojan horse) from copying Top Secret intelligence into an Unclassified public text file. That is the *-Property (Star-Property).',
      likelyQuestions: [
        {
          question: 'Can Bell-LaPadula and Biba be used simultaneously in the same system?',
          answer: 'In theory yes, but in practice combining them restricts subjects to reading and writing strictly at their exact same level, resulting in rigid, unusable systems.'
        }
      ]
    }
  },

  // 4. Process: Role-Based Access Control (RBAC) & SoD
  {
    id: 'ac-rbac-sod',
    kind: 'process',
    title: 'Role-Based Access Control (RBAC)',
    subtitle: 'Managing Permissions at Enterprise Scale (NIST RBAC Standard)',
    caption: 'Users are assigned to Roles, and Roles are assigned to Permissions. Separation of Duties ensures no single employee can complete fraudulent operations alone.',
    eli5Caption: 'Giving keys to a job title (like "Cashier" or "Store Manager"), not to individual people, so when staff change, the locks stay secure.',
    customFigure: 'TopologyDiagram',
    speakerNotes: {
      script: 'Explain the three levels of NIST RBAC: 1. Core RBAC (User-Role-Permission assignment). 2. Hierarchical RBAC (Inheritance of permissions: Senior Doctor inherits Nurse permissions). 3. Constrained RBAC (Static and Dynamic Separation of Duties). A classic SSoD example: The user who creates a purchase order cannot also approve the payment for that order.',
      likelyQuestions: [
        {
          question: 'What is the difference between Static and Dynamic Separation of Duties?',
          answer: 'Static SoD forbids assigning two conflicting roles to the same user at any time; Dynamic SoD allows a user to hold both roles, but forbids activating both within the same active session.'
        }
      ]
    }
  },

  // 5. Worked Example: Multi-Level Security Access Decisions
  {
    id: 'ac-worked',
    kind: 'worked-example',
    title: 'Worked Example: Multi-Level Access Decisions',
    subtitle: 'Evaluating Bell-LaPadula Rules on Clearance Levels',
    caption: 'Tracing whether 4 real-world military access requests are GRANTED or DENIED under Bell-LaPadula axioms.',
    eli5Caption: 'Watch the step-by-step clearance checks that stop secret spies from leaking state secrets.',
    workedExample: {
      problem: 'Evaluate access requests for Colonel Alice and Lieutenant Bob against classified war plans and public press releases using Bell-LaPadula rules.',
      given: {
        'Subject 1': 'Colonel Alice (Clearance: Top Secret, Level 3)',
        'Subject 2': 'Lieutenant Bob (Clearance: Confidential, Level 1)',
        'Object A': 'War Plan Document (Classification: Secret, Level 2)',
        'Object B': 'Public Press Release (Classification: Unclassified, Level 0)'
      },
      steps: [
        {
          label: 'Request 1: Colonel Alice attempts to READ Object A (War Plan)',
          formula: 'Read allowed iff Level(Alice) >= Level(Object A)',
          substitution: 'Level 3 (Top Secret) >= Level 2 (Secret) -> TRUE',
          result: 'ACCESS GRANTED (Simple Security Property / No Read Up satisfied)',
          note: 'Alice possesses higher clearance than the document requires.'
        },
        {
          label: 'Request 2: Lieutenant Bob attempts to READ Object A (War Plan)',
          formula: 'Read allowed iff Level(Bob) >= Level(Object A)',
          substitution: 'Level 1 (Confidential) >= Level 2 (Secret) -> FALSE',
          result: 'ACCESS DENIED (Simple Security Property Violation)',
          note: 'Bob cannot read higher classification data (No Read Up).'
        },
        {
          label: 'Request 3: Colonel Alice attempts to WRITE to Object B (Press Release)',
          formula: 'Write allowed iff Level(Alice) <= Level(Object B)',
          substitution: 'Level 3 (Top Secret) <= Level 0 (Unclassified) -> FALSE',
          result: 'ACCESS DENIED (*-Property Violation / No Write Down)',
          note: 'Writing to a lower classification is blocked to prevent accidental or malicious secret leakage.'
        },
        {
          label: 'Request 4: Lieutenant Bob attempts to WRITE to Object A (War Plan)',
          formula: 'Write allowed iff Level(Bob) <= Level(Object A)',
          substitution: 'Level 1 (Confidential) <= Level 2 (Secret) -> TRUE',
          result: 'ACCESS GRANTED (*-Property / Blind write allowed)',
          note: 'Writing up is permitted under pure Bell-LaPadula because it cannot disclose confidential data.'
        }
      ],
      finalAnswer: 'Request 1 (Read) is Granted; Request 2 (Read) is Denied; Request 3 (Write) is Denied; Request 4 (Write) is Granted.',
      checkVerification: 'Check: Bell-LaPadula guarantees that information flows only upward, never downward into public channels.'
    },
    speakerNotes: {
      script: 'Review Request 3 and Request 4: Request 3 is the most common test trap! Students instinctively think a Top Secret Colonel can write anything. Remind them: No Write Down blocks high-clearance subjects from writing into low-clearance files to prevent trojan data leakage.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'ac-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Control Mechanisms',
    caption: 'Core models, reference monitor rules, and RBAC principles for examinations.',
    eli5Caption: 'Key terms to achieve top marks on access control questions.',
    speakerNotes: {
      script: 'Ensure students write: Reference Monitor (Complete Mediation, Tamper Resistance, Verifiability), DAC (owner sets ACL), MAC (system enforces labels), Bell-LaPadula (No Read Up, No Write Down), Biba (No Read Down, No Write Up), RBAC (roles decouple users from rights).',
      likelyQuestions: [
        {
          question: 'What is the Principle of Least Privilege?',
          answer: 'Every program and every privileged user must operate using the minimum set of privileges necessary to complete their authorized task, minimizing the blast radius of a compromise.'
        }
      ]
    },
    examWords: {
      term: 'Access Control Systems',
      definition: 'Security mechanisms that regulate which subjects (users, processes) are authorized to perform specific operations (read, write, execute) upon specific protected computing objects.',
      keywords: [
        'Reference Monitor (Complete Mediation)',
        'Discretionary Access Control (DAC / ACLs)',
        'Mandatory Access Control (MAC)',
        'Bell-LaPadula (NRU / NWD)',
        'Biba Model (NRD / NWU)',
        'Role-Based Access Control (RBAC)',
        'Separation of Duties (SoD)',
        'Principle of Least Privilege'
      ],
      mustRememberPoints: [
        'The Reference Monitor must satisfy three properties: Complete Mediation (every access checked), Tamper Resistance, and Verifiability.',
        'Bell-LaPadula enforces confidentiality via Simple Security (No Read Up) and *-Property (No Write Down).',
        'Biba enforces data integrity via Simple Integrity (No Read Down) and *-Integrity (No Write Up).'
      ],
      typicalMarks: 5
    }
  }
]

export const accessControlPresentation: TopicPresentation = {
  moduleId: 'm4',
  moduleTitle: 'Protection of Computing Resources and Security Features',
  topicId: 'access-control',
  topicTitle: 'Control Mechanisms & Resource Protection',
  targetDurationMinutes: 10,
  plates: accessControlPlates
}
