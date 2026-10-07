import { Question } from "@/lib/quiz/types"

export const tlsQuestions: Question[] = [
  {
    id: "tls_1",
    topic: "tls",
    round: "rapid",
    difficulty: 1,
    prompt: "What does TLS stand for?",
    options: [
      "Transport Layer Security",
      "Transfer Level Socket",
      "Total Local Security",
      "Transmission Link SSL"
    ],
    answerIndex: 0,
    explanation: "TLS stands for Transport Layer Security, which is the successor to the deprecated SSL (Secure Sockets Layer).",
    tags: ["tls", "acronyms"]
  },
  {
    id: "tls_2",
    topic: "tls",
    round: "rapid",
    difficulty: 2,
    prompt: "Why does TLS use Asymmetric Cryptography (RSA/ECC) during the handshake?",
    options: [
      "Because Asymmetric is faster than Symmetric",
      "To securely agree on a Symmetric Key over an insecure channel",
      "To encrypt the bulk HTTP traffic payload",
      "To compress the data before transmission"
    ],
    answerIndex: 1,
    explanation: "Asymmetric cryptography solves the 'Key Distribution Problem', allowing two parties to securely agree on a fast Symmetric Key without ever meeting in person.",
    tags: ["handshake", "crypto"]
  },
  {
    id: "tls_3",
    topic: "tls",
    round: "scenario",
    difficulty: 3,
    prompt: "An attacker intercepts all encrypted traffic between Alice and a banking server for a year. Later, they steal the bank's Private RSA Key. However, they STILL cannot decrypt the old traffic. What property ensures this?",
    scenario: "Investigating a massive server breach.",
    options: [
      "Digital Signatures",
      "Perfect Forward Secrecy (PFS)",
      "Certificate Pinning",
      "Strict Transport Security (HSTS)"
    ],
    answerIndex: 1,
    explanation: "Perfect Forward Secrecy uses Diffie-Hellman to generate a unique session key for every connection, meaning the compromise of the long-term private key doesn't compromise past sessions.",
    tags: ["pfs", "scenario"]
  },
  {
    id: "tls_4",
    topic: "tls",
    round: "rapid",
    difficulty: 2,
    prompt: "What entity digitally signs a server's Digital Certificate to prove it is authentic?",
    options: [
      "The Server Admin",
      "A Certificate Authority (CA)",
      "The Client Browser",
      "The Internet Service Provider (ISP)"
    ],
    answerIndex: 1,
    explanation: "A trusted third party, known as a Certificate Authority (CA) (e.g., Let's Encrypt, DigiCert), mathematically signs the certificate.",
    tags: ["pki", "ca"]
  },
  {
    id: "tls_5",
    topic: "tls",
    round: "rapid",
    difficulty: 2,
    prompt: "What is a major performance improvement introduced in TLS 1.3?",
    options: [
      "It requires 2 round-trips for the handshake",
      "It removes symmetric encryption entirely",
      "It reduces the handshake to 1 round-trip (1-RTT)",
      "It uses UDP instead of TCP"
    ],
    answerIndex: 2,
    explanation: "TLS 1.3 optimized the handshake process, dropping the required round-trips from 2 to 1, significantly speeding up secure connection establishment.",
    tags: ["tls1.3", "performance"]
  }
]
