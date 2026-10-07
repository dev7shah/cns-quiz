import { Question } from "@/lib/quiz/types"

export const cryptoQuestions: Question[] = [
  {
    id: "cry_1",
    topic: "crypto",
    round: "rapid",
    difficulty: 1,
    prompt: "Which algorithm is asymmetric?",
    options: ["AES", "DES", "RSA", "ChaCha20"],
    answerIndex: 2,
    explanation: "RSA uses a public/private key pair; AES and DES use one shared key.",
    tags: ["asymmetric", "rsa"]
  },
  {
    id: "cry_2",
    topic: "crypto",
    round: "rapid",
    difficulty: 2,
    prompt: "What is the primary purpose of a cryptographic hash function?",
    options: ["To encrypt data for secure transmission", "To provide a unique, fixed-size digital fingerprint of data", "To compress data into smaller sizes", "To generate random encryption keys"],
    answerIndex: 1,
    explanation: "Hash functions take arbitrary data and return a fixed-size bit string (fingerprint). They do not encrypt (they are one-way) and they are not compression algorithms.",
    tags: ["hash", "basics"]
  },
  {
    id: "cry_3",
    topic: "crypto",
    round: "rapid",
    difficulty: 2,
    prompt: "Which of the following is a symmetric encryption algorithm?",
    options: ["RSA", "Diffie-Hellman", "ECC", "AES"],
    answerIndex: 3,
    explanation: "AES is a symmetric cipher (uses the same key to encrypt and decrypt). RSA and ECC are asymmetric, and Diffie-Hellman is a key exchange protocol.",
    tags: ["symmetric", "aes"]
  },
  {
    id: "cry_4",
    topic: "crypto",
    round: "rapid",
    difficulty: 3,
    prompt: "In the RSA algorithm, the security relies on the mathematical difficulty of which problem?",
    options: ["Solving discrete logarithms", "Factoring large semiprimes", "Computing elliptic curves", "Calculating modular exponentiation"],
    answerIndex: 1,
    explanation: "RSA relies on the integer factorization problem, specifically the difficulty of factoring the product of two large prime numbers.",
    tags: ["rsa", "math"]
  },
  {
    id: "cry_5",
    topic: "crypto",
    round: "rapid",
    difficulty: 1,
    prompt: "A Caesar cipher with a shift of 3 transforms 'A' into which letter?",
    options: ["C", "D", "E", "F"],
    answerIndex: 1,
    explanation: "A shift of 3 moves A -> B(1) -> C(2) -> D(3).",
    tags: ["caesar", "classical"]
  },
  {
    id: "cry_6",
    topic: "crypto",
    round: "rapid",
    difficulty: 3,
    prompt: "What is the Avalanche Effect in hashing?",
    options: ["A small change in input produces a completely different output", "A large input produces a small output", "The hash function takes longer as the input grows", "Multiple inputs result in the same hash"],
    answerIndex: 0,
    explanation: "The avalanche effect means that changing even a single bit of the input should drastically change the resulting hash value (about 50% of the output bits flip).",
    tags: ["hash", "avalanche"]
  },
  {
    id: "cry_7",
    topic: "crypto",
    round: "scenario",
    difficulty: 2,
    prompt: "Alice wants to send a secret message to Bob. In a public-key infrastructure, which key should Alice use to encrypt the message?",
    scenario: "Alice is sending confidential documents over the internet to Bob.",
    options: ["Alice's public key", "Alice's private key", "Bob's public key", "Bob's private key"],
    answerIndex: 2,
    explanation: "To ensure only Bob can read the message, Alice encrypts it with Bob's public key. Bob can then decrypt it using his own private key.",
    tags: ["pki", "scenario"]
  },
  {
    id: "cry_8",
    topic: "crypto",
    round: "scenario",
    difficulty: 3,
    prompt: "Bob receives a contract signed by Alice. To verify that Alice actually signed it and it hasn't been tampered with, which key does Bob use?",
    scenario: "Alice applied a digital signature to a PDF document.",
    options: ["Alice's public key", "Alice's private key", "Bob's public key", "Bob's private key"],
    answerIndex: 0,
    explanation: "Digital signatures are created with the sender's private key. Anyone can verify the signature using the sender's (Alice's) public key.",
    tags: ["signatures", "scenario"]
  },
  {
    id: "cry_9",
    topic: "crypto",
    round: "image",
    difficulty: 2,
    prompt: "Which cryptographic key encrypts the document to create the digital signature?",
    imageComponent: "RSADiagram",
    options: ["Sender's Private Key", "Sender's Public Key", "Receiver's Private Key", "Receiver's Public Key"],
    answerIndex: 0,
    explanation: "A digital signature is created by encrypting the hash of the document with the sender's private key.",
    tags: ["rsa", "signatures", "image"]
  },
  {
    id: "cry_10",
    topic: "crypto",
    round: "image",
    difficulty: 3,
    prompt: "Identify the mathematical operation used in the Diffie-Hellman step shown.",
    imageComponent: "DHDiagram",
    options: ["Multiplication", "Addition", "Modular Exponentiation", "Bitwise XOR"],
    answerIndex: 2,
    explanation: "Diffie-Hellman relies on modular exponentiation (e.g., g^a mod p) to safely exchange keys over a public channel.",
    tags: ["dh", "math", "image"]
  }
]
