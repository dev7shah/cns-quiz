import { Plate, TopicPresentation } from "@/lib/present/types"

export const osiArchitecturePlates: Plate[] = [
  // 1. Hook
  {
    id: 'osi-hook',
    kind: 'hook',
    title: 'The X.800 Blueprint of Network Defense',
    subtitle: 'ITU-T Recommendation X.800 Security Architecture',
    caption: 'X.800 is the international systematic standard defining security attacks, services, and mechanisms.',
    eli5Caption: 'A formal international rulebook that tells engineers what attacks exist and what defenses solve them.',
    speakerNotes: {
      script: 'To assess and design secure network communications, ITU-T developed recommendation X.800. It defines three dimensions: Security Attacks (what threatens us), Security Services (what protection we require), and Security Mechanisms (the mathematical tools to enforce protection).',
      likelyQuestions: [
        {
          question: 'What is the relationship between an attack, service, and mechanism?',
          answer: 'An attack threatens a system; a service is the abstract policy that counters that threat; a mechanism is the concrete algorithm or protocol that implements the service.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'osi-analogy',
    kind: 'analogy',
    title: 'The Three-Axis Defense Matrix',
    subtitle: 'Threats × Policies × Tools',
    caption: 'Attacks are the diseases; Services are the health requirements; Mechanisms are the medicines.',
    eli5Caption: 'An attack is a burglar; the service is home insurance; the mechanism is the deadbolt lock.',
    speakerNotes: {
      script: 'Use the medical metaphor: an attack is a disease (e.g. infection). The security service is the desired health state (e.g. immunity). The security mechanism is the actual medicine or vaccine (e.g. antibiotic).',
      likelyQuestions: [
        {
          question: 'Can one mechanism satisfy multiple services?',
          answer: 'Yes! Symmetric encryption satisfies both Confidentiality and Data Origin Authentication (when combined with challenge-response).'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'osi-concept',
    kind: 'concept',
    title: 'Passive Attacks vs Active Attacks',
    subtitle: 'Release of Contents & Traffic Analysis vs Masquerade, Replay, Modification, DoS',
    caption: 'Passive attacks only observe (threaten Confidentiality); Active attacks alter data or fabricate streams.',
    eli5Caption: 'Passive attacks secretly listen; active attacks change your messages or pretend to be you.',
    speakerNotes: {
      script: 'Every student must know this fundamental division: Passive attacks are eavesdropping and traffic analysis. They are hard to detect, so we focus on prevention (encryption). Active attacks alter state, so we focus on detection and recovery.',
      likelyQuestions: [
        {
          question: 'Why are passive attacks harder to detect than active attacks?',
          answer: 'Because passive attacks do not alter data packets, inject traffic, or cause noticeable server delays; the wire transmission continues normally while being recorded.'
        }
      ]
    }
  },

  // 4. Compare
  {
    id: 'osi-compare',
    kind: 'compare',
    title: 'The 5 Standard Security Services (X.800)',
    subtitle: 'Authentication, Access Control, Confidentiality, Integrity, Non-Repudiation',
    caption: 'Each service maps directly to specific cryptographic mechanisms designed to enforce it.',
    eli5Caption: 'Five core shields that protect any digital system across the network.',
    speakerNotes: {
      script: 'Walk through the 5 service classes defined in X.800. For each service, identify its matching cryptographic mechanism: Confidentiality uses ciphers; Integrity uses MACs/hashes; Non-repudiation uses digital signatures.',
      likelyQuestions: [
        {
          question: 'What is Traffic Padding mechanism?',
          answer: 'Generating spurious ciphertext packets to disguise actual traffic rates, preventing passive traffic analysis.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Passive Security Attacks',
      rightTitle: 'Active Security Attacks',
      differences: [
        { feature: 'Core Behavior', left: 'Eavesdropping, monitoring, traffic analysis', right: 'Masquerade, replay, modification, DoS', diffTone: 'signal' },
        { feature: 'Impact on System State', left: 'Zero state alteration (silent listening)', right: 'State modified, resources consumed, sessions hijacked', diffTone: 'bad' },
        { feature: 'Primary Goal', left: 'Steal confidential information', right: 'Disrupt services or tamper with records', diffTone: 'warn' },
        { feature: 'Defense Strategy', left: 'Focus on Prevention (strong encryption)', right: 'Focus on Detection, Prevention & Recovery', diffTone: 'ok' }
      ],
      summaryTakeaway: 'Prevent passive attacks via encryption; detect and recover from active attacks via signatures, MACs, and firewalls.'
    }
  },

  // 5. Exam Words
  {
    id: 'osi-exam',
    kind: 'exam-words',
    title: 'Exam Words: OSI Security Architecture (X.800)',
    subtitle: 'Syllabus Keyword Reference for University Examinations',
    caption: 'Define Security Attack, Security Service, and Security Mechanism with exact X.800 classifications.',
    eli5Caption: 'The three formal definitions and classification lists examiners ask for in 5-mark questions.',
    speakerNotes: {
      script: 'Remind students of the three formal definitions: Security Attack (any action that compromises security), Security Service (a processing or communication service that enhances security), Security Mechanism (a mechanism designed to detect, prevent, or recover from an attack).',
      likelyQuestions: [
        {
          question: 'What are the 4 active attacks defined in X.800?',
          answer: '1. Masquerade, 2. Replay, 3. Modification of messages, 4. Denial of service.'
        }
      ]
    },
    examWords: {
      term: 'OSI Security Architecture (ITU-T X.800)',
      definition: 'A systematic framework that categorizes computer security into three core components: Security Attacks (actions that compromise information security, divided into Passive and Active), Security Services (capabilities provided by a protocol layer to ensure adequate security, covering 5 classes: Authentication, Access Control, Data Confidentiality, Data Integrity, and Non-repudiation), and Security Mechanisms (concrete algorithms implemented to enforce services).',
      keywords: [
        'Security Attack vs Service vs Mechanism',
        'Passive Attacks (Eavesdropping, Traffic Analysis)',
        'Active Attacks (Masquerade, Replay, Modification, DoS)',
        '5 Security Services (AuthN, Access Control, Confidentiality, Integrity, Non-Repudiation)',
        'X.800 Recommendation'
      ],
      mustRememberPoints: [
        'Passive attacks threaten Confidentiality; Active attacks threaten Integrity and Availability.',
        'Passive attacks focus on PREVENTION (via encryption); Active attacks focus on DETECTION and RECOVERY.',
        'The 4 specific active attack classes are: Masquerade, Replay, Modification of messages, and Denial of Service.'
      ],
      typicalMarks: 5
    }
  }
]

export const osiArchitecturePresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'osi-architecture',
  topicTitle: 'OSI Security Architecture (X.800)',
  targetDurationMinutes: 10,
  plates: osiArchitecturePlates
}
