import { Question, NumericQuestion, MultiQuestion, MatchQuestion, TfWhyQuestion } from "../types"

export const m3Questions: Question[] = [
  // ==========================================
  // TOPIC 1: AUTHENTICATION REQUIREMENTS & FUNCTIONS
  // ==========================================
  {
    id: 'm3-mcq-auth-vs-conf',
    type: 'mcq',
    module: 'M3',
    topicId: 'auth-requirements',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the fundamental distinction between confidentiality and authenticity?',
    options: [
      'Confidentiality prevents unauthorized reading; Authenticity verifies the true origin and integrity of the data',
      'Confidentiality uses symmetric keys; Authenticity can only use asymmetric keys',
      'Confidentiality protects data in transit; Authenticity only protects data at rest',
      'Confidentiality guarantees non-repudiation; Authenticity does not'
    ],
    answerIndex: 0,
    explanation: 'Confidentiality ensures that unauthorized eavesdroppers cannot read message contents. Authenticity ensures that the receiver can verify that the message truly originated from the claimed sender and has not been altered.'
  },
  {
    id: 'm3-tfwhy-mac-nonrepudiation',
    type: 'tf-why',
    module: 'M3',
    topicId: 'auth-requirements',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate whether a Message Authentication Code (MAC) provides non-repudiation in a legal dispute:',
    statement: 'A standard Message Authentication Code (MAC) provides legal non-repudiation against the sender.',
    isTrue: false,
    whyOptions: [
      'Because both sender and receiver share the same symmetric secret key K, so the receiver could have generated the MAC tag themselves',
      'Because MAC tags are truncated to 16 bits, making collisions trivial',
      'Because MAC algorithms do not use cryptographic hash functions',
      'Because MACs can only be validated over unencrypted channels'
    ],
    whyIndex: 0,
    explanation: 'A MAC uses a shared symmetric key K known to both Alice and Bob. If Alice denies sending a message, Bob cannot prove to an independent judge that Alice generated it, because Bob possesses the identical key K and had the technical capability to forge the MAC tag himself.'
  } as TfWhyQuestion,
  {
    id: 'm3-order-auth-threats',
    type: 'order',
    module: 'M3',
    topicId: 'auth-requirements',
    tags: ['auth', 'attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Order the active communication attacks defined in RFC 2828 from source fabrication to timing manipulation:',
    items: [
      'Masquerade (Insertion of fraudulent messages from an unauthorized source)',
      'Content Modification (Altering data bytes or headers within valid messages)',
      'Sequence Modification (Reordering or dropping numbered packets in a stream)',
      'Timing Modification (Delaying or replaying previously captured authentic messages)'
    ],
    correctOrder: [0, 1, 2, 3],
    explanation: 'The standard taxonomy of active message threats: 1. Masquerade (falsifying identity), 2. Content modification, 3. Sequence alteration, 4. Timing/replay attacks.'
  },

  // ==========================================
  // TOPIC 2: MAC AND HMAC
  // ==========================================
  {
    id: 'm3-mcq-length-extension',
    type: 'mcq',
    module: 'M3',
    topicId: 'mac-hmac',
    tags: ['auth', 'crypto'],
    bloom: 'L3',
    difficulty: 3,
    marks: 2,
    timeSec: 45,
    prompt: 'Why is the naive construction MAC = H(Key || Message) insecure under Merkle-Damgård hash functions (MD5, SHA-1, SHA-256)?',
    options: [
      'Because an attacker can perform a Length Extension Attack by resuming the compression function from the published digest without knowing the secret key',
      'Because the key is XORed directly into the plaintext, exposing the key via known-plaintext attack',
      'Because Merkle-Damgård hashes truncate keys to 8 bits',
      'Because the hash output size is smaller than the key size'
    ],
    answerIndex: 0,
    explanation: 'In Merkle-Damgård hashes, the final digest is identical to the internal state of the compression function after processing the last block. An attacker knowing len(M) can initialize the compression function with this published digest and append extra blocks, computing a valid tag for (Key || M || pad || Extension) without ever knowing Key.'
  },
  {
    id: 'm3-multi-hmac-properties',
    type: 'multi',
    module: 'M3',
    topicId: 'mac-hmac',
    tags: ['auth', 'crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Which statements correctly describe the RFC 2104 HMAC standard? (Select all that apply)',
    options: [
      'HMAC uses two fixed padding constants: ipad (0x36) and opad (0x5C)',
      'HMAC formula is H((K+ ⊕ opad) || H((K+ ⊕ ipad) || M))',
      'If key length exceeds the hash block size B, the key is pre-hashed: K = H(K)',
      'HMAC can only be computed using DES encryption hardware'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'RFC 2104 defines HMAC with inner pad 0x36, outer pad 0x5C, nested hashing, and key pre-hashing when key length exceeds block size B (64 bytes for SHA-256).'
  } as MultiQuestion,
  {
    id: 'm3-numeric-hmac-pad-diff',
    type: 'numeric',
    module: 'M3',
    topicId: 'mac-hmac',
    tags: ['auth', 'crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the Hamming distance (number of differing bits) between the HMAC inner pad byte ipad (0x36 = 00110110) and outer pad byte opad (0x5C = 01011100)?',
    given: {
      'ipad': '0x36 (00110110)',
      'opad': '0x5C (01011100)'
    },
    answer: 4,
    tolerance: 0,
    steps: [
      '1. Compute XOR: 0x36 ^ 0x5C = 00110110 ^ 01011100 = 01101010 (0x6A)',
      '2. Count 1-bits in 01101010: bit 6, bit 5, bit 3, bit 1 are set.',
      '3. Total Hamming distance = 4 bits (exactly 50% of 8 bits).'
    ],
    explanation: '0x36 (00110110) XOR 0x5C (01011100) = 01101010 (0x6A), which contains exactly 4 one-bits. Exactly half of the 8 bits differ, ensuring optimal cryptographic decorrelation between inner and outer keys.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 3: CRYPTOGRAPHIC HASH PROPERTIES
  // ==========================================
  {
    id: 'm3-mcq-birthday-paradox',
    type: 'mcq',
    module: 'M3',
    topicId: 'hash-functions',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'According to the Birthday Paradox, how many operations are required to find a collision in an n-bit cryptographic hash function with probability ~50%?',
    options: [
      'O(2^(n/2)) operations',
      'O(2^n) operations',
      'O(n^2) operations',
      'O(2^(n/4)) operations'
    ],
    answerIndex: 0,
    explanation: 'Finding ANY collision among arbitrary pairs requires comparing k items where the number of pairs k(k-1)/2 approaches 2^n. This yields the birthday bound k ≈ 1.177 * 2^(n/2).'
  },
  {
    id: 'm3-match-hash-resistances',
    type: 'match',
    module: 'M3',
    topicId: 'hash-functions',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 3,
    timeSec: 45,
    prompt: 'Match each hash security property to its precise cryptographic definition:',
    pairs: [
      ['Pre-image Resistance (One-Way)', 'Given digest y, computationally infeasible to find any x such that H(x) = y (O(2^n))'],
      ['Second Pre-image Resistance (Weak Collision)', 'Given fixed message x, computationally infeasible to find x’ ≠ x such that H(x’) = H(x) (O(2^n))'],
      ['Collision Resistance (Strong Collision)', 'Computationally infeasible to find ANY pair (x1, x2) with x1 ≠ x2 such that H(x1) = H(x2) (O(2^(n/2)))']
    ],
    explanation: 'Pre-image: invert a given hash y (O(2^n)). Second pre-image: match a specific fixed input x (O(2^n)). Collision: find any matching pair (O(2^(n/2))).'
  } as MatchQuestion,
  {
    id: 'm3-numeric-sha256-collision-security',
    type: 'numeric',
    module: 'M3',
    topicId: 'hash-functions',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 25,
    prompt: 'How many bits of collision resistance security does SHA-256 provide against birthday attacks (enter the exponent k in 2^k)?',
    given: {
      'Hash output length': 256,
      'Birthday collision formula': '2^(n/2)'
    },
    answer: 128,
    tolerance: 0,
    steps: [
      '1. Collision resistance for an n-bit hash is n / 2 bits.',
      '2. For SHA-256: 256 / 2 = 128 bits.',
      '3. Search effort required: 2^128 operations.'
    ],
    explanation: 'For an n-bit hash, collision resistance security is n / 2 bits. For SHA-256 (n = 256 bits), birthday attack complexity is 2^(256/2) = 2^128 operations.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 4: MD5, SHA-1, SHA-2, SHA-3
  // ==========================================
  {
    id: 'm3-mcq-sponge-architecture',
    type: 'mcq',
    module: 'M3',
    topicId: 'md5-sha',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'How does SHA-3 (Keccak) fundamentally differ in architecture from SHA-1 and SHA-2?',
    options: [
      'SHA-3 uses a Sponge Construction (Bitrate r + Capacity c), whereas SHA-1 and SHA-2 use Merkle-Damgård',
      'SHA-3 uses RSA modular exponentiation in every round',
      'SHA-3 requires 4096-bit symmetric keys',
      'SHA-3 replaces hashing with block ciphers in CBC mode'
    ],
    answerIndex: 0,
    explanation: 'SHA-3 utilizes the Sponge Construction: data is absorbed into a bitrate portion r, mixed across a 1600-bit state with Keccak-f permutation, and squeezed out. Unlike Merkle-Damgård, the capacity portion c is never revealed, making SHA-3 naturally immune to length extension attacks.'
  },
  {
    id: 'm3-order-md-padding',
    type: 'order',
    module: 'M3',
    topicId: 'md5-sha',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 3,
    marks: 2,
    timeSec: 50,
    prompt: 'Order the sequential steps for padding an arbitrary message in SHA-256 into 512-bit blocks:',
    items: [
      'Append a single 1-bit (represented as byte 0x80)',
      'Append zero bits until total message length ≡ 448 (mod 512)',
      'Append unsigned 64-bit big-endian integer representing original message bit length',
      'Feed the padded 512-bit block into the round compression function'
    ],
    correctOrder: [0, 1, 2, 3],
    explanation: 'Merkle-Damgård padding: 1. Append 1-bit (0x80), 2. Pad zeros until 448 mod 512 bits (leaving exactly 64 bits at end), 3. Append 64-bit length, 4. Process block.'
  },
  {
    id: 'm3-tfwhy-shattered-sha1',
    type: 'tf-why',
    module: 'M3',
    topicId: 'md5-sha',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate whether SHA-1 can still be safely used for digital signature verification:',
    statement: 'SHA-1 is no longer secure for digital signatures or TLS certificate issuance.',
    isTrue: true,
    whyOptions: [
      'Because Google and CWI Amsterdam demonstrated practical collisions (SHAttered attack in 2017), producing two distinct valid PDFs with identical SHA-1 hashes',
      'Because SHA-1 uses a 56-bit key that can be brute-forced in 24 hours',
      'Because SHA-1 is vulnerable to quantum Grover search in O(1) time',
      'Because SHA-1 cannot hash messages longer than 1 kilobyte'
    ],
    whyIndex: 0,
    explanation: 'The SHAttered attack (2017) generated two distinct PDF documents with identical SHA-1 hashes in 2^63.1 computations (~110 GPU-years), proving that an attacker could forge digitally signed contracts. All major browsers and CAs completely banned SHA-1.'
  } as TfWhyQuestion,

  // ==========================================
  // TOPIC 5: DIGITAL SIGNATURES (RSA & ECDSA)
  // ==========================================
  {
    id: 'm3-mcq-hash-then-sign',
    type: 'mcq',
    module: 'M3',
    topicId: 'digital-signatures',
    tags: ['crypto', 'auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'What mathematical vulnerability occurs if Alice signs a raw message M directly with RSA (S = M^d mod n) without first hashing it?',
    options: [
      'Multiplicative Homomorphism: S1 * S2 = (M1 * M2)^d mod n, enabling existential forgery of valid signatures for composite messages',
      'The private key d is revealed whenever M is a prime number',
      'The public modulus n factors into p and q automatically',
      'The signature S becomes an all-zeros bitstring'
    ],
    answerIndex: 0,
    explanation: 'Raw RSA satisfies the multiplicative homomorphism: (M1^d) * (M2^d) ≡ (M1 * M2)^d mod n. An attacker intercepting signatures on M1 and M2 can forge a valid signature for M3 = M1 * M2 without knowing private key d. The Hash-then-Sign paradigm eliminates this because H(M1 * M2) ≠ H(M1) * H(M2).'
  },
  {
    id: 'm3-mcq-sony-ps3-exploit',
    type: 'mcq',
    module: 'M3',
    topicId: 'digital-signatures',
    tags: ['crypto', 'attacks'],
    bloom: 'L4',
    difficulty: 3,
    marks: 2,
    timeSec: 50,
    prompt: 'In the famous 2010 Sony PS3 hack, fail0verflow recovered Sony’s master private signing key because Sony made which implementation error?',
    options: [
      'They reused a static, constant ephemeral nonce k across multiple ECDSA signatures instead of generating a cryptographically random k',
      'They used RSA with a 512-bit modulus that was factored on a laptop',
      'They used MD5 without salting on user account passwords',
      'They accidentally published their private key in public Git repositories'
    ],
    answerIndex: 0,
    explanation: 'In ECDSA, s = k^-1 * (z + r*d) mod n. If the same nonce k is reused for two messages z1 and z2, r is identical. Subtracting yields s1 - s2 = k^-1 * (z1 - z2) mod n, allowing immediate recovery of k = (z1 - z2)/(s1 - s2) mod n, followed by the private key d = (s1*k - z1)/r mod n.'
  },
  {
    id: 'm3-numeric-rsa-verify',
    type: 'numeric',
    module: 'M3',
    topicId: 'digital-signatures',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'In an RSA signature scheme with modulus n = 33 and public exponent e = 3, an incoming signature is S = 5. What was the original signed message digest V (compute V = S^e mod n)?',
    given: {
      'Signature (S)': 5,
      'Public Exponent (e)': 3,
      'Modulus (n)': 33
    },
    answer: 26,
    tolerance: 0,
    steps: [
      '1. Verification formula: V = S^e mod n',
      '2. Substitute: V = 5^3 mod 33 = 125 mod 33',
      '3. Since 33 * 3 = 99: 125 - 99 = 26.',
      '4. Recovered message digest V = 26.'
    ],
    explanation: 'V = S^e mod n = 5^3 mod 33 = 125 mod 33. Since 33 * 3 = 99, 125 - 99 = 26. Therefore, the recovered message digest is 26.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 6: PKI & DIGITAL CERTIFICATES
  // ==========================================
  {
    id: 'm3-mcq-x509-basic-constraints',
    type: 'mcq',
    module: 'M3',
    topicId: 'pki-certificates',
    tags: ['auth', 'tls'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Why is the X.509 v3 extension "Basic Constraints: isCA=true/false" critical to the security of the entire internet PKI?',
    options: [
      'It prevents an ordinary end-entity domain certificate (isCA=false) from issuing rogue certificates for other websites like google.com or bank.com',
      'It specifies whether the certificate uses RSA or ECC encryption',
      'It forces the browser to refresh its cache every 24 hours',
      'It controls whether the server supports HTTP/2 or HTTP/3'
    ],
    answerIndex: 0,
    explanation: 'Without checking Basic Constraints, any website with a valid TLS certificate could act as a subordinate Certificate Authority and sign valid fraudulent certificates for any other domain on the internet.'
  },
  {
    id: 'm3-multi-ocsp-stapling',
    type: 'multi',
    module: 'M3',
    topicId: 'pki-certificates',
    tags: ['auth', 'tls'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Why is OCSP Stapling (RFC 6066) superior to traditional Certificate Revocation Lists (CRLs) and direct OCSP queries? (Select all that apply)',
    options: [
      'It eliminates browser connection latency because the web server delivers the cached CA status directly during the TLS handshake',
      'It protects user privacy because the Certificate Authority does not receive real-time queries for every domain the user visits',
      'It prevents CA Denial of Service by offloading status delivery from the CA to millions of web servers',
      'It allows web servers to sign their own root certificates without a CA'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'OCSP Stapling has the server periodically fetch a digitally signed OCSP response from the CA, cache it, and "staple" it into the TLS CertificateStatus handshake message. This provides zero-latency verification, complete user privacy from CAs, and high availability.'
  } as MultiQuestion,
  {
    id: 'm3-order-chain-validation',
    type: 'order',
    module: 'M3',
    topicId: 'pki-certificates',
    tags: ['auth', 'tls'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Arrange the sequence of validation checks a browser performs on a received X.509 certificate chain:',
    items: [
      'Verify the website hostname matches the Subject Alternative Name (SAN) in the leaf certificate',
      'Check temporal validity (current timestamp is between notBefore and notAfter)',
      'Verify cryptographic signature of the leaf certificate using the Intermediate CA’s public key',
      'Verify the Intermediate CA certificate signature using a trusted Root CA pre-installed in the OS trust store',
      'Verify revocation status via OCSP Stapling or CRL'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'Standard TLS chain validation: 1. Hostname/SAN matching, 2. Date validity, 3. Leaf signature check, 4. Intermediate -> Root anchor check, 5. Revocation status validation.'
  }
]
