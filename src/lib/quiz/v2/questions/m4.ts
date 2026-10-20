import { Question, NumericQuestion, MultiQuestion, MatchQuestion, TfWhyQuestion } from "../types"

export const m4Questions: Question[] = [
  // ==========================================
  // TOPIC 1: SOFTWARE VULNERABILITIES & BUFFER OVERFLOW
  // ==========================================
  {
    id: 'm4-mcq-stack-direction',
    type: 'mcq',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In standard x86/x64 process memory, which direction does the call stack grow and in which direction are local buffers written?',
    options: [
      'The stack grows downward toward lower memory addresses; buffer writes proceed upward toward higher memory addresses',
      'The stack grows upward toward higher memory; buffer writes proceed downward toward lower memory',
      'Both the stack and buffer writes proceed downward toward lower memory addresses',
      'Both the stack and buffer writes proceed upward toward higher memory addresses'
    ],
    answerIndex: 0,
    explanation: 'The call stack grows downward (from high memory to low memory). However, string operations like strcpy() write upward (from low memory to high memory). This directional conflict allows overflow data to write past the buffer end and corrupt the Saved Frame Pointer (EBP) and Return Address (EIP).'
  },
  {
    id: 'm4-multi-overflow-defenses',
    type: 'multi',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Which mechanisms are standard compile-time and runtime defenses against buffer overflow exploits? (Select all that apply)',
    options: [
      'Stack Canaries (StackGuard) placed before the saved frame pointer',
      'Data Execution Prevention (DEP / NX bit) marking stack memory as non-executable',
      'Address Space Layout Randomization (ASLR) randomizing stack and library base addresses',
      'Disabling CPU arithmetic logic units during function calls'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'Stack Canaries detect stack corruption before return; DEP/NX prevents execution of shellcode placed on the stack; ASLR randomizes memory addresses so hardcoded pointer jumps fail.'
  } as MultiQuestion,
  {
    id: 'm4-order-stack-layout',
    type: 'order',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Arrange the elements of an x86 stack frame in order from HIGHEST memory address down to LOWEST memory address:',
    items: [
      'Function Arguments (pushed by caller)',
      'Saved Return Address (EIP / RIP pushed by CALL instruction)',
      'Saved Frame Pointer (EBP / RBP)',
      'Stack Canary (StackGuard value)',
      'Local Variable Buffers (e.g. char buffer[64])'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'Stack memory layout from High to Low addresses: Caller Arguments -> Return Address (EIP) -> Saved EBP -> Canary -> Local Buffer. The stack pointer ESP points to the lowest address.'
  },
  {
    id: 'm4-tfwhy-incomplete-mediation',
    type: 'tf-why',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate whether client-side JavaScript validation is sufficient to prevent input tampering vulnerabilities:',
    statement: 'Validating form input strictly in client-side HTML5 or JavaScript guarantees data integrity.',
    isTrue: false,
    whyOptions: [
      'Because attackers can bypass client-side code entirely by modifying HTTP requests directly via proxy tools like Burp Suite or curl',
      'Because JavaScript does not support regular expression checking',
      'Because client-side validation only works on Windows operating systems',
      'Because HTML5 forms automatically encrypt data with DES'
    ],
    whyIndex: 0,
    explanation: 'Client-side validation is solely for user convenience. An adversary can easily bypass browser validation by submitting raw HTTP requests directly via curl, Python, or interception proxies. All input must be independently validated on the server (complete mediation).'
  } as TfWhyQuestion,

  // ==========================================
  // TOPIC 2: MALWARE & MALICIOUS CODE
  // ==========================================
  {
    id: 'm4-mcq-worm-vs-virus',
    type: 'mcq',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the primary architectural difference between a computer virus and a network worm?',
    options: [
      'A virus requires a host executable and human execution to spread; a worm is a standalone program that propagates autonomously across networks',
      'A virus only infects Linux; a worm only infects Windows',
      'A virus uses symmetric encryption; a worm uses public key encryption',
      'A virus is hardware-based; a worm is software-based'
    ],
    answerIndex: 0,
    explanation: 'A virus attaches itself to an existing host file and requires human action (running the infected program) to spread. A worm is an autonomous standalone process that replicates across network connections without requiring a host file or human intervention.'
  },
  {
    id: 'm4-match-malware-types',
    type: 'match',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 3,
    timeSec: 50,
    prompt: 'Match each malware category to its defining technical characteristic:',
    pairs: [
      ['Trojan Horse', 'Disguised as benign or useful utility while maintaining a concealed backdoor'],
      ['Rootkit', 'Subverts operating system integrity by hooking system calls (SSDT) or modifying kernel data structures (DKOM) to hide artifacts'],
      ['Ransomware', 'Hybrid cryptosystem encrypting user data with symmetric ciphers and locking keys with attacker public keys']
    ],
    explanation: 'Trojans deceive via benign disguise. Rootkits manipulate OS kernel tables to hide processes and sockets. Ransomware holds user documents hostage via hybrid encryption.'
  } as MatchQuestion,
  {
    id: 'm4-mcq-metamorphic-code',
    type: 'mcq',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Why are metamorphic viruses significantly more difficult for signature-based antivirus scanners to detect than simple polymorphic viruses?',
    options: [
      'Metamorphic viruses rewrite their entire instruction body (reordering instructions, swapping registers, inserting equivalent opcodes) so no constant byte signature exists',
      'Metamorphic viruses delete the operating system before the antivirus can scan',
      'Metamorphic viruses only run inside CPU caches without touching RAM',
      'Metamorphic viruses use 4096-bit RSA keys on each execution'
    ],
    answerIndex: 0,
    explanation: 'Polymorphic viruses keep a constant encrypted body and only mutate a small decryptor routine. Metamorphic viruses completely recompile and rewrite their entire code base on every generation, altering instruction sequences and register usage so static byte signatures completely fail.'
  },

  // ==========================================
  // TOPIC 3: CONTROL MECHANISMS & RESOURCE PROTECTION
  // ==========================================
  {
    id: 'm4-mcq-bell-lapadula-star',
    type: 'mcq',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Under the Bell-LaPadula Confidentiality Model, what does the *-Property (Star-Property) state, and what attack does it prevent?',
    options: [
      'No Write Down (NWD): Subject cannot write to objects with lower classification, preventing high-clearance trojans from leaking secret data into public files',
      'No Read Up (NRU): Subject cannot read objects with higher classification, preventing unauthorized data access',
      'No Read Down (NRD): Subject cannot read objects with lower classification, preventing data contamination',
      'No Write Up (NWU): Subject cannot write to higher classification objects, preventing file modifications'
    ],
    answerIndex: 0,
    explanation: 'The *-Property (No Write Down) enforces: Subject at level L_S can write to Object at level L_O iff L_S <= L_O. This prevents a high-clearance process (or an embedded trojan horse) from copying Top Secret information down into an Unclassified document.'
  },
  {
    id: 'm4-match-biba-vs-blp',
    type: 'match',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 45,
    prompt: 'Match each access control axiom to its corresponding model and purpose:',
    pairs: [
      ['Simple Security Property (Bell-LaPadula)', 'No Read Up (NRU): Preserves confidentiality by preventing unauthorized disclosure'],
      ['Simple Integrity Property (Biba)', 'No Read Down (NRD): Preserves integrity by preventing contamination from low-integrity dirty data'],
      ['*-Integrity Property (Biba)', 'No Write Up (NWU): Preserves integrity by preventing low-integrity subjects from modifying high-integrity objects']
    ],
    explanation: 'Bell-LaPadula enforces confidentiality (NRU, NWD). Biba enforces integrity (NRD, NWU).'
  } as MatchQuestion,
  {
    id: 'm4-multi-reference-monitor',
    type: 'multi',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'What are the three mandatory requirements of a Reference Monitor in trusted computing systems? (Select all that apply)',
    options: [
      'Complete Mediation (Every access attempt must be mediated; zero bypasses)',
      'Tamper Resistance (The reference monitor code and data structures are immune to alteration)',
      'Verifiability (The security kernel must be compact enough to be mathematically evaluated and proven)',
      'Quantum Encryption (Must use optical photon channels)'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'According to the Anderson 1972 report, a Reference Monitor must be: 1. Completely mediated, 2. Tamper-resistant, and 3. Verifiable (simple enough to prove correct).'
  } as MultiQuestion,

  // ==========================================
  // TOPIC 4: USER AUTHENTICATION & MULTI-FACTOR AUTH
  // ==========================================
  {
    id: 'm4-numeric-biometric-cer',
    type: 'numeric',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 35,
    prompt: 'A biometric fingerprint scanner operating at sensitivity threshold T exhibits a False Acceptance Rate (FAR) of 2.4% and a False Rejection Rate (FRR) of 2.4%. What is the Crossover Error Rate (CER) percentage?',
    given: {
      'False Acceptance Rate (FAR)': '2.4%',
      'False Rejection Rate (FRR)': '2.4%',
      'Operating Point': 'FAR == FRR'
    },
    answer: 2.4,
    tolerance: 0.1,
    steps: [
      '1. By definition, Crossover Error Rate (CER) occurs where FAR equals FRR.',
      '2. Given FAR = 2.4% and FRR = 2.4%, they are equal at this threshold.',
      '3. Therefore, CER = 2.4%.'
    ],
    explanation: 'The Crossover Error Rate (CER), also known as the Equal Error Rate (EER), is precisely the error rate at the threshold where False Acceptance Rate equals False Rejection Rate.'
  } as NumericQuestion,
  {
    id: 'm4-mcq-fido2-phishing',
    type: 'mcq',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'How does FIDO2 / WebAuthn provide mathematical phishing resistance against adversary-in-the-middle reverse proxies (e.g. Evilginx)?',
    options: [
      'The browser cryptographically binds the authenticator signature to the authentic origin domain (clientDataHash), which fails when submitted to a phishing domain',
      'The authenticator disables network packets if a proxy is detected on the local subnet',
      'The server sends SMS verification codes directly to the hardware key',
      'The user password is encrypted with 512-bit Blowfish'
    ],
    answerIndex: 0,
    explanation: 'In WebAuthn, the browser constructs clientDataJSON containing the exact origin in the address bar (e.g. https://cns-lab.edu). If an attacker lures a victim to https://evil-phish.com, the hardware key signs "evil-phish.com", which the real server immediately detects as an origin mismatch and rejects.'
  },
  {
    id: 'm4-order-totp-steps',
    type: 'order',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Order the sequential mathematical steps executed by an authenticator app to compute an RFC 6238 TOTP code:',
    items: [
      'Read current Unix epoch time in seconds and calculate time counter T = floor(CurrentTime / 30)',
      'Compute 20-byte HMAC-SHA1 digest of 8-byte big-endian counter T using shared secret K',
      'Extract offset from lowest 4 bits of the 20th digest byte to select a 4-byte slice',
      'Mask out the most significant bit to produce a 31-bit positive integer P',
      'Compute P mod 1,000,000 to produce a 6-digit decimal code'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'RFC 6238 TOTP derivation: 1. Counter calculation T, 2. HMAC-SHA1 computation, 3. Dynamic truncation offset extraction, 4. 31-bit integer masking, 5. Modulo 10^6 to get 6-digit code.'
  },

  // ==========================================
  // TOPIC 5: PASSWORD ATTACKS & SELECTION CRITERIA
  // ==========================================
  {
    id: 'm4-mcq-nist-guidelines',
    type: 'mcq',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Under current NIST SP 800-63B guidelines, which traditional password rule is now officially DISFAVORED and discouraged?',
    options: [
      'Mandatory periodic password changes (e.g. forcing users to reset passwords every 90 days)',
      'Checking passwords against lists of breached credentials (HaveIBeenPwned)',
      'Allowing passphrases of up to 64 characters',
      'Storing passwords using slow memory-hard key stretching algorithms'
    ],
    answerIndex: 0,
    explanation: 'NIST SP 800-63B Section 5.1.1.2 explicitly discourages mandatory periodic expiration (e.g. 90-day resets). Empirical studies proved this causes users to choose predictable patterns (Password123! -> Password124!) rather than strong, memorable passphrases.'
  },
  {
    id: 'm4-numeric-password-entropy',
    type: 'numeric',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Calculate the information entropy E (in bits) of an 8-character password chosen randomly from the lowercase English alphabet (26 characters). Enter the value rounded to 1 decimal place (use log2(26) ≈ 4.7004).',
    given: {
      'Password Length (L)': 8,
      'Character Pool (R)': 26,
      'Formula': 'E = L * log2(R)'
    },
    answer: 37.6,
    tolerance: 0.2,
    steps: [
      '1. Apply entropy formula: E = L * log2(R)',
      '2. Substitute L = 8 and R = 26: E = 8 * log2(26)',
      '3. Since log2(26) ≈ 4.70044: E = 8 * 4.70044 = 37.6035 bits',
      '4. Round to 1 decimal place: 37.6 bits.'
    ],
    explanation: 'Entropy is L * log2(R) = 8 * log2(26) ≈ 37.6 bits. A password with only 37.6 bits of entropy is vulnerable to offline GPU brute-force in less than one second.'
  } as NumericQuestion,
  {
    id: 'm4-tfwhy-salt-rainbow',
    type: 'tf-why',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate why adding a cryptographic salt to passwords neutralizes precomputed rainbow table attacks:',
    statement: 'A unique random salt per user prevents adversaries from using precomputed rainbow tables.',
    isTrue: true,
    whyOptions: [
      'Because H(Salt || Password) creates a unique hash space for every user, requiring the attacker to regenerate a multi-gigabyte rainbow table from scratch for every single user account',
      'Because the salt encrypts the password database with AES-256',
      'Because the salt truncates the hash to 8 bytes, causing collisions',
      'Because rainbow tables can only crack passwords that contain numbers'
    ],
    whyIndex: 0,
    explanation: 'Rainbow tables rely on precomputing hash chains for common passwords. A 16-byte random salt creates 2^128 distinct hash spaces. An attacker cannot use a single precomputed table across multiple accounts; they would have to generate an entire new rainbow table for each user, making precomputation economically infeasible.'
  } as TfWhyQuestion
]
