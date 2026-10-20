/**
 * Password Attacks, Salting, Key Stretching, & NIST SP 800-63B Criteria
 * Covers:
 * - Password Entropy: E = L * log2(R)
 * - Attack speeds: Raw SHA-256 (GPU) vs PBKDF2 vs bcrypt vs Argon2id
 * - Rainbow Table Chains & Reduction Functions (and why random salt defeats them)
 * - NIST SP 800-63B Digital Identity Guidelines evaluation
 */

import { fnv1a32Hex } from "../crypto/hmac"

export interface NistEvaluationResult {
  passwordLength: number
  entropyBits: number
  isCompliant: boolean
  violations: string[]
  legacyRuleWarnings: string[]
  verdict: string
}

export const COMMON_BREACHED_PASSWORDS = new Set([
  "password",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "admin",
  "admin123",
  "welcome",
  "login",
  "iloveyou",
  "monkey",
  "dragon",
  "sunshine",
  "princess",
  "football"
])

/**
 * Evaluates a password against NIST SP 800-63B Digital Identity Guidelines:
 * - Minimum 8 characters (recommends >= 12)
 * - Maximum at least 64 characters
 * - Checked against compromised credential lists (common passwords, dictionary words)
 * - Disfavors forced arbitrary composition rules (e.g. 1 uppercase, 1 symbol)
 * - Disfavors mandatory periodic expiration (which encourages weak patterns)
 */
export function evaluateNistPassword(password: string): NistEvaluationResult {
  const len = password.length
  const violations: string[] = []
  const legacyWarnings: string[] = []

  if (len < 8) {
    violations.push("Length is under 8 characters (NIST SP 800-63B Section 5.1.1.2 mandates >= 8 characters).")
  }

  if (COMMON_BREACHED_PASSWORDS.has(password.toLowerCase())) {
    violations.push("Matches a commonly breached password (NIST mandates filtering against compromised credential blacklists).")
  }

  // Calculate character pool
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33

  const entropy = pool > 0 ? Math.round(len * Math.log2(pool) * 10) / 10 : 0

  if (len >= 8 && len < 12) {
    legacyWarnings.push("NIST recommends at least 12 characters for enterprise access accounts.")
  }

  const isCompliant = violations.length === 0

  return {
    passwordLength: len,
    entropyBits: entropy,
    isCompliant,
    violations,
    legacyRuleWarnings: legacyWarnings,
    verdict: isCompliant
      ? `NIST SP 800-63B COMPLIANT (${entropy} bits of entropy).`
      : `NON-COMPLIANT: ${violations.join(" ")}`
  }
}

/**
 * Calculates estimated cracking times across different hashing algorithms:
 * - Fast Hash (SHA-256 on 8x RTX 4090 GPU cluster: ~100 GH/s = 10^11 H/s)
 * - PBKDF2 (600,000 iterations: ~500 KH/s = 5 * 10^5 H/s)
 * - bcrypt (cost factor 12: ~2,000 H/s)
 * - Argon2id (memory-hard 64MB: ~100 H/s)
 */
export interface CrackingTimeEstimate {
  algorithm: string
  hashesPerSecond: number
  hashesPerSecondDisplay: string
  memoryRequirement: string
  secondsToCrackKeyspace: number
  timeDisplay: string
}

export function estimateCrackingTime(entropyBits: number): CrackingTimeEstimate[] {
  const keyspace = Math.pow(2, entropyBits)
  // Average search space to find password is 50% of keyspace
  const avgGuesses = keyspace / 2

  const algos = [
    { name: "Unsalted / Fast SHA-256 (GPU Cluster)", rate: 1e11, rateDisp: "100 Billion H/s", mem: "0 MB" },
    { name: "PBKDF2-HMAC-SHA256 (600k iters)", rate: 5e5, rateDisp: "500 Thousand H/s", mem: "< 1 MB" },
    { name: "bcrypt (Cost 12)", rate: 2000, rateDisp: "2,000 H/s", mem: "4 KB" },
    { name: "Argon2id (Memory Hard: 64 MB)", rate: 100, rateDisp: "100 H/s", mem: "64 MB / thread" }
  ]

  const formatTime = (sec: number): string => {
    if (sec < 1e-3) return "< 1 millisecond"
    if (sec < 1) return `${Math.round(sec * 1000)} ms`
    if (sec < 60) return `${Math.round(sec)} seconds`
    if (sec < 3600) return `${Math.round(sec / 60)} minutes`
    if (sec < 86400) return `${Math.round(sec / 3600)} hours`
    if (sec < 31536000) return `${Math.round(sec / 86400)} days`
    if (sec < 31536000 * 1000) return `${Math.round(sec / 31536000)} years`
    if (sec < 31536000 * 1e6) return `${(sec / (31536000 * 1e3)).toFixed(1)} thousand years`
    return `${(sec / (31536000 * 1e6)).toExponential(1)} million years`
  }

  return algos.map(a => {
    const s = avgGuesses / a.rate
    return {
      algorithm: a.name,
      hashesPerSecond: a.rate,
      hashesPerSecondDisplay: a.rateDisp,
      memoryRequirement: a.mem,
      secondsToCrackKeyspace: s,
      timeDisplay: formatTime(s)
    }
  })
}

/**
 * Rainbow Table Chain Simulation:
 * Plaintext P_0 -> Hash H(P_0) -> Reduction R_1(H) -> P_1 -> Hash H(P_1) -> Reduction R_2(H) -> P_2
 * Shows:
 * 1. Precomputed chain lookup in O(chain_length) instead of O(keyspace)
 * 2. Why random salt breaks rainbow tables: Salt prepended to password makes H(Salt || P)
 *    belong to a completely different hash space, rendering precomputed tables useless.
 */
export interface RainbowChainStep {
  step: number
  plaintext: string
  hashHex: string
  reductionOutput: string
}

export interface RainbowSimulation {
  chainLength: number
  chain: RainbowChainStep[]
  tableEntry: { startPlaintext: string; endPlaintext: string }
  saltedDefenseExplanation: string
}

export function simulateRainbowChain(startPlaintext: string = "cns123", chainLength: number = 4): RainbowSimulation {
  const chain: RainbowChainStep[] = []
  let currentWord = startPlaintext

  for (let i = 0; i < chainLength; i++) {
    const hash = fnv1a32Hex(currentWord)
    // Educational reduction function R_i: maps 32-bit hash back to a 6-char alphanumeric string
    const num = parseInt(hash.slice(0, 6), 16)
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
    let nextWord = ""
    let temp = num + (i * 997)
    for (let c = 0; c < 6; c++) {
      nextWord += charset[temp % charset.length]
      temp = Math.floor(temp / charset.length)
    }

    chain.push({
      step: i + 1,
      plaintext: currentWord,
      hashHex: hash,
      reductionOutput: nextWord
    })

    currentWord = nextWord
  }

  return {
    chainLength,
    chain,
    tableEntry: {
      startPlaintext,
      endPlaintext: chain[chain.length - 1].reductionOutput
    },
    saltedDefenseExplanation:
      "A rainbow table precomputes chains using reduction function R. If a unique random salt (e.g. 16 bytes) is stored per user, H(Salt || Password) changes the hash space for every single user. The attacker would have to compute a multi-gigabyte rainbow table from scratch for every individual user, making precomputation economically impossible."
  }
}
