/**
 * Rabin Public-Key Cryptosystem
 * - Public Key: n = p * q, where p ≡ q ≡ 3 (mod 4) (Blum integers)
 * - Private Key: (p, q)
 * - Encryption: C = M^2 mod n
 * - Decryption: 4 modular square roots via Chinese Remainder Theorem (CRT)
 * - Breaking Rabin is mathematically equivalent to factoring n.
 */

import { modPow, gcd } from "./rsa"

export interface RabinKeypair {
  p: bigint
  q: bigint
  n: bigint
}

export function generateRabinKeys(p: number, q: number): RabinKeypair | null {
  const bigP = BigInt(p)
  const bigQ = BigInt(q)

  // Verify Blum prime conditions: p ≡ 3 (mod 4) and q ≡ 3 (mod 4)
  if (bigP % BigInt(4) !== BigInt(3) || bigQ % BigInt(4) !== BigInt(3)) {
    return null
  }
  if (bigP === bigQ || gcd(bigP, bigQ) !== BigInt(1)) {
    return null
  }

  const n = bigP * bigQ
  return { p: bigP, q: bigQ, n }
}

export function rabinEncrypt(message: bigint, n: bigint): bigint {
  return (message * message) % n
}

export interface RabinRoots {
  r1: bigint
  r2: bigint
  r3: bigint
  r4: bigint
}

// Extended Euclidean Algorithm for BigInt
export function extEuclidBigInt(a: bigint, b: bigint): { gcd: bigint; x: bigint; y: bigint } {
  let [oldR, r] = [a, b]
  let [oldS, s] = [BigInt(1), BigInt(0)]
  let [oldT, t] = [BigInt(0), BigInt(1)]

  while (r !== BigInt(0)) {
    const q = oldR / r
    ;[oldR, r] = [r, oldR - q * r]
    ;[oldS, s] = [s, oldS - q * s]
    ;[oldT, t] = [t, oldT - q * t]
  }

  return { gcd: oldR, x: oldS, y: oldT }
}

export function rabinDecrypt(c: bigint, p: bigint, q: bigint): RabinRoots {
  const n = p * q

  // 1. Compute modular square roots mod p and mod q
  // For prime p ≡ 3 mod 4, sqrt(c) ≡ c^((p+1)/4) mod p
  const expP = (p + BigInt(1)) / BigInt(4)
  const expQ = (q + BigInt(1)) / BigInt(4)
  const mp = modPow(c, expP, p)
  const mq = modPow(c, expQ, q)

  // 2. Chinese Remainder Theorem: find yp, yq such that yp*p + yq*q = 1
  const { x: yp, y: yq } = extEuclidBigInt(p, q)

  // 3. Four square roots
  // r = (yp * p * mq + yq * q * mp) mod n
  // s = (yp * p * mq - yq * q * mp) mod n
  let r = (yp * p * mq + yq * q * mp) % n
  if (r < BigInt(0)) r += n

  let s = (yp * p * mq - yq * q * mp) % n
  if (s < BigInt(0)) s += n

  const r1 = r
  const r2 = (n - r1) % n
  const r3 = s
  const r4 = (n - r3) % n

  return { r1, r2, r3, r4 }
}
