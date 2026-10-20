import { Plate, TopicPresentation } from "@/lib/present/types"

export const pkiCertificatesPlates: Plate[] = [
  // 1. Hook: The DigiNotar Bankruptcy
  {
    id: 'pki-hook',
    kind: 'hook',
    title: 'The DigiNotar Catastrophe (2011)',
    subtitle: 'When a Compromised Root CA Shook Global Internet Trust',
    caption: 'In 2011, hackers infiltrated Dutch Certificate Authority DigiNotar and issued 531 rogue certificates, including a wildcard *.google.com cert used to intercept 300,000 Gmail users in Iran. Within weeks, DigiNotar was removed from every browser and went bankrupt.',
    eli5Caption: 'A trusted passport office was robbed by thieves who started printing real passports with fake names, forcing governments to cancel the office entirely.',
    speakerNotes: {
      script: 'Start by confronting the core problem: How does your browser know that google.com really belongs to Google, and not to an attacker or rogue Wi-Fi router? Public key cryptography alone cannot answer this—it only gives you a number. Public Key Infrastructure (PKI) binds a name to a public key via digital certificates.',
      likelyQuestions: [
        {
          question: 'How was the DigiNotar attack discovered?',
          answer: 'Chrome users in Iran received SSL warning errors because Google had hardcoded its own public keys into Chrome (HTTP Public Key Pinning).'
        }
      ]
    }
  },

  // 2. Process: Hierarchy of Trust & Certificate Chains
  {
    id: 'pki-chain',
    kind: 'process',
    title: 'The Hierarchical Chain of Trust',
    subtitle: 'Root CAs, Intermediates, and Leaf Certificates',
    caption: 'Trust flows downward: Self-signed Root CAs in the operating system validate Intermediate CAs, which sign End-Entity (Leaf) server certificates.',
    eli5Caption: 'The president stamps the governor’s badge; the governor stamps the sheriff’s badge; the sheriff inspects your driver’s license.',
    customFigure: 'ChainDiagram',
    speakerNotes: {
      script: 'Explain the three tiers: 1. Root CA: Self-signed, valid for 20-30 years, stored offline in air-gapped high-security vaults (HSMs). 2. Intermediate CA: Signed by Root, performs daily automated issuance. 3. Leaf Certificate: Issued to web servers (e.g. cns-lab.edu), valid for 90-398 days. If an intermediate key is compromised, only that branch is revoked—the root remains safe.',
      likelyQuestions: [
        {
          question: 'Why don’t Root CAs sign server certificates directly?',
          answer: 'To limit exposure. Signing servers requires an online server. If an online server is hacked, revoking a Root CA breaks hundreds of millions of devices.'
        }
      ]
    }
  },

  // 3. Concept: X.509 v3 Certificate Anatomy
  {
    id: 'pki-x509-anatomy',
    kind: 'concept',
    title: 'Anatomy of an X.509 v3 Certificate',
    subtitle: 'The Standard Digital Identity Container (RFC 5280)',
    caption: 'An X.509 certificate binds a Subject’s identity to their Public Key, signed by the Issuer’s private key.',
    eli5Caption: 'A digital ID card containing your photo (public key), your name, who approved it, expiration date, and a holographic seal.',
    customFigure: 'PacketBuilder',
    speakerNotes: {
      script: 'Walk through the core fields defined in ITU-T X.509 / RFC 5280: 1. Version (v3). 2. Serial Number. 3. Signature Algorithm ID. 4. Issuer Name (CA). 5. Validity Period (Not Before, Not After). 6. Subject Name. 7. Subject Public Key Info. 8. Issuer Unique ID & Subject Unique ID. 9. Extensions: Basic Constraints (CA=TRUE/FALSE), Key Usage, Subject Alternative Name (SAN).',
      likelyQuestions: [
        {
          question: 'What is the most critical X.509 extension?',
          answer: 'Basic Constraints: isCA=true/false. If this field is missing or unchecked, a regular website certificate could act as a CA and issue certificates for any domain!'
        }
      ]
    }
  },

  // 4. Comparison: Revocation Mechanisms
  {
    id: 'pki-revocation-compare',
    kind: 'compare',
    title: 'Certificate Revocation Mechanisms',
    subtitle: 'CRL vs OCSP vs OCSP Stapling (RFC 6066)',
    caption: 'How clients discover when a certificate has been compromised before its expiration date.',
    eli5Caption: 'A giant stolen credit card booklet (CRL) vs calling the bank live (OCSP) vs the cashier showing you the bank’s fresh signed clearance (OCSP Stapling).',
    comparison: {
      leftTitle: 'Traditional Revocation (CRL / OCSP)',
      rightTitle: 'Modern Standard (OCSP Stapling / Must-Staple)',
      differences: [
        {
          feature: 'Network Latency',
          left: 'High (Browser pauses connection to download megabyte CRLs or query CA)',
          right: 'Zero (Server includes pre-cached, CA-signed OCSP response in TLS handshake)'
        },
        {
          feature: 'User Privacy',
          left: 'Leaked (CA learns every website user visits via live OCSP queries)',
          right: 'Preserved (CA never sees individual user connections)'
        },
        {
          feature: 'Failure Behavior',
          left: 'Soft-fail (If CA server is down, browsers ignore check, permitting attacks)',
          right: 'Hard-fail (With OCSP Must-Staple, missing status terminates connection)'
        },
        {
          feature: 'Bandwidth Overhead on CA',
          left: 'Massive (CA infrastructure hammered by billions of live queries)',
          right: 'Minimal (Server queries CA once every 24 hours and caches response)'
        }
      ],
      summaryTakeaway: 'OCSP Stapling (RFC 6066) is the gold standard: fast, private, and resilient against CA outages.'
    },
    speakerNotes: {
      script: 'Explain the privacy hazard of vanilla OCSP: Every time a user visits a website, the browser sends an unencrypted HTTP query to the CA asking "Is certificate XYZ valid?". The CA gets a live log of every website that IP address visits! OCSP Stapling fixes this completely.',
      likelyQuestions: []
    }
  },

  // 5. Worked Example: Step-by-Step Chain Validation
  {
    id: 'pki-worked',
    kind: 'worked-example',
    title: 'Worked Example: Validating a TLS Certificate Chain',
    subtitle: 'What Your Browser Executes on Every HTTPS Connection',
    caption: 'Step-by-step verification executed by Chrome or Firefox when connecting to https://cns-lab.edu.',
    eli5Caption: 'Watch the five security checks your phone does in 5 milliseconds before showing the green padlock.',
    workedExample: {
      problem: 'Validate the 3-tier certificate chain for website https://cns-lab.edu received during a TLS 1.3 handshake.',
      given: {
        'Leaf Certificate': 'CN=cns-lab.edu, Issued by DigiCert TLS CA',
        'Intermediate CA': 'CN=DigiCert TLS CA, Issued by DigiCert Global Root',
        'Root CA in Trust Store': 'CN=DigiCert Global Root CA (Self-Signed)',
        'Check Date': '2026-06-01T00:00:00Z',
        'Target Hostname': 'cns-lab.edu'
      },
      steps: [
        {
          label: 'Domain Identity Matching (SAN Check)',
          formula: 'Target Hostname in Leaf.SubjectAlternativeNames',
          substitution: '"cns-lab.edu" matches SAN "cns-lab.edu"',
          result: 'PASS',
          note: 'Rejects cert if domain does not match, preventing domain impersonation.'
        },
        {
          label: 'Temporal Validity Window Check',
          formula: 'Leaf.notBefore <= CheckTime <= Leaf.notAfter',
          substitution: '2025-01-01 <= 2026-06-01 <= 2027-01-01',
          result: 'PASS',
          note: 'Ensures certificate has not expired or been pre-dated.'
        },
        {
          label: 'Leaf Cryptographic Signature Verification',
          formula: 'Verify(Intermediate_PubKey, Leaf_Bytes, Leaf_Sig)',
          substitution: 'RSA-SHA256 signature verification over DER-encoded leaf',
          result: 'VALID',
          note: 'Proves mathematically that Intermediate CA signed Leaf.'
        },
        {
          label: 'Intermediate Basic Constraints & Signature',
          formula: 'Intermediate.isCA === TRUE && Verify(Root_PubKey, Int_Bytes, Int_Sig)',
          substitution: 'BasicConstraints isCA=true; Root signature verified',
          result: 'VALID',
          note: 'Ensures Intermediate was authorized to issue certs, and signed by Root.'
        },
        {
          label: 'Anchor to Trusted Root Store & Check Revocation',
          formula: 'Root in OS_Trust_Store && Status not in CRL / OCSP',
          substitution: 'Root matches DigiCert Global Root in trust store; OCSP: "good"',
          result: 'TRUST GRANTED',
          note: 'Chain terminates at authoritative pre-installed trust anchor.'
        }
      ],
      finalAnswer: 'All 5 checks passed: Secure HTTPS TLS session established with validated identity.',
      checkVerification: 'Check: Hierarchical chain verified cryptographically from Leaf -> Intermediate -> Trusted Root.'
    },
    speakerNotes: {
      script: 'Emphasize that if any single step fails (e.g. expired by 1 minute, or name mismatch), the browser displays an alarming full-screen NET::ERR_CERT_COMMON_NAME_INVALID warning. This prevents active Man-in-the-Middle attacks.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'pki-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for PKI and Digital Certificates',
    caption: 'Key architectural terms, X.509 fields, and revocation systems for exams.',
    eli5Caption: 'The exact terms required for maximum marks on PKI questions.',
    speakerNotes: {
      script: 'Review the 3 self-learning concepts from the syllabus: 1. Entity authentication (proving identity in real-time). 2. Message integrity (ensuring no unauthorized alterations). 3. Non-repudiation (undeniable proof of origin). An X.509 PKI provides all three.',
      likelyQuestions: [
        {
          question: 'What is Certificate Transparency (CT)?',
          answer: 'An open framework of append-only public cryptographic audit logs (RFC 6962) where all issued certificates must be logged, preventing CAs from issuing secret rogue certs.'
        }
      ]
    },
    examWords: {
      term: 'Public Key Infrastructure (PKI)',
      definition: 'A framework of hardware, software, policies, and standards used to create, manage, distribute, use, store, and revoke digital certificates and manage public-key encryption.',
      keywords: [
        'Certificate Authority (CA)',
        'X.509 v3 Format',
        'Chain of Trust',
        'Root CA vs Intermediate CA',
        'Certificate Revocation List (CRL)',
        'OCSP & OCSP Stapling (RFC 6066)',
        'Basic Constraints (isCA)',
        'Subject Alternative Name (SAN)'
      ],
      mustRememberPoints: [
        'An X.509 certificate cryptographically binds a subject’s public key to their identity, signed by an issuing Certificate Authority.',
        'Trust chains validate hierarchically: Leaf Certificate -> Intermediate CA -> Root CA (anchored in the client’s local trust store).',
        'OCSP Stapling avoids network latency and privacy leaks by having the web server deliver a time-stamped, CA-signed validity proof directly during the TLS handshake.'
      ],
      typicalMarks: 5
    }
  }
]

export const pkiCertificatesPresentation: TopicPresentation = {
  moduleId: 'm3',
  moduleTitle: 'Cryptographic Hashes and Digital Signatures',
  topicId: 'pki-certificates',
  topicTitle: 'PKI & Digital Certificates',
  targetDurationMinutes: 12,
  plates: pkiCertificatesPlates
}
