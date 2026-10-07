import { Question } from "@/lib/quiz/types"

export const authQuestions: Question[] = [
  {
    id: "auth_1",
    topic: "auth",
    round: "rapid",
    difficulty: 1,
    prompt: "What does a cryptographic salt protect against?",
    options: ["Man-in-the-middle attacks", "Precomputed rainbow table attacks", "SQL injection", "Cross-site scripting"],
    answerIndex: 1,
    explanation: "A unique random salt per user forces the attacker to redo work for every hash, making precomputed tables useless.",
    tags: ["salt", "hashing"]
  },
  {
    id: "auth_2",
    topic: "auth",
    round: "rapid",
    difficulty: 2,
    prompt: "Which hashing algorithm is considered slow by design, making it good for passwords?",
    options: ["MD5", "SHA-256", "bcrypt", "SHA-1"],
    answerIndex: 2,
    explanation: "bcrypt incorporates a work factor that slows down the hashing process, making brute-force attacks computationally expensive.",
    tags: ["hashing", "bcrypt"]
  },
  {
    id: "auth_3",
    topic: "auth",
    round: "rapid",
    difficulty: 1,
    prompt: "What does TOTP stand for?",
    options: ["Time-based One-Time Password", "Two-step Online Token Protocol", "Token-Oriented Transfer Protocol", "Time-Oriented Transaction Password"],
    answerIndex: 0,
    explanation: "TOTP stands for Time-based One-Time Password, an algorithm that computes a one-time password from a shared secret key and the current time.",
    tags: ["totp", "2fa"]
  },
  {
    id: "auth_4",
    topic: "auth",
    round: "scenario",
    difficulty: 2,
    prompt: "An attacker acquires a database dump of user passwords stored as plain MD5 hashes without salt. What is the fastest way they can crack these passwords?",
    scenario: "Database breach investigation.",
    options: ["Brute-forcing every possible character combination", "Using a rainbow table of precomputed MD5 hashes", "Using a padding oracle attack", "Performing a dictionary attack manually"],
    answerIndex: 1,
    explanation: "Without a salt, the attacker can use precomputed rainbow tables to instantly look up the plaintext for common MD5 hashes.",
    tags: ["scenario", "hashing", "attacks"]
  },
  {
    id: "auth_5",
    topic: "auth",
    round: "scenario",
    difficulty: 3,
    prompt: "A system uses TOTP for 2FA. A user reports their code is always rejected even though they type it correctly. What is the most likely cause?",
    scenario: "User troubleshooting a 2FA login issue.",
    options: ["The user's password was changed recently", "The server's clock and the user's phone clock are out of sync", "The TOTP secret was compromised", "The hashing algorithm is deprecated"],
    answerIndex: 1,
    explanation: "TOTP relies on the current time. If the server and the authenticator device's clocks drift significantly apart, the generated codes won't match.",
    tags: ["totp", "scenario"]
  },
  {
    id: "auth_6",
    topic: "auth",
    round: "image",
    difficulty: 2,
    prompt: "In a typical OAuth 2.0 flow, what is exchanged for the final Access Token?",
    imageComponent: "OAuthDiagram",
    options: ["Authorization Code", "Client ID", "User Password", "Refresh Token"],
    answerIndex: 0,
    explanation: "In the authorization code flow, the client receives an authorization code from the authorization server, which it then exchanges for an access token.",
    tags: ["oauth", "image"]
  },
  {
    id: "auth_7",
    topic: "auth",
    round: "rapid",
    difficulty: 2,
    prompt: "What is the primary difference between Authentication and Authorization?",
    options: ["Authentication is verifying identity; Authorization is verifying permissions.", "Authentication is for servers; Authorization is for users.", "Authentication is verifying permissions; Authorization is verifying identity.", "They mean exactly the same thing."],
    answerIndex: 0,
    explanation: "Authentication proves WHO you are (e.g. login). Authorization determines WHAT you are allowed to do (e.g. permissions).",
    tags: ["concepts"]
  },
  {
    id: "auth_8",
    topic: "auth",
    round: "scenario",
    difficulty: 2,
    prompt: "A company enforces a policy where passwords must be changed every 30 days. However, users are observed simply appending a number (e.g., Password1, Password2). This is a failure of what concept?",
    scenario: "Security audit of a corporate network.",
    options: ["Password entropy", "Rate limiting", "Multi-factor authentication", "Account lockout"],
    answerIndex: 0,
    explanation: "Password entropy measures the unpredictability of a password. Predictable patterns like appending sequential numbers lower the entropy drastically.",
    tags: ["passwords", "scenario"]
  },
  {
    id: "auth_9",
    topic: "auth",
    round: "rapid",
    difficulty: 3,
    prompt: "Which of these is an example of 'Something you are' in MFA?",
    options: ["A hardware security key", "An SMS code", "A fingerprint scan", "A smart card"],
    answerIndex: 2,
    explanation: "MFA factors: Something you know (password), something you have (hardware key/phone), something you are (biometrics like fingerprints).",
    tags: ["mfa", "biometrics"]
  },
  {
    id: "auth_10",
    topic: "auth",
    round: "image",
    difficulty: 3,
    prompt: "Based on the authentication flow diagram, which step prevents replay attacks?",
    imageComponent: "ChallengeResponseDiagram",
    options: ["Sending the User ID", "The server generating a random nonce (challenge)", "The client hashing the password", "The server looking up the user"],
    answerIndex: 1,
    explanation: "A random nonce (challenge) generated by the server ensures that the response is unique for every session, preventing an attacker from replaying an old response.",
    tags: ["replay", "image"]
  }
]
