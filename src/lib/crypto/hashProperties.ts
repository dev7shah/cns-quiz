/**
 * Cryptographic Hash Properties & Birthday Attack Mathematics
 * Covers:
 * - Pre-image Resistance (One-Way): Infeasible to find M given H(M) -> O(2^n)
 * - Second Pre-image Resistance (Weak Collision): Infeasible to find M2 != M1 with H(M2) = H(M1) -> O(2^n)
 * - Collision Resistance (Strong Collision): Infeasible to find ANY pair M1, M2 with H(M1) = H(M2) -> O(2^(n/2))
 * - Birthday Paradox collision probabilities and trial bounds
 * - Toy 16-bit hash collision finder for real-time demonstrations
 * - Avalanche effect bit-flip analyzer
 */

import { fnv1a32 } from "./hmac"

/**
 * Calculates the exact and approximate probability of at least one collision
 * among k random selections from N = 2^bits possibilities.
 * P(collision) ≈ 1 - exp(-k^2 / (2 * 2^bits))
 */
export function birthdayCollisionProbability(k: number, bits: number): number {
  const n = Math.pow(2, bits)
  if (k <= 1) return 0
  if (k > n) return 1
  // Use exponential approximation to avoid underflow/overflow: 1 - exp(-k^2 / (2N))
  const exponent = -(k * k) / (2 * n)
  return 1 - Math.exp(exponent)
}

/**
 * Calculates number of trials required to reach a target collision probability P (e.g. 0.5 for 50%).
 * k ≈ sqrt(2 * 2^bits * ln(1 / (1 - P)))
 * For P = 0.5: k ≈ 1.1774 * 2^(bits / 2)
 */
export function requiredTrialsForCollision(probability: number, bits: number): number {
  if (probability <= 0) return 1
  if (probability >= 1) return Math.pow(2, bits)
  const n = Math.pow(2, bits)
  const lnTerm = Math.log(1 / (1 - probability))
  return Math.round(Math.sqrt(2 * n * lnTerm))
}

export interface SecurityLevelComparison {
  hashName: string
  outputBits: number
  preimageResistanceOps: string
  collisionResistanceOps: string
  brokenStatus: "secure" | "weakened" | "broken"
  knownAttacks: string
}

export const HASH_COMPARISON_TABLE: SecurityLevelComparison[] = [
  {
    hashName: "MD5",
    outputBits: 128,
    preimageResistanceOps: "2^128",
    collisionResistanceOps: "2^64 (theoretically) / 2^18 (Wang 2004 practical)",
    brokenStatus: "broken",
    knownAttacks: "Wang differential collision (2004), Rogue CA collision (2008), Flame malware"
  },
  {
    hashName: "SHA-1",
    outputBits: 160,
    preimageResistanceOps: "2^160",
    collisionResistanceOps: "2^80 (theoretically) / 2^63.1 (SHAttered 2017)",
    brokenStatus: "broken",
    knownAttacks: "SHAttered (2017 CWI/Google), chosen-prefix collision (2020)"
  },
  {
    hashName: "SHA-256 (SHA-2)",
    outputBits: 256,
    preimageResistanceOps: "2^256",
    collisionResistanceOps: "2^128",
    brokenStatus: "secure",
    knownAttacks: "None on full 64 rounds; standard for TLS, Bitcoin, HMAC"
  },
  {
    hashName: "SHA-512 (SHA-2)",
    outputBits: 512,
    preimageResistanceOps: "2^512",
    collisionResistanceOps: "2^256",
    brokenStatus: "secure",
    knownAttacks: "None; high security margin"
  },
  {
    hashName: "SHA3-256 (Keccak)",
    outputBits: 256,
    preimageResistanceOps: "2^256",
    collisionResistanceOps: "2^128",
    brokenStatus: "secure",
    knownAttacks: "None; sponge construction fundamentally immune to length extension"
  }
]

/**
 * Toy 16-bit hash for live browser/test collision demonstration.
 * Takes any string and maps it into 0x0000..0xFFFF (65,536 buckets).
 * According to birthday paradox, a collision should occur around sqrt(65536) ≈ 256 - 300 attempts!
 */
export function toyHash16(input: string): number {
  const hash32 = fnv1a32(input)
  // Fold 32-bit into 16-bit
  return ((hash32 >>> 16) ^ (hash32 & 0xffff)) & 0xffff
}

export interface CollisionResult {
  input1: string
  input2: string
  hashHex: string
  hashVal: number
  trials: number
}

/**
 * Finds a collision in toyHash16 via birthday paradox.
 * Expected trials: ~250-320 iterations.
 */
export function findBirthdayCollision(prefix: string = "msg"): CollisionResult {
  const seen = new Map<number, string>()
  let trials = 0
  let counter = 0

  while (true) {
    trials++
    const candidate = `${prefix}_${counter++}`
    const hash = toyHash16(candidate)
    if (seen.has(hash)) {
      const existing = seen.get(hash)!
      return {
        input1: existing,
        input2: candidate,
        hashHex: "0x" + hash.toString(16).padStart(4, "0").toUpperCase(),
        hashVal: hash,
        trials
      }
    }
    seen.set(hash, candidate)
  }
}

/**
 * Avalanche Effect Analyzer:
 * Compares two hashes bit-by-bit and calculates the Hamming distance / percentage of changed bits.
 * A good cryptographic hash flips ~50% of bits on a 1-bit input change.
 */
export interface AvalancheResult {
  msg1: string
  msg2: string
  hash1Hex: string
  hash2Hex: string
  totalBits: number
  flippedBits: number
  flipPercentage: number
}

export function measureAvalanche(msg1: string, msg2: string): AvalancheResult {
  const h1 = fnv1a32(msg1)
  const h2 = fnv1a32(msg2)
  const diff = (h1 ^ h2) >>> 0

  let flipped = 0
  for (let i = 0; i < 32; i++) {
    if ((diff & (1 << i)) !== 0) flipped++
  }

  return {
    msg1,
    msg2,
    hash1Hex: "0x" + h1.toString(16).padStart(8, "0"),
    hash2Hex: "0x" + h2.toString(16).padStart(8, "0"),
    totalBits: 32,
    flippedBits: flipped,
    flipPercentage: Math.round((flipped / 32) * 100)
  }
}
