/**
 * Diffie-Hellman Key Exchange & Man-in-the-Middle (MitM) Attack Simulation
 * - Public parameters: prime p, primitive root g
 * - Alice: private a, public A = g^a mod p
 * - Bob: private b, public B = g^b mod p
 * - Shared Secret: K = g^(ab) mod p
 * - MitM Attack: Mallory establishes separate shared secrets with Alice and Bob.
 */

import { modPow } from "./rsa"

export interface DHParty {
  name: string
  privateKey: bigint
  publicKey: bigint
  sharedSecret?: bigint
}

export function generateDHPublicKey(g: bigint, privateKey: bigint, p: bigint): bigint {
  return modPow(g, privateKey, p)
}

export function computeDHSharedSecret(theirPublicKey: bigint, myPrivateKey: bigint, p: bigint): bigint {
  return modPow(theirPublicKey, myPrivateKey, p)
}

export interface DHExchangeResult {
  p: bigint
  g: bigint
  alice: DHParty
  bob: DHParty
  sharedSecretAlice: bigint
  sharedSecretBob: bigint
  match: boolean
}

export function runNormalDH(p: number, g: number, a: number, b: number): DHExchangeResult {
  const bigP = BigInt(p)
  const bigG = BigInt(g)
  const bigA = BigInt(a)
  const bigB = BigInt(b)

  const pubA = generateDHPublicKey(bigG, bigA, bigP)
  const pubB = generateDHPublicKey(bigG, bigB, bigP)

  const secretAlice = computeDHSharedSecret(pubB, bigA, bigP)
  const secretBob = computeDHSharedSecret(pubA, bigB, bigP)

  return {
    p: bigP,
    g: bigG,
    alice: { name: 'Alice', privateKey: bigA, publicKey: pubA, sharedSecret: secretAlice },
    bob: { name: 'Bob', privateKey: bigB, publicKey: pubB, sharedSecret: secretBob },
    sharedSecretAlice: secretAlice,
    sharedSecretBob: secretBob,
    match: secretAlice === secretBob
  }
}

export interface DHMitmResult {
  p: bigint
  g: bigint
  alice: DHParty
  bob: DHParty
  mallory: {
    privateKey: bigint
    publicKeyToAlice: bigint
    publicKeyToBob: bigint
    secretWithAlice: bigint
    secretWithBob: bigint
  }
  compromised: boolean
}

export function runMitmDH(p: number, g: number, a: number, b: number, m: number): DHMitmResult {
  const bigP = BigInt(p)
  const bigG = BigInt(g)
  const bigA = BigInt(a)
  const bigB = BigInt(b)
  const bigM = BigInt(m) // Mallory's rogue private key

  const pubA = generateDHPublicKey(bigG, bigA, bigP)
  const pubB = generateDHPublicKey(bigG, bigB, bigP)
  const pubM = generateDHPublicKey(bigG, bigM, bigP) // Mallory sends pubM to both

  // Alice receives pubM instead of pubB:
  const secretAlice = computeDHSharedSecret(pubM, bigA, bigP)
  // Bob receives pubM instead of pubA:
  const secretBob = computeDHSharedSecret(pubM, bigB, bigP)

  // Mallory computes secrets with both sides:
  const secretMalloryAlice = computeDHSharedSecret(pubA, bigM, bigP)
  const secretMalloryBob = computeDHSharedSecret(pubB, bigM, bigP)

  return {
    p: bigP,
    g: bigG,
    alice: { name: 'Alice', privateKey: bigA, publicKey: pubA, sharedSecret: secretAlice },
    bob: { name: 'Bob', privateKey: bigB, publicKey: pubB, sharedSecret: secretBob },
    mallory: {
      privateKey: bigM,
      publicKeyToAlice: pubM,
      publicKeyToBob: pubM,
      secretWithAlice: secretMalloryAlice,
      secretWithBob: secretMalloryBob
    },
    // True because Alice and Bob unwittingly decrypt through Mallory!
    compromised: secretAlice === secretMalloryAlice && secretBob === secretMalloryBob
  }
}
