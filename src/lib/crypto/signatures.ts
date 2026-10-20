/**
 * Digital Signatures: RSA & ECDSA
 * Covers:
 * - Hash-then-Sign paradigm
 * - RSA Signature generation (S = H(M)^d mod n) & verification (V = S^e mod n)
 * - Multiplicative Homomorphism attack on raw RSA (and defense via hashing)
 * - ECDSA over elliptic curves (r, s computation & point verification)
 * - Sony PS3 Ephemeral Nonce Reuse Catastrophe (private key recovery from reused k)
 */

import { modPow } from "./rsa"
import { ECCurve, ECPoint, ecAdd, ecMultiply } from "./ecc"
import { modInverse26 } from "./affine"

// Modulo helper handling negative numbers correctly
function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/**
 * Modular inverse modulo m using Extended Euclidean Algorithm
 */
export function modInverseN(a: number, m: number): number | null {
  return modInverse26(mod(a, m), m)
}

// -------------------------------------------------------------
// RSA DIGITAL SIGNATURES
// -------------------------------------------------------------

export interface RSASignatureResult {
  messageDigest: bigint
  signature: bigint
  isValid: boolean
}

/**
 * Sign a message digest using RSA private key (d, n)
 * S = (digest)^d mod n
 */
export function rsaSign(digest: bigint, d: bigint, n: bigint): bigint {
  return modPow(digest % n, d, n)
}

/**
 * Verify an RSA signature using public key (e, n)
 * Returns true if S^e mod n === digest
 */
export function rsaVerify(signature: bigint, expectedDigest: bigint, e: bigint, n: bigint): boolean {
  const recovered = modPow(signature, e, n)
  return recovered === (expectedDigest % n)
}

/**
 * Simulates the Multiplicative Homomorphic Attack on unhashed/raw RSA:
 * Given Alice's signatures S1 on M1 and S2 on M2:
 * S1 = M1^d mod n, S2 = M2^d mod n
 * Mallory computes M3 = (M1 * M2) mod n and S3 = (S1 * S2) mod n.
 * Then S3 is a valid signature for M3 without Mallory ever knowing d!
 */
export interface RsaMultiplicativeForgery {
  m1: bigint
  s1: bigint
  m2: bigint
  s2: bigint
  forgedM: bigint
  forgedS: bigint
  verified: boolean
  defenseExplanation: string
}

export function simulateRsaMultiplicativeAttack(
  m1: bigint,
  m2: bigint,
  e: bigint,
  d: bigint,
  n: bigint
): RsaMultiplicativeForgery {
  const s1 = rsaSign(m1, d, n)
  const s2 = rsaSign(m2, d, n)

  const forgedM = (m1 * m2) % n
  const forgedS = (s1 * s2) % n

  // Verification check: forgedS^e mod n == forgedM
  const verified = rsaVerify(forgedS, forgedM, e, n)

  return {
    m1,
    s1,
    m2,
    s2,
    forgedM,
    forgedS,
    verified,
    defenseExplanation:
      "When signing raw messages, S1 * S2 = (M1 * M2)^d mod n, allowing existential forgery. The Hash-then-Sign paradigm prevents this because H(M1 * M2) != H(M1) * H(M2)."
  }
}

// -------------------------------------------------------------
// ECDSA (Elliptic Curve Digital Signature Algorithm)
// -------------------------------------------------------------

export interface ECDSASignature {
  r: number
  s: number
  RPoint: ECPoint | null
}

export interface ECDSAPublicKey {
  Q: ECPoint
}

/**
 * Signs hash z with ECDSA given curve, base point G, order n, private key d, and nonce k.
 * 1. Compute R = k * G = (x1, y1)
 * 2. r = x1 mod n
 * 3. s = k^-1 * (z + r * d) mod n
 */
export function ecdsaSign(
  curve: ECCurve,
  G: ECPoint,
  n: number,
  d: number,
  z: number,
  k: number
): ECDSASignature | null {
  if (k <= 0 || k >= n) return null
  const R = ecMultiply(k, G, curve)
  if (!R) return null

  const r = mod(R.x, n)
  if (r === 0) return null

  const kInv = modInverseN(k, n)
  if (kInv === null) return null

  const s = mod(kInv * (z + r * d), n)
  if (s === 0) return null

  return { r, s, RPoint: R }
}

/**
 * Verifies an ECDSA signature (r, s) against public key Q = d * G.
 * 1. Check r, s in [1, n-1]
 * 2. w = s^-1 mod n
 * 3. u1 = z * w mod n, u2 = r * w mod n
 * 4. P = u1 * G + u2 * Q
 * 5. Valid if P != O and P.x mod n == r
 */
export function ecdsaVerify(
  curve: ECCurve,
  G: ECPoint,
  n: number,
  Q: ECPoint,
  z: number,
  sig: { r: number; s: number }
): boolean {
  const { r, s } = sig
  if (r <= 0 || r >= n || s <= 0 || s >= n) return false

  const w = modInverseN(s, n)
  if (w === null) return false

  const u1 = mod(z * w, n)
  const u2 = mod(r * w, n)

  const u1G = ecMultiply(u1, G, curve)
  const u2Q = ecMultiply(u2, Q, curve)
  const P = ecAdd(u1G, u2Q, curve)

  if (!P) return false
  return mod(P.x, n) === r
}

/**
 * Sony PS3 Nonce Reuse Attack (Reused Ephemeral Key k):
 * In 2010, the fail0verflow team discovered Sony used a constant nonce k in their PS3 ECDSA implementation.
 * If two distinct messages z1 and z2 are signed with the SAME nonce k, Mallory sees:
 * s1 = k^-1 * (z1 + r * d) mod n
 * s2 = k^-1 * (z2 + r * d) mod n  (notice r is identical because R = k * G)
 *
 * s1 - s2 = k^-1 * (z1 - z2) mod n
 * => k = (z1 - z2) * (s1 - s2)^-1 mod n
 *
 * Once k is recovered:
 * d = (s1 * k - z1) * r^-1 mod n
 * Alice's master private key is completely extracted!
 */
export interface NonceReuseExploitResult {
  recoveredK: number
  recoveredPrivateKey: number
  success: boolean
  explanation: string
}

export function exploitEcdsaNonceReuse(
  sig1: { r: number; s: number },
  z1: number,
  sig2: { r: number; s: number },
  z2: number,
  n: number
): NonceReuseExploitResult | null {
  if (sig1.r !== sig2.r) {
    // Nonce was not identical because r differs
    return null
  }

  const r = sig1.r
  const sDiff = mod(sig1.s - sig2.s, n)
  const zDiff = mod(z1 - z2, n)

  const sDiffInv = modInverseN(sDiff, n)
  if (sDiffInv === null) return null

  // Recover k: k = (z1 - z2) / (s1 - s2) mod n
  const recoveredK = mod(zDiff * sDiffInv, n)

  // Recover d: d = (s1 * k - z1) / r mod n
  const rInv = modInverseN(r, n)
  if (rInv === null) return null

  const recoveredPrivateKey = mod((sig1.s * recoveredK - z1) * rInv, n)

  return {
    recoveredK,
    recoveredPrivateKey,
    success: true,
    explanation:
      "Because the same nonce k was reused for both signatures, r was identical. Mallory solved for k = (z1 - z2)/(s1 - s2) mod n, and immediately recovered the master private signing key d."
  }
}
