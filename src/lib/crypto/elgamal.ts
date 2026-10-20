/**
 * ElGamal Public-Key Cryptosystem
 * - Based on the Discrete Logarithm Problem (DLP) over Z_p*
 * - Public Parameters: prime p, primitive root g
 * - Private Key: private integer x
 * - Public Key: y = g^x mod p
 * - Encryption: Ephemeral k -> (c1 = g^k mod p, c2 = M * y^k mod p)
 * - Decryption: s = c1^x mod p -> M = c2 * s^-1 mod p
 */

import { modPow, modInverse } from "./rsa"

export interface ElGamalKeyPair {
  p: bigint
  g: bigint
  y: bigint // public key
  x: bigint // private key
}

export interface ElGamalCiphertext {
  c1: bigint
  c2: bigint
}

export function generateElGamalKey(p: number, g: number, x: number): ElGamalKeyPair {
  const bigP = BigInt(p)
  const bigG = BigInt(g)
  const bigX = BigInt(x)

  const y = modPow(bigG, bigX, bigP)
  return { p: bigP, g: bigG, y, x: bigX }
}

export function elgamalEncrypt(
  message: bigint,
  p: bigint,
  g: bigint,
  y: bigint,
  k: bigint
): ElGamalCiphertext {
  // c1 = g^k mod p
  const c1 = modPow(g, k, p)
  // Shared ephemeral secret s = y^k mod p
  const s = modPow(y, k, p)
  // c2 = (message * s) mod p
  const c2 = (message * s) % p

  return { c1, c2 }
}

export function elgamalDecrypt(
  ciphertext: ElGamalCiphertext,
  p: bigint,
  x: bigint
): bigint {
  const { c1, c2 } = ciphertext
  // Shared ephemeral secret s = c1^x mod p
  const s = modPow(c1, x, p)
  // Modular inverse of s mod p
  const sInv = modInverse(s, p)
  // Message M = (c2 * sInv) mod p
  const m = (c2 * sInv) % p
  return m
}
